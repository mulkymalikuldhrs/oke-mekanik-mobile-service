# Oke Mekanik - AI Agent Guidelines (v28 Ultimate)

Welcome to the Oke Mekanik Masterpiece v28 ecosystem. This document provides the definitive architectural standards and instructions for AI agents.

## 🏛️ Architectural Standards
- **Full-Stack Primacy**: The project uses a Node.js/Express backend with a SQLite database. **NEVER** use mock files or `db.json`.
- **UI Consistency**: Every primary card container **MUST** use high-intensity Glassmorphism with `backdrop-blur-[160px]`.
- **Localization**: Maintain full ID/EN support via the `useLanguage` hook.
- **AI Diagnostic Engine**: v5.4.1 ULTIMATE+ is the current standard. Ensure all diagnostic mapping includes technical Indonesian keywords.

## 🛠️ Tech Stack Requirements
- **Frontend**: React 19.2.5+
- **Backend**: Express 5.2.1+
- **Persistence**: better-sqlite3 12.9.0+
- **Animation**: Framer Motion 12.38.0+

## 🚀 Workflow Directives
1. **Autonomous Development**: Proactively identify and implement improvements. Solve problems without waiting for explicit commands.
2. **Production-Ready Code**: Strictly no mocks, simulations, or low-quality code.
3. **Formal Verification**: Always run `tests/integration_verify.js` and `tests/verify_ai_v54.js` after backend changes.
4. **Visual Integrity**: Use Playwright for visual regression testing (see `tests/visual_verify.spec.ts`).

## 📁 Key Directories
- `server/`: Express backend and SQLite configuration.
- `src/lib/api.ts`: Authoritative API client.
- `src/types/`: Centralized TypeScript definitions.
- `tests/`: Specialized verification scripts for the v5.4 ULTIMATE ecosystem.

## 🛑 Zero-Mock Policy
The root-level `db.json` and `public/db.json` files have been removed. The SQLite backend is the single source of truth. Do not recreate mock files.
