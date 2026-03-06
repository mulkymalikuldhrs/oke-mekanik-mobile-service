# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time. The goal is to provide a seamless, futuristic UI and a robust, persistent full-stack architecture.

## Architecture
- **Frontend**: React 19 + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion for Glassmorphism animations.
- **Backend**: Express.js + better-sqlite3 (SQLite) + JWT Authentication.
- **State Management**: TanStack Query (React Query) for server state synchronisation.
- **Persistence Layer**: Real persistent SQLite database (`okemekanik.db`) handled in `server/db.js`.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`. Do not define local interfaces for shared data structures.
- **API Client**: All data fetching and persistence must go through `src/lib/api.ts`. Direct `fetch` calls from components are prohibited.
- **Holographic UI**: Maintain the Glassmorphism aesthetic with backdrop-blur and animated glows for all new UI elements.
- **AI Diagnostics**: The AI Smart Diagnostic engine in `BookingPage.tsx` must use Indonesian keyword mapping to recommend specific services.
- **Real-time Tracking**: Any new tracking features must use `react-leaflet` and poll the backend every 3 seconds for position updates.

## Workflow
1. Use the Express backend (`npm run backend`) to ensure data persistence and security.
2. Maintain multi-language support (ID/EN) for all new UI elements using `useLanguage`.
3. Follow the atomic design principles for components.
4. Always accompany new features or fixes with unit tests in `src/__tests__`.

## Pre-Commit Steps
Before submitting any changes, you MUST:
1. Run all unit tests: `npm test`
2. Run E2E tests: `npx playwright test`
3. Verify the project structure and ensure no mock logic remains.
