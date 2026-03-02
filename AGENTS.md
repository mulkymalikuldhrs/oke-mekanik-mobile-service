# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready, futuristic mobile mechanic platform connecting customers with professional mechanics in real-time.

## Architecture & Tech Stack
- **Frontend**: React 19 + Vite + TypeScript.
- **Styling**: Tailwind CSS + Shadcn/ui (Glassmorphism design system).
- **Animation**: Framer Motion for entrance animations and interactive transitions.
- **State Management**: React Context (Auth) + TanStack Query (Server State).
- **Mapping**: Leaflet + React-Leaflet with custom markers for real-time tracking.
- **Backend**: Node.js + Express 5 server in `server/` directory.
- **Authentication**: JWT-based auth with `bcryptjs` for password hashing.
- **Data Persistence**: SQLite database using `better-sqlite3` located at `server/okemekanik.db`.

## Key Features for Agents to Maintain
- **AI Diagnostics**: Maintain the keyword-to-service mapping in `BookingPage.tsx` and ensure the scanning animation remains smooth.
- **Geolocation**: Always use `navigator.geolocation` for location-aware features.
- **Analytics**: Keep the Mechanic Dashboard analytics (Earnings & Rating Trends) dynamic; calculate metrics from real `bookings` and `reviews` data.
- **AI Smart Diagnostic**: Maps Indonesian terms like 'pincang', 'mati', 'asap', 'overheat' to 'Tune Up' (svc-4), and 'soak' to 'Cek Aki' (svc-7).
- **Tracking**: Maintain real-time tracking in `TrackingPage.tsx` by polling the mechanic's current location from the backend.
- **Realism**: Strictly avoid mocks, simulations, or placeholders in production source code.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`.
- **API**: All data fetching must go through `src/lib/api.ts`. Use `fetchWithAuth` for protected routes.
- **Design System**: Consistently use Glassmorphism styles (`backdrop-blur-2xl`, `bg-white/5`, `border-white/10`).
- **Testing**: All new logic must be tested in `src/__tests__/`. Redundant test files in other directories should be avoided.

## Maintenance Procedures
1. **Running Backend**: `npm run backend` (port 3001).
2. **Running Dev**: `npm run dev` (starts both frontend and backend concurrently).
3. **Database Schema**: Modify `server/db.js` to update the SQLite schema or seed data.
4. **Testing**: Run `npm test` and ensure all 22+ tests pass before any submission.
