# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready, futuristic mobile mechanic platform connecting customers with professional mechanics in real-time.

## Architecture & Tech Stack (Masterpiece Ecosystem)
- **Frontend**: React 19 + Vite + TypeScript 5.
- **Styling**: Tailwind CSS + Shadcn/ui (intensified Glassmorphism + holographic glow).
- **Animation**: Framer Motion for high-intensity entrance animations and interactive transitions.
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Real-time Ecosystem**: **Socket.io 4.8** for bidirectional communication (location tracking & chat).
- **Mapping**: Leaflet + React-Leaflet with custom markers for real-time tracking.
- **Backend**: Node.js + Express 4.21/5.2 with **Helmet** and **Rate-Limiting**.
- **Logging**: Structured production logging for requests and errors.
- **Validation**: Strict **Zod** schema validation for all API inputs.
- **Authentication**: JWT-based auth with `bcryptjs` hashing and mandatory `JWT_SECRET` for production.
- **Data Persistence**: SQLite database using `better-sqlite3` located at `server/okemekanik.db`.

## Key Features for Agents to Maintain
- **AI Diagnostics**: Maintain the **v3.0** weighted keyword engine in `server/index.js` and the holographic scanning animation in `BookingPage.tsx`.
- **Geolocation**: Always use `navigator.geolocation` for location-aware features.
- **Analytics**: Keep the Mechanic Dashboard analytics (Earnings & Rating Trends) dynamic; calculate metrics from real `bookings` and `reviews` data.
- **Tracking**: Maintain real-time tracking in `TrackingPage.tsx` using **Socket.io** events (`join_booking`, `location_updated`).
- **Realism**: Strictly avoid mocks, simulations, or placeholders in production source code.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`.
- **API**: All data fetching must go through `src/lib/api.ts`. Use `fetchWithAuth` for protected routes.
- **Design System**: Consistently use Glassmorphism styles (`backdrop-blur-[40px]`, `bg-white/5`, `border-white/10`).
- **Testing**: All new logic must be tested in `src/__tests__/`. Redundant test files in other directories should be avoided.

## Maintenance Procedures
1. **Running Backend**: `npm run backend` (port 3001).
2. **Running Dev**: `npm run dev` (starts both frontend and backend concurrently using `concurrently`).
3. **Database Schema**: Modify `server/db.js` to update the SQLite schema or seed data.
4. **Testing**: Run `npm test` and ensure all unit tests pass before any submission.
