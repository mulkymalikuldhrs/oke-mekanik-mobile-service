# Oke Mekanik - AI Agent Guidelines

Welcome to the Oke Mekanik project. This document provides instructions and conventions for AI agents working on this codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform connecting customers with professional mechanics in real-time.

## Architecture
- **Frontend**: React + Vite + TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui.
- **State Management**: React Context (Auth) + React Query (Server State).
- **Data Persistence**: Local persistence layer in `src/lib/api.ts` (currently uses `localStorage` to simulate a real backend).
- **Testing**: Vitest + React Testing Library.

## Coding Conventions
- **Types**: Always use types from `@/types/index.ts`. Do not define local interfaces for shared data structures.
- **API**: All data fetching and persistence must go through `src/lib/api.ts`.
- **i18n**: Use the `useLanguage` hook for all user-facing text.
- **Components**: Follow the atomic design principles. Keep components small and focused.
- **Testing**: Every new feature or fix should be accompanied by tests.

## Workflow
1. Use `localStorage` based persistence for now to ensure "real" data behavior.
2. Maintain multi-language support (ID/EN) for all new UI elements.
3. Ensure mobile-first responsiveness.
