import { Router } from 'express';
import * as c from '../controllers/course.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// catálogo público
r.get('/', c.list);

// mis cursos (requiere login)
r.get('/mine', requireAuth, c.mine);

// inscribirse (comprado/aprobado) guarda snapshot
r.post('/:id/inscribirme', requireAuth, c.enroll);

// admin CRUD
r.post('/', requireAuth, requireRole('admin'), c.create);
r.put('/:id', requireAuth, requireRole('admin'), c.update);
r.delete('/:id', requireAuth, requireRole('admin'), c.remove);

export default r;
