# Oke Mekanik - AI Agent Protocol

This document defines the standards and architectural guidelines for AI agents working on the Oke Mekanik ecosystem.

## 🏗️ Architectural Core

### 1. Unified Full-Stack Foundation
- **No Mocks**: Simulations and hardcoded mock data are strictly prohibited in the production path. All data must persist in the SQLite database.
- **Backend First**: Any UI change requiring data persistence must be reflected in `server/index.js` and `server/db.js`.

### 2. Frontend Standards
- **Design System**: Follow the **Glassmorphism** aesthetic. Use `backdrop-blur-2xl`, `bg-white/5`, and `border-white/10`.
- **Data Fetching**: Use `src/lib/api.ts` exclusively. Do not use raw `fetch` calls in components.
- **State**: Use TanStack Query for server state and React Context for global UI state (like Auth).

### 3. Database Schema
- **SQLite**: Managed via `better-sqlite3`.
- **Seeding**: Maintain realistic Indonesian profiles and services in `server/db.js`.
- **Security**: Never store plain-text passwords. Use `bcryptjs` for hashing.

## 🛠️ Operational Commands

- `npm run dev`: Starts both Vite (8080) and Express (3001) concurrently.
- `npm run backend`: Starts only the Express server.
- `npm test`: Executes the Vitest suite.

## 📋 Coding Conventions
- **Naming**: Use PascalCase for components and camelCase for functions/variables.
- **Locales**: Support both Bahasa Indonesia (ID) and English (EN) via the `useLanguage` hook.
- **Atomic Components**: Reuse Shadcn UI components located in `src/components/ui`.

## 🔒 Security Protocol
- All sensitive API routes must be protected with the `verifyToken` middleware in the backend.
- Use `fetchWithAuth` in the frontend to ensure JWT transmission.

---
*Stay Futuristic. Stay Autonomous.*
