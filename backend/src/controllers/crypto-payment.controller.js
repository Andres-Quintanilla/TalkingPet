// backend/src/controllers/crypto-payment.controller.js
import { pool } from "../config/db.js";
import * as coinbaseService from '../services/coinbase.service.js';

/**
 * POST /api/payments/crypto/create
 * Crear pago con criptomonedas (Bitcoin, USDT, Ethereum, etc.)
 */
export async function createCryptoPayment(req, res, next) {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id es requerido' });
    }

    // 1. Verificar que el pedido existe y pertenece al usuario
    const { rows } = await pool.query(
      'SELECT * FROM pedido WHERE id = $1 AND usuario_id = $2',
      [order_id, userId]
    );

    const order = rows[0];
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (order.estado !== 'pendiente') {
      return res.status(400).json({ 
        error: 'El pedido ya fue procesado',
        estado: order.estado 
      });
    }

    // 2. Crear pago en Coinbase Commerce
    const cryptoPayment = await coinbaseService.createCryptoPayment(
      order.id,
      parseFloat(order.total),
      `Pedido #${order.id} - TalkingPet`,
      userEmail
    );

    // 3. Guardar registro en tabla pago
    await pool.query(`
      INSERT INTO pago (
        pedido_id, 
        monto, 
        metodo, 
        estado, 
        referencia
      ) VALUES ($1, $2, 'crypto', 'pendiente', $3)
    `, [
      order.id,
      order.total,
      cryptoPayment.chargeId
    ]);

    // 4. Retornar URL de pago al frontend
    res.json({
      success: true,
      message: 'Pago con criptomonedas creado exitosamente',
      paymentUrl: cryptoPayment.hostedUrl, // Cliente debe abrir esta URL
      chargeId: cryptoPayment.chargeId,
      code: cryptoPayment.code,
      expiresAt: cryptoPayment.expiresAt,
      acceptedCurrencies: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'USD Coin (USDC)', 'Tether (USDT)', 'DAI', 'Dogecoin (DOGE)'],
      addresses: cryptoPayment.addresses // Direcciones de pago para cada crypto
    });

  } catch (error) {
    console.error('Error creando pago crypto:', error);
    
    if (error.message.includes('Coinbase Commerce no está configurado')) {
      return res.status(503).json({ 
        error: 'Pagos con criptomonedas no disponibles',
        details: 'Servicio no configurado. Contacta al administrador.'
      });
    }

    next(error);
  }
}

/**
 * GET /api/payments/crypto/status/:chargeId
 * Verificar estado de un pago con crypto
 */
export async function checkPaymentStatus(req, res, next) {
  try {
    const { chargeId } = req.params;

    if (!chargeId) {
      return res.status(400).json({ error: 'chargeId es requerido' });
    }

    // Verificar en Coinbase
    const status = await coinbaseService.checkCryptoPaymentStatus(chargeId);

    // Buscar en nuestra BD
    const { rows } = await pool.query(
      'SELECT p.*, ped.estado as pedido_estado FROM pago p JOIN pedido ped ON p.pedido_id = ped.id WHERE p.referencia = $1',
      [chargeId]
    );

    res.json({
      success: true,
      coinbase: {
        status: status.status,
        confirmedAt: status.confirmedAt,
        expiresAt: status.expiresAt,
        payments: status.payments
      },
      database: rows[0] || null
    });

  } catch (error) {
    console.error('Error verificando estado de pago:', error);
    next(error);
  }
}

/**
 * POST /api/webhooks/coinbase
 * Webhook de Coinbase Commerce (confirmación de pago)
 * IMPORTANTE: Debe estar sin middleware requireAuth
 */
export async function coinbaseWebhook(req, res) {
  try {
    const signature = req.headers['x-cc-webhook-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Signature faltante' });
    }

    // req.rawBody debe ser configurado con middleware especial
    const rawBody = req.rawBody || JSON.stringify(req.body);

    // Validar signature
    const result = coinbaseService.processCoinbaseWebhook(rawBody, signature);

    if (!result.valid) {
      console.error('❌ Webhook signature inválida');
      return res.status(400).json({ error: 'Signature inválida' });
    }

    const event = result.event;
    const charge = event.data;

    console.log(`📨 Webhook recibido: ${event.type} - Charge ID: ${charge.id}`);

    // Procesar según tipo de evento
    switch (event.type) {
      case 'charge:confirmed':
        // ✅ Pago CONFIRMADO (suficientes confirmaciones en blockchain)
        await handleChargeConfirmed(charge);
        break;

      case 'charge:failed':
        // ❌ Pago FALLÓ
        await handleChargeFailed(charge);
        break;

      case 'charge:pending':
        // ⏳ Pago DETECTADO pero esperando confirmaciones
        await handleChargePending(charge);
        break;

      case 'charge:created':
        // 🆕 Pago CREADO (usuario aún no paga)
        console.log(`🆕 Pago creado: ${charge.id}`);
        break;

      case 'charge:delayed':
        // ⏰ Pago DEMORADO (muchas confirmaciones pendientes)
        console.log(`⏰ Pago demorado: ${charge.id}`);
        break;

      case 'charge:resolved':
        // ✅ Problema RESUELTO
        await handleChargeConfirmed(charge);
        break;

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    res.json({ received: true, event: event.type });

  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}

/**
 * GET /api/payments/crypto/list
 * Listar todos los pagos crypto (admin)
 */
export async function listCryptoPayments(req, res, next) {
  try {
    // Solo admin puede ver todos los pagos
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const charges = await coinbaseService.listCharges();

    res.json({
      success: true,
      charges: charges.data || []
    });

  } catch (error) {
    console.error('Error listando pagos:', error);
    next(error);
  }
}

// ========== HELPERS INTERNOS ==========

/**
 * Manejar pago confirmado
 */
async function handleChargeConfirmed(charge) {
  const orderId = charge.metadata.order_id;

  try {
    await pool.query('BEGIN');

    // Obtener información del pago
    const payment = charge.payments && charge.payments.length > 0 ? charge.payments[0] : null;
    const txHash = payment?.transaction_id || '';
    const cryptoAmount = payment?.value?.crypto?.amount || 0;
    const cryptoNetwork = payment?.network || '';

    // Actualizar pago en BD
    await pool.query(`
      UPDATE pago 
      SET 
        estado = 'pagado',
        fecha_pago = NOW()
      WHERE referencia = $1
    `, [charge.id]);

    // Actualizar pedido
    await pool.query(`
      UPDATE pedido 
      SET estado = 'pagado' 
      WHERE id = $1
    `, [orderId]);

    await pool.query('COMMIT');

    console.log(`✅ Pago CONFIRMADO para pedido #${orderId}`);
    console.log(`   - Charge ID: ${charge.id}`);
    console.log(`   - Network: ${cryptoNetwork}`);
    console.log(`   - Amount: ${cryptoAmount}`);
    console.log(`   - TX Hash: ${txHash}`);

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Error confirmando pago:', error);
  }
}

/**
 * Manejar pago fallido
 */
async function handleChargeFailed(charge) {
  const orderId = charge.metadata.order_id;

  try {
    await pool.query(`
      UPDATE pago 
      SET estado = 'fallido' 
      WHERE referencia = $1
    `, [charge.id]);

    console.log(`❌ Pago FALLIDO para pedido #${orderId}`);
  } catch (error) {
    console.error('Error actualizando pago fallido:', error);
  }
}

/**
 * Manejar pago pendiente
 */
async function handleChargePending(charge) {
  const orderId = charge.metadata.order_id;

  try {
    await pool.query(`
      UPDATE pago 
      SET estado = 'pendiente' 
      WHERE referencia = $1
    `, [charge.id]);

    console.log(`⏳ Pago PENDIENTE para pedido #${orderId} (esperando confirmaciones)`);
  } catch (error) {
    console.error('Error actualizando pago pendiente:', error);
  }
}

export default {
  createCryptoPayment,
  checkPaymentStatus,
  coinbaseWebhook,
  listCryptoPayments
};
