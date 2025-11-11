import { pool } from '../config/db.js';

export async function list(_req, res, next) {
    try {
        const { rows } = await pool.query('SELECT * FROM servicio ORDER BY id DESC');
        res.json(rows);
    } catch (e) { next(e); }
}

export async function create(req, res, next) {
    try {
        const { tipo, descripcion, precio_base, duracion_minutos } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO servicio (tipo, descripcion, precio_base, duracion_minutos)
       VALUES ($1,$2,$3,$4) RETURNING *`,
            [tipo, descripcion || null, precio_base, duracion_minutos || 60]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}
