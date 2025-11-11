import { pool } from '../config/db.js';

export async function list(_req, res, next) {
    try {
        const { rows } = await pool.query(
            `SELECT id, titulo, descripcion, precio, estado
       FROM curso WHERE estado='publicado' ORDER BY id DESC`
        );
        res.json(rows);
    } catch (e) { next(e); }
}

export async function mine(req, res, next) {
    try {
        const { rows } = await pool.query(
            `SELECT ic.id,
              ic.curso_id,
              COALESCE(c.titulo, ic.titulo_snapshot)  AS titulo,
              COALESCE(c.precio, ic.precio_snapshot)  AS precio,
              ic.progreso
       FROM inscripcion_curso ic
       LEFT JOIN curso c ON c.id = ic.curso_id
       WHERE ic.usuario_id=$1
       ORDER BY ic.id DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (e) { next(e); }
}

// al inscribirse, guardamos snapshot del curso
export async function enroll(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { rows: cur } = await pool.query('SELECT titulo, precio FROM curso WHERE id=$1', [id]);
        if (!cur[0]) return res.status(404).json({ error: 'Curso no encontrado' });

        await pool.query(
            `INSERT INTO inscripcion_curso (usuario_id, curso_id, titulo_snapshot, precio_snapshot)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (usuario_id, curso_id) DO NOTHING`,
            [req.user.id, id, cur[0].titulo, cur[0].precio]
        );
        res.json({ ok: true });
    } catch (e) { next(e); }
}

// ===== Admin CRUD (básico) =====
export async function create(req, res, next) {
    try {
        const { titulo, descripcion, estado = 'borrador', precio = null } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO curso (titulo, descripcion, estado, precio, fecha_publicacion, instructor_id)
       VALUES ($1,$2,$3,$4,NOW(),$5) RETURNING *`,
            [titulo, descripcion || null, estado, precio, req.user.id]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}

export async function update(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { titulo, descripcion, estado, precio } = req.body;
        const { rows } = await pool.query(
            `UPDATE curso
       SET titulo=COALESCE($2,titulo),
           descripcion=COALESCE($3,descripcion),
           estado=COALESCE($4,estado),
           precio=COALESCE($5,precio)
       WHERE id=$1
       RETURNING *`,
            [id, titulo || null, descripcion || null, estado || null, precio ?? null]
        );
        if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);
        await pool.query('DELETE FROM curso WHERE id=$1', [id]); // las inscripciones quedan por ON DELETE SET NULL
        res.json({ ok: true });
    } catch (e) { next(e); }
}
