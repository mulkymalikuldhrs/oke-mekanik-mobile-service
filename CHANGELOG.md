# Changelog

All notable changes to this project will be documented in this file.

## [7.0.0] - 2026-06-06

### Added
- **AI Diagnostic Engine v7.0.0 ULTIMATE+**: Complete overhaul of the AI diagnostic system.
- **Specialized Service Support**: Dedicated support for Overhaul (`svc-9`) and EV/Hybrid (`svc-13`) diagnostics.
- **New Technical Boosts**: Increased accuracy for technical keywords with a +45 point technical boost.
- **Elon Mekanik**: Added specialized EV/Hybrid mechanic to the seed data.
- **Database WAL Mode**: Enabled Write-Ahead Logging for better concurrent performance.

### Changed
- **Branding Upgrade**: Project-wide synchronization to **Masterpiece v28.1 ULTIMATE+**.
- **Public AI API**: The `/api/ai/diagnose` endpoint is now public to enhance initial user experience.
- **Architecture Documentation**: Updated `TECHNICAL.md` and `AGENTS.md` to reflect v7.0.0 standards.
- **Clean Backend**: Removed all TypeScript-style definitions and types from backend JavaScript files for native Node.js ESM compliance.

### Fixed
- **Middleware Syntax Errors**: Resolved `SyntaxError` caused by `import type` in backend middleware.
- **Seed Data Integrity**: Re-synchronized database seed with current service IDs and categories.

## [6.1.0] - 2024-05-20

### Added
- Integrated Glassmorphism UI across all dashboards.
- Added localization for English and Indonesian.
- Implemented real-time tracking via Socket.io.

## [5.8.1] - 2024-03-15

### Added
- Initial AI Diagnostic Engine implementation.
- Basic booking flow and mechanic registration.
