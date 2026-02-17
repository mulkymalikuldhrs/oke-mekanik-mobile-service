# AGENTS.md - Oke Mekanik (Production-Ready)

This document provides instructions and conventions for AI agents working on the Oke Mekanik codebase.

## Project Overview

Oke Mekanik is a full-stack on-demand mechanic platform. It features a futuristic React frontend and a robust Node.js/Express backend with SQLite persistence.

## Architecture

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn-ui.
- **Backend:** Node.js, Express, `better-sqlite3` for persistent data storage.
- **Authentication:** JWT-based authentication with `bcryptjs` for password hashing.
- **State Management:** TanStack Query for server state, React Context for Auth and Language.

## Core Directives

1. **Real Data Only:** Do not use mock data or simulations in production-ready components. All data fetching must go through `src/lib/api.ts` which connects to the Express backend.
2. **Security:** Always use `fetchWithAuth` (or the token-aware `fetchApi`) for protected routes. Ensure the `Authorization: Bearer <token>` header is present.
3. **UX Standards:** Use `Skeleton` components for loading states to provide a smooth, futuristic experience.
4. **i18n:** Use the `useLanguage` hook for all user-facing strings. Currently supports Bahasa Indonesia and English.

## Backend Endpoints

- `POST /api/auth/register`: Register new user (Customer or Mechanic).
- `POST /api/auth/login`: Authenticate user and return JWT.
- `GET /api/auth/me`: Verify JWT and return current user profile.
- `GET /api/mechanics`: List all mechanics.
- `POST /api/bookings`: Create a new service booking.
- `GET /api/bookings/active`: Get active bookings for the logged-in user.
- `POST /api/messages`: Send in-app messages.

## Development Workflow

1. **Installation:** `npm install`
2. **Local Dev:** `npm run dev` (starts both frontend on :8080 and backend on :3001).
3. **Database:** SQLite database is located at `server/okemekanik.db`.
4. **Testing:** `npm test` runs the Vitest suite.

## Pre-Commit Steps

Before submitting, ensure:
1. All tests pass (`npm test`).
2. Visual verification of key flows (Login, Dashboard, Booking).
3. No console errors or warnings in the development environment.
