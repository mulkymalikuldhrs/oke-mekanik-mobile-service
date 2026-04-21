# Oke Mekanik - Masterpiece v28 Ultimate AI Agent Guidelines

Welcome to the **Oke Mekanik v28 Ultimate Full-Stack Ecosystem**. This document provides absolute instructions and conventions for AI agents maintaining this codebase.

## Core Directives
1. **NO MOCKING**: All logic must be real and implemented. Use the Node.js/Express backend and SQLite database.
2. **NO UI DEGRADATION**: Maintain the 'Masterpiece v28' standard with at least `160px` backdrop-blur for Glassmorphism effects.
3. **NO SECURITY COMPROMISE**: Always use JWT authentication, Zod validation, and Helmet for security.
4. **ZERO-MOCK POLICY**: Fallback to mock data is strictly prohibited. If an API fails, handle the error gracefully with UI feedback.
5. **AUTONOMOUS UPGRADE**: All future development must prioritize autonomous technical reasoning and production-grade quality.

## Architecture
- **Backend**: Node.js + Express 5.2.1
- **Database**: SQLite via `better-sqlite3` 12.8.0 (okemekanik.db)
- **AI Engine**: AI Smart Diagnostic v5.2 ULTIMATE (Enhanced weighted technical mapping)
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (160px Glassmorphism Blur)
- **State**: TanStack Query (Server) + AuthContext (Client)

## Coding Conventions
- **API Communication**: Use `src/lib/api.ts`. Standard backend port is `3001`.
- **Localization**: Use `useLanguage` hook for *all* user-facing text (ID/EN).
- **Types**: Synchronize `src/types/index.ts` with `server/db.js` schema.
- **Verification**: Run `node tests/integration_verify.js` for backend logic and Playwright for UI flows.

## Environment Setup
- Frontend: `npm run dev` (Port 8080)
- Backend: `npm run backend` (Port 3001)
- Unified: `npm run dev` (runs both via concurrently)

## Testing Requirements
- Unit tests: `npm test`
- Integration: `node tests/integration_verify.js`
- visual: `npx playwright test tests/visual_verify.spec.ts`
