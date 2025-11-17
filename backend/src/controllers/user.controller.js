// src/controllers/user.controller.js
import { pool } from '../config/db.js';

export async function getMyProfile(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, telefono, rol, activo, fecha_registro, saldo, tema
       FROM usuario WHERE id = $1`,
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
}

export async function listAllUsers(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const q = (req.query.q || '').trim();
    const where = q ? `WHERE nombre ILIKE $3 OR email ILIKE $3` : '';
    const params = q ? [limit, offset, `%${q}%`] : [limit, offset];

    const { rows } = await pool.query(
      `SELECT id, nombre, email, telefono, rol, activo, fecha_registro
       FROM usuario
       ${where}
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      params
    );
    res.json({ page, limit, items: rows });
  } catch (e) {
    next(e);
  }
}

export async function updateTheme(req, res, next) {
  try {
    const { tema } = req.body;
    if (!['light', 'dark', 'system'].includes(tema)) {
      return res.status(400).json({ error: 'Tema inválido' });
    }
    const { rows } = await pool.query(
      'UPDATE usuario SET tema = $1 WHERE id = $2 RETURNING id, tema',
      [tema, req.user.id]
    );
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
}