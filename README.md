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
- `server/okemekanik.db`: SQLite database file.
- `db.json`: Initial seed data (legacy, for reference).

## Backend API Endpoints

### Auth
- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User registration.

### Mechanics
- `GET /api/mechanics`: Get all mechanics.
- `GET /api/mechanics/:id`: Get mechanic details.
- `PATCH /api/mechanics/:id/status`: Update mechanic online status.

### Bookings
- `GET /api/bookings`: Get bookings (filterable by `userId` or `mechanicId`).
- `POST /api/bookings`: Create a new booking.
- `PATCH /api/bookings/:id/status`: Update booking status.

### Messages
- `GET /api/messages?bookingId=ID`: Get messages for a booking.
- `POST /api/messages`: Send a message.

## Quality Assurance

To run tests:
```bash
npm test
```

## License

Distributed under the MIT License.
