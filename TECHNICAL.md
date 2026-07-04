# 🛠️ Oke Mekanik - Technical Architecture (v7.0.1 ULTIMATE+)

This document defines the technical standards and architectural patterns for the **Masterpiece v28.2** ecosystem.

## 1. Full-Stack Philosophy
Oke Mekanik operates on a **Zero-Mock Policy**. All data must originate from the authoritative backend. Static JSON files or client-side simulations for API calls are strictly prohibited in the production codebase.

## 2. Backend & Persistence
### Modular Express 5 Architecture
The backend is built on Express 5, featuring a modular architecture for maintainability.
- **Modular Routing**: Routes are logically separated into `server/routes/`.
- **Domain Controllers**: Business logic resides in `server/controllers/`.
- **Security Middleware**: Implements `helmet`, `express-rate-limit` (200req/15min), and centralized JWT verification.
- **Global Error Handling**: Standardized error handler provides consistent JSON responses.

### SQLite (Better-SQLite3)
- **Schema Management**: Managed via `server/db.js`.
- **WAL Mode**: Enabled for high-performance concurrent reads.
- **Seeding**: Automated seeding ensures a ready-to-use development environment.

## 3. AI Diagnostic Engine v7.0.1
The AI Engine uses a weighted keyword matching system optimized for the Indonesian automotive context.

### Confidence Scoring Algorithm
Confidence is calculated using a base weight sum for keywords, followed by an exponential bonus for multiple symptom matches:
```javascript
let score = baseWeightSum;
if (matches > 1) {
  score += Math.pow(matches, 2);
}
// Technical Term Boost (+55 points for v7.0.1 ULTIMATE+)
if (technicalTermsFound) score += 55;
```

### Technical Keyword Mapping
- **`svc-9` (Overhaul)**: `turun mesin`, `skir klep`, `metal jalan`, `oli campur air`.
- **`svc-13` (EV/Hybrid)**: `hybrid`, `mobil listrik`, `inverter`, `baterai hv`, `cas`.
- **`svc-5` (Electrical)**: `limp mode`, `check engine`, `korslet`, `ecu`, `short circuit`.
- **`svc-4` (Tune Up)**: `brebet`, `pincang`, `ngelitik`, `ngeden`, `asap putih/hitam`.

## 4. Frontend Standards (Masterpiece v28.2)
### Glassmorphism UI
All primary containers must use the `.glass-card` utility class:
```css
.glass-card {
  @apply bg-black/40 backdrop-blur-[160px] border border-white/10;
}
```

### Stack
- **React 19 + Vite 8**: Cutting-edge performance.
- **Socket.io**: Real-time location updates.
- **TanStack Query v5**: Server state management.
- **Language Engine**: Bilingual ID/EN localization.

## 5. Verification
All changes must pass:
1. **AI Verification**: `node tests/verify_v701.js`
2. **Build Integrity**: `npm run build`
3. **Zero-Mock Enforcement**: No mock JSON files allowed in `src/`.

---

> **Contact:** Mulky Malikul Dhaher — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
