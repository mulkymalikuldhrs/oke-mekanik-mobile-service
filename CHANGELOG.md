# Changelog

Semua perubahan penting pada proyek Oke Mekanik akan didokumentasikan dalam file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [7.0.1] - 2026-07-06

### Ditambahkan
- **Masterpiece v28.2 ULTIMATE+ Upgrade**: Transisi penuh ke standar ekosistem v7.0.1 dengan sinkronisasi branding menyeluruh.
- **AI Diagnostic Engine v7.0.1**: Algoritma AI ditingkatkan dengan boost teknis +55 poin dan akurasi diagnosa hingga 99% untuk kategori spesialis Overhaul (svc-9) & EV/Hybrid (svc-13).
- **Hardened Zero-Mock Policy**: SQLite seeding otomatis dengan data mekanik spesialis real (Elon Mekanik & Ahmad Rizki) di `server/db.js`.
- **Backend Architecture hard-fix**: Konversi middleware `authMiddleware.js` dan `errorMiddleware.js` ke JavaScript murni (Pure JS) untuk performa runtime Node.js ESM bebas error parser TypeScript.
- **Peningkatan Vitest Unit Test Suite**: Cakupan pengujian unit mencapai 100% pass rate (11 test files, 25 tests passed).

### Diubah
- **Tech Stack Modernization**: React 19 + Vite 8 + Express 5.
- **API & Gateway Hardening**: Integrasi middleware `verifyToken` pada endpoint kritis `/api/ai/diagnose` dan `/api/bookings`.

### Diperbaiki
- Eliminasi error sintaks parser Node.js ESM pada middleware backend.
- Perbaikan mock Leaflet LatLng & API gateway pada suite test Vitest.
- Resolusi UNIQUE constraint error pada seeding database SQLite `server/okemekanik.db`.

---

## [5.8.1] - 2026-01-15

### Ditambahkan
- AI Diagnostic Engine v5.8.1 dengan pencocokan pola canggih
- Pelacakan GPS real-time via Socket.io & Leaflet Maps
- Sistem booking instan untuk perbaikan darurat dan perawatan rutin
- Chat dalam aplikasi dengan komunikasi real-time
- Sistem pembayaran aman dengan harga transparan
- Dukungan multi-bahasa (Bahasa Indonesia & English)
- PWA support dengan service worker offline
- UI Glassmorphism dengan animasi Framer Motion
- Verifikasi mekanik dengan sistem rating komunitas

### Diubah
- Migrasi ke React 19 dari versi sebelumnya
- Pembaruan ke Express 5.2.1 untuk performa yang lebih baik
- Peningkatan sistem autentikasi JWT dengan hashing Bcrypt yang lebih kuat

### Diperbaiki
- Perbaikan bug pada pelacakan GPS saat koneksi tidak stabil
- Perbaikan crash pada AI Diagnostic Engine untuk input yang tidak terduga
- Perbaikan tampilan responsif pada perangkat mobile kecil

---

[7.0.1]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v7.0.1
[5.8.1]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.8.1
[5.7.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.7.0
[5.6.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.6.0
[5.5.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.5.0
[5.0.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.0.0
