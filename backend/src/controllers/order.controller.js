import { pool } from '../config/db.js';

export async function checkoutFromCart(req, res, next) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const cart = await client.query('SELECT id FROM carrito WHERE usuario_id=$1', [req.user.id]);
        if (!cart.rows[0]) throw new Error('Carrito inexistente');

        const items = await client.query(
            `SELECT ci.*, p.nombre FROM carrito_item ci INNER JOIN producto p ON p.id=ci.producto_id WHERE carrito_id=$1`,
            [cart.rows[0].id]
        );
        if (!items.rowCount) return res.status(400).json({ error: 'Carrito vacío' });

        const total = items.rows.reduce((t, it) => t + Number(it.subtotal), 0);
        const { rows: orderRows } = await client.query(
            `INSERT INTO pedido (usuario_id, total, estado, direccion_envio)
       VALUES ($1,$2,'pendiente',$3) RETURNING id, total, estado`,
            [req.user.id, total, req.body.direccion_envio || null]
        );
        const order = orderRows[0];

        // opcional: vaciar carrito (se deja para después del pago)
        await client.query('COMMIT');
        res.status(201).json({ order });
    } catch (e) {
        await pool.query('ROLLBACK');
        next(e);
    } finally {
        client.release();
    }
}

export async function myOrders(req, res, next) {
    try {
        const { rows } = await pool.query('SELECT * FROM pedido WHERE usuario_id=$1 ORDER BY id DESC', [req.user.id]);
        res.json(rows);
    } catch (e) { next(e); }
}

export async function getById(req, res, next) {
    try {
        const { rows } = await pool.query('SELECT * FROM pedido WHERE id=$1 AND (usuario_id=$2 OR $3=TRUE)', [req.params.id, req.user.id, req.user.rol === 'admin']);
        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function listAll(_req, res, next) {
    try {
        const { rows } = await pool.query('SELECT * FROM pedido ORDER BY id DESC');
        res.json(rows);
    } catch (e) { next(e); }
}

export async function track(req, res, next) {
    try {
        const { rows } = await pool.query(
            `SELECT e.estado, e.lat, e.lng, e.fecha_envio, e.fecha_entrega
       FROM envio e JOIN pedido p ON p.id=e.pedido_id
       WHERE p.id=$1 AND p.usuario_id=$2 LIMIT 1`,
            [req.params.id, req.user.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'Sin tracking' });
        res.json(rows[0]);
    } catch (e) { next(e); }
}
