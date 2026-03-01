# Agent Documentation - Futuristic Full-Stack Implementation

This document provides a consolidated architectural overview and development guidelines for the Oke Mekanik ecosystem.

## 1. Full-Stack Architecture
- **Backend Core**: Node.js + Express 5.2.1.
- **Data Persistence**: SQLite using `better-sqlite3`. The database is located at `server/okemekanik.db`.
- **API Strategy**: RESTful endpoints with JWT authentication and bcrypt password hashing.
- **Frontend Engine**: React 19 + Vite.
- **State Management**: TanStack Query for server state and React Context for authentication.

## 2. Key Modules
- **`server/index.js`**: Main entry point for the backend, handling routing, middleware, and database interactions.
- **`server/db.js`**: Database schema definition and initial data seeding.
- **`src/lib/api.ts`**: Centralized API client using `fetchWithAuth` for automatic token injection.
- **`src/pages/BookingPage.tsx`**: Features a backend-powered AI Smart Diagnostic engine.
- **`src/pages/TrackingPage.tsx`**: Implements real-time Leaflet maps for mechanic tracking.

## 3. Development Guidelines
- **No Mocking**: Strictly avoid using `json-server`, `msw`, or frontend-only simulations for core logic.
- **Real Backend**: All data-related changes must be implemented in the Express backend (`server/index.js`) and reflected in `src/lib/api.ts`.
- **Database Consistency**: Ensure any schema changes in `server/db.js` are reflected in the TypeScript types in `src/types/index.ts`.
- **Testing**: Maintain the consolidated test suite in `src/__tests__/`. All new features must include corresponding unit/integration tests.

## 4. Verification & Quality
- **Performance**: Always use skeleton loaders for data fetching transitions.
- **Security**: Never expose the `JWT_SECRET` in public code or frontend bundles.
- **UX**: All diagnostic or tracking animations should have a slight, realistic delay (1-2s) to enhance user perception of "processing".

## 5. Standard Commands
- `npm install`: Install both frontend and backend dependencies.
- `npm run dev`: Start Vite and Express concurrently.
- `npm run backend`: Run only the Express server.
- `npm test`: Execute the Vitest test suite.
