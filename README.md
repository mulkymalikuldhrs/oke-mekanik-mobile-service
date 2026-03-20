# Oke Mekanik - Futuristic Mobile Service Ecosystem

Oke Mekanik adalah platform layanan mekanik panggil (on-demand) yang menghubungkan pelanggan dengan mekanik profesional secara real-time. Proyek ini dibangun dengan visi masa depan, menggunakan antarmuka Glassmorphism yang intens dan backend yang otonom.

## Fitur Utama 'Masterpiece'

- **AI Smart Diagnostic**: Analisa masalah kendaraan secara cerdas melalui backend terintegrasi untuk memberikan rekomendasi layanan yang tepat.
- **Holographic Glassmorphism UI**: Antarmuka futuristik dengan efek blur tingkat tinggi (40px) dan animasi shimmer.
- **Real-time Tracking**: Pelacakan lokasi mekanik dan status pengerjaan secara langsung.
- **Security Hardening**: Sistem autentikasi JWT dengan verifikasi resource ownership di tingkat server.
- **Multi-role Dashboard**: Dashboard khusus untuk Pelanggan dan Mekanik dengan analisis data real-time.

## Tech Stack (Production Ready)

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, SQLite (Better-SQLite3).
- **Security**: JWT (JSON Web Token), Bcryptjs.
- **Testing**: Vitest (Unit), Playwright (E2E).

## Cara Menjalankan

### Pengembangan
```bash
npm install
npm run dev
```
Perintah ini akan menjalankan frontend (port 8080) dan backend (port 3001) secara bersamaan menggunakan `concurrently`.

### Produksi
1. Build frontend: `npm run build`
2. Jalankan server: `node server/index.js`

## Struktur Proyek
- `src/`: Source code frontend (Pages, Components, Contexts, Hooks).
- `server/`: Backend API dan database logic.
- `src/__tests__/`: Suite pengujian unit.
- `tests/`: Suite pengujian E2E Playwright.

## Visi Proyek
Membangun ekosistem perawatan kendaraan yang paling canggih, transparan, dan dapat diandalkan melalui teknologi mutakhir dan desain yang memukau.
