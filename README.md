# Oke Mekanik - Production-Ready Full-Stack Ecosystem

Oke Mekanik is a professional, futuristic mobile mechanic platform designed to connect customers with verified mechanics in real-time. This version represents the absolute peak of the project, featuring a complete Express/SQLite backend and a holographic Glassmorphism frontend.

## 🚀 Key Features

- **Holographic Glassmorphism UI**: Advanced UI/UX with backdrop-blur effects, animated glows, and seamless transitions.
- **AI Smart Diagnostic**: Advanced engine that analyzes Indonesian keywords to recommend specific services (e.g., 'mesin mati' -> 'Tune Up').
- **Real-time GPS Tracking**: Integrated Leaflet maps with live polling to monitor mechanic progress.
- **Earnings & Performance Analytics**: Dynamic charts for mechanics to track their income and rating trends.
- **Full-Stack Architecture**: Persistent SQLite database with a robust Express.js backend.
- **Secure Authentication**: JWT-based session management with encrypted password hashing.

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Animations**: Framer Motion + Lucide Icons
- **Backend**: Express.js + better-sqlite3
- **Security**: JWT (jsonwebtoken) + Bcryptjs
- **State Management**: TanStack Query (React Query)
- **Mapping**: React Leaflet + OpenStreetMap
- **Testing**: Vitest + Playwright

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the unified ecosystem (Frontend + Backend):
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:8080`
   - Backend: `http://localhost:3001`

### Testing
- Run Unit Tests: `npm test`
- Run E2E Tests: `npx playwright test`

## 📁 Project Structure

- `/server`: Express backend and SQLite database logic.
- `/src/components`: Reusable UI components (Holographic design).
- `/src/contexts`: Global state (Auth, etc.).
- `/src/lib/api.ts`: Centralized API client for the real backend.
- `/src/pages`: Application views (Customer & Mechanic dashboards).
- `/tests`: Playwright end-to-end verification scripts.

## 📄 License
This project is private and intended for the Oke Mekanik production environment.
