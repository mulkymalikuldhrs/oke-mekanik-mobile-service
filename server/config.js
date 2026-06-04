import crypto from 'crypto';

if (!process.env.JWT_SECRET) {
  console.warn('[OkeMekanik] JWT_SECRET is not set. Using a temporary secret, sessions will invalidate on server restart.');
}

export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
