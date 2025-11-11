import { pool } from '../config/db.js';
import { bookingSchema } from '../validators/booking.validator.js';

export async function create(req, res, next) {
    try {
        const data = bookingSchema.parse(req.body);
        const { rows } = await pool.query(
            `INSERT INTO cita (usuario_id, mascota_id, servicio_id, empleado_id, modalidad, estado, fecha, hora, comentarios)
       VALUES ($1,$2,$3,NULL,$4,'pendiente',$5,$6,$7)
       RETURNING *`,
            [req.user.id, data.mascota_id || null, data.servicio_id, data.modalidad, data.fecha, data.hora, data.comentarios || null]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}

export async function mine(req, res, next) {
    try {
        const { rows } = await pool.query(
            `SELECT c.*, s.tipo AS servicio_tipo
       FROM cita c LEFT JOIN servicio s ON s.id=c.servicio_id
       WHERE c.usuario_id=$1 ORDER BY c.id DESC`, [req.user.id]
        );
        res.json(rows);
    } catch (e) { next(e); }
}

export async function updateStatus(req, res, next) {
    try {
        const { estado } = req.body; // pendiente, confirmada, cancelada, realizada, no_asistio
        const { rows } = await pool.query(
            `UPDATE cita SET estado=$1 WHERE id=$2 RETURNING *`,
            [estado, req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) { next(e); }
}
