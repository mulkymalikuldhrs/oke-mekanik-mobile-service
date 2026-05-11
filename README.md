# 🛠️ Oke Mekanik: Masterpiece v28.1 Ultimate v5.8.1+

> **Mekanik dan Bengkel Masa Depan** — An autonomous, high-fidelity, full-stack ecosystem for the next generation of mobile vehicle services.

[![System Status](https://img.shields.io/badge/System-Live-green?style=for-the-badge&logo=statuspage)](http://localhost:3001/api/health)
[![AI Engine](https://img.shields.io/badge/AI_Engine-v5.8.1_ULTIMATE+-blue?style=for-the-badge)](tests/verify_ai_v581.js)
[![UI Standard](https://img.shields.io/badge/UI_Standard-Masterpiece_v28.1-orange?style=for-the-badge)](src/index.css)

Oke Mekanik is not just an app; it is a **Masterpiece v28.1** production-ready ecosystem. Engineered for autonomy and high performance, it merges advanced AI diagnostics with a futuristic Glassmorphism interface and a robust SQLite/Express backend.

---

## 🚀 Vision: Zero-Mock, 100% Real
Unlike standard prototypes, Oke Mekanik follows a strict **Zero-Mock Policy**. Every interaction, from AI diagnostics to real-time tracking, is powered by a live Node.js/Express 5 backend and a persistent SQLite database.

## 🧠 AI Diagnostic Engine v5.8.1 ULTIMATE+
The heart of Oke Mekanik is our proprietary AI engine, calibrated specifically for the Indonesian automotive market.
- **Deep Technical Mapping**: Recognizes complex Indonesian automotive slang and technical terms like *brebet, pincang, ngelitik, ngeden, gluduk, setir narik, asap putih, ngobos, turun mesin,* and *limp mode*.
- **Weighted Confidence Algorithm**: Uses exponential bonus scoring for multi-symptom matches, delivering industry-leading diagnostic accuracy.
- **Urgency Matrix**: Automatically classifies repairs into LOW, MEDIUM, HIGH, or CRITICAL priority based on symptom severity.

## 💎 High-Fidelity UI/UX (Masterpiece v28.1)
- **Glassmorphism Core**: Powered by `.glass-card` utilities with `backdrop-blur-[160px]`.
- **Fluid Motion**: Implemented via Framer Motion 12 for cinematic transitions and feedback.
- **Live System Status**: Real-time heartbeat monitoring directly on the landing page via `/api/health`.
- **PWA Optimized**: Production-ready Service Worker (`sw.js`) with `Stale-While-Revalidate` strategy for extreme offline reliability.

## 🛠️ Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS 3.4, Framer Motion 12 |
| **Backend** | Express 5.2.1, Node.js |
| **Database** | Better-SQLite3 12.9.0 |
| **Real-time** | Socket.io 4.8.3 |
| **Testing** | Playwright, Vitest, Custom AI Verification |

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Launch
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Launch Ecosystem**:
   ```bash
   npm run dev
   ```
   *Starts both React Frontend (8080) and Express Backend (3001) concurrently.*

## 🧪 Verification Suite
Maintain the Masterpiece standard by running our comprehensive test suite:
- **AI Engine Logic**: `node tests/verify_ai_v581.js`
- **Visual E2E Fidelity**: `npx playwright test`
- **Unit & Component**: `npm test`

---

## 📂 Architecture
- `server/`: Authoritative backend source with SQLite persistence (`db.js`).
- `src/lib/api.ts`: Centralized, Zero-Mock API abstraction.
- `src/hooks/useLanguage.tsx`: Integrated multi-language engine (ID/EN).
- `public/sw.js`: Enterprise-grade PWA Service Worker.

## 📜 License
Private & Confidential. Part of the **Oke Mekanik Autonomous Initiative**.
