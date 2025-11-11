import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import * as ctrl from '../controllers/product.controller.js';

const r = Router();

// público
r.get('/', ctrl.listProducts);
r.get('/:id', ctrl.getById);

// admin
r.post('/', requireAuth, requireRole('admin'), ctrl.create);
r.put('/:id', requireAuth, requireRole('admin'), ctrl.update);
r.delete('/:id', requireAuth, requireRole('admin'), ctrl.remove);

export default r;
