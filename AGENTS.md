# Agent Documentation - Masterpiece v28.1 ULTIMATE+

Project "Oke Mekanik" telah ditingkatkan menjadi ekosistem full-stack futuristik dengan standar Masterpiece v28.1.

## 1. Arsitektur & Data Layer
- **Zero-Mock Policy**: Seluruh data berasal dari backend Express 5.2.1 dan SQLite. Tidak diperbolehkan menggunakan `db.json` atau mock data lainnya.
- **Centralized API Client**: Menggunakan `src/lib/api.ts` yang terintegrasi penuh dengan backend API di port 3001.
- **Server State Management**: Menggunakan TanStack Query v5 untuk caching dan sinkronisasi data yang efisien.

## 2. AI Diagnostic Engine v5.8.1 ULTIMATE+
- **Advanced Technical Mapping**: Pemetaan gejala otomotif dalam konteks Indonesia yang mendalam (contoh: 'brebet', 'ngeden', 'ngobos', 'turun mesin').
- **Weighted Confidence**: Algoritma dengan bonus eksponensial untuk kecocokan ganda dan boost +30 poin untuk istilah teknis spesifik.

## 3. UI/UX Masterpiece v28.1
- **Glassmorphism UI**: Penggunaan wajib utility `.glass-card` (`backdrop-blur-[160px]`, `bg-black/40`, `border-white/10`).
- **Futuristic Branding**: Sinkronisasi label versi `v5.8.1 CORE ACTIVE` di seluruh dashboard.

## 4. Keamanan & Performa
- **Security Hardening**: Implementasi `helmet`, `express-rate-limit`, dan validasi JWT yang ketat.
- **PWA Optimized**: Strategi caching `Stale-While-Revalidate` (assets) dan `Network-First` (API) di `public/sw.js`.

## Instruksi Maintenance
- Jalankan `npm test` untuk unit testing frontend.
- Jalankan `node tests/verify_ai_v581.js` untuk memverifikasi logika AI Engine.
- Gunakan `npm run build` untuk memastikan integritas build produksi.
- Pastikan backend berjalan (`npm run backend`) saat melakukan pengembangan frontend.
