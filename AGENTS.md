# Masterpiece Full-Stack Ecosystem Guidelines

Dokumen ini mendefinisikan standar operasional untuk pengembangan "Oke Mekanik" sebagai masterpiece aplikasi full-stack.

## Standar Kode & Arsitektur
1. **Security-First**: Semua endpoint di `server/index.js` WAJIB memvalidasi identitas pengguna melalui `req.userId` yang berasal dari JWT. Jangan pernah mempercayai `userId` yang dikirim dari body request pelanggan.
2. **Database Integrity**: Gunakan SQLite (`server/db.js`) sebagai satu-satunya sumber kebenaran data. Hapus atau abaikan file `.json` mock.
3. **API Client Consistency**: Semua panggilan API harus melalui `src/lib/api.ts` menggunakan pembungkus `fetchWithAuth`.

## Standar UI/UX (Futuristic Masterpiece)
- **Glassmorphism**: Gunakan utility class `.glass-card` untuk kontainer utama. Nilai blur harus dipertahankan pada `40px` (`backdrop-blur-ultra`).
- **Animations**: Setiap transisi halaman atau langkah form WAJIB menggunakan `framer-motion` (initial, animate, exit).
- **Interactive Feedback**: Gunakan `sonner` atau `toast` untuk setiap aksi kritikal (login, booking, AI analysis).

## Verifikasi Mandiri
Sebelum melakukan commit, pengembang (atau agen AI) harus memastikan:
1. `npm run build` berjalan tanpa error TypeScript.
2. Backend API merespons dengan status 200/201 pada flow pendaftaran dan login.
3. Fitur AI Diagnostic mengembalikan saran yang valid berdasarkan input kata kunci (rem, oli, aki).

## Aturan Otonom
Operasikan proyek ini dengan asumsi kesiapan produksi (Production-Ready). Jangan gunakan placeholder, jangan gunakan data palsu di tingkat komponen, dan pastikan seluruh logika bisnis terimplementasi secara nyata.

---
*Failure is not an option. Excellence is the only standard.*
