# Oke Mekanik - Futuristic On-Demand Mechanic Platform

Oke Mekanik is a production-ready, full-stack web application designed to connect customers with professional mechanics for on-demand vehicle repair and maintenance services. The platform features a high-end holographic Glassmorphism UI and a robust Node.js/Express/SQLite backend.

## Core Features

- **Holographic Glassmorphism UI**: A futuristic, high-performance interface with synchronized entrance animations and backdrop-blur effects.
- **AI Smart Diagnostic**: An intelligent engine that analyzes Indonesian problem descriptions (e.g., "mesin pincang", "mati mendadak") to recommend the appropriate service.
- **Real-time Tracking**: Monitor the mechanic's live location and service progress via interactive Leaflet maps and polling synchronization.
- **Integrated Chat**: Seamless communication between customers and mechanics with real-time message polling.
- **Full-stack Architecture**: Real persistent data layer using Express and SQLite, replacing all previous mock-based systems.
- **Multi-language Support**: Fully localized in Bahasa Indonesia and English using a centralized translation hook.
- **Secure Authentication**: JWT-based session management with Bcrypt password hashing and multi-role (Customer/Mechanic) protected routes.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn-ui, Framer Motion, TanStack Query.
- **Backend**: Node.js, Express 5, Better-SQLite3, JSONWebToken, BcryptJS.
- **Testing**: Vitest for unit tests, Playwright for end-to-end (E2E) verification.
- **Maps**: Leaflet with React-Leaflet integration.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lovable-community/oke-mekanik.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development environment:**
    ```bash
    npm run dev
    ```
    This starts both the Vite frontend (port 8080) and the Express backend (port 3001) concurrently.

### Running Tests

- **Unit Tests**: `npm test`
- **E2E Tests**: `npx playwright test`

## Project Structure

- `src/`: Frontend React application.
- `server/`: Express backend and SQLite database logic.
- `tests/`: Playwright end-to-end test specifications.
- `public/`: Static assets and public resources.

## License

Distributed under the MIT License.
