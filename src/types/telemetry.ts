export interface TelemetryPoint {
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  latAccel: number;
  longAccel: number;
  steeringAngle?: number;
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

export interface StintLap {
  lapNumber: number;
  driverName: string;
  lapTime: number;
}

export interface StintData {
  driverName: string;
  laps: StintLap[];
}
