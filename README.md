# Oke Mekanik - Futuristic Masterpiece Full-Stack Ecosystem

Selamat datang di masa depan perawatan kendaraan. Oke Mekanik bukan sekadar platform; ini adalah ekosistem terpadu yang menghubungkan pelanggan dengan mekanik profesional secara real-time dengan sentuhan UI/UX futuristik dan kecerdasan buatan.

## Visi Proyek (Futuristic Vision)
Proyek ini mengusung desain **Glassmorphism Intens** (High Blur, Ultra-Transparency) dan **Holographic Aesthetics**. Setiap interaksi dirancang untuk memberikan pengalaman "Cyber-Mechanic" yang belum pernah ada sebelumnya di Indonesia.

## Arsitektur & Teknologi (Real Implementation)

### 1. Backend (Express & SQLite)
- **Engine**: Node.js dengan Express 5.
- **Database**: SQLite (better-sqlite3) untuk performa tinggi dan dependensi minimal.
- **Keamanan**: JWT (JSON Web Token) dengan Bcrypt hashing.
- **Endpoint Terverifikasi**: Menjamin kepemilikan sumber daya (Resource Ownership) melalui validasi token.

### 2. AI Smart Diagnostic
- **Real Engine**: Implementasi `/api/ai/diagnose` yang menganalisa keluhan pelanggan secara tekstual dan memberikan saran layanan yang tepat (Ganti Oli, Cek Aki, Tune Up, dll).
- **UX Integration**: Animasi scanning holografik selama proses diagnosa.

### 3. Frontend (React 19 & Framer Motion)
- **Glassmorphism**: Penggunaan `.glass-card` dan `backdrop-blur-[40px]` secara konsisten.
- **Animations**: Transisi antar-langkah menggunakan `AnimatePresence` dan stagger effects.
- **Responsive**: Desain mobile-first dengan dashboard yang dioptimalkan untuk performa tinggi.

## Cara Menjalankan

1. **Instalasi**:
   ```bash
   npm install
   ```

2. **Pengembangan**:
   ```bash
   npm run dev
   ```
   (Menjalankan Vite frontend di port 8080 dan Express backend di port 3001 secara konkuren).

3. **Pengujian**:
   ```bash
   npm test          # Unit Testing (Vitest)
   node verify_backend.js  # Automated Backend API Verification
   ```

## Batasan Operasional (Strict Rules)
- **No Mocks**: Seluruh data ditarik dari SQLite melalui API Express.
- **No Simulations**: Fitur AI Diagnostic dan Booking Flow berjalan secara fungsional 100%.
- **Design Integrity**: Dilarang menurunkan intensitas blur atau menghapus animasi Framer Motion.

---
*Proyek ini dikembangkan secara otonom untuk mencapai kualitas produksi yang 100x lebih baik.*
