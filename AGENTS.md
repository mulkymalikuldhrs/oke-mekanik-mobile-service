# AGENTS.md - Oke Mekanik Masterpiece Full-Stack Ecosystem

This document provides definitive instructions for AI agents working on the Oke Mekanik codebase.

## 🚀 Project Vision: The Masterpiece
Oke Mekanik is a high-performance, futuristic mobile mechanic platform. It is a **Zero-Mock, Real-Time Full-Stack Ecosystem**.

## 🏗️ Architecture & Stack
- **Frontend:** React 19 + Vite + TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion.
- **Backend:** Node.js + Express 5.
- **Database:** Better-SQLite3 (Persistent storage).
- **Communication:** Socket.io (Real-time tracking and messaging).
- **Validation:** Zod (Strict schema enforcement).

## 🛡️ Critical Operational Constraints
1. **Zero Mocks:** No hardcoded data or artificial delays are permitted in the application logic. Everything must be handled by the Express backend.
2. **Glassmorphism UI:** Maintain high-intensity blurs (`backdrop-blur-[40px]`) and `.glass-card` utilities. Do not degrade the "Futuristic Masterpiece" aesthetic.
3. **Real-time First:** Use Socket.io for all tracking and chat features. Do not use polling.
4. **Security:** JWT-based authentication is mandatory. DERIVE `userId` and `userRole` strictly from the verified token payload on the backend.

## 🛠️ Development Workflow
- **Start Dev:** `npm run dev` (Starts Vite on 8080 and Node backend on 3001 concurrently).
- **Testing:** `npm test` for Vitest unit tests.
- **Backend Verification:** `node verify_backend.js` to ensure the API is fully functional.

## 📝 Coding Standards
- **Technical Indonesian:** Use appropriate Indonesian technical terms in the UI (e.g., "Ganti Oli", "Cek Aki").
- **Types:** Always sync `src/types/index.ts` with the backend schema.
- **Error Handling:** Use the centralized error-handling middleware in `server/index.js` and specific Indonesian error messages in `src/lib/api.ts`.

## ✅ Pre-Commit Verification
Before submitting, you MUST:
1. Run `npm test` and ensure 100% pass rate.
2. Run `node verify_backend.js` to confirm API health.
3. Run `npm run build` to verify production readiness.
