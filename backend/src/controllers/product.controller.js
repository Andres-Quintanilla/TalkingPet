// src/controllers/product.controller.js
import { pool } from '../config/db.js';

// GET /api/products
// Soporta paginación y búsqueda: ?page=1&limit=20&search=collar
export async function list(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const params = [];
    let where = '';

    if (search) {
      params.push(`%${search}%`);
      where = `WHERE nombre ILIKE $${params.length}`;
    }

    const totalQuery = `SELECT COUNT(*) FROM producto ${where}`;
    const totalResult = await pool.query(totalQuery, params);
    const total = Number(totalResult.rows[0]?.count || 0);

    params.push(limit, offset);

    const itemsQuery = `
      SELECT
        id,
        nombre,
        descripcion,
        precio,
        stock,
        estado,
        imagen_url
      FROM producto
      ${where}
      ORDER BY id DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;

    const { rows } = await pool.query(itemsQuery, params);

    res.json({
      page,
      limit,
      total,
      items: rows,
    });
  } catch (e) {
    next(e);
  }
}

// GET /api/products/:id
export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { rows } = await pool.query(
      `SELECT
         id,
         nombre,
         descripcion,
         precio,
         stock,
         estado,
         imagen_url
       FROM producto
       WHERE id = $1`,
      [id]
    );

    const producto = rows[0];
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (e) {
    next(e);
  }
}

// POST /api/products   (solo admin)
export async function create(req, res, next) {
  try {
    const {
      nombre,
      descripcion = null,
      precio = null,
      stock = 0,
      estado = 'activo',
      imagen_url = null,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const { rows } = await pool.query(
      `INSERT INTO producto
        (nombre, descripcion, precio, stock, estado, imagen_url, fecha_creacion)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING
         id,
         nombre,
         descripcion,
         precio,
         stock,
         estado,
         imagen_url`,
      [nombre, descripcion, precio, stock, estado, imagen_url]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
}

// PUT /api/products/:id   (solo admin)
export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const {
      nombre,
      descripcion,
      precio,
      stock,
      estado,
      imagen_url,
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE producto
       SET
         nombre       = COALESCE($2, nombre),
         descripcion  = COALESCE($3, descripcion),
         precio       = COALESCE($4, precio),
         stock        = COALESCE($5, stock),
         estado       = COALESCE($6, estado),
         imagen_url   = COALESCE($7, imagen_url)
       WHERE id = $1
       RETURNING
         id,
         nombre,
         descripcion,
         precio,
         stock,
         estado,
         imagen_url`,
      [
        id,
        nombre ?? null,
        descripcion ?? null,
        precio ?? null,
        stock ?? null,
        estado ?? null,
        imagen_url ?? null,
      ]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
}

// DELETE /api/products/:id  (solo admin)
export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await pool.query('DELETE FROM producto WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
