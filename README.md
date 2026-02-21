# 🛠️ Oke Mekanik - Futuristic Mobile Mechanic Ecosystem

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-orange.svg)](https://github.com/WiseLibs/better-sqlite3)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Oke Mekanik** is a high-performance, production-ready platform designed to bridge the gap between vehicle owners and professional mechanics. Featuring a state-of-the-art **Glassmorphism Design System**, it provides a seamless, real-time experience for emergency repairs and scheduled maintenance.

## 🌟 Advanced Features

- **Futuristic Glassmorphism UI**: A visually stunning design language utilizing `backdrop-blur-2xl`, transparency, and animated glows for a premium feel.
- **Dual-Core Dashboards**: Specialized, data-driven interfaces for both Customers and Mechanics.
- **Real-Time Synchronization**: Live status tracking and instant messaging powered by TanStack Query and polling.
- **Enterprise-Grade Security**: JWT-based authentication, bcrypt password hashing, and secure API endpoints.
- **Automated Booking Engine**: Intelligent matching between customer needs and mechanic specialties.
- **Full-Stack Persistence**: Reliable SQLite storage with `better-sqlite3` for high-concurrency local data management.

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
