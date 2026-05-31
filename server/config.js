import crypto from 'crypto';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set. Using a random UUID. Sessions will be invalidated on restart.');
}

export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
