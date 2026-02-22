# Oke Mekanik - AI Agent Guidelines

## Project Vision
Oke Mekanik is a 100% real, production-ready mobile mechanic platform. No mocks, no simulations.

## Architecture
- **Maps**: Uses Leaflet for real-time tracking.
- **Geolocation**: Uses browser Geolocation API.
- **Analytics**: Calculated dynamically from the `bookings` table.
- **Persistence**: SQLite database in `server/okemekanik.db`.

## Procedures
1. **Adding Endpoints**: Ensure they are added to `server/index.js` and protected with `verifyToken` if necessary.
2. **Data Fetching**: Use `src/lib/api.ts` and TanStack Query.
3. **Styling**: Maintain the futuristic Glassmorphism theme (`bg-white/5`, `backdrop-blur-xl`).

## Removal of Mocks
- All `db.json` files have been removed.
- Hardcoded analytics and timeouts have been replaced with real logic.
- "Fake Map" placeholders have been replaced with Leaflet components.
