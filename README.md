# OKE MEKANIK - Masterpiece Full-Stack Ecosystem

Oke Mekanik adalah platform mekanik panggilan (mobile mechanic) profesional yang menghubungkan pelanggan dengan mekanik ahli secara real-time. Dibangun dengan fokus pada kecepatan, keamanan, dan pengalaman pengguna futuristik.

## 🚀 Fitur Utama

- **Real-time Tracking**: Pantau lokasi mekanik secara langsung menuju lokasi Anda menggunakan integrasi GPS & Socket.io.
- **AI Diagnostic Engine**: Diagnosa masalah kendaraan secara instan dengan bantuan AI (Weighted Keyword Analysis).
- **Holographic Glassmorphism UI**: Antarmuka futuristik dengan intensitas blur tinggi dan animasi halus (Framer Motion).
- **Instant Booking & Emergency**: Panggil mekanik untuk keadaan darurat atau jadwalkan perawatan rutin.
- **Verified Mechanics**: Seluruh mitra mekanik telah melalui proses verifikasi dan memiliki sistem rating transparan.
- **Secure Full-Stack System**: Backend Node.js/Express mandiri dengan enkripsi JWT, Rate Limiting, dan SQLite persistence.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Shadcn UI (Glassmorphism Theme)
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query) v5
- **Communication**: Socket.io-client

### Backend
- **Server**: Node.js + Express 4
- **Database**: Better-SQLite3
- **Authentication**: JWT (JSON Web Token) + BcryptJS
- **Real-time**: Socket.io
- **Security**: Express Rate Limit + Zod Validation

## 📦 Memulai Pengembangan

### Prasyarat
- Node.js (v20+)
- npm

### Instalasi
1. Clone repositori
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan (Frontend & Backend):
   ```bash
   npm run dev
   ```

### Pengujian
- **Unit & Integration Test**: `npm test`
- **E2E Verification**: `node verify_backend.js`

## 🏗 Struktur Proyek

- `server/`: Backend logic, database schema, dan socket handlers.
- `src/components/`: Reusable UI components dengan standar Shadcn.
- `src/contexts/`: Session management & Auth state.
- `src/lib/api.ts`: Centralized production-ready API client.
- `src/pages/`: Halaman aplikasi dengan desain futuristik.
- `tests/`: End-to-end testing suite.

## 🛡 Kebijakan Produksi
Proyek ini mengadopsi standar **Zero-Mock Policy**. Seluruh data dan logika bisnis dijalankan secara nyata pada backend, tanpa simulasi client-side atau mock API di lingkungan produksi.

---
© 2024 Oke Mekanik. Elevating Mobile Mechanic Experience.
