// src/routes/order.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// Resumen para dashboard admin (si más adelante quieres usarlo)
r.get(
  '/admin/summary',
  requireAuth,
  requireRole('admin'),
  ctrl.getAdminSummary
);

// Lista completa de pedidos para admin
// GET /api/orders
r.get(
  '/',
  requireAuth,
  requireRole('admin'),
  ctrl.listAll
);

// --- Rutas de cliente (checkout y "mis pedidos") ---
r.post('/checkout', requireAuth, ctrl.checkoutFromCart);
r.get('/mine', requireAuth, ctrl.myOrders);

// --- Tracking de envío (cliente) ---
r.get('/:id/track', requireAuth, ctrl.track);

// --- Obtener pedido por ID (cliente o admin) ---
r.get('/:id', requireAuth, ctrl.getById);

export default r;
