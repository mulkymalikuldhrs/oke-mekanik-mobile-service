import { z } from 'zod';

export const errorHandler = (err, req, res, _next) => {
  // ZodError: expose only field-level info, never internal schema paths or structures
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      code: 'VALIDATION_ERROR'
    });
  }

  const statusCode = err.status || err.statusCode || 500;

  // Always log full error server-side
  console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.url}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Never expose internal error details to clients
  let message = 'Terjadi kesalahan internal pada server';
  if (statusCode === 400) message = 'Permintaan tidak valid';
  else if (statusCode === 401) message = 'Sesi berakhir, silakan masuk kembali';
  else if (statusCode === 403) message = 'Akses ditolak atau izin tidak mencukupi';
  else if (statusCode === 404) message = 'Sumber daya tidak ditemukan';

  res.status(statusCode).json({
    message,
    code: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : (err.code || 'ERROR'),
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};
