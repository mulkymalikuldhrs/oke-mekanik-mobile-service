# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik production ecosystem. This document provides instructions and conventions for AI agents working on this modernized full-stack codebase. All "mock" simulations have been replaced with real, production-ready implementations.

## 🚀 Project Vision
Oke Mekanik is a hyper-modern, production-ready mobile mechanic platform connecting customers with professional mechanics in real-time. It features a futuristic Glassmorphism UI and a robust Node.js/SQLite backend.

## 🏗️ Architecture
- **Frontend**: React 19 + Vite + TypeScript.
- **Design System**: Futuristic Glassmorphism (Tailwind CSS + shadcn/ui). Key features: `backdrop-blur-2xl`, `bg-white/5`, dark themes (`#0a0a0a`), and pulsing glows.
- **State Management**: React Context (Auth) + TanStack Query v5 (Server State).
- **Backend**: Express.js server (v5) located in the `server/` directory.
- **Database**: SQLite with `better-sqlite3` for high-performance persistence.
- **Authentication**: JWT-based session management with `bcryptjs` for secure password hashing.
- **Testing**: Vitest + React Testing Library (Single source of truth in `src/__tests__/`).

## 🛠️ Maintenance & Development
1. **Starting the Ecosystem**:
   - `npm run dev`: Starts both the Vite frontend (port 8080) and Express backend (port 3001) concurrently.
   - `npm run backend`: Starts only the backend server.
2. **API Integration**:
   - All frontend data fetching must use the centralized client in `src/lib/api.ts`.
   - Use `fetchWithAuth` for protected routes requiring JWT.
3. **Database Management**:
   - Schema and initial seed data are managed in `server/db.js`.
   - The database file is `server/okemekanik.db`.
4. **Security**:
   - Always use the `verifyToken` middleware for sensitive backend endpoints.
   - Ensure `JWT_SECRET` is configured in production via environment variables.

## 🧪 Quality Assurance
- **Unit Testing**: All tests must reside in `src/__tests__/`. Redundant tests in other directories have been removed. Run `npm test` to verify the entire suite.
- **Performance**: Use skeleton loaders and Framer Motion for smooth UI transitions.
- **Code Quality**: Maintain zero console logs and hardcoded mock strings in production-ready components.

## 🌐 Localization (i18n)
- Use the `useLanguage` hook for all user-facing strings to support Indonesian (ID) and English (EN).
