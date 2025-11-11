import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

// registro / login
r.post('/register', c.register);
r.post('/login', c.login);

// opcional: quién soy (útil para pruebas; tu front ya usa /api/users/me)
r.get('/me', requireAuth, c.me);

// password reset (en dev, el link sale por consola del backend)
r.post('/forgot', c.forgotPassword);
r.post('/reset', c.resetPassword);

export default r;
