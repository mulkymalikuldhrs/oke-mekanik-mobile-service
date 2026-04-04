# Oke Mekanik - Ultimate Full-Stack Masterpiece

Oke Mekanik is a production-ready on-demand mechanic platform designed with a futuristic "Masterpiece" vision. It connects customers with professional mechanics in real-time, featuring an AI-powered diagnostic engine, secure authentication, and a high-intensity Glassmorphism UI.

## 🚀 Architecture: The Unified Ecosystem

The project follows a robust full-stack architecture, consolidating both frontend and backend into a high-performance, mock-free environment.

### Backend (Node.js & Express)
- **Engine**: Express 5.2.x with hardened security (Helmet, Rate Limiting).
- **Database**: SQLite (via `better-sqlite3`) for reliable, production-grade persistence.
- **Real-time**: Bidirectional communication via Socket.io for live location tracking and instant messaging.
- **AI Diagnostic**: A weighted technical scoring engine (v3.0) that analyzes Indonesian technical keywords to suggest optimal services.
- **Security**: JWT-based authentication with asynchronous bcrypt hashing and Zod schema validation.

### Frontend (React & Vite)
- **Framework**: React 19 with Vite for lightning-fast delivery.
- **Styling**: Futuristic Glassmorphism theme (40px blur) using Tailwind CSS and Framer Motion.
- **State Management**: React Query for efficient server state synchronization and Context API for authentication.
- **Tracking**: Integrated maps via Leaflet for real-time mechanic positioning.
- **Localization**: Full Indonesian (ID) and English (EN) support across all user flows.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### Installation
1. Install all dependencies:
   ```bash
   npm install
   ```

2. Start the unified development ecosystem (Frontend + Backend):
   ```bash
   npm run dev
   ```

### Verification
Run the comprehensive test suite to ensure production readiness:
- **Unit Tests**: `npm test`
- **Integration/E2E**: `npx playwright test`
- **Backend Health**: `node tests/integration_verify.js`

## 💎 Design Standards: The Masterpiece Vision
- **Blur Density**: 40px backdrop-blur for all glass cards.
- **Intensity**: Multi-layered high-intensity gradients with holographic glows.
- **Motion**: Fluid, spring-based animations for all UI transitions.

## 📜 License
Private and confidential. Developed for the Oke Mekanik ecosystem.
