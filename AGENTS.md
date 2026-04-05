# Oke Mekanik - AI Agent Guidelines (Masterpiece v27 Edition)

Welcome to the **Oke Mekanik Masterpiece v27** project. This document provides instructions and conventions for AI agents working on this high-performance, full-stack, production-ready codebase.

## Project Vision
Oke Mekanik is a **Masterpiece Mobile Mechanic Platform** connecting customers with professional mechanics in real-time. It features a futuristic, high-intensity UI and a zero-mock, hardened backend ecosystem.

## Core Directives
1. **Full Autonomy**: Operate with full autonomy, prioritizing architectural integrity and production readiness.
2. **Zero-Mock Policy**: No mock data or simulations in the core application layer. All data must flow through the Node.js/Express/SQLite backend.
3. **Masterpiece UI**: Maintain and elevate the high-intensity Glassmorphism theme using `backdrop-blur-[40px]`, multi-layered gradients, and Framer Motion animations. Do **not** degrade or remove these features.
4. **Hardened Security**: All API endpoints must be protected with JWT authentication, and inputs must be validated using Zod.

## Architecture
- **Frontend**: React 19 + Vite 5 + TypeScript 5.
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion.
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Backend**: Express 5 + Socket.io + JWT + Helmet + Express Rate Limit.
- **Database**: SQLite (`better-sqlite3`) for high-performance persistence.
- **Testing**: Vitest + React Testing Library + Playwright.

## Coding Conventions
- **Types**: Always use synchronized types from `@/types/index.ts`.
- **API**: All data fetching must use the centralized `src/lib/api.ts` client. No direct `fetch` calls from components.
- **i18n**: Use the `useLanguage` hook for all user-facing text (Indonesian/English).
- **Security**: derive `userId` strictly from verified JWT payloads in the backend.

## Workflow
1. **Real Data Integrity**: Ensure all features are fully implemented and verified against the real backend.
2. **Comprehensive Testing**: Run all unit tests (`npm test`) and perform production builds before submitting.
3. **Documentation**: Keep `README.md` and `AGENTS.md` updated with the latest architectural changes.

## Maintenance
- Use `npm test` for the unit test suite.
- All new features or fixes must be accompanied by relevant tests.
- Ensure the production build (`npm run build`) always passes.

**Oke Mekanik - Ultimate Full-Stack Masterpiece Unification**
