import { Router } from 'express';
import * as ctrl from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

r.post('/checkout', requireAuth, ctrl.checkoutFromCart);
r.get('/mine', requireAuth, ctrl.myOrders);
r.get('/:id', requireAuth, ctrl.getById);

// tracking del pedido del usuario
r.get('/:id/track', requireAuth, ctrl.track);

// admin
r.get('/', requireAuth, requireRole('admin'), ctrl.listAll);

export default r;
