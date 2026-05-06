<<<<<<< HEAD
<<<<<<< HEAD
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
=======
# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time.

## Architecture
- **Frontend**: React + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui.
- **State Management**: React Context (Auth) + React Query (Server State).
- **Data Persistence**: Local persistence layer in `src/lib/api.ts` (currently uses `localStorage` to simulate a real backend).
- **Testing**: Vitest + React Testing Library.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`. Do not define local interfaces for shared data structures.
- **API**: All data fetching and persistence must go through `src/lib/api.ts`.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Components**: Follow the atomic design principles. Keep components small and focused.
- **Testing**: Every new feature or fix should be accompanied by tests.

## Workflow
1. Use `localStorage` based persistence for now to ensure "real" data behavior.
2. Maintain multi-language support (ID/EN) for all new UI elements.
3. Ensure mobile-first responsiveness.
>>>>>>> origin/jules-9588893365322302084-daabd2d3
=======
# AGENTS.md - Autonomous Developer Protocol (Masterpiece v28.1)

This document provides strict instructions for AI agents working on the Oke Mekanik ecosystem.

## 1. Project Vision
Oke Mekanik is a high-fidelity, production-ready full-stack mechanic platform. The goal is to deliver an experience that is 100x better than standard simulations.

## 2. Core Directives
- **Zero-Mock Policy**: Strictly no mock data in production. All data must flow from the Express/SQLite backend.
- **Autonomous Quality**: You are responsible for end-to-end quality. Do not wait for user validation if you can verify it yourself via tests.
- **Fidelity First**: Maintain the Glassmorphism UI standards (`.glass-card` with `backdrop-blur-[160px]`).

## 3. Technical Standards
- **Backend**: Express 5.2.1 + Better-SQLite3.
- **Frontend**: React 19 + Vite + TypeScript + TanStack Query.
- **AI Engine**: v5.8.0 ULTIMATE+ (Technical Indonesian Mapping).
- **Security**: Hardened headers, rate limiting, and JWT authentication.

## 4. Verification Workflow
Before submitting any changes, you MUST:
1. **Verify AI**: `node tests/verify_ai_v58.js` (Must pass all 11+ test cases).
2. **Build Check**: `npm run build` (Must have zero TS errors).
3. **Unit Tests**: `npm test` (Ensure no regressions in core logic).
4. **Visual Check**: Use Playwright if available to confirm UI fidelity.

## 5. Development Commands
- `npm run dev`: Starts both Vite (8080) and Express (3001) concurrently.
- `npm run backend`: Starts only the production backend.
- `npm test`: Runs Vitest suite.

## 6. Coding Conventions
- Use `@/` path aliases for all internal imports.
- All API interactions must reside in `src/lib/api.ts`.
- Multi-language support (ID/EN) is mandatory for all new UI strings.
- Strictly follow the types defined in `src/types/index.ts`.
>>>>>>> jules-1751083910730374172-8e0c37a0
