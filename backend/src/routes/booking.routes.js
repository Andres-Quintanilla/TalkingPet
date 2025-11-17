// src/routes/booking.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();
const EMPLEADO_ROLES = [
  'admin',
  'empleado_peluquero',
  'empleado_veterinario',
  'empleado_adiestrador',
];

// Summary de citas para dashboard admin (opcional)
r.get(
  '/admin/summary',
  requireAuth,
  requireRole('admin'),
  ctrl.getAdminSummary
);

// RUTA PÚBLICA (para consultar horarios disponibles)
r.get('/availability', ctrl.getAvailability);

// --- Rutas de CLIENTE ---
r.post('/', requireAuth, ctrl.create);
r.get('/mine', requireAuth, ctrl.mine);

// --- Rutas de EMPLEADO/ADMIN ---
// GET /api/bookings/all  -> usada por el dashboard
r.get('/all', requireAuth, requireRole(...EMPLEADO_ROLES), ctrl.listAll);

r.patch(
  '/:id/status',
  requireAuth,
  requireRole(...EMPLEADO_ROLES),
  ctrl.updateStatus
);

export default r;
