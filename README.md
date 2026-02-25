# 🛠️ Oke Mekanik - Futuristic Full-Stack Mechanic Ecosystem

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-orange.svg)](https://github.com/WiseLibs/better-sqlite3)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Oke Mekanik** is a high-performance, production-ready platform designed to bridge the gap between vehicle owners and professional mechanics. Featuring a state-of-the-art **Glassmorphism Design System**, it provides a seamless, real-time experience for emergency repairs and scheduled maintenance.

## 🌟 Advanced Features

- **Futuristic Glassmorphism UI**: A visually stunning design language utilizing `backdrop-blur-2xl`, transparency, and animated glows for a premium feel.
- **Dual-Core Dashboards**: Specialized, data-driven interfaces for both Customers and Mechanics.
- **Real-Time Map Tracking**: Live location tracking powered by Leaflet, featuring simulated mechanic movement and custom markers.
- **Dynamic Analytics**: Real-time financial performance charts for mechanics, automatically calculated from completed bookings.
- **Geolocation Integration**: Native Geolocation API support for finding nearby mechanics and locking precise service coordinates.
- **Enterprise-Grade Security**: JWT-based authentication, bcrypt password hashing, and secure API endpoints.
- **Integrated Rating System**: Automated feedback loop between customers and mechanics to ensure top-tier service quality.
- **Full-Stack Persistence**: Reliable SQLite storage with `better-sqlite3` for consistent, high-concurrency data management.

## 🚀 Technical Architecture

### Frontend
- **Framework**: React 19 (Vite-powered)
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **State Management**: TanStack Query (Server State) + React Context (Auth)
- **Mapping**: Leaflet + React-Leaflet (Dark Mode Tiles)
- **API Client**: Centralized fetch wrapper with automatic JWT injection.

### Backend
- **Engine**: Node.js + Express 5
- **Database**: SQLite (Persistent) with comprehensive seeding logic.
- **Auth**: JSON Web Tokens (JWT) + Bcrypt password hashing.

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
Starts the Vite frontend (Port 8080) and Express backend (Port 3001) concurrently.

### 4. Testing
```bash
npm test
```

## 📂 Project Structure

- `server/`: Express API server, Database schema (`db.js`), and Initial Seeding.
- `src/lib/api.ts`: Centralized API client using `fetchWithAuth`.
- `src/types/`: Unified TypeScript interfaces.
- `src/__tests__/`: Comprehensive test suite for the entire ecosystem.

---
© 2024 Oke Mekanik. Elevating vehicle maintenance into the future.
