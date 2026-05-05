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
- **AI Engine**: v5.8.1 ULTIMATE+ (Technical Indonesian Mapping).
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
