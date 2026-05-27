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
 * Formula: Delta(d) = ComparisonTime(d) - ReferenceTime(d)
 * Positive values indicate where the comparison driver is losing time.
 */
export const calculateDelta = (reference: TelemetryRow[], comparison: TelemetryRow[]) => {
  return comparison.map((compRow) => {
    // Find the closest distance marker in the reference lap
    // This is a simplified linear search; for production, we'd use binary search or interpolation.
    const refRow = reference.reduce((prev, curr) => 
      Math.abs(curr.distance - compRow.distance) < Math.abs(prev.distance - compRow.distance) ? curr : prev
    );

    return {
      distance: compRow.distance,
      delta: compRow.lapTime - refRow.lapTime,
    };
  });
};

/**
 * Identifies the Minimum Speed (Vmin) for major corners.
 * This looks for local minima in the speed curve.
 */
export const findVmin = (data: TelemetryRow[]) => {
  const result: { corner: string; distance: number; vmin: number }[] = [];
  // Logic to detect dips in speed below a certain threshold followed by acceleration
  // This is a placeholder for specific Spa corner distance markers
  const spaCorners = [
    { name: 'La Source', start: 200, end: 600 },
    { name: 'Eau Rouge', start: 800, end: 1200 },
    { name: 'Les Combes', start: 2000, end: 2400 },
  ];

  spaCorners.forEach(corner => {
    const sectorData = data.filter(d => d.distance >= corner.start && d.distance <= corner.end);
    if (sectorData.length > 0) {
      const minSpeed = Math.min(...sectorData.map(d => d.speed));
      const minRow = sectorData.find(d => d.speed === minSpeed);
      result.push({ corner: corner.name, distance: minRow?.distance || 0, vmin: minSpeed });
    }
  });
  return result;
};

/**
 * Detects instances of "Micro-braking" or overlapping throttle and brake.
 */
export const detectHabits = (data: TelemetryRow[]) => {
  const overlapping = data.filter(d => d.throttle > 5 && d.brake > 5);
  return {
    overlapCount: overlapping.length,
    overlapPercentage: (overlapping.length / data.length) * 100,
  };
};
