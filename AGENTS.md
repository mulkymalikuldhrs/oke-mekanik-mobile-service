<<<<<<< HEAD
<<<<<<< HEAD

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
=======
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
# AGENTS.md

This document provides instructions for AI agents working on the Oke Mekanik codebase.

## Project Overview

Oke Mekanik is a web platform that connects customers with mechanics. It features separate dashboards for customers and mechanics, a booking system, service tracking, a chat feature, and a payment system.

## Technologies

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, shadcn-ui
- **State Management:** `@tanstack/react-query` is used for managing server state. When adding new data-fetching logic, use `useQuery` for queries and `useMutation` for mutations.
- **Routing:** `react-router-dom` is used for all routing. All routes are defined in `src/App.tsx`.
- **Mock API:** `json-server` is used to provide a mock API for development. The data is stored in `db.json`.
- **Testing:** The project uses `vitest` for running tests and `@testing-library/react` for rendering and interacting with components in a test environment.

## Getting Started

### Running the Application

To run the application, use the following command:

```bash
npm run dev
```

This will start the Vite development server for the frontend and the `json-server` for the mock API.

### Running Tests

To run the test suite, use the following command:

```bash
npm test
```

All new features and bug fixes should be accompanied by tests.

## Coding Conventions

- **Component Structure:** Components are located in `src/components`. Pages are located in `src/pages`.
- **Styling:** Use Tailwind CSS for styling. For UI components, use the `shadcn-ui` library.
- **API Calls:** All API calls should be made in `src/lib/api.ts`. Do not make direct `fetch` calls from components.
- **State Management:** Use `@tanstack/react-query` for server state. For client-side state, use React hooks (`useState`, `useReducer`).
- **Path Aliases:** The project uses a path alias `@` which resolves to the `./src` directory. Use this alias when importing modules from the `src` directory (e.g., `import { Button } from '@/components/ui/button';`).

## Pre-Commit Steps

Before submitting any changes, you must complete the pre-commit steps. This involves running the tests and ensuring they all pass.
<<<<<<< HEAD
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
