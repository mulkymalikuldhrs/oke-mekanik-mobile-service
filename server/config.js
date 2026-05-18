export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-okemekanik-2024';
export const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'dev-secret-okemekanik-2024') {
  console.error('FATAL: JWT_SECRET is insecure in production!');
  process.exit(1);
}
