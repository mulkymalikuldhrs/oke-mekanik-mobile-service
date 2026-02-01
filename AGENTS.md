
# Agent Documentation - Production-Ready Implementation

Project "Oke Mekanik" telah ditingkatkan menjadi aplikasi fungsional dengan arsitektur yang siap digunakan untuk produksi. Berikut adalah detail implementasi:

## 1. Arsitektur & Data Layer
- **Centralized API Client**: Menggunakan `src/lib/api.ts` sebagai abstraksi data fetching, siap diintegrasikan dengan backend API nyata.
- **TypeScript Types**: Kontrak data didefinisikan secara ketat di `src/types/index.ts`.
- **Server State Management**: Menggunakan TanStack Query untuk efisiensi caching dan sinkronisasi data.

## 2. Sistem Autentikasi
- **AuthProvider**: Session management yang persisten dengan dukungan multi-role (Pelanggan & Mekanik).
- **Validasi Robust**: Menggunakan React Hook Form dan Zod untuk memastikan integritas data input.

## 3. Fitur Utama
- **Real-time Tracking**: Implementasi visualisasi progres mekanik menuju lokasi pelanggan.
- **Sistem Pesan**: Integrasi komunikasi dua arah antara mitra dan pelanggan.
- **Multi-step Workflow**: Alur pendaftaran dan pemesanan yang terstruktur untuk efisiensi UX.

## 4. Kualitas & Pengujian
- **Performance**: Implementasi skeleton loaders untuk transisi UI yang mulus.
- **Scalability**: Struktur folder yang modular memudahkan pengembangan fitur di masa depan.
- **Testing**: Infrastruktur pengujian menggunakan Vitest telah dikonfigurasi dan diverifikasi.

## Instruksi Maintenance
- Gunakan `npm test` untuk menjalankan unit testing.
- Semua pengembangan fitur baru harus mengikuti pola yang ada di `src/lib/api.ts` dan menggunakan interface dari `src/types`.
