
# Oke Mekanik - Solusi Bengkel Panggilan Terpercaya

Oke Mekanik adalah platform web modern yang menghubungkan pelanggan dengan mekanik profesional secara langsung. Dengan fokus pada kemudahan akses, transparansi harga, dan keamanan, Oke Mekanik menghadirkan layanan bengkel langsung ke lokasi Anda.

## Fitur Utama

- **Sistem Autentikasi**: Login dan pendaftaran khusus untuk Pelanggan dan Mekanik.
- **Dashboard Pelanggan**: Kelola pesanan aktif, riwayat layanan, dan cari mekanik terdekat.
- **Dashboard Mekanik**: Terima pesanan, kelola status pekerjaan, dan pantau pendapatan.
- **Pemesanan Real-time**: Formulir pemesanan lengkap dengan integrasi API.
- **Pelacakan Lokasi**: Visualisasi real-time mekanik menuju lokasi pelanggan.
- **Sistem Chat**: Komunikasi langsung antara pelanggan dan mekanik.
- **Pembayaran Terintegrasi**: Berbagai pilihan metode pembayaran (E-Wallet, Transfer Bank, Kartu).

## Teknologi yang Digunakan

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form, Zod
- **Testing**: Vitest, React Testing Library
- **Icons**: Lucide React

## Cara Menjalankan Project

1. **Install Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```

3. **Jalankan Test**:
   ```bash
   npm test
   ```

## Arsitektur Project

- `src/contexts`: Context providers (Auth, Language).
- `src/lib`: API client dan utilitas.
- `src/pages`: Halaman utama aplikasi.
- `src/components`: UI components (shadcn/ui) dan custom components.
- `src/types`: Definisi TypeScript interfaces.
- `db.json`: Mock data untuk pengembangan.

---
Dikembangkan dengan ❤️ untuk kemudahan perawatan kendaraan Anda.
