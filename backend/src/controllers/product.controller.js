// backend/src/controllers/product.controller.js
import { pool } from '../config/db.js';
import { productSchema } from '../validators/product.validator.js';

/**
 * GET /api/products
 * Lista paginada de productos activos.
 * Añade cabeceras Link para prev/next y Cache-Control corto.
 */
export async function list(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 12);
        const offset = (page - 1) * limit;

        const { rows } = await pool.query(
            `SELECT id, nombre, descripcion, categoria, precio, stock, imagen_url
       FROM producto
       WHERE activo = TRUE
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const {
            rows: [{ count }],
        } = await pool.query(
            'SELECT COUNT(*)::int AS count FROM producto WHERE activo = TRUE'
        );

        const totalPages = Math.max(1, Math.ceil(count / limit));
        const base = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';
        const apiBase = process.env.API_PUBLIC_BASE_URL || 'http://localhost:4000';

        // Cabeceras de navegación (prev/next) para el cliente
        const links = [];
        if (page > 1)
            links.push(
                `<${apiBase}/api/products?page=${page - 1}&limit=${limit}>; rel="prev"`
            );
        if (page < totalPages)
            links.push(
                `<${apiBase}/api/products?page=${page + 1}&limit=${limit}>; rel="next"`
            );
        if (links.length) res.setHeader('Link', links.join(', '));

        // Cache corto y seguro
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

        res.json({
            page,
            totalPages,
            count,
            items: rows,
            uiListUrl: `${base}/productos?page=${page}`,
        });
    } catch (e) {
        next(e);
    }
}

/**
 * GET /api/products/:id
 * Devuelve un producto por id (activo o no; si quieres solo activos, añade WHERE activo=TRUE).
 */
export async function getById(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const { rows } = await pool.query(
            'SELECT * FROM producto WHERE id = $1',
            [id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });

        res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=120');
        res.json(rows[0]);
    } catch (e) {
        next(e);
    }
}

/**
 * POST /api/products
 * Crea un producto (admin).
 */
export async function create(req, res, next) {
    try {
        const data = productSchema.parse(req.body);

        const { rows } = await pool.query(
            `INSERT INTO producto
         (nombre, descripcion, categoria, precio, stock, imagen_url, activo)
       VALUES
         ($1, $2, $3, $4, $5, $6, COALESCE($7, TRUE))
       RETURNING *`,
            [
                data.nombre,
                data.descripcion ?? null,
                data.categoria ?? null,
                data.precio,
                data.stock ?? 0,
                data.imagen_url ?? null,
                data.activo,
            ]
        );

        res.status(201).json(rows[0]);
    } catch (e) {
        next(e);
    }
}

/**
 * PUT /api/products/:id
 * Actualiza campos parciales (admin).
 */
export async function update(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Validación parcial con Zod
        const data = productSchema.partial().parse(req.body);

        const fields = Object.keys(data);
        if (!fields.length)
            return res.status(400).json({ error: 'Nada para actualizar' });

        const values = Object.values(data);
        const set = fields.map((k, i) => `${k}=$${i + 1}`).join(', ');

        const { rows } = await pool.query(
            `UPDATE producto SET ${set} WHERE id=$${fields.length + 1} RETURNING *`,
            [...values, id]
        );

        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) {
        next(e);
    }
}

/**
 * DELETE /api/products/:id
 * Borra un producto (admin). Si prefieres "soft delete", cambia a UPDATE activo=FALSE.
 */
export async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        await pool.query('DELETE FROM producto WHERE id=$1', [id]);
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
}

// Alias para compatibilidad si en alguna parte usabas listProducts
export { list as listProducts };
