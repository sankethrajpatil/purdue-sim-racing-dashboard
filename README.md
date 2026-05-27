# Purdue Sim Racing Telemetry Dashboard

A Next.js-based telemetry analysis tool for the Purdue Sim Racing Club.

## Features
- **Telemetry Charts**: Synchronized Speed, Throttle, and Brake overlays against Track Distance.
- **Lap Time Delta**: Real-time delta comparison against a reference lap (Peddycord).
- **Improvement Areas**: Automated identification of time-loss sectors.
- **Serverless API**: Next.js API routes ready for complex telemetry math.

## Tech Stack
- **Frontend**: Next.js 16, Tailwind CSS, Recharts, PapaParse.
- **Backend**: Vercel Serverless Functions.
- **Data**: CSV exports from Garage61.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure
- `src/app/`: Next.js App Router pages.
- `src/components/dashboard/`: Recharts visualization components.
- `utils/`: Telemetry parsing and math logic.
- `data/telemetry/`: Place raw `.csv` telemetry files here.
- `docs/`: Project documentation and architecture rules.

## Analysis Rules
See [rules/dashboard_architecture.md](rules/dashboard_architecture.md) for detailed telemetry calculation rules and physics-based habit identification logic.

