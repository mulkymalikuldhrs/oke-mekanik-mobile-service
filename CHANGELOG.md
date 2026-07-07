# Changelog

Semua perubahan penting pada proyek Oke Mekanik akan didokumentasikan dalam file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [7.0.1] - 2026-07-07

### Ditambahkan
- **AI Diagnostic Engine v7.0.1**: Penambahan kategori khusus untuk EV/Hybrid (`svc-13`) dan Overhaul (`svc-9`).
- **Technical Scoring Boost (+55)**: Peningkatan akurasi diagnosa untuk istilah teknis otomotif.
- **Ecosystem Branding v28.2 ULTIMATE+**: Sinkronisasi branding di seluruh dashboard dan landing page.
- **Dukungan Kendaraan Listrik**: Integrasi penuh layanan untuk mobil listrik dan hybrid (Elon Mekanik).

### Diubah
- Upgrade ke **Vite 8** dan **React 19** untuk performa frontend maksimal.
- Pembaruan skema database untuk mendukung layanan baru.
- Peningkatan sistem keamanan pada backend middleware (removal of JS syntax errors).

### Diperbaiki
- Sinkronisasi status mekanik real-time pada dashboard pelanggan.
- Perbaikan validasi input pada form pendaftaran mekanik.
- Optimasi aset visual untuk loading yang lebih cepat.

---

## [7.0.0] - 2026-05-20

### Ditambahkan
- Upgrade ke Masterpiece v28.1 ULTIMATE+
- Implementasi penuh Zero-Mock Policy
- Migrasi ke Vite 8 dan React 19 production build
- Database SQLite dengan mode WAL (Write-Ahead Logging)
- Global Request Trace ID untuk pemantauan end-to-end

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

---

## [5.6.0] - 2025-10-15

### Ditambahkan
- AI Diagnostic Engine v5.6 dengan diagnosa dasar
- Sistem booking dengan jadwal tersedia
- Integrasi pembayaran digital
- Halaman profil mekanik

---

## [5.5.0] - 2025-08-01

### Ditambahkan
- Fitur chat dasar antara pelanggan dan mekanik
- Sistem booking sederhana
- Autentikasi JWT
- Rate limiting pada API

---

## [5.0.0] - 2025-05-01

### Ditambahkan
- Rilis awal platform Oke Mekanik
- Registrasi dan login pengguna
- Pendaftaran mekanik
- Pencarian mekanik berdasarkan lokasi
- Halaman utama dengan daftar layanan

---

[7.0.1]: https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/releases/tag/v7.0.1
[5.8.1]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.8.1
[5.7.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.7.0
[5.6.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.6.0
[5.5.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.5.0
[5.0.0]: https://github.com/mulkymalikuldhrs/oke-mekanik/releases/tag/v5.0.0
