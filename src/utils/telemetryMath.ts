import { TelemetryPoint } from '@/types/telemetry';

/**
 * Calculates the running time delta between a reference lap and a comparison lap.
 * Uses a sliding window approach for O(n) alignment of distance markers.
 */
export function calculateLapDelta(
  referenceLap: TelemetryPoint[],
  comparisonLap: TelemetryPoint[]
): { distance: number; delta: number }[] {
  if (referenceLap.length === 0 || comparisonLap.length === 0) return [];

  const results: { distance: number; delta: number }[] = [];
  let compIdx = 0;

  for (let i = 0; i < referenceLap.length; i++) {
    const refPoint = referenceLap[i];
    
    // Slide comparison index to find the closest distance match
    while (
      compIdx < comparisonLap.length - 1 &&
      Math.abs(comparisonLap[compIdx + 1].distance - refPoint.distance) <
      Math.abs(comparisonLap[compIdx].distance - refPoint.distance)
    ) {
      compIdx++;
    }

    const compPoint = comparisonLap[compIdx];

    // Use provided lapTime if available, otherwise delta is 0 for that point
    // Usually Garage61 provides 'SessionTime' or 'LapTime'
    if (refPoint.lapTime !== undefined && compPoint.lapTime !== undefined) {
      results.push({
        distance: refPoint.distance,
        delta: compPoint.lapTime - refPoint.lapTime
      });
    }
  }

  return results;
}

/**
 * Detects apex speeds (Vmin) by finding local speed minimums after braking events.
 */
export function findVminPoints(
  lap: TelemetryPoint[],
  brakeThreshold = 20, // Minimum brake % to consider a corner entry
  minSpeedRef = 40     // Ignore pit lane or near-stop speeds
): { distance: number; speed: number }[] {
  const vmins: { distance: number; speed: number }[] = [];
  let inBrakingZone = false;

  for (let i = 1; i < lap.length - 1; i++) {
    const prev = lap[i - 1];
    const curr = lap[i];
    const next = lap[i + 1];

    if (curr.brake > brakeThreshold) {
      inBrakingZone = true;
    }

    // Capture local minimum speed if we've seen braking recently
    if (
      inBrakingZone &&
      curr.speed < prev.speed &&
      curr.speed < next.speed &&
      curr.speed > minSpeedRef
    ) {
      vmins.push({
        distance: curr.distance,
        speed: curr.speed
      });
      inBrakingZone = false; // Reset for next corner
    }
  }

  return vmins;
}

/**
 * Task 1: Estimating the G-G Friction Ellipse Area.
 * Uses 90th percentile to ignore outliers and capture the usable grip limit.
 */
export function calculateGG_Area(lap: TelemetryPoint[]): number {
  if (lap.length === 0) return 0;

  const latVals = lap.map(p => Math.abs(p.latAccel)).sort((a, b) => a - b);
  const longVals = lap.map(p => Math.abs(p.longAccel)).sort((a, b) => a - b);

  const p90Idx = Math.floor(lap.length * 0.9);
  
  const a = latVals[p90Idx]; // Major axis (Lateral)
  const b = longVals[p90Idx]; // Minor axis (Longitudinal)

  return Math.PI * a * b;
}

/**
 * Task 1: Steering Smoothness Calculation.
 * Measures average rate of change (derivative) of steering input.
 */
export function calculateSteeringSmoothness(lap: TelemetryPoint[]): number {
  if (lap.length < 2) return 0;

  let totalChange = 0;
  let validPoints = 0;

  for (let i = 1; i < lap.length; i++) {
    const steering = lap[i].steeringAngle ?? 0;
    const prevSteering = lap[i-1].steeringAngle ?? 0;
    
    // We assume data is sampled at constant intervals for dashboard visualization
    totalChange += Math.abs(steering - prevSteering);
    validPoints++;
  }

  return validPoints > 0 ? totalChange / validPoints : 0;
}
