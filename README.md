# Oke Mekanik - Masterpiece v28 Ultimate v54 Ecosystem

This is the definitive, production-ready full-stack implementation of the Oke Mekanik platform.

## 🚀 Vision
Mekanik dan Bengkel masa depan - A futuristic mobile mechanic platform featuring autonomous AI diagnostics and a high-fidelity Glassmorphism UI.

## 🛠️ Tech Stack
- **Frontend**: React 19.2.5, Vite, TypeScript, Framer Motion 12.38.0
- **UI/UX**: Tailwind CSS, shadcn/ui (Standardized Glassmorphism: `backdrop-blur-[160px]`)
- **Backend**: Express 5.2.1, Node.js
- **Database**: SQLite (via `better-sqlite3` 12.9.0)
- **State Management**: TanStack Query (React Query)
- **Real-time**: Socket.io 4.8.3
- **AI Engine**: AI Diagnostic Engine v5.4 ULTIMATE (Technical Indonesian Mapping)

## 🏗️ Architecture & Zero-Mock Policy
This project adheres to a strict **Zero-Mock Policy**. All data is real and persisted in a SQLite database. There are no simulations or static `db.json` files in production or development.
- **API Client**: `src/lib/api.ts` handles all backend communication.
- **Server**: `server/index.js` provides a robust RESTful API with security hardening (Helmet, Rate Limiting).
- **Database Schema**: `server/db.js` defines the full-stack data model and seeds initial production-grade data.

## 🚦 Getting Started

### Installation
```bash
npm install
```

### Running the Ecosystem
```bash
npm run dev
```
Starts both the React frontend (port 8080) and the Express backend (port 3001) concurrently.

### Testing & Verification
```bash
npm test                      # Unit/Integration tests
python3 tests/manual_verify.py  # End-to-end API verification
```

## 📜 License
Private & Proprietary - Oke Mekanik Masterpiece v28.
