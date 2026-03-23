# 🚀 OKE MEKANIK - Masterpiece Agent Guidelines

Welcome to the **Oke Mekanik** Masterpiece project. This document defines the strict operational constraints and futuristic vision for all AI agents.

## 💎 The Masterpiece Vision
Oke Mekanik is a high-performance, **mock-free** full-stack ecosystem. Every feature must be 100% real, functional, and production-ready.

## 🏗️ Architecture & Flow
- **Unified Full-Stack**: React 19 (Frontend) + Express 5/SQLite (Backend).
- **Zero-Mock Integrity**: All data fetching MUST use `src/lib/api.ts` pointing to `http://localhost:3001/api`.
- **High-Intensity UI**: All primary containers MUST use `.glass-card` and `backdrop-blur-[40px]`.
- **AI Diagnostics**: The `POST /api/ai/diagnose` endpoint in `server/index.js` is the source of truth for symptom analysis.
- **Real-Time Tracking**: GPS markers must reflect the dynamic status transitions from the backend.

## 💎 Operational Constraints (NEVER VIOLATE)
1. **NO SIMULATIONS**: Do not use `setTimeout` or `localStorage` to "fake" backend behavior. Use the real Express endpoints.
2. **ANIMATION INTEGRITY**: Never remove Framer Motion transitions. Staggered entrance animations are mandatory for the "Futuristic" feel.
3. **GLASSMORPHISM FIRST**: If you add a new page or modal, it MUST be transparent, blurred, and bordered according to the Masterpiece spec.
4. **LANGUAGE PARITY**: Maintain both Indonesian and English support via the `useLanguage` hook.

## 🧪 Verification Protocol
1. Run `node verify_backend.js` after any backend or schema change.
2. Run `npm test` to ensure unit test stability (22+ tests).
3. Use Playwright for E2E verification of the "Booking -> Tracking -> Payment" flow.

---
*Elevate the code. Maintain the masterpiece. The future is autonomous.*
