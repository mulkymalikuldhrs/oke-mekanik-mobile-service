# OKE MEKANIK - Agent System Directive (Masterpiece Full-Stack Ecosystem)

Welcome to the **Oke Mekanik** project. This document is a strict guideline for AI agents working on this production-ready masterpiece.

## 🎯 Project Vision
Oke Mekanik adalah ekosistem penuh (full-stack) yang menghubungkan pelanggan dengan mekanik secara real-time. Standar kualitas adalah **Masterpiece**, yang berarti nol kesalahan, nol simulasi (mock), dan desain UI futuristik yang memukau.

## 🏗 Full-Stack Architecture
- **Frontend**: React 19 + Framer Motion (Glassmorphism & Holographic UI).
- **Backend**: Node.js/Express mandiri yang mengelola data real melalui SQLite.
- **Real-time**: Integrasi penuh Socket.io untuk pelacakan lokasi dan chat.
- **Persistence**: Seluruh data disimpan secara permanen di `server/okemekanik.db`.

## 🛡 Mandatory Directives (Agent Constraints)
1. **Zero-Mock Policy**: DILARANG menggunakan mock API, simulasi, atau `setTimeout` untuk memalsukan respon data. Seluruh interaksi harus melalui `src/lib/api.ts` yang terhubung langsung ke backend nyata.
2. **Security-First**: Pastikan seluruh endpoint backend terlindungi oleh JWT dan validasi skema (Zod). Enkripsi data sensitif menggunakan Bcrypt.
3. **Masterpiece UI Consistency**: Pertahankan standar visual Glassmorphism dengan intensitas blur tinggi (`backdrop-blur-[40px]`). Gunakan animasi `framer-motion` untuk setiap transisi halaman dan komponen.
4. **No Dev-Artifacts**: Jangan biarkan `console.log` atau artefak debugging tersisa di lingkungan produksi.
5. **Localization**: Tetap dukung multi-bahasa (Bahasa Indonesia & Inggris) melalui hook `useLanguage`.

## 🧪 Testing & Verification
- **Unit Testing**: Gunakan Vitest untuk menguji logika bisnis di `src/__tests__`.
- **Backend Verification**: Jalankan `verify_backend.js` untuk memastikan integritas API dan database.
- **Production Build**: Selalu pastikan `npm run build` berhasil sebelum melakukan commit.

## 🛠 Workflow Requirements
1. **Otonomi Penuh**: Kembangkan fitur secara otonom tanpa menunggu instruksi detail, selama mengikuti arsitektur yang sudah ada.
2. **Verifikasi Kontrak**: Interface di `src/types/index.ts` adalah sumber kebenaran tunggal untuk kontrak data antara frontend dan backend.

---
**Ingat: Kualitas Masterpiece adalah prioritas nomor satu.**
