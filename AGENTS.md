# AGENTS.md

This document provides instructions for AI agents working on the Oke Mekanik codebase.

## Project Overview

Oke Mekanik is a web platform that connects customers with mechanics. It features separate dashboards for customers and mechanics, a booking system, service tracking, a chat feature, and a payment system.

## Masterpiece v28.1 ULTIMATE+ Standards

- **Zero-Mock Policy:** All data must be persisted via the SQLite/Express backend. No static JSON mocks in production-ready paths.
- **Futuristic UI:** Enforce Glassmorphism layout (`backdrop-blur-[160px]`, `bg-[#050505]`) as defined in `AppLayout`.
- **AI-Driven:** The AI Diagnostic Engine (v5.8.1) is the core of the booking flow.

## Technologies

- **Frontend:** React 19, Vite 8, TypeScript
- **Styling:** Tailwind CSS, shadcn-ui
- **State Management:** `@tanstack/react-query` for server state.
- **Backend:** Express, SQLite (better-sqlite3), Socket.io
- **Testing:** Vitest, Playwright

## Coding Conventions

- **Component Structure:** Components in `src/components`, Pages in `src/pages`.
- **API Calls:** Use `src/lib/api.ts` which communicates with the Express backend.
- **Modular Backend:** Backend logic is separated into `server/controllers`, `server/routes`, and `server/middleware`.
- **i18n:** Use the `useLanguage` hook for all user-facing text.

## Pre-Commit Steps

Before submitting, ensure:
1. Backend is running (`node server/index.js`).
2. All Vitest tests pass (`npm test`).
3. Playwright verification passes (`python3 tests/final_verification.py`).
