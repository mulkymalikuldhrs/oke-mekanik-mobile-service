<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
# Oke Mekanik - Your On-Demand Mechanic Solution

Oke Mekanik is a web application that connects customers with mechanics for on-demand vehicle repair and maintenance services. It provides a platform for customers to easily book mechanics, track the status of their service requests, and make payments. For mechanics, it offers a way to manage their jobs, communicate with customers, and receive payments.

## Features

- **Customer Dashboard**: View active and past service requests, and manage your profile.
- **Mechanic Dashboard**: View and manage incoming job requests, and track your earnings.
- **Booking System**: Easily book a mechanic by providing your location, vehicle details, and the problem you're facing.
- **Real-Time Tracking**: Track the mechanic's location and the status of your service request in real-time.
- **In-App Chat**: Communicate with your mechanic directly through the app.
- **Secure Payments**: Pay for services securely through the app.
- **Authentication**: Secure login and registration for customers and mechanics.

## Technologies Used

- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **React**: A popular JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **shadcn-ui**: A collection of accessible and customizable UI components.
- **React Query**: A data-fetching library that simplifies the process of fetching, caching, and updating data.
- **React Hook Form**: A library for building performant, flexible, and extensible forms.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Mock Service Worker (MSW)**: An API mocking library for seamless development and testing.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the development server
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

The project is structured as follows:

- `src/components`: Contains reusable UI components.
- `src/hooks`: Contains custom React hooks.
- `src/lib`: Contains utility functions.
- `src/mocks`: Contains the mock API handlers and server setup.
- `src/pages`: Contains the application's pages.
- `public`: Contains static assets, including the MSW service worker.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
# Oke Mekanik

Oke Mekanik is a web platform designed to connect customers with mechanics for vehicle repair and maintenance services. The platform features separate dashboards for customers and mechanics, a booking system, service tracking, a chat feature for communication, and a payment system.

## Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, shadcn-ui
- **State Management:** @tanstack/react-query
- **Routing:** react-router-dom
- **Testing:** Vitest, React Testing Library
- **Mock API:** json-server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lovable-community/oke-mekanik.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd oke-mekanik
    ```

3.  **Install the dependencies:**

    ```bash
    npm install
    ```

### Running the Application

=======
# Oke Mekanik

Oke Mekanik is a web platform designed to connect customers with mechanics for vehicle repair and maintenance services. The platform features separate dashboards for customers and mechanics, a booking system, service tracking, a chat feature for communication, and a payment system.

## Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS, shadcn-ui
- **State Management:** @tanstack/react-query
- **Routing:** react-router-dom
- **Testing:** Vitest, React Testing Library
- **Mock API:** json-server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lovable-community/oke-mekanik.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd oke-mekanik
    ```

3.  **Install the dependencies:**

    ```bash
    npm install
    ```

### Running the Application

>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
To run the application in development mode, which includes the Vite development server for the UI and the `json-server` for the mock API, run the following command:

```bash
npm run dev
```

This will start two servers concurrently:

- The **frontend application** will be available at `http://localhost:5173`.
- The **mock API server** will be running at `http://localhost:3001`.

### Running Tests

To run the test suite, use the following command:

```bash
npm test
```

This will execute the tests using Vitest and provide a report in the console.
<<<<<<< HEAD
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
=======
# Oke Mekanik

Oke Mekanik is a comprehensive mobile mechanic platform designed to bring professional vehicle services directly to the customer's location.

## Features

- **Real-time Tracking**: Monitor the mechanic's location as they head towards you.
- **Instant Booking**: Call a mechanic for emergency repairs or schedule routine maintenance.
- **Verified Mechanics**: All mechanics are vetted and rated by the community.
- **In-app Chat**: Seamless communication between customers and mechanics.
- **Secure Payments**: Transparent pricing and digital payment records.
- **Multi-language Support**: Available in Bahasa Indonesia and English.

## Tech Stack

- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest) & Context API
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm test
   ```

## Project Structure

- `src/components`: Reusable UI components.
- `src/contexts`: React Context providers (Auth, etc.).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and API client.
- `src/pages`: Application pages/routes.
- `src/types`: TypeScript definitions.

## License

This project is private and intended for the Oke Mekanik platform.
>>>>>>> origin/jules-9588893365322302084-daabd2d3
=======
# 🛠️ Oke Mekanik: Masterpiece v28.1 Ultimate v5.8.1+

> **Mekanik dan Bengkel Masa Depan** — An autonomous, high-fidelity, full-stack ecosystem for the next generation of mobile vehicle services.

[![System Status](https://img.shields.io/badge/System-Live-green?style=for-the-badge&logo=statuspage)](http://localhost:3001/api/health)
[![AI Engine](https://img.shields.io/badge/AI_Engine-v5.8.1_ULTIMATE+-blue?style=for-the-badge)](tests/verify_ai_v58.js)
[![UI Standard](https://img.shields.io/badge/UI_Standard-Masterpiece_v28.1-orange?style=for-the-badge)](src/index.css)

Oke Mekanik is not just an app; it is a **Masterpiece v28.1** production-ready ecosystem. Engineered for autonomy and high performance, it merges advanced AI diagnostics with a futuristic Glassmorphism interface and a robust SQLite/Express backend.

---

## 🚀 Vision: Zero-Mock, 100% Real
Unlike standard prototypes, Oke Mekanik follows a strict **Zero-Mock Policy**. Every interaction, from AI diagnostics to real-time tracking, is powered by a live Node.js/Express 5 backend and a persistent SQLite database.

## 🧠 AI Diagnostic Engine v5.8.1 ULTIMATE+
The heart of Oke Mekanik is our proprietary AI engine, calibrated specifically for the Indonesian automotive market.
- **Deep Technical Mapping**: Recognizes complex Indonesian automotive slang and technical terms like *brebet, pincang, ngelitik, ngeden, gluduk, setir narik, asap putih, ngobos, turun mesin,* and *limp mode*.
- **Weighted Confidence Algorithm**: Uses exponential bonus scoring for multi-symptom matches, delivering industry-leading diagnostic accuracy.
- **Urgency Matrix**: Automatically classifies repairs into LOW, MEDIUM, HIGH, or CRITICAL priority based on symptom severity.

## 💎 High-Fidelity UI/UX (Masterpiece v28.1)
- **Glassmorphism Core**: Powered by `.glass-card` utilities with `backdrop-blur-[160px]`.
- **Fluid Motion**: Implemented via Framer Motion 12 for cinematic transitions and feedback.
- **Live System Status**: Real-time heartbeat monitoring directly on the landing page via `/api/health`.
- **PWA Optimized**: Production-ready Service Worker (`sw.js`) with `Stale-While-Revalidate` strategy for extreme offline reliability.

## 🛠️ Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS 3.4, Framer Motion 12 |
| **Backend** | Express 5.2.1, Node.js |
| **Database** | Better-SQLite3 12.9.0 |
| **Real-time** | Socket.io 4.8.3 |
| **Testing** | Playwright, Vitest, Custom AI Verification |

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Launch
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Launch Ecosystem**:
   ```bash
   npm run dev
   ```
   *Starts both React Frontend (8080) and Express Backend (3001) concurrently.*

## 🧪 Verification Suite
Maintain the Masterpiece standard by running our comprehensive test suite:
- **AI Engine Logic**: `node tests/verify_ai_v58.js`
- **Visual E2E Fidelity**: `npx playwright test`
- **Unit & Component**: `npm test`

---

## 📂 Architecture Architecture
- `server/`: Authoritative backend source with SQLite persistence (`db.js`).
- `src/lib/api.ts`: Centralized, Zero-Mock API abstraction.
- `src/hooks/useLanguage.tsx`: Integrated multi-language engine (ID/EN).
- `public/sw.js`: Enterprise-grade PWA Service Worker.

## 📜 License
Private & Confidential. Part of the **Oke Mekanik Autonomous Initiative**.
>>>>>>> jules-1751083910730374172-8e0c37a0
