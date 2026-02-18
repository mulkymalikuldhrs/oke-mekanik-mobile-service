# Oke Mekanik - Futuristic On-Demand Mechanic Platform

Oke Mekanik is a professional, production-ready web platform that connects customers with expert mechanics for on-demand vehicle repair and maintenance.

## 🚀 Key Features

- **Futuristic Glassmorphism UI**: High-end aesthetic with smooth animations and responsive design.
- **Real-Time Service Tracking**: Monitor your mechanic's progress from booking to completion.
- **Secure JWT Authentication**: Robust security with hashed passwords and token-based sessions.
- **Interactive Chat**: Built-in messaging system for seamless communication.
- **Multi-Role Dashboards**: Specialized interfaces for both Customers and Mechanics.
- **Persistent Storage**: Real SQLite database for reliable data management.
- **Internationalization**: Full support for Bahasa Indonesia and English.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn-ui.
- **Backend**: Node.js, Express, better-sqlite3.
- **State Management**: TanStack Query (React Query).
- **Security**: JWT (jsonwebtoken), bcryptjs.
- **Testing**: Vitest, React Testing Library.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start both the frontend and backend concurrently with a single command:
```bash
npm run dev
```
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

## 🧪 Quality Assurance

We maintain high standards through automated testing:
```bash
npm test
```

## 📂 Project Structure

- `src/`: React application (Components, Pages, Hooks, Contexts).
- `server/`: Node.js/Express backend and database initialization.
- `public/`: Static assets.

## 📄 License

Distributed under the MIT License.
