# Oke Mekanik - Technical Documentation (v5.5.0 ULTIMATE+)

## Architecture Overview
Oke Mekanik is a high-fidelity full-stack platform designed for mobile mechanic services. It utilizes a modern stack to provide real-time diagnostic and booking capabilities.

### Tech Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Node.js/Express 5, Socket.io for real-time updates.
- **Database**: SQLite (via `better-sqlite3`) for robust local-first persistence.
- **Security**: Helmet, Express Rate Limit, JWT-based Authentication.

## AI Diagnostic Engine v5.5.0
The core of the platform is the AI Diagnostic Engine, which uses a weighted keyword mapping system tailored for Indonesian technical automotive terms.

### Key Mappings
- **svc-4 (Tune Up)**: Keywords include `brebet`, `pincang`, `ngelitik`, `boros bensin`.
- **svc-7 (Cek Aki)**: Keywords include `aki soak`, `stater berat`, `pagi susah nyala`.
- **svc-5 (Cek Kelistrikan)**: Keywords include `limp mode`, `check engine`, `konslet`.

### Confidence Algorithm
The engine calculates confidence based on keyword weights and provides an exponential bonus for multiple matches, ensuring high accuracy for complex problem descriptions.

## API Specification
All endpoints are prefixed with `/api`.

### Authentication
- `POST /auth/login`: Authenticate user and return JWT.
- `POST /auth/register`: Create a new customer or mechanic account.
- `GET /auth/me`: Retrieve current session user data (Protected).

### Mechanics & Bookings
- `GET /mechanics/nearby`: Search for online mechanics within a radius.
- `POST /bookings`: Create a new service request (Protected).
- `PATCH /bookings/:id/status`: Update booking progress (OTW, Working, Completed).

### AI Diagnosis
- `POST /ai/diagnose`: Submit problem description for automated analysis.

## PWA & Offline Strategy
- **Service Worker**: Implements `Stale-While-Revalidate` for assets and `Network-First` for API calls.
- **Manifest**: Optimized for a native-like mobile experience.

## Quality Standards (Masterpiece v28)
- **Glassmorphism**: Standardized via `.glass-card` utility with `backdrop-blur-[160px]`.
- **Zero-Mock Policy**: All data is served from the SQLite backend; no static JSON files are used in production.
- **Formal Verification**: Automated scripts (`tests/verify_ai_v54.js`) validate the AI engine logic.
