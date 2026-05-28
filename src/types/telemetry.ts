export interface TelemetryPoint {
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  latAccel: number;
  longAccel: number;
  lapTime?: number;
}

export interface LapData {
  driverName: string;
  isReferenceLap: boolean;
  data: TelemetryPoint[];
}

export interface DriverStatRecord {
  date: string;
  iRating: number;
  safetyRating: number;
  cleanLapPercentage: number;
}
