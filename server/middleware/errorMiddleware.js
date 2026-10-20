import { z } from 'zod';

export const errorHandler = (err, req, res, _next) => {
  // Log server-side internal errors for diagnostic monitoring
  if (!err.status || err.status >= 500) {
    console.error('[SERVER ERROR]', err);
  }

  // ZodError: expose field-level validation issues cleanly
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Data tidak valid',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // HTTP Errors or client-facing operational errors
  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Sanitize internal server errors to prevent exposing database or stack trace details
  const message = (statusCode >= 500 && isProduction)
    ? 'Terjadi kesalahan pada server'
    : (err.message || 'Terjadi kesalahan pada server');

  res.status(statusCode).json({ message });
};
