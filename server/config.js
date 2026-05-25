import crypto from 'crypto';
if (!process.env.JWT_SECRET) { console.warn('[OkeMekanik] WARNING: JWT_SECRET env var not set. Using random secret. Set JWT_SECRET in production!'); }
export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
