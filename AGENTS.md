# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## 🚀 Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time. It features a futuristic Glassmorphism design and a robust full-stack architecture.

## 🏗️ Technical Architecture
- **Frontend**: React 19 + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui with a centralized 'Glassmorphism' system (`backdrop-blur-2xl`, transparency, animated glows).
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Backend**: Node.js + Express.js.
- **Database**: SQLite with `better-sqlite3` for persistent storage (located in `server/okemekanik.db`).
- **Authentication**: JWT-based auth with `bcryptjs` hashing.
- **Testing**: Vitest + React Testing Library.

## 📝 Coding Conventions
- **Types**: Always use centralized types from `src/types/index.ts`.
- **API**: All data fetching must go through `src/lib/api.ts`. Use `fetchWithAuth` for protected endpoints.
- **i18n**: Use the `useLanguage` hook for all user-facing text to support Indonesian (ID) and English (EN).
- **Components**: Follow atomic design principles. Maintain the futuristic visual style.
- **Testing**: Every new feature or fix should be accompanied by tests in `src/__tests__/`.

## 🛠️ Development Workflow
- **Start Dev Environment**: `npm run dev` (runs both frontend and backend).
- **Backend Only**: `npm run backend`.
- **Testing**: `npm test`.
- **Production Readiness**: No mock data in components, no `console.log` in production code, all API calls must be real.

## ✅ Production Readiness Checklist
1. All API endpoints secured with `verifyToken`.
2. Consistent usage of `fetchWithAuth` in frontend.
3. Proper loading states (Skeletons) for all data-driven components.
4. Comprehensive error handling with localized error messages.
5. All tests passing and verified.
6. Mobile-first responsive design across all pages.
7. Sanity check for any remaining hardcoded simulation data.
