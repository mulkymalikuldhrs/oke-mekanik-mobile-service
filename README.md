# Oke Mekanik - Masterpiece v27 Full-Stack Ecosystem

Oke Mekanik is a revolutionary, production-ready mobile mechanic platform that connects customers with professional mechanics in real-time. This project has been elevated to **Masterpiece v27** status, featuring a high-intensity futuristic UI, a robust Node.js/Express backend with SQLite, and an advanced AI-powered diagnostic engine.

## 🚀 Key Features

- **AI Smart Diagnostic v4.0**: Advanced weighted analysis for pinpointing vehicle issues based on user descriptions.
- **Real-Time Tracking**: Live mechanic location updates via Socket.io during the service journey.
- **Glassmorphism UI**: High-intensity aesthetic using `backdrop-blur-[40px]`, holographic glow effects, and Framer Motion animations.
- **Multi-Role Dashboards**: Specialized interfaces for Customers and Mechanics with real-time status synchronization.
- **Localized Experience**: Full internationalization (Bahasa Indonesia & English) using the `useLanguage` hook.
- **Secure Architecture**: JWT-hardened API, Zod-validated schemas, and `better-sqlite3` for high-performance persistence.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query.
- **Backend**: Node.js, Express 5.2, Socket.io, JWT, bcryptjs, Zod.
- **Database**: SQLite (`better-sqlite3`).
- **Testing**: Vitest (Unit), Playwright (E2E).

## 🚦 Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (Frontend + Backend):
   ```bash
   npm run dev
   ```

## 🧪 Testing and Verification

### Unit Tests
Run the comprehensive suite of 22+ unit tests:
```bash
npm test
```

### Integration & E2E Verification
Verify the full-stack ecosystem and AI engine:
```bash
node tests/integration_verify.js
# and for E2E:
npx playwright test tests/visual_verify.spec.ts
```

## 📜 License

Private and proprietary. Engineered for excellence.
