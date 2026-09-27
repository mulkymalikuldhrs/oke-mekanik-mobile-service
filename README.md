<!-- CAPSULE-RENDER HEADER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=3b82f6&descColor=f59e0b&height=220&section=header&text=Oke%20Mekanik&fontSize=65&desc=Mobile%20Mechanic%20Service&animation=fadeIn" />

<!-- TYPING SVG -->
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=Mobile+Mechanic+at+Your+Door;AI-Powered+Preliminary+Diagnostics;Book+%2C+Track+%2C+Get+Fixed;AI+Diagnostics+Are+Preliminary+Only" alt="Typing SVG" />
  </a>
</div>

<br/>

<!-- BADGES -->
<div align="center">

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express 5](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/oke-mekanik-mobile-service?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/oke-mekanik-mobile-service?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/oke-mekanik-mobile-service?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-7.0.1-blue?style=flat-square)](https://www.npmjs.com/package/oke-mekanik-mobile-service)

<!-- AUTO-PACKAGE-BADGES:END -->

## Overview

**Oke Mekanik (v7.0.1 Masterpiece v28.2 ULTIMATE+)** is a futuristic mobile mechanic service platform built with React 19, Vite 8, and Express 5. Customers can book mechanics to come directly to their location, receive AI-powered preliminary vehicle diagnostics, track mechanic arrival in real-time, and manage service history — all from a high-fidelity glassmorphism web interface.

## Visual Architecture

### Service Booking Flow

```mermaid
flowchart LR
    subgraph Request["Request"]
        A["Open App"] --> B["Describe Vehicle Issue"]
        B --> C["Set Location"]
        C --> D["Submit Request"]
    end

    subgraph Match["Match"]
        D --> E["Find Nearby Mechanics"]
        E --> F["Mechanic Accepts"]
        F --> G["ETA Calculated"]
    end

    subgraph Track["Track"]
        G --> H["Live GPS Tracking"]
        H --> I["Mechanic En Route"]
        I --> J["Mechanic Arrives"]
    end

    subgraph Complete["Complete"]
        J --> K["Service Performed"]
        K --> L["Payment Processed"]
        L --> M["Rate and Review"]
    end

    style A fill:#0a1628,color:#3b82f6
    style F fill:#143d5e,color:#f59e0b
    style H fill:#0d2b4a,color:#3b82f6
    style M fill:#22c55e,color:#fff
```

### AI Diagnostics Pipeline

```mermaid
flowchart TB
    subgraph Input["User Input"]
        Start["Select Vehicle Make and Model"] --> Symptoms["Describe Symptoms"]
        Symptoms --> Context["Add Context: Mileage, Year, Recent Work"]
    end

    subgraph LLMProc["LLM Processing"]
        Context --> Prompt["Construct Diagnostic Prompt"]
        Prompt --> LLM["AI Diagnostic Engine v7.0.1"]
        LLM --> Parse["Parse Weighted Symptom Scores"]
    end

    subgraph Diagnosis["Preliminary Diagnosis"]
        Parse --> Causes["Possible Causes"]
        Parse --> Severity["Severity & Urgency Assessment"]
        Parse --> Estimate["Estimated Service Category"]
    end

    subgraph Disclaimer["Disclaimer"]
        Causes --> Warning["Preliminary Only"]
        Severity --> Warning
        Estimate --> Warning
        Warning --> Mechanic["Verify with Mechanic In-Person"]
    end

    style Start fill:#0a1628,color:#3b82f6
    style LLM fill:#7c3aed,color:#fff
    style Warning fill:#f59e0b,color:#000
    style Mechanic fill:#22c55e,color:#fff
```

### Real-Time GPS Tracking

```mermaid
sequenceDiagram
    participant C as Customer App
    participant S as Socket.io Server
    participant M as Mechanic App
    participant L as Leaflet Map

    M->>S: Update GPS coordinates
    S->>C: Broadcast mechanic location
    C->>L: Update marker on map
    L-->>C: Render updated position

    loop Every 2-3 seconds
        M->>S: GPS ping
        S->>C: Location update
        C->>L: Smooth marker transition
    end

    M->>S: Status: Arrived
    S->>C: Mechanic on-site notification
    C->>L: Center map on destination
```

### Full Stack Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend - Vite React SPA"]
        UI["React 19 + TypeScript"]
        Router["React Router DOM"]
        Shadcn["shadcn/ui + Radix"]
        FM["Framer Motion"]
        Leaflet["React Leaflet Maps"]
        PWA["PWA + Glassmorphism UI"]
    end

    subgraph Realtime["Real-Time Layer"]
        SIOClient["Socket.io Client"]
        SIOServer["Socket.io Server"]
    end

    subgraph Backend["Backend - Express 5"]
        API["REST API Routes"]
        Auth["JWT Authentication"]
        Booking["Booking Engine"]
        Diag["AI Diagnostics v7.0.1"]
    end

    subgraph Data["Data Layer"]
        SQLite["SQLite - better-sqlite3"]
        Users["Users Table"]
        Services["Services Table"]
    end

    UI --> Router
    UI --> Shadcn
    UI --> FM
    UI --> Leaflet
    UI --> PWA
    UI --> SIOClient
    SIOClient --> SIOServer
    SIOServer --> API
    API --> Auth
    API --> Booking
    API --> Diag
    API --> SQLite
    SQLite --> Users
    SQLite --> Services

    style UI fill:#61DAFB,color:#000
    style SIOServer fill:#010101,color:#fff
    style API fill:#000,color:#fff
    style SQLite fill:#003B57,color:#fff
    style PWA fill:#5A0FC8,color:#fff
```

> **Published**: This package is published as `oke-mekanik-mobile-service` v7.0.1. The AI diagnostics feature provides preliminary assessments only — always verify with an in-person mechanic inspection.

---

## Features

- **Service Booking** — Schedule mobile mechanic visits with location, vehicle info, and issue description
- **AI Preliminary Diagnostics v7.0.1** — Advanced symptom weighting and technical boost scoring (+55 points) including EV/Hybrid support and Overhaul detection
- **Real-Time Tracking** — Track your mechanic's arrival in real-time via Socket.io and Leaflet
- **Service History & Review System** — Complete record of past services with localized rating and review feedback
- **Mechanic Dashboard** — Real-time job management, navigation, and customer communication
- **Payment Integration** — In-app invoice tracking and instant status updates

## Quick Start

### Prerequisites
- Node.js 18+
- SQLite3 runtime

### Installation

```bash
git clone https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service
npm install --legacy-peer-deps
cp .env.example .env
```

### Running Development Server

```bash
npm run dev
```

### Running Backend Server Only

```bash
npm run backend
```

### Running Vitest Suite

```bash
npm test -- --run
```

## Project Structure

```
oke-mekanik-mobile-service/
├── server/               # Express 5 Modular Backend & SQLite DB
│   ├── controllers/      # Business logic controllers
│   ├── middleware/       # Auth & error handling middleware
│   ├── routes/           # REST API routes
│   └── db.js             # SQLite database schema & seeding
├── src/
│   ├── components/       # Reusable React components & UI primitives
│   ├── contexts/         # React Contexts (Auth)
│   ├── hooks/            # Custom hooks (useLanguage)
│   ├── lib/              # Centralized API gateway & utility functions
│   ├── pages/            # Application views (Customer, Mechanic, Admin)
│   └── types/            # TypeScript definitions
├── tests/                # E2E and verification scripts
└── public/               # Static PWA assets & manifest
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Disclaimer

AI-generated diagnostics are preliminary suggestions only and should not be used as the sole basis for repair decisions. Always have a qualified mechanic perform an in-person inspection. The authors assume no liability for repair decisions made based on AI diagnostics.

## License

**MIT License** — see [LICENSE](./LICENSE) for details.

## Author

<div align="center">

**Mulky Malikul Dhaher**

[![GitHub](https://img.shields.io/badge/GitHub-mulkymalikuldhrs-181717?style=flat-square&logo=github)](https://github.com/mulkymalikuldhrs)
[![Email](https://img.shields.io/badge/Email-mulkymalikudhr@mail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:mulkymalikudhr@mail.com)

</div>

---

<!-- FOOTER BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=3b82f6&descColor=f59e0b&height=120&section=footer&text=&fontSize=0" />
