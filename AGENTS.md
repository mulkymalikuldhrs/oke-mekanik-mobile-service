# Agent Documentation - Masterpiece Full-Stack Ecosystem

This document provides definitive architectural guidelines and operational instructions for AI agents working on the "Oke Mekanik" codebase. This project represents a "Masterpiece" state where design, security, and functionality converge into a unified ecosystem.

## 🏗️ Architectural Core

- **Full-Stack Integration**: The project uses a Node.js/Express backend with a SQLite database (`server/okemekanik.db`). Mock data sources (MSW/json-server) have been completely removed.
- **Data Persistence**: All domain logic (Bookings, Users, Mechanics, Messages) is persisted in SQLite.
- **State Management**:
  - **Server State**: Managed via TanStack Query in the frontend.
  - **Auth State**: Managed via `AuthContext.tsx`.
- **API Communication**: The `src/lib/api.ts` file is the exclusive gateway for all backend communication.

## 🔒 Security Standards

- **JWT Auth**: All protected endpoints require a `Bearer` token in the `Authorization` header.
- **Ownership Verification**: Backend endpoints must verify that the `userId` requesting or modifying a resource matches the resource's owner (Broken Access Control prevention).
- **Environment Safety**: Never commit actual `JWT_SECRET` values. Use `.env` and `.env.example`.

## 🎨 UI/UX Guidelines

- **Glassmorphism**: Follow the established holographic design system: `bg-white/5`, `backdrop-blur-xl`, `border-white/10`.
- **Entrance Animations**: Use Framer Motion for page transitions and component visibility.
- **Responsive Design**: Ensure all pages are fully functional on mobile devices.
- **Multi-Language**: Every user-facing string must be implemented via the `useLanguage` hook.

## 🧪 Testing Protocol

- **Unit/Integration**: All unit tests are located in `src/__tests__/`. Run with `npm test`.
- **Backend Verification**: Use the root-level `verify_backend.js` script to validate core API endpoints.
- **E2E**: Playwright tests are in the `tests/` directory.
- **Requirement**: No pull request should be submitted without passing existing tests and adding new tests for added features.

## 🛠️ Operational Commands

- `npm run dev`: Starts both frontend and backend concurrently.
- `npm run build`: Generates the production build of the Vite application.
- `npm test`: Executes the Vitest suite.

## 🚫 Negative Constraints (Strict Forbidden)

- **NO MOCKS**: Do not use `db.json`, MSW, or local simulations. Every data point must originate from the SQLite backend.
- **NO DEGRADATION**: Never downgrade the holographic Glassmorphism UI or remove high-intensity animations.
- **NO SIMULATIONS**: AI Diagnostics and Mechanic Tracking must be 100% operational architectural flows, not UX facades.
- **NO INCONSISTENCY**: Do not mix UI styles or naming conventions.
- **NO PLACEHOLDERS**: Every file must be fully implemented and functional.
