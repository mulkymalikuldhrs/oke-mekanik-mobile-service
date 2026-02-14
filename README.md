# Oke Mekanik - Production-Ready Mobile Mechanic Platform

Oke Mekanik is a high-performance, production-ready web platform connecting customers with professional mechanics in real-time. Built with a futuristic Glassmorphism design and a robust full-stack architecture.

## 🚀 Key Features

- **Futuristic UI/UX**: Professional Glassmorphism design system using Tailwind CSS and shadcn/ui.
- **Real-Time Dashboards**: Separate, data-rich dashboards for Customers and Mechanics.
- **Secure Authentication**: Implementation of JWT-based authentication with hashed passwords (bcrypt).
- **Interactive Booking**: Multi-step booking flow with emergency options.
- **Service Tracking**: Real-time progress tracking for active services.
- **Centralized API**: Clean data abstraction layer using TanStack Query.
- **Persistent Storage**: Integrated SQLite database with `better-sqlite3`.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **State Management**: TanStack Query, React Context.
- **Backend**: Node.js, Express 5.
- **Database**: SQLite (better-sqlite3).
- **Testing**: Vitest, React Testing Library.

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development
```bash
npm run dev
```
This command starts both the Vite frontend and the Express backend (port 3001) concurrently.

### 3. Run Tests
```bash
npm test
```

## 📂 Project Structure

- `src/`: Frontend React application.
- `server/`: Express.js backend and SQLite database.
- `public/`: Static assets.

## 📝 License
MIT
