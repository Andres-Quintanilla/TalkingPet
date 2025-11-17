// src/routes/service.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/service.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// --- Ruta Pública ---
r.get('/', ctrl.list);

// --- Rutas de Admin ---
r.post('/', requireAuth, requireRole('admin'), ctrl.create);
r.put('/:id', requireAuth, requireRole('admin'), ctrl.update); // <-- AÑADIDO
r.delete('/:id', requireAuth, requireRole('admin'), ctrl.remove); // <-- AÑADIDO

export default r;