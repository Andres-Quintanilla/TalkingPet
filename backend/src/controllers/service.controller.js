// src/controllers/service.controller.js
import { pool } from '../config/db.js';

export async function list(_req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM servicio ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { nombre, tipo, descripcion, precio_base, duracion_minutos } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO servicio (nombre, tipo, descripcion, precio_base, duracion_minutos)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, tipo, descripcion || null, precio_base, duracion_minutos || 60]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
}

// --- NUEVA FUNCIÓN ---
export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, tipo, descripcion, precio_base, duracion_minutos } = req.body;
    const { rows } = await pool.query(
      `UPDATE servicio 
       SET 
         nombre = COALESCE($1, nombre),
         tipo = COALESCE($2, tipo),
         descripcion = COALESCE($3, descripcion),
         precio_base = COALESCE($4, precio_base),
         duracion_minutos = COALESCE($5, duracion_minutos)
       WHERE id = $6 RETURNING *`,
      [nombre, tipo, descripcion, precio_base, duracion_minutos, id]
    );
    if (!rows[0])
      return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
}

// --- NUEVA FUNCIÓN ---
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM servicio WHERE id = $1', [
      id,
    ]);
    if (rowCount === 0)
      return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}