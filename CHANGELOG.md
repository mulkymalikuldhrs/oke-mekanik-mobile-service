# Changelog

Semua perubahan penting pada proyek Oke Mekanik akan didokumentasikan dalam file ini.

Format didasarkan pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [7.0.1] - 2026-06-22

### Ditambahkan
- AI Diagnostic Engine v7.0.1 dengan dukungan penuh untuk EV / Hybrid (svc-13).
- Deteksi canggih untuk masalah Inverter, Baterai HV, dan Motor Listrik.
- Peningkatan teknis "Technical Boost" AI ke +45 poin untuk akurasi tinggi pada masalah Overhaul dan EV.
- Tombol 'Quick Service' khusus untuk Overhaul dan EV/Hybrid di Dashboard Pelanggan.
- Mekanik spesialis EV baru: 'Elon Mekanik' dengan keahlian Baterai HV.
- Branding Masterpiece v28.2 ULTIMATE+ di seluruh ekosistem.
- Sinkronisasi versi sistem backend dan frontend ke v7.0.1.

### Diubah
- Update footer copyright ke 2026 OKE MEKANIK MASTERPIECE v28.2 ULTIMATE+.
- Refaktor middleware backend untuk menghilangkan SyntaxError pada environment Node.js ESM.
- Pembaruan unit test untuk menggunakan modern API mocking (vi.mocked) sesuai Zero-Mock Policy.

### Diperbaiki
- Perbaikan masalah impor type di `authMiddleware.js` dan `errorMiddleware.js`.
- Perbaikan inkonsistensi data pada dashboard pelanggan.

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
