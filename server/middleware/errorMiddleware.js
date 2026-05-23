import { z } from 'zod';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: err.errors,
      code: 'VALIDATION_ERROR'
    });
  }

  const isDev = process.env.NODE_ENV === 'development';
  const statusCode = err.status || err.statusCode || 500;

  console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.url}: ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  let message = 'Terjadi kesalahan internal pada server';
  if (statusCode === 400) message = 'Permintaan tidak valid';
  else if (statusCode === 401) message = 'Sesi berakhir, silakan masuk kembali';
  else if (statusCode === 403) message = 'Akses ditolak atau izin tidak mencukupi';
  else if (statusCode === 404) message = 'Sumber daya tidak ditemukan';

  res.status(statusCode).json({
    message: isDev ? err.message : message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: req.url,
    error: isDev ? err.stack : undefined
  });
};
