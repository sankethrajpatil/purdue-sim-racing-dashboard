# Dashboard Architecture

## Project Context & Mission
You are an expert full-stack developer and sim racing data engineer building a telemetry dashboard for the Purdue Sim Racing Club. The primary goal of this application is to help team drivers (Emmett, Drew, Jordan) analyze their laps against a reference fast lap (Peddycord) to find missing time. Currently, the focus is on a Baseline VRS Corvette Setup for Spa-Francorchamps in the IMSA Open series. The project must be highly maintainable, heavily documented, and modular so future club members can easily take over the codebase.

## Hosting & Infrastructure
- **Target Host**: Vercel (Serverless architecture).
- **Frontend Tech Stack**: Next.js (React), Tailwind CSS for styling, and Recharts or Chart.js for data visualization.
- **Backend/Data Processing**: Python (via Vercel Serverless Functions) using pandas and numpy to crunch the telemetry math, or client-side JavaScript using PapaParse to read the CSVs if we want to keep it strictly front-end.

## Source Files & Data Format
- **Input Data**: Raw telemetry data exported strictly as .CSV files from Garage61.
- **Available Drivers**: Emmett, Peddycord, Drew, and Jordan.

## Guardrails & Limitations (DO NOT HALLUCINATE)
- **NO BINARY PARSING**: Do NOT write code utilizing itelem, pyirsdk, or .ibt binary parsing libraries. We have completely bypassed binary telemetry files and are exclusively ingesting Garage61 .CSV files.
- **VERCEL COMPATIBILITY**: Stick to stateless serverless functions and React components.
- **DATA SIZES**: Ensure parsing logic utilizes efficient memory management or down-samples the data points.

## Core Telemetry Analysis Rules & Features
### The Lap Time Delta Calculation:
1. Set the fastest driver (Peddycord) as the "Pole Lap" or reference point at 0.
2. Subtract the comparison laps (Emmett, Drew, Jordan) from the Pole Lap at each distance marker.
3. Plot this Lap Time Delta against track distance (position). Positive values indicate where the comparison driver is losing time.

### Telemetry Overlay Charts:
- Create a synchronized subplot view showing Speed (km/h) vs. Distance, Throttle % vs. Distance, and Brake % vs. Distance.
- Calculate exact time lost in sectors where speed drops significantly below the reference.

### Driver Habit Identifiers:
- **Micro-braking release delays**: Detect and flag overlapping throttle and brake.
- **Vmin Inconsistencies**: Automatically identify Mid-corner minimum speed (Vmin).
- **Momentum Drops**: Compare sector momentum against theoretical optimal.

## Code Generation Directives
- **X-axis**: Always "Track Distance" for synchronization.
- **Documentation**: Write inline documentation for all math formulas.
- **UI/UX**: Highlight "Top 3 Corners to Improve" based on time delta loss.
