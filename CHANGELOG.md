# Changelog

Semua perubahan penting pada proyek Oke Mekanik akan didokumentasikan dalam file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [6.2.0] - 2026-05-25

### Ditambahkan
- AI Diagnostic Engine v5.8.2 ULTIMATE+ dengan dukungan EV/Hybrid (svc-9).
- Layanan `svc-13` ditambahkan untuk "Overhaul / Turun Mesin".
- Peningkatan UI Glassmorphism pada BookingPage dan CustomerDashboard sesuai standar Masterpiece v28.1.
- Observabilitas backend yang ditingkatkan dengan Request Trace ID pada log rute.
- Audit kepatuhan Zero-Mock Policy untuk memastikan semua data berasal dari SQLite.

## [5.8.2] - 2026-01-15

### Ditambahkan
- AI Diagnostic Engine v5.8.2 dengan pencocokan pola canggih
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

[5.8.2]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.8.2
[5.7.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.7.0
[5.6.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.6.0
[5.5.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.5.0
[5.0.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.0.0
