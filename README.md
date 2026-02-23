# 🛠️ OKE MEKANIK - Futuristic Mobile Service Ecosystem

Oke Mekanik is a high-performance, full-stack platform designed to revolutionize how customers connect with professional mechanics. Built with a "Futuristic Glassmorphism" aesthetic and a robust backend architecture, it provides a seamless, real-time experience for vehicle maintenance.

## 🌟 Key Features

- **Futuristic UI**: A unified "Glassmorphism" design system using `backdrop-blur-2xl` and interactive pulsing glows.
- **Real-time Discovery**: Geolocation-based mechanic discovery and real-time service tracking.
- **Secure Ecosystem**: JWT-based authentication and SQLite persistence for reliable data management.
- **Analytics Dashboard**: Dynamic earnings visualization for mechanics using Recharts.
- **Multi-language Support**: Full Indonesian and English localization.
- **Production-Ready**: Sanitized codebase with a comprehensive testing suite (Vitest).

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend**: Node.js, Express 5, Better-SQLite3, JWT, BcryptJS.
- **State Management**: TanStack Query v5, React Context.
- **Testing**: Vitest, React Testing Library.

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or bun

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
To start both the frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001

### Testing
To run the full test suite:
```bash
npm test
```

## 📂 Project Structure

- `server/`: Express backend and SQLite database configuration.
- `src/`: React frontend application.
  - `__tests__/`: Centralized test suite.
  - `components/`: Reusable UI components.
  - `contexts/`: Global state (Auth, etc.).
  - `lib/`: Centralized API client.
  - `pages/`: Main application views.
  - `types/`: Unified TypeScript definitions.

## 🔒 Environment Variables
Create a `.env` file based on `.env.example`:
- `PORT`: Backend port (default: 3001)
- `JWT_SECRET`: Secret for token signing
- `VITE_API_URL`: Frontend API base URL
- `NODE_ENV`: production or development

## 📄 License
MIT
