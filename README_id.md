<div align="center">

<img src="https://raw.githubusercontent.com/mulkymalikuldhrs/oke-mekanik/main/public/favicon.ico" width="120" alt="Logo Oke Mekanik" />

<h1>Oke Mekanik</h1>

<h3><em>Mekanik Panggilan — Servis Kendaraan Profesional Langsung ke Lokasi Anda</em></h3>

[![Versi](https://img.shields.io/badge/Versi-5.8.1-0A84FF?style=for-the-badge)](https://github.com/mulkymalikuldhrs/oke-mekanik)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Lisensi](https://img.shields.io/badge/Lisensi-MIT-green?style=for-the-badge)](./LICENSE)

[English](README.md) | **Bahasa Indonesia** | [中文](README_zh.md)

</div>

---

## 🚗 Tentang Oke Mekanik

**Oke Mekanik** adalah platform SaaS full-stack yang menghubungkan pemilik kendaraan dengan mekanik profesional — langsung ke lokasi Anda. Terinspirasi dari model layanan Gojek/Grab, kami membawa bengkel ke tempat Anda. Ditenagai oleh **AI Diagnostic Engine v5.8.1**, pelacakan GPS real-time, dan antarmuka glassmorphism, ini adalah servis kendaraan yang diperbarui untuk era modern. Tidak perlu lagi menunggu di bengkel — mekanik datang ke Anda.

Platform ini dirancang untuk memberikan pengalaman servis kendaraan yang mulus dan transparan. Dengan teknologi pencocokan pola AI yang canggih, pelanggan dapat mendiagnosis masalah kendaraan mereka sebelum mekanik tiba, memungkinkan persiapan yang lebih baik dan waktu penyelesaian yang lebih cepat. Sistem pelacakan GPS real-time memastikan Anda selalu tahu di mana mekanik Anda berada, sementara fitur chat dalam aplikasi memungkinkan komunikasi langsung tanpa hambatan.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi | Status |
|:------|:----------|:------:|
| 🤖 AI Diagnostic Engine | Diagnosa kendaraan otomatis dengan pencocokan pola canggih (v5.8.1) | ✅ |
| 📍 Pelacakan GPS Real-time | Lokasi mekanik langsung via Socket.io & Leaflet Maps | ✅ |
| ⚡ Booking Instan | Perbaikan darurat atau perawatan rutin di ujung jari Anda | ✅ |
| ✅ Mekanik Terverifikasi | Hanya profesional yang telah diverifikasi & dinilai komunitas | ✅ |
| 💬 Chat Dalam Aplikasi | Komunikasi real-time tanpa hambatan antara pelanggan & mekanik | ✅ |
| 💳 Pembayaran Aman | Harga transparan dengan catatan pembayaran digital | ✅ |
| 🌐 Multi-bahasa | Lokalisasi lengkap dalam Bahasa Indonesia & English | ✅ |
| 📱 Siap PWA | Instal sebagai aplikasi native dengan dukungan service worker offline | ✅ |
| 🎨 UI Glassmorphism | Desain kaca buram modern dengan animasi Framer Motion | ✅ |

---

## 🚀 Panduan Mulai

```bash
# 1. Clone repositori
git clone https://github.com/mulkymalikuldhrs/oke-mekanik.git
cd oke-mekanik

# 2. Install dependensi
npm install --legacy-peer-deps

# 3. Inisialisasi database
node -e "import('./server/db.js')"

# 4. Mulai pengembangan (Frontend + Backend bersamaan)
npm run dev
```

> **Prasyarat:** Node.js v18+, npm atau bun

---

## 🛠️ Teknologi yang Digunakan

| Lapisan | Teknologi | Versi |
|:--------|:----------|:-----:|
| **Frontend** | React | 19 |
| **Build Tool** | Vite | 8 |
| **Bahasa** | TypeScript | 5.5 |
| **Styling** | Tailwind CSS + shadcn/ui | 3.4 |
| **Animasi** | Framer Motion | 12.x |
| **State** | TanStack Query | 5.100 |
| **Peta** | Leaflet + React-Leaflet | 1.9 / 5.0 |
| **Backend** | Express | 5.2.1 |
| **Database** | Better-SQLite3 | 12.x |
| **Realtime** | Socket.io | 4.8 |
| **Autentikasi** | JWT + Bcrypt | — |
| **Keamanan** | Helmet + Rate Limiting | 8.x |
| **Testing** | Vitest + Playwright | 4.x / 1.x |

---

## 🏗️ Arsitektur Sistem

Oke Mekanik menggunakan arsitektur full-stack dengan pemisahan jelas antara frontend dan backend. Frontend dibangun dengan React 19 dan Vite 8, menyediakan pengalaman pengguna yang responsif dengan antarmuka glassmorphism yang modern. Styling menggunakan Tailwind CSS dan komponen shadcn/ui untuk konsistensi visual, sementara Framer Motion memberikan animasi yang halus dan natural.

Backend menggunakan Express 5.2.1 dengan Better-SQLite3 untuk penyimpanan data yang ringan namun andal. Komunikasi real-time antara klien dan server ditangani oleh Socket.io, memungkinkan pelacakan GPS langsung dan chat tanpa jeda. Autentikasi dilakukan melalui JWT dengan hashing Bcrypt, dilengkapi proteksi Helmet dan rate limiting untuk keamanan API.

AI Diagnostic Engine adalah komponen khas Oke Mekanik yang menggunakan pencocokan pola canggih untuk mendiagnosis masalah kendaraan berdasarkan gejala yang dilaporkan pengguna. Mesin ini menganalisis input pengguna, mencocokkannya dengan database masalah kendaraan yang komprehensif, dan memberikan rekomendasi diagnosa beserta estimasi biaya perbaikan.

Lihat [ARCHITECTURE.md](ARCHITECTURE.md) untuk dokumentasi arsitektur lengkap.

---

## 📬 Kontak

| Saluran | Info |
|:--------|:-----|
| 📧 Email | [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com) |
| 👤 Penulis | **Mulky Malikul Dhaher** |
| 🐙 GitHub | [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs) |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License — lihat file [LICENSE](LICENSE) untuk detailnya.

---

<div align="center">

> *"Dibangun untuk Keunggulan — Di Mana Teknologi Bertemu Jalan"*

**Oke Mekanik** © 2024 — Sekarang • **Mulky Malikul Dhaher**

</div>
