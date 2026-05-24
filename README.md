# Oke Mekanik - Masterpiece v28.1 ULTIMATE+ v5.8.2

Oke Mekanik is a comprehensive mobile mechanic platform designed to bring professional vehicle services directly to the customer's location. This version (v28.1 ULTIMATE+) represents the pinnacle of autonomous, production-ready full-stack implementation.

## Features

- **AI Diagnostic Engine v5.8.2**: Automated vehicle problem diagnosis with EV/Hybrid support.
- **Real-time Tracking**: Monitor the mechanic's location as they head towards you via Socket.io.
- **Instant Booking**: Call a mechanic for emergency repairs or schedule routine maintenance.
- **Verified Mechanics**: All mechanics are vetted and rated by the community.
- **In-app Chat**: Seamless real-time communication between customers and mechanics.
- **Secure Payments**: Transparent pricing and digital payment records.
- **Multi-language Support**: Full localization in Bahasa Indonesia and English.

## Tech Stack

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Express 5.2.1, Better-SQLite3, Socket.io.
- **State Management**: TanStack Query v5.100.9 & Context API.
- **Security**: Helmet, Rate Limiting, JWT Authentication, Bcrypt.
- **Testing**: Vitest, React Testing Library, Playwright (E2E).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Install Dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Initialize Database:
   ```bash
   node -e "import('./server/db.js')"
   ```

3. Start Development Environment (Frontend + Backend):
   ```bash
   npm run dev
   ```

### Running Tests

To run the unit and integration tests:
```bash
npm test
```

To run E2E verification (requires Playwright):
```bash
python3 tests/final_verification.py
```

## Project Structure

- `src/`: React frontend application.
- `server/`: Express backend and SQLite database logic.
- `tests/`: E2E and integration verification scripts.
- `public/`: Static assets and PWA manifest.

## License

This project is private and intended for the Oke Mekanik platform. Engineered for Excellence.
