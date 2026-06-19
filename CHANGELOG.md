# Changelog

Semua perubahan penting pada proyek Oke Mekanik akan didokumentasikan dalam file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [7.0.1] - 2026-06-11

### Ditambahkan
- **AI Diagnostic Engine v7.0.1**: Dukungan penuh untuk Kendaraan Listrik (EV) dan Hybrid.
- Layanan Baru: `svc-13` (Cek Sistem EV/Hybrid) mencakup Baterai HV, Inverter, dan Motor Listrik.
- Technical Boost Score ditingkatkan menjadi +45 untuk akurasi diagnosa masalah teknis yang spesifik.
- UI Fidelity Upgrade: Implementasi `.glass-card` pada dashboard Pelanggan dan Mekanik.
- Sinkronisasi Branding Masterpiece v28.2 ULTIMATE+ di seluruh platform.

### Diubah
- Migrasi infrastruktur backend ke Node.js ESM murni dengan menghapus sisa-sisa sintaks TypeScript.
- Pembaruan dokumentasi teknis (`README.md`, `TECHNICAL.md`, `AGENTS.md`) untuk mencerminkan arsitektur Vite + React 19.

### Diperbaiki
- **Kestabilan Server**: Memperbaiki SyntaxError pada middleware backend yang mencegah server berjalan di lingkungan Node.js standar.
- Validasi data database seeding untuk memastikan integrasi layanan EV/Hybrid yang tepat.

---

## [7.0.0] - 2026-06-06

### Ditambahkan
- Upgrade besar ke ekosistem Masterpiece v28.1 ULTIMATE+.
- Integrasi layanan Overhaul / Turun Mesin (`svc-9`) ke dalam model AI.
- Penggunaan Request Trace ID (`req.id`) untuk observabilitas end-to-end.
- Mode Write-Ahead Logging (WAL) pada SQLite untuk performa konkuren yang lebih baik.

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

## [5.7.0] - 2025-12-01

### Ditambahkan
- Integrasi Leaflet Maps untuk pelacakan mekanik
- Sistem rating dan review mekanik
- Dashboard admin untuk manajemen mekanik dan pesanan
- Notifikasi push untuk pembaruan status booking

### Diubah
- Peningkatan performa loading halaman
- Optimasi database SQLite untuk query yang lebih cepat

### Diperbaiki
- Perbaikan masalah koneksi Socket.io yang terputus
- Perbaikan tampilan chat pada mode gelap

---

## [5.6.0] - 2025-10-15

### Ditambahkan
- AI Diagnostic Engine v5.6 dengan diagnosa dasar
- Sistem booking dengan jadwal tersedia
- Integrasi pembayaran digital
- Halaman profil mekanik

### Diubah
- Redesign UI ke glassmorphism
- Migrasi dari CSS biasa ke Tailwind CSS
- Pembaruan dependensi keamanan

### Diperbaiki
- Perbaikan bug autentikasi pada sesi kadaluarsa
- Perbaikan memory leak pada koneksi Socket.io

---

## [5.5.0] - 2025-08-01

### Ditambahkan
- Fitur chat dasar antara pelanggan dan mekanik
- Sistem booking sederhana
- Autentikasi JWT
- Rate limiting pada API

### Diubah
- Peningkatan struktur proyek untuk skalabilitas
- Pembaruan ke TypeScript 5.5

---

## [5.0.0] - 2025-05-01

### Ditambahkan
- Rilis awal platform Oke Mekanik
- Registrasi dan login pengguna
- Pendaftaran mekanik
- Pencarian mekanik berdasarkan lokasi
- Halaman utama dengan daftar layanan

---

[5.8.1]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.8.1
[5.7.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.7.0
[5.6.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.6.0
[5.5.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.5.0
[5.0.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.0.0
