<img src="docs/banner.png" width="100%">

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

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## Overview

**Oke Mekanik** is a mobile mechanic service platform built with Next.js. Customers can book mechanics to come to their location, receive AI-powered preliminary vehicle diagnostics, track mechanic arrival in real-time, and manage service history — all from a modern web interface.

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
        Prompt --> LLM["LLM Analysis Engine"]
        LLM --> Parse["Parse Response"]
    end

    subgraph Diagnosis["Preliminary Diagnosis"]
        Parse --> Causes["Possible Causes"]
        Parse --> Severity["Severity Assessment"]
        Parse --> Estimate["Estimated Repair Scope"]
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
        Diag["AI Diagnostics"]
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

> **Published**: This package is published to npm as `oke-mekanik-mobile-service` v7.0.0. The AI diagnostics feature provides preliminary assessments only — always verify with an in-person mechanic inspection.

---

## Features

- **Service Booking** — Schedule mobile mechanic visits with location, vehicle info, and issue description
- **AI Preliminary Diagnostics** — Describe your vehicle symptoms and get AI-generated possible causes and estimated repair scope
- **Real-Time Tracking** — Track your mechanic's arrival in real-time
- **Service History** — Complete record of past services, repairs, and costs
- **Mechanic Dashboard** — Job management, navigation, and customer communication
- **Payment Integration** — Secure in-app payments and invoicing

## Honest Notes

- **AI Diagnostics Are Preliminary** — The AI diagnostic feature provides initial assessments based on symptom descriptions. It is **not** a substitute for a professional mechanic's in-person inspection. Always rely on the mechanic's physical diagnosis for repair decisions.
- **Service Area** — Availability depends on mechanic coverage in your area.

## Quick Start

### Prerequisites
- Node.js 18+
- LLM API key for AI diagnostic features
- Map/GPS API key for tracking

### Installation

```bash
git clone https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service
npm install
cp .env.example .env
```

### Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPS_API_KEY=your_key
OPENAI_API_KEY=your_key
DATABASE_URL=your_database_url
```

### Running

```bash
npm run dev
```

## Project Structure

```
oke-mekanik-mobile-service/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/
│   │   ├── booking/      # Service booking UI
│   │   ├── diagnostics/  # AI diagnostic interface
│   │   ├── tracking/     # Real-time tracking
│   │   └── dashboard/    # Mechanic dashboard
│   ├── lib/
│   │   ├── ai/           # AI diagnostic engine
│   │   ├── booking/      # Booking logic
│   │   ├── tracking/     # GPS tracking
│   │   └── payments/     # Payment integration
│   └── types/            # TypeScript definitions
└── public/               # Static assets
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Improvements to the AI diagnostic engine, booking flow, and real-time tracking are especially welcome.

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
