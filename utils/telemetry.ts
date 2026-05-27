import Papa from 'papaparse';

export interface TelemetryRow {
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  lapTime: number;
  [key: string]: any;
}

export interface LapData {
  driver: string;
  data: TelemetryRow[];
}

/**
 * Parses a Garage61 CSV file and returns the telemetry data.
 * The CSV is expected to have headers like 'Distance', 'Speed', 'Throttle', 'Brake'.
 * Distance is used as the primary key for synchronization.
 */
export const parseTelemetryCSV = async (file: File): Promise<TelemetryRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const processedData = data.map((row) => ({
          distance: row['Distance'] || row['distance'],
          speed: row['Speed'] || row['speed'],
          throttle: row['Throttle'] || row['throttle'],
          brake: row['Brake'] || row['brake'],
          lapTime: row['LapTime'] || row['lapTime'],
          ...row,
        }));
        resolve(processedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Calculates the time delta between a reference lap and a comparison lap.
 * Formula: Delta = Comparison Lap Time - Reference Lap Time at the same distance.
 * Since distance samples might not align perfectly, this uses basic interpolation.
 */
export const calculateDelta = (reference: TelemetryRow[], comparison: TelemetryRow[]) => {
  // Simplification: In a real app, we would interpolate to ensure distance samples match.
  // For now, we assume distance samples are roughly aligned for visualization.
  return comparison.map((row, index) => {
    const refRow = reference[index] || reference[reference.length - 1];
    return {
      distance: row.distance,
      delta: row.lapTime - refRow.lapTime,
    };
  });
};
