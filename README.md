# 🛠️ Oke Mekanik - Futuristic Mobile Mechanic Ecosystem

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-orange.svg)](https://github.com/WiseLibs/better-sqlite3)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-green.svg)](https://leafletjs.com/)

**Oke Mekanik** is a high-performance, production-ready platform designed to bridge the gap between vehicle owners and professional mechanics. Featuring a state-of-the-art **Glassmorphism Design System** and **Real-Time Map Integration**, it provides a seamless experience for repairs.

## 🌟 Advanced Features

- **Futuristic Glassmorphism UI**: A visually stunning design utilizing `backdrop-blur-2xl`, transparency, and `framer-motion` animations.
- **Real-Time Map Integration**: Real-time location tracking of mechanics and customers using **Leaflet**.
- **Precise Geolocation**: Integrated `navigator.geolocation` for accurate service delivery.
- **Dynamic Analytics**: Data-driven mechanic dashboard with real-time earning calculations.
- **Full-Stack Persistence**: Robust SQLite storage with `better-sqlite3` and expanded seed data.
- **Enterprise-Grade Security**: JWT-based authentication and bcrypt password hashing.

## 🚀 Technical Architecture

### Frontend
- **Framework**: React 19 (Vite)
- **Maps**: React Leaflet + Leaflet
- **Animations**: Framer Motion
- **State**: TanStack Query + React Context

### Backend
- **Engine**: Node.js + Express 5
- **Database**: SQLite (Persistent)
- **Auth**: JWT + Bcrypt

## 🏁 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Testing
```bash
npm test
```

## 📂 Project Structure
- `server/`: Express server, SQLite schema, and seeding.
- `src/__tests__/`: Comprehensive test suite.
- `src/lib/api.ts`: Centralized API client.

---
© 2024 Oke Mekanik. Elevating vehicle maintenance into the future.
