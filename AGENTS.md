# 🤖 Oke Mekanik - AI Agent Guidelines (v5.8.0 ULTIMATE+)

This document provides strict instructions and conventions for AI agents working on the **Masterpiece v28.1** codebase.

## 🚀 Core Principles
1. **Zero-Mock Policy**: Never implement static JSON mocks or simulated API delays. Use the Express backend (`server/`) and SQLite database as the single source of truth.
2. **Production-Ready by Default**: Every line of code must be of the highest quality, following modern best practices and strict TypeScript typing.
3. **Autonomous Excellence**: Think ahead. Solve problems before they are reported. Ensure all edge cases are covered.

## 🏗️ Architectural Constraints
- **State Management**: Use `AuthContext` for user sessions and `TanStack Query` for all server data.
- **API Calls**: All fetching must go through `src/lib/api.ts` utilizing `fetchApi` or `fetchWithAuth`.
- **UI Fidelity**: Maintain the **Masterpiece v28.1** Glassmorphism standard. Use `backdrop-blur-[160px]` and Framer Motion 12 for all transitions.
- **Localization**: All user-facing text must be integrated into the `translations` object in `src/hooks/useLanguage.tsx`.

## 🧠 AI Diagnostic Engine v5.8.0
When modifying the AI engine in `server/index.js`:
- Respect the **technical Indonesian keyword mapping**.
- Maintain the **weighted confidence algorithm** (exponential bonuses for multi-symptom matches).
- Ensure the `version` property always reflects the current standard (`v5.8.0-ultimate`).

## 🧪 Verification Protocol
Before submitting any work, you MUST run and pass:
1. `node tests/verify_ai_v57.js` - Validates the AI Engine logic.
2. `npm run build` - Ensures zero TypeScript or build errors.
3. `npm run test` - Executes the Vitest unit test suite.
4. `npx playwright test` - Verifies visual E2E fidelity.

## 📂 File Responsibility
- **Source of Truth**: If a file exists in `server/`, that is where the logic belongs. Do not duplicate backend logic in the frontend.
- **Typing**: All data structures must be defined in `src/types/index.ts`.

---
*Oke Mekanik: Masterpiece v28.1 Ultimate — Built for the future of automotive service.*
