
<!-- CAPSULE-RENDER HEADER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0a1628,50:0d2b4a,100:143d5e&fontColor=3b82f6&descColor=f59e0b&height=220&section=header&text=Oke%20Mekanik&fontSize=65&desc=Mobile%20Mechanic%2C%20Workshop%20%26%20Sparepart%20Marketplace&animation=fadeIn" />

<!-- TYPING SVG -->
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=Mobile+Mechanic+at+Your+Door;Store+Sparepart+Marketplace;Uber%2FGrab-Style+Tracking;PWA+%2B+Capacitor.js+Mobile+Ready;MASTERPIECE+v28.2+ULTIMATE+" alt="Typing SVG" />
  </a>
</div>

<br/>

<!-- BADGES -->
<div align="center">

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor.js-6.x-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## Overview

**Oke Mekanik (Masterpiece v28.2 ULTIMATE+)** is a production-grade, zero-mock full-stack ecosystem for mobile mechanics, workshops, and sparepart stores. Customers can request nearby mechanics, track real-time mechanic arrival (Uber/Grab style), diagnose vehicle issues via AI v7.0.1, and buy spareparts directly from local stores with seller-provided payment methods.

## Core Multi-Role Ecosystem

1. **Pelanggan (Customer)** — Request nearby mechanics, track route in real time, run AI diagnostics, and purchase spareparts from local stores.
2. **Mekanik Keliling (Mechanic)** — Independent mobile mechanics receiving job dispatches and tracking client routes.
3. **Bengkel Resmi (Workshop)** — Brick-and-mortar automotive service workshops managing teams of technicians.
4. **Toko Suku Cadang (Store / Sparepart Seller)** — List spareparts, set stock levels, and attach direct payment options (BCA, Mandiri, BRI, QRIS, GoPay).

## Visual Architecture

### Full Ecosystem & Marketplace Flow

```mermaid
flowchart LR
    subgraph Roles["Multi-Role Onboarding"]
        Customer["Pelanggan"]
        Mechanic["Mekanik Keliling"]
        Workshop["Bengkel Resmi"]
        Store["Toko Sparepart"]
      end

    subgraph Dispatch["Uber/Grab-Style Geo Engine"]
        Customer --> Geo["Haversine Nearby Discovery"]
        Geo --> Route["Socket.io Real-Time Tracking"]
        Route --> Arrival["Job Execution"]
    end

    subgraph StoreMarketplace["Store & Sparepart Marketplace"]
        Store --> Catalog["List Spareparts & Stock"]
        Catalog --> DirectPay["Direct Seller Payment (Bank / QRIS)"]
        DirectPay --> Customer
    end

    style Customer fill:#0a1628,color:#3b82f6
    style Mechanic fill:#143d5e,color:#f59e0b
    style Store fill:#047857,color:#fff
    style DirectPay fill:#059669,color:#fff
```

## PWA & Mobile Readiness (Capacitor.js)

- **PWA Ready**: Web app manifest (`public/manifest.webmanifest`), theme configuration, and Service Worker caching (`public/sw.js`).
- **Capacitor.js Configured**: Native Android/iOS mobile deployment configuration (`capacitor.config.json`).

## Quick Start

### Prerequisites
- Node.js 22.x (LTS)
- npm or bun

### Installation & Database Initialization

```bash
git clone https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service
npm install --legacy-peer-deps
node server/db.js
```

### Running Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## License

**MIT License** — see [LICENSE](./LICENSE) for details.

## Author

**Mulky Malikul Dhaher**
- [GitHub](https://github.com/mulkymalikuldhrs)
- [Email](mailto:mulkymalikuldhr@mail.com)
