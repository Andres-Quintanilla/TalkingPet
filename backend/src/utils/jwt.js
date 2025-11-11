import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'dev_secret';
const expiresIn = process.env.JWT_EXPIRES || '7d';

export const signToken = (payload) => jwt.sign(payload, secret, { expiresIn });
export const verifyToken = (token) => jwt.verify(token, secret);
