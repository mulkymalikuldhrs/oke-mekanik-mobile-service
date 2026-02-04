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
