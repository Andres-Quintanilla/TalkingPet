// backend/src/controllers/chat.controller.js
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
// Importamos el servicio de IA y quitamos el obsoleto
import { getSmartChatResponse } from '../services/aiChat.service.js';
import {
  sendEmail,
  sendWhatsApp,
  scheduleReminder,
} from '../services/notification.service.js';

/**
 * POST /api/chat
 * Envía un mensaje al chatbot, obtiene respuesta de IA y guarda en BD
 * Body: { message, sessionId?, email?, telefono? }
 */
export async function sendMessage(req, res, next) {
  try {
    const { message, sessionId, email, telefono } = req.body;
    // El ID de usuario se obtiene de optionalAuth (puede ser null)
    const userId = req.user?.id || null;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "El campo 'message' es requerido" });
    }

    // 1. Obtener o crear conversación
    let conversationId;
    let currentSessionId = sessionId || uuidv4();

    const convQuery = 'SELECT id FROM chat_conversacion WHERE session_id = $1';
    const convResult = await pool.query(convQuery, [currentSessionId]);

    if (convResult.rows.length > 0) {
      conversationId = convResult.rows[0].id;
      // Actualizar última actividad y vincular usuario si acaba de iniciar sesión
      await pool.query(
        'UPDATE chat_conversacion SET ultima_actividad = NOW(), usuario_id = COALESCE($2, usuario_id) WHERE id = $1',
        [conversationId, userId]
      );
    } else {
      // Crear nueva conversación
      const insertConv = await pool.query(
        `INSERT INTO chat_conversacion (usuario_id, session_id, email, telefono)
           VALUES ($1, $2, $3, $4) RETURNING id`,
        [userId, currentSessionId, email || null, telefono || null]
      );
      conversationId = insertConv.rows[0].id;
    }

    // 2. Guardar mensaje del usuario
    await pool.query(
      'INSERT INTO chat_mensaje (conversacion_id, rol, contenido) VALUES ($1, $2, $3)',
      [conversationId, 'user', message]
    );

    // 3. Obtener historial de mensajes para contexto (últimos 10)
    const historyQuery = `
       SELECT rol, contenido 
       FROM chat_mensaje 
       WHERE conversacion_id = $1 
       ORDER BY enviado_en DESC 
       LIMIT 10
     `;
    const historyResult = await pool.query(historyQuery, [conversationId]);
    const history = historyResult.rows.reverse().map((row) => ({
      role: row.rol,
      content: row.contenido,
    }));

    // 4. Llamar al chatbot INTELIGENTE (aiChat.service)
    const assistantReply = await getSmartChatResponse(
      message,
      history,
      userId
    );

    // 5. Guardar respuesta del asistente
    const insertMsgResult = await pool.query(
      'INSERT INTO chat_mensaje (conversacion_id, rol, contenido) VALUES ($1, $2, $3) RETURNING id',
      [conversationId, 'assistant', assistantReply.reply] // Guardamos solo el .reply
    );
    const assistantMessageId = insertMsgResult.rows[0].id;

    res.json({
      reply: assistantReply.reply,
      action: assistantReply.action || null, // Devolvemos la acción al frontend
      sessionId: currentSessionId,
      conversationId,
      messageId: assistantMessageId, // ID del mensaje del bot (para feedback)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/chat/history/:sessionId
 * Obtiene el historial de una conversación
 */
export async function getHistory(req, res, next) {
  try {
    const { sessionId } = req.params;

    const convQuery = 'SELECT id FROM chat_conversacion WHERE session_id = $1';
    const convResult = await pool.query(convQuery, [sessionId]);

    if (convResult.rows.length === 0) {
      return res.json({ sessionId, messages: [] }); // Devuelve vacío si no existe
    }

    const conversationId = convResult.rows[0].id;

    const historyQuery = `
       SELECT id AS "messageId", rol, contenido, enviado_en 
       FROM chat_mensaje 
       WHERE conversacion_id = $1 
       ORDER BY enviado_en ASC
     `;
    const historyResult = await pool.query(historyQuery, [conversationId]);

    res.json({
      sessionId,
      messages: historyResult.rows.map((row) => ({
        messageId: row.messageId, // ID del mensaje (para feedback)
        role: row.rol,
        content: row.contenido,
        timestamp: row.enviado_en,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/chat/notify
 * Envía notificación inmediata por email o WhatsApp
 */
export async function sendNotification(req, res, next) {
  try {
    const { type, recipient, subject, message } = req.body;

    if (!type || !recipient || !message) {
      return res
        .status(400)
        .json({ error: 'Faltan campos requeridos: type, recipient, message' });
    }

    let result;

    if (type === 'email') {
      result = await sendEmail(
        recipient,
        subject || 'Notificación TalkingPet',
        message
      );
    } else if (type === 'whatsapp') {
      result = await sendWhatsApp(recipient, message);
    } else {
      return res
        .status(400)
        .json({ error: "Tipo inválido. Usa 'email' o 'whatsapp'" });
    }

    if (result.success) {
      res.json({ success: true, message: 'Notificación enviada' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    next(error);
  }
}