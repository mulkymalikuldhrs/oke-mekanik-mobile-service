# OKE MEKANIK 🛠️⚡

**The Ultimate Future of On-Demand Mobile Mechanic Ecosystem**

Oke Mekanik is a production-ready, full-stack platform designed to connect customers with professional mechanics in real-time. Built with a high-performance architecture and a futuristic Glassmorphism UI, it brings transparency, speed, and reliability to vehicle maintenance.

---

## 🚀 Key Features

- **Real-time GPS Tracking**: Watch your mechanic approach your location in real-time on an interactive map.
- **Smart Booking System**: Intelligent service discovery with localized pricing and emergency dispatch support.
- **Mechanic Command Center**: Advanced dashboard for mechanics to manage jobs, track earnings, and update live status.
- **Integrated Chat & Communication**: Real-time communication bridge between customers and service providers.
- **Secure Payment Gateway**: Digital records and secure payment flows for a seamless transaction experience.
- **Futuristic UI/UX**: Ultra-modern Glassmorphism design system with smooth animations and responsive layout.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Shadcn UI (Custom Glassmorphism Design System)
- **State Management**: TanStack Query (React Query) + Context API
- **Maps**: Leaflet + React-Leaflet
- **Animations**: Framer Motion / CSS Animate

### Backend
- **Server**: Express.js (v5.2.1)
- **Database**: SQLite (via better-sqlite3)
- **Authentication**: JWT (JSON Web Tokens) + BcryptJS Password Hashing
- **ID Generation**: UUID v4

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Start the unified development server (Frontend + Backend):
   ```bash
   npm run dev
   ```

### Application Ports
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

## 🧪 Testing & Quality Assurance
Run the comprehensive test suite to ensure system stability:
```bash
npm test
```

## 📂 Project Structure
- `/src`: Frontend React application.
- `/server`: Node.js Express backend & SQLite database.
- `/public`: Static assets and icons.
- `/__tests__`: Comprehensive test suites for all major components.

---

*Autonomous Development by Jules.*
