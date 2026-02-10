# Oke Mekanik - AI Agent Guidelines

This document provides instructions and conventions for AI agents working on the Oke Mekanik codebase.

## Project Vision
Oke Mekanik is a "futuristic" mobile mechanic platform connecting customers with professional mechanics in real-time. It aims for a production-ready, high-quality implementation.

## Architecture
- **Frontend**: React 18 + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui. Design system follows "Glassmorphism" principles (transparency, blur, thin borders).
- **Backend**: Express.js server running on port 3001 (API prefix: `/api`).
- **Persistence**: SQLite database via `better-sqlite3`. Schema is managed in `server/db.js`.
- **State Management**:
  - **Server State**: TanStack Query (React Query) for efficient fetching and caching.
  - **Client State**: React Context API for Authentication and Language.
- **Testing**: Vitest + React Testing Library for unit and integration tests.

## Database Schema
The database (`server/okemekanik.db`) consists of:
- `users`: Stores customer and mechanic account data.
- `mechanics`: Profile details for mechanics (linked to `users`).
- `services`: Available service types (Ganti Oli, etc.).
- `bookings`: Service request records.
- `messages`: Chat messages between users.
- `payments`: Payment transaction records.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`.
- **API**: All data fetching must go through `src/lib/api.ts`.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Components**: Follow atomic design. Use shadcn/ui for base components.
- **Glassmorphism**: Use `backdrop-blur-md`, `bg-white/40`, and `border-white/20` for a futuristic feel.

## Workflow
1. Ensure the backend (`server/index.js`) is running alongside the frontend.
2. Maintain multi-language support (ID/EN) for all UI elements.
3. Ensure mobile-first responsiveness.
4. Every new feature or fix should be accompanied by relevant tests.
