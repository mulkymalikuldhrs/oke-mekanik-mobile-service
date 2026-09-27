# 🛠️ Oke Mekanik - Technical Architecture (v7.0.1 Masterpiece v28.2 ULTIMATE+)

This document defines the technical standards and architectural patterns for the **Masterpiece v28.2 ULTIMATE+** ecosystem.

## 1. Full-Stack Philosophy
Oke Mekanik operates on a strict **Zero-Mock Policy**. All data must originate from the authoritative Express/SQLite backend. Static JSON files or client-side mock simulations for API calls are strictly prohibited in production.

## 2. Backend & Persistence
### Modular Express 5.2.1 Architecture
The backend is built on Express 5, featuring a modular CJS/ESM architecture for maintainability and direct execution performance.
- **Modular Routing**: Routes are logically separated into `server/routes/` (e.g., `authRoutes.js`, `bookingRoutes.js`, `aiRoutes.js`).
- **Domain Controllers**: Pure JavaScript business logic resides in `server/controllers/`.
- **Security Middleware**: Implements `helmet`, `express-rate-limit` (200req/15min), and centralized JWT verification in `server/middleware/authMiddleware.js`.
- **Global Error Handling**: Standardized error handler in `server/middleware/errorMiddleware.js` providing consistent JSON error responses across all endpoints.

### SQLite (Better-SQLite3)
We use SQLite (`server/okemekanik.db`) for its reliability, performance, and local persistence capabilities.
- **Schema Management**: Managed via `server/db.js`. Includes automated seeding for users, workshops, mechanics (including EV specialist 'Elon Mekanik'), and services (`svc-1` through `svc-13`).
- **Indexes**: Optimized with indexes on `users(email)`, `bookings(user_id)`, `reviews(mechanic_id)`, and `mechanics(is_online)`.

## 3. AI Diagnostic Engine v7.0.1
The AI Engine uses a weighted symptom matching system optimized for Indonesian automotive context.

### Confidence Scoring Algorithm
Confidence is calculated using a base weight sum for keywords, followed by an exponential bonus for multiple symptom matches and specialized technical boost scoring (+55 points):
```javascript
let score = baseWeightSum;
if (matches > 1) {
  score += Math.pow(matches, 2);
}
// Add technical term boosts (+55 points for v7.0.1)
if (technicalTermsFound) score += 55;
```

### Technical Keyword Mapping
- **`svc-1` (Oil Change)**: `oli meler`, `oli rembes`, `oil seal`, `karter`.
- **`svc-4` (Tune Up)**: `brebet`, `pincang`, `ngelitik`, `ngeden`, `asap putih/hitam`, `ngobos`, `injector`, `bore up`.
- **`svc-5` (Electrical)**: `limp mode`, `check engine`, `korslet`, `ecu`, `sekring putus`, `short circuit`, `grounding`.
- **`svc-2` (Routine/Suspension)**: `gluduk`, `kaki-kaki`, `setir narik`, `v-belt`, `cv joint`, `bushing arm`.
- **`svc-9` (Overhaul)**: `ganti seher`, `turun setengah`, `ngebul parah`, `suara kasar logam`, `macet total`, `overhaul`, `turun mesin`.
- **`svc-13` (EV/Hybrid)**: `tesla`, `ioniq`, `wuling ev`, `port cas`, `kabel orange`, `high voltage`, `bms`, `inverter`.

## 4. Frontend Standards (Masterpiece v28.2)
### Glassmorphism UI
All primary UI containers leverage glassmorphism utilities with Tailwind CSS and Framer Motion transitions.

### Real-Time Infrastructure
- **Socket.io**: Real-time location tracking and messaging between customers and mechanics.
- **TanStack Query**: Client-side server state management and query caching.
- **Language Engine**: `useLanguage.tsx` centralized context for Indonesian and English localization.

## 5. Quality & Verification
All changes must pass:
1. **AI & Integration Verification**: `node tests/verify_v701.js` (Engine v7.0.1)
2. **Unit Test Suite**: `npm test -- --run` (100% pass rate across 11 test files)
3. **Build Integrity**: `npm run build` (`tsc && vite build`)
4. **Zero-Mock Enforcement**: Complete integration with `server/okemekanik.db`.

---

> **Contact:** Mulky Malikul Dhaher — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
>
> **Disclaimer:** Educational Purpose Only.
