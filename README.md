# Oke Mekanik - Futuristic Masterpiece Full-Stack Mobile Mechanic Platform

Oke Mekanik is a high-intensity, futuristic mobile mechanic platform designed to bring professional vehicle services directly to your location in real-time. This project features a sophisticated full-stack architecture with a React 19 frontend and a Node.js/Express 5 backend, powered by a persistent SQLite database and real-time Socket.io communication.

## ✨ Features (Masterpiece Edition)
- **Holographic Glassmorphism UI:** High-intensity blurs (`backdrop-blur-[40px]`), shimmering animations, and a seamless futuristic design.
- **AI Smart Diagnostic Engine (v2.0):** Weighted keyword analysis for accurate vehicle problem identification and service suggestions.
- **Real-time Bidirectional Tracking:** Powered by Socket.io, see exactly where your mechanic is as they approach.
- **Integrated Chat & Messaging:** Real-time communication between customers and mechanics.
- **Secure JWT Authentication:** Multi-role (Customer & Mechanic) session management with strict Zod validation.
- **Full Booking & Payment Lifecycle:** From initial diagnostic to secure checkout and review system.

## 🛠️ Tech Stack
- **Frontend:** [React 19](https://reactjs.org/), [Vite 5](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion 12](https://www.framer.com/motion/)
- **Backend:** [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **Real-time:** [Socket.io 4](https://socket.io/)
- **Validation:** [Zod 3](https://zod.dev/)
- **State Management:** [React Query 5](https://tanstack.com/query/latest) & Context API
- **Testing:** [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)

## 🚀 Getting Started

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

### Running the Application
To launch both the Vite development server (port 8080) and the Node.js backend (port 3001) concurrently:
```bash
npm run dev
```
The application will be available at `http://localhost:8080`.

### Running Tests
- **Unit Tests:** `npm test`
- **Backend Verification:** `node verify_backend.js`

## 📂 Project Structure
- `src/`: React frontend (Pages, Components, Contexts, Hooks).
- `server/`: Node.js/Express backend and SQLite database logic.
- `public/`: Static assets and public resources.
- `screenshots/`: Visual verification of the futuristic UI.

## 📄 License
This project is private and intended for the Oke Mekanik platform.
