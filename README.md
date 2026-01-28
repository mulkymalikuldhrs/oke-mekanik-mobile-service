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
