# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time.

# Technical Architecture
- **Frontend Core**: React 19 + Vite 5 + TypeScript.
- **Design Paradigm**: Advanced Glassmorphism (Tailwind CSS + shadcn/ui).
- **State Orchestration**: TanStack Query v5 + React Context (Security Layer).
- **Backend Engine**: Node.js + Express 5.
- **Security Protocol**: JWT + `bcryptjs` for high-entropy credential protection.
- **Persistence Layer**: SQLite v3 (`better-sqlite3`) - High performance, Zero-config.
- **Intelligence**: Real-time Haversine distance-based discovery.
- **Analytics Engine**: Interactive Recharts integration for financial visualization.
- **Feedback Loop**: Integrated end-to-end Rating & Review system.
- **Quality Assurance**: Vitest + React Testing Library (100% core coverage).

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`. Do not redefine interfaces.
- **API**: All data fetching must go through `src/lib/api.ts` using `fetchWithAuth` for protected routes.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Design System**: Consistently use `backdrop-blur-2xl`, `bg-white/5`, and dark themes (`#0a0a0a`). Use bold, italic, tracking-tighter typography for primary headers.
- **Components**: Keep components small and focused. Prefer functional components and hooks.
- **Testing**: Every new feature or fix must be accompanied by tests in `src/__tests__/`.

## Operational Procedures
1. **Unified Development**: `npm run dev` executes both Frontend (Vite) and Backend (Express) concurrently.
2. **Backend Services**: Standalone backend available via `npm run backend` (Internal Port: 3001).
3. **Schema Management**: Database definitions residing in `server/db.js`.
4. **Security Integrity**: New endpoints MUST implement the `verifyToken` middleware in `server/index.js`.
5. **Validation Suite**: Execute `npm test` to validate system integrity before any merge.
