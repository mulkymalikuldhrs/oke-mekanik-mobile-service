# Oke Mekanik - Production-Ready Full-Stack Masterpiece

Oke Mekanik is a comprehensive, futuristic mobile mechanic platform designed to bring professional vehicle services directly to the customer's location in real-time.

## 🚀 Key Features

- **Futuristic Masterpiece UI**: Intensified Glassmorphism design system with `backdrop-blur-[40px]`, multi-layered gradients, and high-intensity Framer Motion entrance animations.
- **AI Smart Diagnostic (v2.0)**: Real-time Indonesian technical analysis engine with holographic 'Scanning' overlay, providing repair suggestions based on weighted keyword scoring.
- **Real-Time Ecosystem**: Bidirectional communication via **Socket.io** for live mechanic tracking and instant in-app messaging between customers and partners.
- **Hardened Full-Stack Architecture**:
  - **Backend**: Node.js + Express 5.2.1 with Zod schema validation and centralized JSON error handling.
  - **Database**: High-performance SQLite (`better-sqlite3`) with synchronized schema for Bookings, Messages, and Reviews.
  - **Security**: JWT-based authentication with strict resource ownership verification and `bcryptjs` password hashing.
- **Unified Testing Suite**: Consolidated unit tests in `src/__tests__/` and end-to-end (E2E) verification using Playwright.
- **Multi-language Support**: Fully integrated Indonesian/English support via the `useLanguage` hook across all production components.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 5, TypeScript 5.
- **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons.
- **State Management**: TanStack Query (Server State), React Context (Auth).
- **Backend**: Express 5, Socket.io, JWT, Zod.
- **Database**: SQLite (better-sqlite3).
- **Testing**: Vitest, React Testing Library, Playwright.

## 🏁 Getting Started

### Prerequisites
- Node.js (v22 recommended)
- npm

### Installation
1. Clone the repository.
2. Install NPM packages:
   ```bash
   npm install
   ```

### Running the Application
To launch the full-stack ecosystem (Frontend on port 8080 and Backend on port 3001 concurrently):
```bash
npm run dev
```

### Running Tests
To execute the unit test suite:
```bash
npm test
```

## 📂 Project Structure
- `server/`: Node.js/Express backend and SQLite database.
- `src/__tests__/`: Consolidated unit tests for all core features.
- `src/components/`: Reusable UI components following the Glassmorphism theme.
- `src/contexts/`: Global state providers (Auth, etc.).
- `src/lib/api.ts`: Centralized API client for the Node.js backend.
- `src/pages/`: Production-ready application routes.
- `src/types/`: Synchronized TypeScript interfaces.

## 📜 License
This project is private and intended for the Oke Mekanik platform.
