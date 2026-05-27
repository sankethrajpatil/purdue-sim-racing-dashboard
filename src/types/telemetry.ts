export interface TelemetryPoint {
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  lapTime?: number;
}

export interface LapData {
  driverName: string;
  isReferenceLap: boolean;
  data: TelemetryPoint[];
}
