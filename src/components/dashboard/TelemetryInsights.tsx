'use client';

import React, { useMemo } from 'react';
import { LapData } from '@/types/telemetry';
import { findVminPoints, calculateGG_Area, calculateSteeringSmoothness } from '@/utils/telemetryMath';
import { AlertTriangle, TrendingDown, Target, Zap, Activity, CircleDashed } from 'lucide-react';

interface TelemetryInsightsProps {
  laps: LapData[];
  deltaData?: { distance: number; delta: number }[] | null;
}

export const TelemetryInsights: React.FC<TelemetryInsightsProps> = ({ laps, deltaData }) => {
  const refLap = useMemo(() => laps.find(l => l.isReferenceLap), [laps]);
  const compLap = useMemo(() => laps.find(l => !l.isReferenceLap), [laps]);

  const insights = useMemo(() => {
    if (!refLap || !compLap || !deltaData) return null;

    // Metric 1: Total Time Delta
    const finalDelta = deltaData[deltaData.length - 1]?.delta || 0;

    // Task 2: Style Metrics
    const ggArea = calculateGG_Area(compLap.data);
    const steeringSmoothness = calculateSteeringSmoothness(compLap.data);

    // Metric 2: Top 3 Sectors to Improve (steepest positive slope)
    const sectorGains: { start: number; end: number; gain: number }[] = [];
    const windowSize = 50; // Check every 50 meters
    
    for (let i = 0; i < deltaData.length - windowSize; i += 20) {
      const startPoint = deltaData[i];
      const endPoint = deltaData[i + windowSize];
      const gain = endPoint.delta - startPoint.delta;
      
      if (gain > 0) {
        sectorGains.push({
          start: Math.round(startPoint.distance),
          end: Math.round(endPoint.distance),
          gain
        });
      }
    }

    const topSectors = sectorGains
      .sort((a, b) => b.gain - a.gain)
      .filter((v, i, a) => a.findIndex(t => Math.abs(t.start - v.start) < 200) === i) // Deduplicate close sectors
      .slice(0, 3);

    // Metric 3: Vmin Inconsistencies
    const refVmins = findVminPoints(refLap.data);
    const compVmins = findVminPoints(compLap.data);
    
    const vminIssues: { distance: number; refSpeed: number; compSpeed: number; diff: number }[] = [];
    
    compVmins.forEach(cVmin => {
      // Find closest reference Vmin
      const rVmin = refVmins.find(rv => Math.abs(rv.distance - cVmin.distance) < 50);
      if (rVmin && rVmin.speed - cVmin.speed > 3) { // 3km/h threshold
        vminIssues.push({
          distance: Math.round(cVmin.distance),
          refSpeed: rVmin.speed,
          compSpeed: cVmin.speed,
          diff: rVmin.speed - cVmin.speed
        });
      }
    });

    return {
      finalDelta,
      topSectors,
      vminIssues,
      ggArea,
      steeringSmoothness
    };
  }, [refLap, compLap, deltaData]);

  if (!insights) return null;

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Delta Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-red-500/10 p-3 rounded-full text-red-500">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Gap</p>
            <p className="text-2xl font-black text-white">
              {insights.finalDelta > 0 ? '+' : ''}{insights.finalDelta.toFixed(3)}s
            </p>
          </div>
        </div>

        {/* Task 2: G-G Area Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
            <CircleDashed size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">G-G Area</p>
            <p className="text-2xl font-black text-white">
              {insights.ggArea.toFixed(2)} <span className="text-xs font-normal text-slate-500">G²</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Larger area indicates pushing the car closer to its grip limits.</p>
          </div>
        </div>

        {/* Task 2: Steering Smoothness Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-full text-blue-500">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Steering Smoothness</p>
            <p className="text-2xl font-black text-white">
              {insights.steeringSmoothness.toFixed(3)}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Lower values indicate smoother, more professional inputs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sectors to Improve */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-orange-500" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Critical Sectors to Improve</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {insights.topSectors.map((s, i) => (
              <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <p className="text-slate-400 text-[10px] mb-1">{s.start}m — {s.end}m</p>
                <p className="text-red-400 font-bold text-sm">+{s.gain.toFixed(3)}s lost</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vmin Issues */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg col-span-1 md:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-blue-500" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Apex Speed (Vmin) Inconsistencies</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {insights.vminIssues.map((issue, i) => (
              <div key={i} className="flex items-center gap-3 bg-blue-900/10 border border-blue-500/20 px-4 py-2 rounded-full">
                <AlertTriangle size={14} className="text-blue-400" />
                <p className="text-xs text-slate-300">
                  Over-slowing at <span className="font-bold text-white">{issue.distance}m</span>: 
                  <span className="text-blue-400 ml-1">-{issue.diff.toFixed(1)} km/h</span> vs Reference
                </p>
              </div>
            ))}
            {insights.vminIssues.length === 0 && (
              <p className="text-slate-500 text-xs italic">No major apex speed differences detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
