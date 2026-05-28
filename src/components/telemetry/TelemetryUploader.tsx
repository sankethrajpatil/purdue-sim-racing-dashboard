'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { LapData, TelemetryPoint } from '@/types/telemetry';

interface TelemetryUploaderProps {
  onUpload: (lap: LapData) => void;
}

export const TelemetryUploader: React.FC<TelemetryUploaderProps> = ({ onUpload }) => {
  const [driverName, setDriverName] = useState('Emmett');
  const [isReference, setIsReference] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const drivers = ['Peddycord', 'Emmett', 'Drew', 'Jordan'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: TelemetryPoint[] = results.data.map((row: any) => ({
          distance: row['Distance'] || row['distance'] || 0,
          speed: row['Speed'] || row['speed'] || 0,
          throttle: row['Throttle'] || row['throttle'] || 0,
          brake: row['Brake'] || row['brake'] || 0,
          latAccel: row['LatAccel'] || row['latAccel'] || 0,
          longAccel: row['LongAccel'] || row['longAccel'] || 0,
          lapTime: row['LapTime'] || row['lapTime'],
        }));

        onUpload({
          driverName,
          isReferenceLap: isReference,
          data: parsedData,
        });
        
        setIsParsing(false);
        // Reset file input
        e.target.value = '';
      },
      error: (error) => {
        console.error('Parsing error:', error);
        setIsParsing(false);
      }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Upload size={18} className="text-orange-500" />
        Ingest Telemetry (.CSV)
      </h3>

      <div className="mb-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <p className="text-sm text-amber-200/80 leading-relaxed">
          <strong>⚠️ Please upload the Lap Telemetry CSV</strong>, not the Driver Statistics file. 
          To get this: Go to your laps on Garage61, click the button to the right of the specific lap, and select 'download csv'.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Driver</label>
          <select 
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {drivers.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-md border border-slate-700">
          <input 
            type="checkbox" 
            id="ref-lap"
            checked={isReference}
            onChange={(e) => setIsReference(e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 text-orange-600 focus:ring-orange-500 bg-slate-700"
          />
          <label htmlFor="ref-lap" className="text-sm font-medium text-slate-200 cursor-pointer">
            Set as Reference (Pole Lap)
          </label>
        </div>

        <label className={`
          relative flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-lg cursor-pointer transition
          ${isParsing ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/30 border-slate-700 hover:border-orange-500/50 hover:bg-slate-800/50'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {isParsing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
                <p className="text-sm text-slate-400">Parsing Telemetry Data...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-3 text-slate-500" />
                <p className="mb-2 text-sm text-slate-300">
                  <span className="font-bold text-orange-500">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">Garage61 CSV Exports only</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange} 
            disabled={isParsing}
          />
        </label>
      </div>
    </div>
  );
};
