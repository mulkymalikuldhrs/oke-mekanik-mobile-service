<!-- BANNER -->
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
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/oke-mekanik-mobile-service?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/oke-mekanik-mobile-service?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/oke-mekanik-mobile-service?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-7.0.0-blue?style=flat-square)](https://www.npmjs.com/package/oke-mekanik-mobile-service)

<!-- AUTO-PACKAGE-BADGES:END -->

## Overview

**Oke Mekanik** is a mobile mechanic service platform built with React 19 and Vite 8. Customers can book mechanics to come to their location, receive AI-powered preliminary vehicle diagnostics (v7.0.1), track mechanic arrival in real-time, and manage service history — all from a modern web interface.

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
│   ├── pages/            # View pages
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Contexts (Auth, etc.)
│   ├── hooks/            # Custom hooks (Localization, etc.)
│   ├── lib/              # API clients and utilities
│   └── types/            # TypeScript definitions
├── server/               # Express Backend v7.0.1
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   └── middleware/       # Security & Auth
└── tests/                # Quality verification suite
```

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
