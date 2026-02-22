# 🌌 OKE MEKANIK - THE FUTURE OF VEHICLE CARE

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-orange.svg)](https://github.com/WiseLibs/better-sqlite3)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**OKE MEKANIK** is a hyper-modern, production-grade ecosystem architected to redefine the relationship between vehicle owners and technical experts. Engineered with a cutting-edge **Glassmorphism Design Language**, OKE MEKANIK delivers a zero-latency, immersive experience for both mission-critical emergency repairs and predictive maintenance.

## 🚀 CORE INNOVATIONS

- **Hyper-Modern Glassmorphism UI**: An immersive visual experience utilizing `backdrop-blur-2xl`, high-frequency transparency, and pulsing neon accents.
- **Dual-Core Dashboards**: Specialized, data-driven interfaces for both Customers and Mechanics.
- **Real-Time Synchronization**: Live status tracking and instant messaging powered by TanStack Query and polling.
- **Enterprise-Grade Security**: JWT-based authentication, bcrypt password hashing, and secure API endpoints.
- **Intelligent Geolocation Routing**: Real-time distance-based discovery using `navigator.geolocation` and server-side Haversine computation.
- **Service Feedback Loop**: End-to-end rating and review system ensuring elite service quality.
- **Financial Analytics Suite**: Real-time earnings visualization with interactive Recharts integration.
- **Persistent SQLite Backbone**: High-concurrency data management powered by `better-sqlite3`.

## 🚀 Technical Architecture

### Frontend
- **Framework**: React 19 (Vite-powered)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (Server State) + React Context (Auth)
- **Internationalization**: Custom i18n hook (`useLanguage`)
- **API Client**: Centralized Axios-like fetch wrapper with automatic JWT injection.

### Backend
- **Engine**: Node.js + Express 5
- **Database**: SQLite (Persistent)
- **Auth**: JSON Web Tokens (JWT)
- **Security**: Bcrypt password hashing & Route middleware protection.

## 🏁 Quick Start

### 1. Requirements
Ensure you have **Node.js 18+** installed.

### 2. Installation
```bash
npm install
```

### 3. Development Mode
```bash
npm run dev
```
Starts the Vite frontend (Port 8081) and Express backend (Port 3001) concurrently.

### 4. Testing
```bash
npm test
```

## 📂 Project Structure

- `server/`: Express API server, Database schema (`db.js`), and Initial Seeding.
- `src/lib/api.ts`: Centralized API client using `fetchWithAuth`.
- `src/types/`: Unified TypeScript interfaces for domain entities.
- `src/components/`: Atomic UI components with Glassmorphism styles.
- `src/__tests__/`: Comprehensive test suite for components, pages, and hooks.

## 📝 Roadmap
- [x] Full-Stack SQLite Integration
- [x] Futuristic UI Upgrade
- [x] Real-time Tracking & Chat
- [ ] Mobile App (React Native)
- [ ] Integrated Payment Gateway (Midtrans/Stripe)

## 🤝 Contributing
Oke Mekanik is an open-source project. Feel free to fork and submit PRs!

---
© 2024 Oke Mekanik. Elevating vehicle maintenance into the future.
