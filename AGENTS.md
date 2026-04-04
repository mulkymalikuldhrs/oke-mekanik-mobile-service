# AGENTS.md - Ultimate Masterpiece Operational Constraints

This document defines the strict operational boundaries for AI agents working on the Oke Mekanik codebase.

## 🛑 Absolute Constraints
- **NO MOCKING**: All logic must be real and implemented. No `setTimeout` simulations, hardcoded mock objects in production code, or `localStorage` as a primary database.
- **NO UI DEGRADATION**: Do not reduce `backdrop-blur` below 40px. Do not remove Framer Motion animations or high-intensity gradients.
- **NO SECURITY COMPROMISE**: All API endpoints must be protected with JWT and Zod validation. Password hashing must remain asynchronous and salt-secure.

## 🧱 Architectural Standards
- **Unified Ecosystem**: The backend (Node.js/Express) and frontend (React) are a single unit. Use `concurrently` to run both during development.
- **Data Persistence**: `server/db.js` is the source of truth for all schemas. Do not create new tables without a formal migration in `db.js`.
- **Localization**: Use the `useLanguage` hook for all user-facing strings. Hardcoded strings in Indonesian or English are strictly forbidden.

## 🔧 Workflow Guidelines
1. **Explore First**: Always understand the full-stack dependency graph before making changes.
2. **Verify Always**: Run `tests/integration_verify.js` after any backend change. Run Playwright E2E tests after any UI change.
3. **Clean Up**: Remove any binary artifacts (screenshots, SQLite database files) from git staging before submission.

## 🧪 Testing Protocol
- **Unit Tests**: Located in `src/__tests__/`. Use Vitest for all frontend component and hook testing.
- **E2E Tests**: Located in `tests/`. Use Playwright for full customer journey verification.
- **Backend Tests**: Use `tests/integration_verify.js` for quick API health checks.

## 🛠️ Tooling
- **Vite**: 5.4.x
- **React**: 19.x
- **Express**: 5.2.x
- **SQLite**: 12.8.x
- **Socket.io**: 4.x
- **Zod**: 4.x

Any deviation from these standards will result in a #Incorrect# architectural rating.
