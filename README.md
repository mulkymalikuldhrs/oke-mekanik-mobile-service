# Oke Mekanik - Futuristic Mobile Service Platform

Oke Mekanik is a production-ready full-stack mobile mechanic platform that connects customers with professional mechanics in real-time. Featuring a futuristic Glassmorphism UI and a robust Node.js/SQLite backend.

## 🚀 Key Features

- **Futuristic UI/UX**: Advanced Glassmorphism aesthetic with smooth Framer Motion animations.
- **AI Smart Diagnostic**: Intelligent problem analysis that recommends the best service based on user input.
- **Real-time Tracking**: Live Leaflet-based map integration to track mechanic location.
- **Full-Stack Architecture**: Real Express.js backend with persistent SQLite storage (no more mocks).
- **Secure Authentication**: JWT-based auth with separate flows for Customers and Mechanics.
- **In-App Communication**: Real-time chat system between customers and mechanics.
- **Earnings Analytics**: Dynamic performance charts for mechanics using Recharts.
- **Rating & Review System**: Transparent feedback mechanism to ensure service quality.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Node.js, Express.js, Better-SQLite3.
- **State Management**: TanStack Query (React Query) & Context API.
- **Maps**: Leaflet & React Leaflet.
- **Animations**: Framer Motion.
- **Testing**: Vitest & React Testing Library.

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and configure your variables (optional, defaults provided).

3. **Run Development Mode**:
   ```bash
   npm run dev
   ```
   This starts both the Vite frontend (port 8080) and Express backend (port 3001) concurrently.

4. **Run Tests**:
   ```bash
   npm test
   ```

## 🏗 Project Structure

- `server/`: Express.js backend and SQLite database logic.
- `src/__tests__/`: Comprehensive test suite for components and logic.
- `src/components/`: Reusable UI components (shadcn/ui based).
- `src/contexts/`: Auth and global state providers.
- `src/lib/`: API client and utility functions.
- `src/pages/`: Application views (Customer/Mechanic Dashboards, Booking, etc).

## 📄 License

This project is private and intended for the Oke Mekanik platform.
