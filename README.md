# Oke Mekanik - Futuristic On-Demand Mechanic Platform

Oke Mekanik is a production-ready web platform that connects customers with professional mechanics for on-demand vehicle repair and maintenance services. This project features a full-stack architecture with a real Express/SQLite backend and a futuristic React frontend.

## Features

- **Futuristic UI/UX**: Sleek glassmorphism design with smooth animations.
- **Customer Dashboard**: Manage vehicle profiles, book mechanics, and track service history.
- **Mechanic Dashboard**: Handle job requests, track earnings, and manage availability.
- **Real-Time Simulation**: Track mechanic location and chat in real-time (via polling).
- **Secure Authentication**: Multi-role authentication system for customers and mechanics.
- **Service & Payments**: Transparent pricing and integrated payment records.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn-ui.
- **Backend**: Node.js, Express, SQLite (better-sqlite3).
- **State Management**: TanStack Query (React Query).
- **Routing**: React Router 7.
- **Testing**: Vitest, React Testing Library.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Running

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

## Project Structure

- `src/`: React frontend source code.
- `server/`: Express backend and SQLite database logic.
- `db.json`: Initial seed data (for reference).

## Quality Assurance

To run tests:
```bash
npm test
```

## License

Distributed under the MIT License.
