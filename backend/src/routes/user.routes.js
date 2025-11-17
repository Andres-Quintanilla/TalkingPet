// src/routes/user.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import * as ctrl from '../controllers/user.controller.js'; // <-- Importamos el controlador

const r = Router();

// Rutas de usuario logueado
r.get('/me', requireAuth, ctrl.getMyProfile);
r.patch('/theme', requireAuth, ctrl.updateTheme); // <-- NUEVA RUTA

// Ruta de Admin
r.get('/', requireAuth, requireRole('admin'), ctrl.listAllUsers);

export default r;