# 🛠️ Oke Mekanik - Technical Architecture (v5.8.1 ULTIMATE+)

This document defines the technical standards and architectural patterns for the **Masterpiece v28.1** ecosystem.

## 1. Full-Stack Philosophy
Oke Mekanik operates on a **Zero-Mock Policy**. All data must originate from the authoritative backend. Static JSON files or client-side simulations for API calls are strictly prohibited in the production codebase.

## 2. Backend & Persistence
### Express 5.2.1
The backend is built on the latest Express 5 series, providing a high-performance middleware stack and hardened security.
- **Security**: Implements `helmet` for header security and `express-rate-limit` (100req/15min) for API protection.
- **Error Handling**: Centralized global error handler in `server/index.js` returns standardized JSON responses with error codes and timestamps.

### SQLite (Better-SQLite3)
We use SQLite for its reliability, performance, and "local-first" persistence capabilities.
- **Schema Management**: Managed via `server/db.js`. Includes automated seeding for development environments.
- **Indexes**: Optimized for performance with specific indexes on `users(email)`, `bookings(user_id)`, and `reviews(mechanic_id)`.

## 3. AI Diagnostic Engine v5.8.1 ULTIMATE+
The AI Engine uses a weighted keyword matching system optimized for the Indonesian automotive context.

### Confidence Scoring Algorithm
Confidence is calculated using a base weight sum for keywords, followed by an exponential bonus for multiple symptom matches:
```javascript
let score = baseWeightSum;
if (matches > 1) {
  score += Math.pow(matches, 2);
}
// Add technical term boosts (+30 points for v5.8.1 ULTIMATE+)
if (technicalTermsFound) score += 30;
```

### Technical Keyword Mapping (Hardened v5.8.1)
- **`svc-1` (Ganti Oli)**: `oli meler`, `oli rembes`, `oil seal`, `karter`, `oil filter macet`.
- **`svc-4` (Tune Up)**: `brebet`, `pincang`, `ngelitik`, `ngeden`, `asap putih`, `asap hitam`, `nyendal`, `nyentak`, `boros bensin`, `ngebul`, `ngobos`, `injector`, `bore up`, `overhaul`, `skir klep`, `turun mesin`, `stel klep`, `kompresi rendah`.
- **`svc-5` (Cek Kelistrikan)**: `limp mode`, `check engine`, `konslet`, `ecu`, `wiring`, `sekring putus`, `short circuit`, `grounding`, `sensor tps`, `sensor iat`.
- **`svc-7` (Cek Aki)**: `pagi susah nyala`, `stater berat`, `aki tekor`, `dinamo ampre`, `alternator bench`, `carbon brush habis`, `starter panjang`, `klakson lemah`.
- **`svc-2` (Servis Rutin/Kaki-kaki)**: `gluduk`, `kaki-kaki`, `bunyi kaki-kaki`, `setir narik`, `v-belt`, `cv joint`, `bushing arm`, `link stabilizer`, `rack steer`.

## 4. Frontend Standards (Masterpiece v28.1)
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
1. **AI Verification**: `node tests/verify_ai_v581.js` (Engine v5.8.1)
2. **Visual Fidelity**: Playwright E2E screenshots.
3. **Build Integrity**: `tsc && vite build`
4. **Zero-Mock Enforcement**: No `db.json` files allowed.
5. **Branding Consistency**: All dashboards must display 'v5.8.1 CORE ACTIVE' and 'Masterpiece v28.1'.
