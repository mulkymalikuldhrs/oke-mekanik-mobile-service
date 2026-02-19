# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time.

## Architecture
- **Frontend**: React + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui (Glassmorphism design system).
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Backend**: Express.js server in `server/` directory.
- **Authentication**: JWT-based auth with `bcryptjs` for password hashing.
- **Data Persistence**: SQLite database using `better-sqlite3` located at `server/okemekanik.db`.
- **Testing**: Vitest + React Testing Library.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`.
- **API**: All data fetching must go through `src/lib/api.ts` using `fetchWithAuth` for protected routes.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Components**: Follow the atomic design principles. Use Glassmorphism styles consistently.
- **Testing**: Every new feature or fix should be accompanied by tests.

## Maintenance Procedures
1. **Running Backend**: `npm run backend` (or `npm run dev` for full stack).
2. **Database Schema**: Modify `server/db.js` to update the SQLite schema.
3. **Authentication**: Use the `verifyToken` middleware in `server/index.js` to protect new endpoints.
4. **Testing**: Run `npm test` before any submission.
