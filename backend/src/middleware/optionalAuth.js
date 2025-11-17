// src/middleware/optionalAuth.js
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'dev_secret';

/**
 * Adjunta req.user si el token existe y es válido.
 * No bloquea la ruta si no hay token.
 */
export function optionalAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;

  if (!token) {
    // No hay token, pero continuamos
    return next();
  }

  try {
    // Hay token, lo verificamos y adjuntamos
    const payload = jwt.verify(token, secret);
    req.user = payload;
  } catch {
    // El token es inválido, pero no importa, continuamos
    // req.user queda como 'undefined'
  }

  next();
}