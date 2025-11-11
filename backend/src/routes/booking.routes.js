import { Router } from 'express';
import * as ctrl from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

r.post('/', requireAuth, ctrl.create);
r.get('/mine', requireAuth, ctrl.mine);
r.patch('/:id/status', requireAuth, requireRole('admin','empleado_peluquero','empleado_veterinario','empleado_adiestrador'), ctrl.updateStatus);

export default r;
