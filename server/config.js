import crypto from 'crypto';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is missing. Using a dynamic fallback for development.');
}

export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomUUID();
