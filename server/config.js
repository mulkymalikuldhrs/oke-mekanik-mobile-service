import crypto from 'crypto';
export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
