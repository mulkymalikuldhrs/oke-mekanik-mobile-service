# AGENTS.md

This document provides architectural truth and instructions for AI agents working on the **Oke Mekanik** futuristic full-stack codebase.

## 🚀 Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time. It features a futuristic Glassmorphism UI and a robust Node.js/SQLite backend.

## 🏗 Full-Stack Architecture
The project has been upgraded to a real full-stack architecture. **Do not use mocks, simulations, or `db.json` files.**

- **Backend**: Express.js server in `server/index.js` with `better-sqlite3` storage.
- **Frontend**: React 19 + Vite in `src/`.
- **API**: Centralized in `src/lib/api.ts` using `fetchWithAuth`.
- **Database**: Persistent SQLite database in `server/okemekanik.db`.

## 🛠 Coding Conventions
- **No Mocks**: Always integrate with the real backend API.
- **Glassmorphism UI**: Maintain the futuristic aesthetic (backdrop-blur, translucent borders, glowing accents) using Tailwind and Framer Motion.
- **Localization**: Use the `useLanguage` hook for all user-facing text (Bahasa Indonesia & English).
- **TypeScript**: Strictly follow types defined in `src/types/index.ts`.
- **Auth**: Use the `AuthContext` for user session management and protected routes.
- **Maps**: All tracking features must use `react-leaflet` with real coordinates.

## 🧪 Testing Standards
- All tests must reside in `src/__tests__/`.
- Use Vitest and React Testing Library for all component and logic tests.
- Run `npm test` before any submission.

## 📦 Deployment & Environment
- **Environment**: Use `.env.example` for required variables (`VITE_API_URL`, `JWT_SECRET`).
- **Concurrent Run**: `npm run dev` starts both the Vite frontend (port 8080) and the Express backend (port 3001) using `concurrently`.

## 💡 Key Tips
- Use the **AI Smart Diagnostic** engine in `BookingPage.tsx` to handle Indonesian problem descriptions.
- The **Mechanic Dashboard** features real-time performance analytics powered by `recharts`.
- For real-time location updates, use the `PATCH /api/mechanics/:id/location` endpoint.
