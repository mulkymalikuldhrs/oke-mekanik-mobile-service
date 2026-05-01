# Oke Mekanik - Masterpiece v28 Ultimate v5.4.1

Oke Mekanik is a comprehensive, production-ready mobile mechanic platform designed to bring professional vehicle services directly to the customer's location with AI-powered diagnostics.

## Features
- **AI Diagnostic Engine v5.4.1 ULTIMATE+**: Advanced troubleshooting using Indonesian technical automotive terms.
- **Real-time Tracking**: Monitor mechanic location via Socket.io and Leaflet maps.
- **High-Fidelity UI**: Futuristic Glassmorphism design with `backdrop-blur-[160px]` and Framer Motion 12.
- **Full-Stack Ecosystem**: Node.js/Express backend with SQLite persistence.
- **PWA Ready**: Offline support and home screen installation.

## Tech Stack
- **Framework**: React 19, Vite
- **Backend**: Express 5.2.1, Better-SQLite3 12.9.0
- **Real-time**: Socket.io 4.8.3
- **Styling**: Tailwind CSS, Framer Motion 12
- **State Management**: TanStack Query (v5), Context API
- **Verification**: Playwright, Vitest

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the full-stack development environment (Frontend + Backend):
   ```bash
   npm run dev
   ```

### Running Tests
- **Integration & AI**: `node tests/verify_ai_v54.js`
- **Visual E2E**: `npx playwright test`

## Project Structure
- `server/`: Express backend and SQLite database logic.
- `src/components/`: Reusable UI components.
- `src/lib/api.ts`: Centralized API client (Zero-Mock).
- `src/pages/`: Application routes and views.
- `tests/`: Automated verification scripts.

## License
Private - Oke Mekanik Autonomous Initiative.
