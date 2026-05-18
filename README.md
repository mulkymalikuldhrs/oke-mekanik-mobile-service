# Oke Mekanik - Masterpiece v28.1 ULTIMATE+

Oke Mekanik is a comprehensive mobile mechanic platform designed to bring professional vehicle services directly to the customer's location.

## Features

- **Real-time Tracking**: Monitor the mechanic's location via Socket.io.
- **AI Diagnostic Engine**: Advanced technical mapping for precise problem identification.
- **Instant Booking**: Call a mechanic for emergency repairs or schedule routine maintenance.
- **Secure Payments**: Integrated payment tracking and records.
- **Multi-language Support**: Fully localized in Bahasa Indonesia and English.

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Backend**: Node.js, Express, SQLite, Socket.io
- **Styling**: Tailwind CSS + Glassmorphism Layout
- **State Management**: TanStack Query v5
- **Testing**: Vitest + Playwright

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Initialize Database**:
   ```bash
   node -e "import('./server/db.js')"
   ```

3. **Start Development (Frontend & Backend)**:
   ```bash
   # Run both concurrently
   npm run dev
   ```

## Project Structure

- `src/`: React frontend codebase.
- `server/`: Express backend with modular controllers and routes.
- `tests/`: End-to-end and AI verification scripts.

## License

Private - Oke Mekanik Masterpiece Series.
