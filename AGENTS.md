# AGENTS.md - Masterpiece v28 Production-Ready Directives

This document defines the absolute operational constraints and architectural standards for the **Oke Mekanik Masterpiece v28** ecosystem.

## 🏛 Project Standards (v28)

Oke Mekanik is a high-fidelity, mock-free full-stack implementation.

- **Zero-Mock Policy**: All data persistence must be handled by the SQLite backend. No `localStorage` mocks or simulation logic are allowed for core transactions.
- **UI Excellence**: Maintain 'Masterpiece v28' Glassmorphism. Core pages must use `backdrop-blur-[160px]` for background effects and `backdrop-blur-[40px]` for headers/cards.
- **Real-time Backend**: Use the Node.js/Express server (`port 3001`) for all API and Socket.io communication.
- **Autonomous Development**: The agent is expected to think independently, maintain code quality, and ensure the system is production-ready without constant micro-management.

## 🚫 Critical Constraints

1. **NO UI DEGRADATION**: Never lower the visual standards. Maintain holographic glow effects and smooth animations.
2. **SECURITY FIRST**: All endpoints must be protected with `verifyToken` and validated with Zod schemas.
3. **LOCALIZATION**: Never hardcode user-facing strings. Use `t('key')` and register translations in `src/hooks/useLanguage.tsx`.
4. **PERFORMANCE**: Ensure database queries are optimized. Maintain indexes on foreign keys and frequently searched fields.

## ⚙️ Workflow & Verification

### Launch
Use `npm run dev` to start the full stack.

### Automated Checks
Before submission, you MUST verify the ecosystem:
1. **Unit Tests**: `npm test` - Ensure all 22+ centralized tests pass.
2. **Integration**: `node tests/integration_verify.js` - Confirms backend health and AI logic.
3. **Visual/E2E**: `npx playwright test tests/visual_verify.spec.ts` - Verifies critical user flows.

### Cleanup
Always remove binary database artifacts (`server/*.db`), screenshots, and temporary logs from the repository before committing.

## 🏁 Objective
Deliver and maintain a technically superior, visually stunning, and fully functional futuristic mechanic platform.
