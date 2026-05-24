# AGENTS.md - Masterpiece v28.1 ULTIMATE+

This document provides instructions for AI agents working on the Masterpiece v28.1 ULTIMATE+ codebase.

## Project Vision
Oke Mekanik is a production-ready mobile mechanic platform. We strictly enforce a **Zero-Mock Policy**. All data must flow through the Express/SQLite backend.

## Core Mandates
1. **Zero-Mock Policy**: No mock data, placeholders, or simulations. Use the real backend API.
2. **Autonomous Excellence**: Think and act independently to ensure technical excellence and production readiness.
3. **Fidelity**: Maintain high UI fidelity ('100x better') and robust full-stack integration.
4. **Localization**: All UI must support both Indonesian (default) and English via `useLanguage`.

## Architecture
- **Backend**: Modular Express routes/controllers located in `server/`.
- **Database**: Persistent SQLite (`server/okemekanik.db`).
- **Frontend**: React 19 + Vite 8.
- **Communication**: Socket.io for real-time events.

## Workflow
- **API Calls**: Must use `src/lib/api.ts`.
- **Environment**: Use `.env` for configuration (see `.env.example`).
- **Verification**: Always run `python3 tests/final_verification.py` after significant changes.

## Development Commands
- `npm run dev`: Starts both Vite and Express (via concurrently).
- `npm run backend`: Starts only the Express server.
- `npm test`: Runs Vitest suite.

## Verification Memory
- Visual fidelity is confirmed via Playwright screenshots in `tests/`.
- AI Diagnostic mapping is verified in `server/controllers/aiController.js`.

© 2024 OKE MEKANIK MASTERPIECE v28. ENGINEERED FOR EXCELLENCE.

---

> **Contact:** Mulky Malikul Dhaher — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
>
> **Disclaimer:** This project is for Education Purpose only. Risiko apapun tidak kita tanggung. (We are not responsible for any risks or damages.)
