// src/routes/course.routes.js
import { Router } from 'express';
import * as c from '../controllers/course.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// --- Rutas Públicas ---
r.get('/', c.list);

// --- Rutas de Cliente ---
// (Movimos 'mine' ANTES de ':id' para evitar conflictos)
r.get('/mine', requireAuth, c.mine);
r.post('/:id/inscribirme', requireAuth, c.enroll);

// --- Ruta Pública (Debe ir DESPUÉS de 'mine') ---
r.get('/:id', c.getById);

// --- Rutas de Admin ---
r.post('/', requireAuth, requireRole('admin'), c.create);
r.put('/:id', requireAuth, requireRole('admin'), c.update);
r.delete('/:id', requireAuth, requireRole('admin'), c.remove);

export default r;