# 🛠️ Oke Mekanik - Technical Architecture (v7.0.0 ULTIMATE+)

This document defines the technical standards and architectural patterns for the **Masterpiece v28.1 ULTIMATE+** ecosystem.

## 1. Full-Stack Philosophy
Oke Mekanik operates on a **Zero-Mock Policy**. All data must originate from the authoritative backend. Static JSON files or client-side simulations for API calls are strictly prohibited in the production codebase.

## 2. Backend & Persistence
### Modular Express 5.2.1 Architecture
The backend is built on the latest Express 5 series, featuring a modular architecture for extreme maintainability and scalability.
- **Modular Routing**: Routes are logically separated into `server/routes/` (e.g., `authRoutes.js`, `bookingRoutes.js`, `aiRoutes.js`).
- **Domain Controllers**: Business logic resides in `server/controllers/`, ensuring a clean separation of concerns.
- **Security Middleware**: Implements `helmet`, `express-rate-limit` (100req/15min), and centralized JWT verification in `server/middleware/authMiddleware.js`.
- **Global Error Handling**: A standardized error handler in `server/middleware/errorMiddleware.js` provides consistent JSON responses across all endpoints.

### SQLite (Better-SQLite3)
We use SQLite for its reliability, performance, and "local-first" persistence capabilities.
- **Schema Management**: Managed via `server/db.js`. Includes automated seeding for development environments.
- **Indexes**: Optimized for performance with specific indexes on `users(email)`, `bookings(user_id)`, and `reviews(mechanic_id)`.
- **WAL Mode**: Enabled for high-concurrency read/write operations.

## 3. AI Diagnostic Engine v7.0.0 ULTIMATE+
The AI Engine uses a weighted keyword matching system optimized for the Indonesian automotive context, now featuring specialized categories for futuristic vehicle services.

### Confidence Scoring Algorithm
Confidence is calculated using a base weight sum for keywords, followed by an exponential bonus for multiple symptom matches:
```javascript
let score = baseWeightSum;
if (matches > 1) {
  score += Math.pow(matches, 2);
}
// Technical Term Boosts (+45 points for v7.0.0 ULTIMATE+)
if (technicalTermsFound) score += 45;
```

### Specialized Service Mapping
- **`svc-9` (Overhaul)**: `turun mesin`, `skir klep`, `piston pecah`, `oli campur air`.
- **`svc-13` (EV/Hybrid)**: `baterai hv`, `inverter`, `motor listrik`, `high voltage`.
- **`svc-1` (Oil Change)**: `oli meler`, `oli rembes`, `oil seal`.
- **`svc-4` (Tune Up)**: `brebet`, `pincang`, `ngelitik`, `ngeden`.
- **`svc-5` (Electrical)**: `limp mode`, `check engine`, `korslet`, `ecu`.

## 4. Frontend Standards (Masterpiece v28.1 ULTIMATE+)
### Glassmorphism UI
All primary containers must use the `.glass-card` utility class:
```css
.glass-card {
  @apply bg-black/40 backdrop-blur-[160px] border border-white/10;
}
```
This ensures a consistent, high-fidelity futuristic aesthetic across the platform.

### Real-Time Infrastructure
- **Socket.io**: Used for real-time mechanic location updates and instant messaging.
- **TanStack Query**: Manages server state, caching, and optimistic updates.
- **Language Engine**: `useLanguage.tsx` provides a centralized dictionary for ID/EN localization.

## 5. PWA & Offline Readiness
The `public/sw.js` implements a specialized caching strategy:
- **Static Assets**: `Stale-While-Revalidate` ensures instant load times for the UI shell.
- **API Requests**: `Network-First` ensures data freshness while providing fallback for offline booking viewing.

## 6. Quality & Verification
All changes must pass:
1. **AI Verification**: `node tests/verify_ai_v700.js` (Engine v7.0.0)
2. **Visual Fidelity**: Playwright E2E screenshots.
3. **Build Integrity**: `tsc && vite build`
4. **Zero-Mock Enforcement**: No mock data allowed in production.

---

> **Contact:** Mulky Malikul Dhaher — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
>
> **Disclaimer:** This project is for Education Purpose only. Risiko apapun tidak kita tanggung. (We are not responsible for any risks or damages.)
