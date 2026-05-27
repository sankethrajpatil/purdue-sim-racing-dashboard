'use client';

import React from 'react';
import { Flag, User, Trash2 } from 'lucide-react';
import { LapData } from '@/types/telemetry';

interface DriverListProps {
  laps: LapData[];
  onDelete?: (driverName: string) => void;
}

export const DriverList: React.FC<DriverListProps> = ({ laps, onDelete }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <User size={14} />
        Active Laps
      </h2>
      
      {laps.length === 0 ? (
        <div className="text-sm text-slate-600 italic p-2 border border-dashed border-slate-800 rounded-md text-center">
          No laps loaded
        </div>
      ) : (
        <ul className="space-y-2">
          {laps.map((lap) => (
            <li 
              key={lap.driverName} 
              className={`
                group relative flex items-center justify-between p-3 rounded-lg border transition
                ${lap.isReferenceLap 
                  ? 'bg-blue-500/10 border-blue-500/30' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'}
              `}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${lap.isReferenceLap ? 'text-blue-400' : 'text-white'}`}>
                    {lap.driverName}
                  </span>
                  {lap.isReferenceLap && (
                    <span className="flex items-center gap-1 bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      <Flag size={10} />
                      Ref
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {lap.data.length.toLocaleString()} data points
                </span>
              </div>

              {onDelete && (
                <button 
                  onClick={() => onDelete(lap.driverName)}
                  className="text-slate-600 hover:text-red-400 transition"
                  title="Remove Lap"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {laps.some(l => l.isReferenceLap) && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-[11px] text-blue-400 leading-snug italic">
            <strong>Note:</strong> All comparison deltas are calculated against 
            {laps.find(l => l.isReferenceLap)?.driverName}.
          </p>
        </div>
      )}
    </div>
  );
};
