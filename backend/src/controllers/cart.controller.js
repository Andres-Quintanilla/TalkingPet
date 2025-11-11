import { pool } from '../config/db.js';

async function ensureCart(userId) {
    const find = await pool.query('SELECT id FROM carrito WHERE usuario_id=$1', [userId]);
    if (find.rows[0]) return find.rows[0].id;
    const ins = await pool.query('INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING id', [userId]);
    return ins.rows[0].id;
}

export async function getMyCart(req, res, next) {
    try {
        const cartId = await ensureCart(req.user.id);
        const { rows } = await pool.query(
            `SELECT ci.id, ci.producto_id, p.nombre, p.imagen_url, ci.cantidad, ci.precio_unitario, ci.subtotal
       FROM carrito_item ci INNER JOIN producto p ON p.id = ci.producto_id
       WHERE carrito_id=$1 ORDER BY ci.id DESC`, [cartId]
        );
        const total = rows.reduce((t, it) => t + Number(it.subtotal), 0);
        res.json({ items: rows, total });
    } catch (e) { next(e); }
}

export async function addItem(req, res, next) {
    try {
        const { producto_id, cantidad = 1 } = req.body;
        const cartId = await ensureCart(req.user.id);
        const p = await pool.query('SELECT id, precio FROM producto WHERE id=$1', [producto_id]);
        if (!p.rows[0]) return res.status(404).json({ error: 'Producto no existe' });

        await pool.query(
            `INSERT INTO carrito_item (carrito_id, producto_id, cantidad, precio_unitario)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (carrito_id, producto_id)
       DO UPDATE SET cantidad = carrito_item.cantidad + EXCLUDED.cantidad`,
            [cartId, producto_id, cantidad, p.rows[0].precio]
        );
        return getMyCart(req, res, next);
    } catch (e) { next(e); }
}

export async function updateItem(req, res, next) {
    try {
        const { producto_id, cantidad } = req.body;
        const cartId = await ensureCart(req.user.id);
        await pool.query(
            `UPDATE carrito_item SET cantidad=$1 WHERE carrito_id=$2 AND producto_id=$3`,
            [cantidad, cartId, producto_id]
        );
        return getMyCart(req, res, next);
    } catch (e) { next(e); }
}

export async function removeItem(req, res, next) {
    try {
        const { producto_id } = req.body;
        const cartId = await ensureCart(req.user.id);
        await pool.query(`DELETE FROM carrito_item WHERE carrito_id=$1 AND producto_id=$2`, [cartId, producto_id]);
        return getMyCart(req, res, next);
    } catch (e) { next(e); }
}

export async function clearCart(req, res, next) {
    try {
        const cartId = await ensureCart(req.user.id);
        await pool.query(`DELETE FROM carrito_item WHERE carrito_id=$1`, [cartId]);
        return getMyCart(req, res, next);
    } catch (e) { next(e); }
}
