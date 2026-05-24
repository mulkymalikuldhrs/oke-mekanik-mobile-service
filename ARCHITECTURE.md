# Arsitektur Oke Mekanik

> Dokumentasi arsitektur sistem untuk Oke Mekanik Mobile Service v5.8.1

---

## Ikhtisar Arsitektur

Oke Mekanik menggunakan arsitektur monolitik full-stack dengan pemisahan logis antara frontend dan backend. Kedua komponen berjalan pada server yang sama dan berkomunikasi melalui REST API dan WebSocket. Pendekatan ini dipilih untuk memudahkan deployment dan pengembangan, sambil tetap mempertahankan kemampuan untuk menskalakan secara horizontal di masa depan.

```
┌─────────────────────────────────────────────────────────────┐
│                     OKE MEKANIK v5.8.1                      │
│                                                             │
│  ┌─────────────────────┐     ┌─────────────────────────┐   │
│  │   FRONTEND           │     │   BACKEND                │   │
│  │                     │     │                         │   │
│  │  React 19 + Vite 8  │◄───►│  Express 5.2.1          │   │
│  │  Tailwind + shadcn   │     │  Better-SQLite3         │   │
│  │  TanStack Query      │     │  Socket.io Server       │   │
│  │  Framer Motion       │     │  JWT Auth + Helmet      │   │
│  │  Leaflet Maps        │     │  Rate Limiting          │   │
│  │  PWA Service Worker  │     │                         │   │
│  └─────────────────────┘     └─────────────────────────┘   │
│           │                              │                  │
│           └──────── Socket.io ──────────┘                  │
│              Real-time Location & Chat                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AI DIAGNOSTIC ENGINE v5.8.1                        │   │
│  │  Pattern Matching → Symptom Analysis → Recommendations│   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Lapisan Frontend

### Teknologi

Frontend dibangun dengan React 19 sebagai library UI utama, dibundel menggunakan Vite 8 untuk kecepatan build yang optimal. TypeScript 5.5 digunakan untuk keamanan tipe end-to-end, mengurangi bug runtime dan meningkatkan produktivitas pengembang.

### Komponen Utama

- **React 19**: Library UI dengan fitur terbaru termasuk concurrent rendering dan server components compatibility
- **Vite 8**: Build tool yang cepat dengan Hot Module Replacement (HMR) untuk pengalaman pengembangan yang mulus
- **Tailwind CSS 3.4 + shadcn/ui**: Sistem styling utility-first dengan komponen UI yang aksesibel dan dapat dikustomisasi
- **Framer Motion 12.x**: Library animasi untuk transisi halaman, efek hover, dan micro-interactions
- **TanStack Query 5.100**: Manajemen state server dengan caching, background refetching, dan optimistic updates
- **Leaflet + React-Leaflet**: Peta interaktif untuk pelacakan lokasi mekanik secara real-time
- **PWA Service Worker**: Dukungan offline untuk pengalaman native-like pada perangkat mobile

### Halaman dan Rute

| Halaman | Deskripsi |
|:--------|:----------|
| Beranda | Landing page dengan fitur utama dan CTA |
| Booking | Form pemesanan layanan servis |
| Pelacakan | Peta real-time dengan lokasi mekanik |
| Chat | Pesan langsung antara pelanggan dan mekanik |
| Pembayaran | Proses pembayaran digital |
| Dashboard | Panel kontrol untuk mekanik dan admin |
| Login/Register | Autentikasi pengguna |

---

## Lapisan Backend

### Teknologi

Backend dibangun dengan Express 5.2.1 sebagai web framework, menggunakan middleware pipeline untuk penanganan request yang terstruktur. Better-SQLite3 dipilih sebagai database untuk kesederhanaan deployment dan performa baca yang cepat.

### Arsitektur API

API mengikuti pola RESTful dengan rute yang dikelompokkan berdasarkan domain:

```
/api/auth        → Autentikasi dan manajemen sesi
/api/mechanics   → Pencarian dan profil mekanik
/api/bookings    → CRUD pemesanan layanan
/api/ai          → AI Diagnostic Engine endpoint
/api/payments    → Proses pembayaran
/api/messages    → Chat dan pesan
/api/services    → Katalog layanan servis
/api/reviews     → Rating dan review mekanik
```

### Middleware Pipeline

1. **Helmet**: Keamanan HTTP headers
2. **Rate Limiting**: Pembatasan request per IP
3. **CORS**: Cross-origin resource sharing
4. **JSON Parser**: Parsing body request
5. **JWT Verification**: Validasi token autentikasi
6. **Route Handler**: Penanganan endpoint spesifik

### Autentikasi

Sistem autentikasi menggunakan JWT (JSON Web Tokens) dengan strategi berikut:
- Token akses dengan masa berlaku singkat (15 menit)
- Token refresh dengan masa berlaku lebih lama (7 hari)
- Password di-hash menggunakan Bcrypt dengan salt rounds 12
- Role-based access control (customer, mechanic, admin)

---

## Database

### Skema

Better-SQLite3 digunakan dengan skema relasional yang mencakup tabel utama:

- **users**: Data pengguna dengan role (customer, mechanic, admin)
- **bookings**: Pemesanan layanan dengan status tracking
- **mechanics**: Profil mekanik dengan spesialisasi dan rating
- **messages**: Riwayat chat antara pelanggan dan mekanik
- **payments**: Catatan pembayaran digital
- **reviews**: Rating dan review dari pelanggan
- **services**: Katalog layanan servis yang tersedia

### Migrasi

Skema database diinisialisasi melalui `server/db.js` yang membuat tabel secara otomatis saat pertama kali dijalankan. Pendekatan ini memudahkan setup lokal tanpa perlu migrasi manual.

---

## Komunikasi Real-time

### Socket.io

Socket.io digunakan untuk dua fitur real-time utama:

1. **Pelacakan GPS**: Mekanik mengirim lokasi mereka secara periodik, dan server meneruskannya ke pelanggan yang memiliki booking aktif. Data lokasi mencakup koordinat (latitude, longitude), timestamp, dan kecepatan.

2. **Chat**: Pesan dikirim secara real-time antara pelanggan dan mekanik. Socket.io menjamin pengiriman pesan dengan acknowledgment system, dan pesan disimpan ke database untuk riwayat.

### Event Socket.io

| Event | Arah | Deskripsi |
|:------|:-----|:----------|
| `location:update` | Mekanik → Server → Pelanggan | Pembaruan lokasi GPS |
| `message:send` | Klien → Server | Kirim pesan chat |
| `message:receive` | Server → Klien | Terima pesan chat |
| `booking:update` | Server → Klien | Pembaruan status booking |
| `mechanic:arrived` | Mekanik → Server → Pelanggan | Mekanik tiba di lokasi |

---

## AI Diagnostic Engine

### Arsitektur

AI Diagnostic Engine adalah modul khas Oke Mekanik yang menggunakan pendekatan pattern-matching untuk mendiagnosis masalah kendaraan. Mesin ini beroperasi dalam tiga tahap:

1. **Pattern Matching**: Input pengguna (gejala, suara, perilaku kendaraan) dicocokkan dengan database pola masalah yang telah diprogram sebelumnya
2. **Symptom Analysis**: Gejala yang teridentifikasi dianalisis untuk menentukan kemungkinan penyebab dan tingkat keparahan
3. **Recommendations**: Berdasarkan analisis, mesin memberikan rekomendasi diagnosa, estimasi biaya, dan saran tindakan

### Integrasi

AI Diagnostic Engine terintegrasi sebagai modul backend yang dapat diakses melalui endpoint `/api/ai`. Hasil diagnosa ditampilkan pada halaman booking dan dapat digunakan oleh mekanik untuk persiapan sebelum tiba di lokasi pelanggan.

---

## Keamanan

### Lapisan Proteksi

- **Helmet**: Menambahkan HTTP headers keamanan (X-Content-Type-Options, X-Frame-Options, dll.)
- **Rate Limiting**: Membatasi jumlah request per IP untuk mencegah abuse
- **JWT**: Token-based authentication dengan rotation
- **Bcrypt**: Password hashing dengan salt yang kuat
- **CORS**: Konfigurasi origin yang ketat
- **Input Validation**: Validasi semua input menggunakan schema validation

### Praktik Keamanan

- Semua password di-hash sebelum disimpan
- Token JWT memiliki masa berlaku yang terbatas
- Rate limiting diterapkan pada semua endpoint API
- Input divalidasi sebelum diproses
- Koneksi database tidak terekspos ke internet

---

## Deployment

### Pengembangan Lokal

```bash
npm run dev  # Menjalankan frontend dan backend bersamaan
```

### Produksi

```bash
npm run build  # Build frontend untuk produksi
npm start      # Menjalankan server produksi
```

### Pertimbangan Skalabilitas

- Database SQLite cocok untuk deployment single-server; untuk skalabilitas horizontal, migrasi ke PostgreSQL direkomendasikan
- Socket.io dapat dikonfigurasi dengan Redis adapter untuk mendukung multiple server instances
- Frontend dapat di-deploy terpisah sebagai CDN static files
- Backend dapat di-deploy sebagai container Docker untuk orkestrasi dengan Kubernetes

---

## Kontak

Untuk pertanyaan arsitektur atau kontribusi teknis, hubungi:

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
