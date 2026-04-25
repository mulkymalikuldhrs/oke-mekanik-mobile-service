# Oke Mekanik - Masterpiece v28 Ultimate

Oke Mekanik is a comprehensive, production-ready mobile mechanic platform designed to bring professional vehicle services directly to the customer's location. This project represents the 'Masterpiece v28' standard, featuring a zero-mock, full-stack architecture with real-time capabilities and AI diagnostics.

## Features

- **AI Smart Diagnostic Engine (v5.4 ULTIMATE)**: Advanced technical analysis to identify vehicle problems based on user symptoms.
- **Real-time Tracking**: Monitor mechanic location and service progress using Socket.io and Leaflet.
- **Full-Stack Ecosystem**: Node.js/Express backend with a persistent SQLite database (Better-SQLite3).
- **Glassmorphism UI**: High-intensity futuristic interface with 160px background blurs and Framer Motion animations.
- **Multi-role Dashboards**: Specialized interfaces for Customers and Mechanics with real-time status synchronization.
- **Secure Architecture**: JWT-based authentication, Zod validation, and security hardening with Helmet and Rate Limiting.
- **Full Localization**: Complete support for Bahasa Indonesia (ID) and English (EN) using a centralized translation hook.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query.
- **Backend**: Node.js, Express 5.2, Socket.io, Zod.
- **Database**: SQLite (better-sqlite3) with performance-optimized indexing.
- **Testing**: Vitest (Unit), Playwright (E2E).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the Integrated Ecosystem**:
   ```bash
   npm run dev
   ```
   This command launches both the Vite frontend (port 8080) and the Express backend (port 3001) concurrently.

3. **Run Tests**:
   - Unit Tests: `npm test`
   - E2E Tests: `npx playwright test`

## Architecture Highlights

- **`server/index.js`**: Centralized Express server with security middleware, Socket.io logic, and AI diagnostic endpoints.
- **`server/db.js`**: Database schema initialization, seeding logic, and performance indexes.
- **`src/lib/api.ts`**: Unified API client using `fetchWithAuth` for all backend communication.
- **`src/hooks/useLanguage.tsx`**: Centralized localization provider.

## License

© 2024 OKE MEKANIK MASTERPIECE v28. ENGINEERED FOR EXCELLENCE.
