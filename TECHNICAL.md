# TECHNICAL DOCUMENTATION v28.1 ULTIMATE+

## 🏗️ Architecture
OKE MEKANIK menggunakan arsitektur full-stack modern yang memisahkan logic frontend (React) dan backend (Express) namun terintegrasi secara seamless melalui REST API dan WebSockets.

### 1. Database Schema (SQLite)
- **Users:** Manajemen profil pelanggan dan mekanik.
- **Mechanics:** Data profesional, rating, status online, dan koordinat GPS.
- **Services:** Katalog jasa layanan dengan estimasi durasi dan biaya dasar.
- **Spare Parts:** Inventori suku cadang dengan tracking stok dan harga.
- **Bookings:** Transaksi utama yang mencakup detail kendaraan, lokasi GPS, dan rincian biaya (Labor, Parts, Fees).
- **Messages:** Log komunikasi real-time antar pengguna.
- **Reviews:** Sistem rating dan feedback kepuasan pelanggan.
- **Activity Feed:** Timeline sosial untuk transparansi ekosistem.

### 2. AI Diagnostic Engine
Algoritma pencocokan kata kunci berbasis bobot (Weighted Keyword Matching) yang dioptimalkan untuk dialek otomotif Indonesia.
- **Confidence Score:** Menghitung tingkat kepercayaan diagnosa.
- **Urgency Mapping:** Mengkategorikan masalah (Low, Medium, High, Critical).

### 3. Real-Time Logic
Menggunakan **Socket.io** untuk:
- Update lokasi mekanik di peta secara live.
- Sinkronisasi status booking (Pending -> OTW -> Working -> Completed).
- Notifikasi chat instan.

### 4. Financial Algorithm
```
Total = Labor_Cost + Parts_Cost + Service_Fee + (Emergency_Surcharge IF is_emergency)
```

## 🛡️ Security
- **Authentication:** JWT (JSON Web Token) dengan masa berlaku 24 jam.
- **Data Integrity:** Validasi input menggunakan Zod schema di sisi server.
- **Rate Limiting:** Proteksi dari serangan brute force dan spamming.
- **Headers:** Implementasi Helmet untuk keamanan HTTP headers.

## 🧪 Testing & Quality Assurance
- **Unit Testing:** Vitest untuk logika bisnis inti.
- **E2E Testing:** Playwright untuk verifikasi journey pengguna secara visual.
- **Validation Script:** `tests/verify_ai_v581.js` untuk memastikan akurasi mesin diagnosa.

---
**DEVELOPER NOTE:**
Selalu gunakan `--legacy-peer-deps` saat instalasi untuk menjaga kompatibilitas registry v2026.
