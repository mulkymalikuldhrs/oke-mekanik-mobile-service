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
- **Analytics**: Data visualization using Recharts on the Mechanic Dashboard.
- **Feedback System**: Integrated Rating & Review system for service quality assurance.
- **Testing**: Vitest + React Testing Library.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`. Do not redefine interfaces.
- **API**: All data fetching must go through `src/lib/api.ts` using `fetchWithAuth` for protected routes.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Design System**: Consistently use `backdrop-blur-2xl`, `bg-white/5`, and dark themes (`#0a0a0a`). Use bold, italic, tracking-tighter typography for primary headers.
- **Components**: Keep components small and focused. Prefer functional components and hooks.
- **Testing**: Every new feature or fix must be accompanied by tests in `src/__tests__/`.

## Maintenance Procedures
1. **Running Backend**: `npm run backend` (port 3001).
2. **Running Dev**: `npm run dev` (starts both frontend and backend).
3. **Database Schema**: Modify `server/db.js` to update the SQLite schema. Tables include `users`, `mechanics`, `services`, `bookings`, `messages`, and `payments`.
4. **Authentication**: Use the `verifyToken` middleware in `server/index.js` to protect new endpoints.
5. **Testing**: Run `npm test` before any submission.
