import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// Perfil del usuario autenticado
r.get('/me', requireAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, nombre, email, telefono, rol, activo, fecha_registro
       FROM usuario WHERE id = $1`,
            [req.user.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) { next(e); }
});

// Admin: listar usuarios con filtro y paginación
r.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 20);
        const offset = (page - 1) * limit;

        const q = (req.query.q || '').trim();
        const where = q ? `WHERE nombre ILIKE $1 OR email ILIKE $1` : '';
        const params = q ? [`%${q}%`, limit, offset] : [limit, offset];

        const { rows } = await pool.query(
            `
      SELECT id, nombre, email, telefono, rol, activo, fecha_registro
      FROM usuario
      ${where}
      ORDER BY id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
      `,
            params
        );
        res.json({ page, limit, items: rows });
    } catch (e) { next(e); }
});

export default r;
