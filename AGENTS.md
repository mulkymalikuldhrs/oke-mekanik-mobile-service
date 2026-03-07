# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik production-ready ecosystem. This document provides critical architectural truth and conventions for agents working on this codebase.

## Architectural Truth

- **Single Source of Truth**: The Express backend (`server/index.js`) and SQLite database (`server/db.js`) are the definitive data layers. Strictly **no mocks, no simulations, and no `db.json` files**.
- **Frontend-Backend Contract**: All data fetching must go through `src/lib/api.ts`. Direct `fetch` calls or local state simulations for database records are forbidden.
- **UI Standard**: The project utilizes a holographic Glassmorphism aesthetic. All new components must adhere to the `backdrop-blur`, `border-white/10`, and entrance animation patterns.

## Development Standards

- **Authentication**: Use `AuthContext` to manage user sessions. Protected routes are enforced in `App.tsx`.
- **Localization**: All user-facing strings must use the `useLanguage` hook for ID/EN support.
- **Testing**:
  - Unit tests reside in `src/__tests__/`.
  - E2E tests reside in `tests/`.
  - Every feature must be verified with `npm test` and ideally a Playwright script.
- **Map Implementation**: Use Leaflet for tracking. Ensure marker icons are correctly linked to unpkg.com to avoid rendering issues in React.

## Core Commands

- `npm run dev`: Starts the unified full-stack environment (Vite + Express).
- `npm test`: Executes the Vitest suite.
- `npx playwright test`: Runs end-to-end verification.

## Workflow Directive

Act autonomously to maintain the project's 'masterpiece' status. If you encounter low-quality code, mock patterns, or architectural inconsistencies, you are authorized (and expected) to refactor them into production-ready implementations immediately.
