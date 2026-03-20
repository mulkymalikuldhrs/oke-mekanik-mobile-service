# Oke Mekanik - Masterpiece Full-Stack Ecosystem

Dokumen ini berisi panduan dan standar operasional untuk agen AI yang bekerja pada codebase Oke Mekanik.

## Prinsip Utama
1. **Otonom & Real**: Tidak diperbolehkan menggunakan mock data, simulasi, atau placeholder di logika aplikasi inti. Semua data harus berasal dari backend SQLite.
2. **Futuristic UI**: Pertahankan estetika Glassmorphism. Jangan pernah menghapus `.glass-card` atau `.backdrop-blur-ultra`.
3. **Keamanan**: Selalu verifikasi `req.userId` dari JWT untuk operasi yang sensitif terhadap kepemilikan data (POST/PATCH/PUT).
4. **Kualitas Produksi**: Kode harus bersih, terdokumentasi, dan melewati semua pengujian sebelum disubmit.

## Panduan Backend
- Database: SQLite via `better-sqlite3`.
- API: Express dengan middleware `verifyToken`.
- AI Diagnostic: Logika pemetaan keyword berada di `/api/ai/diagnose`.

## Panduan Frontend
- Gunakan `src/lib/api.ts` untuk semua komunikasi API.
- Gunakan `Framer Motion` untuk transisi dan animasi futuristik.
- Selalu dukung multi-bahasa (ID/EN) melalui `useLanguage`.

## Alur Verifikasi
1. Jalankan unit test: `npm test`.
2. Jalankan build: `npm run build`.
3. Pastikan tidak ada `db.json` legacy yang muncul kembali.

Proyek ini adalah sebuah Masterpiece. Jaga integritas arsitektural dan visualnya.
