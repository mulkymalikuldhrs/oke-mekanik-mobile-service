# 🏗️ Oke Mekanik Architecture (v7.0.1)

## System Overview
Oke Mekanik is a decentralized mobile mechanic ecosystem designed for high-availability and real-time response.

## Core Layers

### 1. Presentation Layer (Vite 8 + React 19)
- **SPA Architecture**: Optimized for mobile viewports.
- **Atomic Components**: Using shadcn/ui and Radix primitives.
- **Framer Motion**: Smooth interactive state transitions.

### 2. Communication Layer (Socket.io)
- **Real-time GPS**: Continuous coordinate broadcasting between mechanics and customers.
- **Chat System**: Low-latency binary protocol for instant communication.

### 3. Logic Layer (Express 5)
- **Modular Controllers**: Decoupled business logic for AI, Bookings, Payments, Sparepart Stores, and Products.
- **AI Diagnostic Engine**: Proprietary pattern-matching algorithm for automotive triage.
- **Marketplace Engine**: Haversine distance calculations and direct seller payment routing.

### 4. Data Layer (SQLite + WAL)
- **Persistent Storage**: Write-Ahead Logging for high-concurrency performance.
- **Relational Schema**: Optimized with indexes for geolocation, store management, product inventory, seller payment methods, and status queries.
- **PWA & Mobile Native**: Service worker caching and Capacitor.js mobile runtime configuration.

## Branding standards
- **Target**: Masterpiece v28.2 ULTIMATE+
- **Palette**: Deep Navy (#0a1628), Electric Blue (#3b82f6), Amber (#f59e0b).
- **Style**: Futuristic Glassmorphism.
