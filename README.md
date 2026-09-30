
<!-- CAPSULE-RENDER HEADER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=3b82f6&descColor=f59e0b&height=220&section=header&text=Oke%20Mekanik&fontSize=65&desc=Mobile%20Mechanic%20Service&animation=fadeIn" />

<!-- TYPING SVG -->
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=Mobile+Mechanic+at+Your+Door;AI-Powered+Diagnostic+v7.0.1;Book+%2C+Track+%2C+Get+Fixed;MASTERPIECE+v28.2+ULTIMATE+" alt="Typing SVG" />
  </a>
</div>

<br/>

<!-- BADGES -->
<div align="center">

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/oke-mekanik-mobile-service?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/oke-mekanik-mobile-service?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/oke-mekanik-mobile-service?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-7.0.1-blue?style=flat-square)](https://www.npmjs.com/package/oke-mekanik-mobile-service)

<!-- AUTO-PACKAGE-BADGES:END -->

## Overview

**Oke Mekanik (Masterpiece v28.2 ULTIMATE+)** is a production-ready mobile mechanic platform built with React 19, Vite 8, and Express 5. Customers can book mechanics instantly, receive AI-powered vehicle diagnostics (v7.0.1), track mechanic arrival in real-time via GPS, and manage their automotive ecosystem from a futuristic glassmorphism interface.

## Visual Architecture

### Service Booking Flow

```mermaid
flowchart LR
    subgraph Request["Request"]
        A["Open App"] --> B["AI Diagnosis / Select Service"]
        B --> C["Set Location & Vehicle"]
        C --> D["Submit Booking"]
    end

    subgraph Match["Match"]
        D --> E["Auto-Dispatch System"]
        E --> F["Mechanic Accepts Job"]
        F --> G["ETA & Route Calculation"]
    end

    subgraph Track["Track"]
        G --> H["Real-Time GPS (Socket.io)"]
        H --> I["Mechanic En Route"]
        I --> J["Arrival Notification"]
    end

    subgraph Complete["Complete"]
        J --> K["Service Execution"]
        K --> L["Secure Payment"]
        L --> M["Review & Feedback"]
    end

    style A fill:#0a1628,color:#3b82f6
    style F fill:#143d5e,color:#f59e0b
    style H fill:#0d2b4a,color:#3b82f6
    style M fill:#22c55e,color:#fff
```

### AI Diagnostics Pipeline v7.0.1

```mermaid
flowchart TB
    subgraph Input["User Telemetry"]
        Start["Vehicle Data"] --> Symptoms["Natural Language Symptoms"]
        Symptoms --> Context["Environmental Context"]
    end

    subgraph Engine["AI Diagnostic Engine v7.0.1"]
        Context --> Pattern["Pattern Matching"]
        Pattern --> Technical["Technical Boost (+55 pts)"]
        Technical --> Scoring["Confidence Scoring"]
    end

    subgraph Output["Diagnostic Insight"]
        Scoring --> Suggestion["Service Suggestion"]
        Scoring --> Causes["Possible Root Causes"]
        Scoring --> Urgency["Urgency Level"]
    end

    subgraph Finalize["Finalization"]
        Suggestion --> Warning["Preliminary Assessment"]
        Causes --> Warning
        Urgency --> Warning
        Warning --> Mechanic["In-Person Verification"]
    end

    style Start fill:#0a1628,color:#3b82f6
    style Engine fill:#7c3aed,color:#fff
    style Warning fill:#f59e0b,color:#000
    style Mechanic fill:#22c55e,color:#fff
```

### Full Stack Ecosystem

```mermaid
graph TB
    subgraph Frontend["Frontend - Vite 8 + React 19"]
        UI["React 19 SPA"]
        State["TanStack Query v5"]
        FM["Framer Motion 12"]
        Leaflet["React Leaflet 5"]
        PWA["PWA / Glassmorphism UI"]
    end

    subgraph Realtime["Real-Time Layer"]
        SIOClient["Socket.io Client 4"]
        SIOServer["Socket.io Server 4"]
    end

    subgraph Backend["Backend - Express 5"]
        API["Modular REST API"]
        Auth["JWT + Bcrypt Security"]
        Booking["Real-Time Dispatch"]
        Diag["AI Engine v7.0.1"]
    end

    subgraph Data["Persistence Layer"]
        SQLite["SQLite (better-sqlite3)"]
        Users["Users & Profiles"]
        Services["Service Catalog"]
        Logs["Transaction Logs"]
    end

    UI --> State
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
    SQLite --> Logs

    style UI fill:#61DAFB,color:#000
    style SIOServer fill:#010101,color:#fff
    style API fill:#000,color:#fff
    style SQLite fill:#003B57,color:#fff
    style PWA fill:#5A0FC8,color:#fff
```

## Core Features (v7.0.1 ULTIMATE+)

- **AI Diagnostic Engine v7.0.1 ULTIMATE+** — Advanced pattern matching with specialized support for EV/Hybrid systems (`svc-13`) and Engine Overhaul (`svc-9`).
- **Real-Time GPS Ecosystem** — Instant mechanic tracking with smooth marker transitions and live ETA.
- **Zero-Mock Architecture** — Strictly persistent data flowing through Express 5 and SQLite.
- **Bilingual Interface** — Fully localized in Indonesian and English via `useLanguage`.
- **Modern Tech Stack** — Built with the latest React 19, Vite 8, and Framer Motion 12 for extreme performance.

## Quick Start

### Prerequisites
- Node.js 22.x (LTS)
- npm or bun

### Installation

```bash
git clone https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service
npm install --legacy-peer-deps
cp .env.example .env
```

### Running

```bash
npm run dev
```

## Project Structure

```
oke-mekanik/
├── src/
│   ├── pages/            # View components (Index, Dashboard, Booking)
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Global state (Auth, etc.)
│   ├── hooks/            # Custom logic & Localization
│   ├── lib/              # API Gateway & Utilities
│   └── types/            # Centralized TypeScript definitions
├── server/
│   ├── controllers/      # Business Logic
│   ├── routes/           # API Endpoints
│   ├── middleware/       # Security & Error Handling
│   └── db.js             # Database Schema & Seeding
└── tests/                # Verification Suite
```

## Disclaimer

AI diagnostics are preliminary assessments only. Always verify with an in-person mechanic inspection. Oke Mekanik assumes no liability for decisions based solely on AI suggestions.

## License

**MIT License** — see [LICENSE](./LICENSE) for details.

## Author

**Mulky Malikul Dhaher**
- [GitHub](https://github.com/mulkymalikuldhrs)
- [Email](mailto:mulkymalikuldhr@mail.com)

---

<!-- FOOTER BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=3b82f6&descColor=f59e0b&height=120&section=footer&text=&fontSize=0" />
