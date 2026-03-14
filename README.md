# Oke Mekanik - Production-Ready Full-Stack Ecosystem

Oke Mekanik is a professional on-demand mobile mechanic platform designed to bring high-quality vehicle repair and maintenance services directly to the customer's location. This project implements a full-stack architecture with a Node.js/Express/SQLite backend and a futuristic Glassmorphism React frontend.

## 🚀 Features

- **Futuristic UI/UX**: Holographic Glassmorphism design using Tailwind CSS and Framer Motion.
- **AI Smart Diagnostic**: Real-world problem analysis engine using a keyword-mapping algorithm to recommend verified services based on user symptoms (e.g., 'pincang', 'mati', 'asap').
- **Real-Time Tracking**: Persistent mechanic location tracking system using Leaflet and TanStack Query polling for real-time status updates from the SQLite backend.
- **Unified Full-Stack**: Integrated Node.js + Express + SQLite (Better-SQLite3) backend.
- **Secure Authentication**: JWT-based session management with resource ownership verification.
- **Role-Based Access**: Dedicated dashboards for Customers and Mechanics.
- **Multi-Language Support**: Seamlessly switch between Bahasa Indonesia and English.
- **Autonomous Ecosystem**: A fully integrated full-stack environment designed for production, eliminating all mocks and simulations in favor of real architectural flows.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query.
- **Backend**: Node.js, Express 5, Better-SQLite3, JWT, Bcrypt.
- **Testing**: Vitest, React Testing Library, Playwright (E2E).
- **Icons & Motion**: Lucide-React, Framer Motion.

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file based on `.env.example`:
   ```env
   JWT_SECRET=your_super_secret_key_here
   PORT=3001
   ```

3. **Start Development Server**:
   Runs both the Vite frontend (Port 8080) and Express backend (Port 3001) concurrently.
   ```bash
   npm run dev
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

## 📂 Project Structure

- `server/`: Express backend logic and SQLite database configuration.
- `src/`: React frontend application.
  - `__tests__/`: Consolidated unit and integration tests.
  - `components/`: Reusable UI components.
  - `contexts/`: React Contexts (Auth, etc.).
  - `hooks/`: Custom React hooks (Language, etc.).
  - `lib/`: Centralized API client and utilities.
  - `pages/`: Application pages and route handlers.
  - `types/`: TypeScript interface definitions.
- `tests/`: Playwright end-to-end test specifications.

## 🔒 Security

- **JWT Authentication**: Sessions are secured with JSON Web Tokens.
- **Resource Ownership**: Backend endpoints verify resource ownership using `req.userId`.
- **Password Hashing**: Bcryptjs is used for secure password storage.

## 📜 License

Distributed under the MIT License.
