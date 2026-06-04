import crypto from 'crypto';

if (!process.env.JWT_SECRET) {
  console.warn('[WARNING] JWT_SECRET is not set. Using a dynamic fallback for security, but user sessions will invalidate on restart.');
}

export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
