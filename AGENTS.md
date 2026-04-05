# AGENTS.md - Masterpiece v27 Full-Stack Directives

This document defines the absolute operational constraints for all AI agents working on the **Oke Mekanik Masterpiece v27** codebase.

## 🏛 Project Architecture (Masterpiece v27)

Oke Mekanik is a production-ready, mock-free full-stack ecosystem.

- **Backend**: Node.js/Express (`server/index.js`) with SQLite persistence (`server/db.js`).
- **Frontend**: React 19 + Vite (`src/`).
- **Communication**: Real-time Socket.io integration.
- **Diagnostics**: AI Smart Diagnostic Engine v4.0 (Advanced Weighted).

## 🚫 Absolute Constraints

1. **NO MOCKING**: All logic must be real and implemented. Mocking core application logic is a fatal architectural violation.
2. **UI INTEGRITY**: Maintain Glassmorphism standards. All core pages must use `backdrop-blur-[40px]` (or equivalent) and Framer Motion animations.
3. **SECURITY HARDENING**: Never compromise security. All new API endpoints must use JWT authentication (`fetchWithAuth`) and Zod validation.
4. **LOCALIZATION**: Every user-facing string MUST use the `useLanguage` hook and be registered in `src/hooks/useLanguage.tsx`.
5. **TEST-DRIVEN**: New features must include unit tests in `src/__tests__/` and be verified with the Playwright E2E suite.

## ⚙️ Development Environment

- **Launch Command**: `npm run dev` (runs both frontend and backend concurrently).
- **Backend Port**: 3001
- **Frontend Port**: 8080 (dev environment preference)
- **API Base URL**: Configured in `src/lib/api.ts` to `http://localhost:3001/api`.

## 🧪 Verification Protocol

Before submission, you MUST:
1. Run `npm test` and ensure all 22+ centralized unit tests pass.
2. Execute a full-stack verification script (e.g., `tests/visual_verify.spec.ts`) to confirm the end-to-end customer journey.
3. Remove any binary artifacts, screenshots, or database files (`server/*.db`) from the git staging area.

## 🏁 Goal
Maintain the "Masterpiece" status: A high-quality, production-ready, futuristic mobile mechanic platform that demonstrates technical superiority and visual excellence.
