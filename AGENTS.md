# AGENTS.md - Masterpiece v28 Ultimate v5.5.0

This document provides instructions for AI agents working on the Oke Mekanik codebase.

## Project Overview
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time. It features a full-stack architecture with a Node.js/Express backend and an AI Diagnostic Engine v5.5.0 ULTIMATE+.

## Standard & Vision
- **Version**: Masterpiece v28 Ultimate v5.5.0
- **Philosophy**: Autonomous, production-ready, high-fidelity, and zero tolerance for simulations/mocks.
- **Goal**: "Mekanik dan Bengkel masa depan" (Mechanic and Workshop of the future).

## Technologies
- **Frontend**: React 19 + Vite + TypeScript.
- **Backend**: Node.js + Express 5.2.1 + better-sqlite3.
- **Real-time**: Socket.io 4.8.3.
- **Styling**: Tailwind CSS (Glassmorphism with `backdrop-blur-[160px]`) + Framer Motion 12.
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Testing**: Vitest + Playwright (Visual & E2E).

## Zero-Mock Policy
- All data must originate from the SQLite-based Express backend.
- Root-level `db.json` files are prohibited and must be deleted if found.
- All API calls must go through `src/lib/api.ts`.

## AI Diagnostic Engine v5.5.0 ULTIMATE+
- Located in `server/index.js`.
- Features advanced technical Indonesian automotive mapping.
- Keywords include: 'brebet', 'pincang', 'ngelitik', 'limp mode', 'asap putih', 'bunyi kaki-kaki', 'ngeden', 'gluduk', etc.

## Coding Conventions
- **Types**: Use types from `src/types/index.ts`.
- **UI**: Apply `backdrop-blur-[160px]` to all primary card containers for consistent Glassmorphism.
- **Localization**: Maintain ID/EN support via `useLanguage` hook.

## Verification
- Run `node tests/verify_ai_v55.js` for AI engine verification.
- Run `node tests/integration_verify.js` for backend integration checks.
- Run `npx playwright test tests/visual_verify.spec.ts` for visual UI verification.
