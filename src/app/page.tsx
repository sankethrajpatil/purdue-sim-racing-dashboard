'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TelemetryChart } from '@/components/dashboard/TelemetryChart';
import { TelemetryInsights } from '@/components/dashboard/TelemetryInsights';
import { TelemetryUploader } from '@/components/telemetry/TelemetryUploader';
import { StintAnalysisChart } from '@/components/dashboard/StintAnalysisChart';
import { Activity, LayoutDashboard, Timer } from 'lucide-react';
import { calculateLapDelta, findVminPoints, calculateGG_Area, calculateSteeringSmoothness } from '@/utils/telemetryMath';
import { LapData, TelemetryPoint, DriverStatRecord, StintData } from '@/types/telemetry';

// Simple standalone Delta Chart component since we need multiple charts
const DeltaChart = ({ data, name }: { data: any[], name: string }) => (
  <div className="w-full h-48 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg mb-6">
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 px-8">{name}</h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} syncId="telemetrySync">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="distance" hide />
        <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
        />
        <Line 
          type="monotone" 
          dataKey="delta" 
          stroke="#ef4444" 
          dot={false} 
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [laps, setLaps] = useState<LapData[]>([]);
  const [driverStats, setDriverStats] = useState<Record<string, DriverStatRecord[]>>({});
  const [view, setView] = useState<'telemetry' | 'stint'>('telemetry');

  // Sample Stint Data for demonstration if none uploaded
  const stintData: StintData[] = useMemo(() => [
    {
      driverName: 'Peddycord',
      laps: [
        { lapNumber: 1, driverName: 'Peddycord', lapTime: 138.452 },
        { lapNumber: 2, driverName: 'Peddycord', lapTime: 138.567 },
        { lapNumber: 3, driverName: 'Peddycord', lapTime: 138.642 },
        { lapNumber: 4, driverName: 'Peddycord', lapTime: 138.812 },
        { lapNumber: 5, driverName: 'Peddycord', lapTime: 138.923 },
        { lapNumber: 6, driverName: 'Peddycord', lapTime: 139.145 },
        { lapNumber: 7, driverName: 'Peddycord', lapTime: 139.345 },
        { lapNumber: 8, driverName: 'Peddycord', lapTime: 139.512 },
      ]
    },
    {
      driverName: 'Emmett',
      laps: [
        { lapNumber: 1, driverName: 'Emmett', lapTime: 139.123 },
        { lapNumber: 2, driverName: 'Emmett', lapTime: 139.045 },
        { lapNumber: 3, driverName: 'Emmett', lapTime: 139.156 },
        { lapNumber: 4, driverName: 'Emmett', lapTime: 139.212 },
        { lapNumber: 5, driverName: 'Emmett', lapTime: 139.367 },
        { lapNumber: 6, driverName: 'Emmett', lapTime: 139.423 },
        { lapNumber: 7, driverName: 'Emmett', lapTime: 139.556 },
        { lapNumber: 8, driverName: 'Emmett', lapTime: 139.712 },
      ]
    }
  ], []);

  const handleUpload = (newLap: LapData) => {
    setLaps(prev => {
      // If new lap is reference, unmark existing reference
      const updatedLaps = newLap.isReferenceLap 
        ? prev.map(l => ({ ...l, isReferenceLap: false }))
        : prev;
      
      // Filter out existing lap for same driver name to avoid duplicates
      return [...updatedLaps.filter(l => l.driverName !== newLap.driverName), newLap];
    });
  };

  const deleteLap = (driverName: string) => {
    setLaps(prev => prev.filter(l => l.driverName !== driverName));
  };

  const referenceLap = useMemo(() => laps.find(l => l.isReferenceLap), [laps]);
  const comparisonLap = useMemo(() => laps.find(l => !l.isReferenceLap), [laps]);

  const deltaData = useMemo(() => {
    if (referenceLap && comparisonLap) {
      return calculateLapDelta(referenceLap.data, comparisonLap.data);
    }
    return null;
  }, [referenceLap, comparisonLap]);

  const stats = useMemo(() => {
    if (!comparisonLap) return null;
    return {
      vmins: findVminPoints(comparisonLap.data)
    };
  }, [comparisonLap]);

  const telemetryContext = useMemo(() => {
    if (!referenceLap || !comparisonLap || !deltaData) return 'No telemetry data uploaded.';
    const finalDelta = deltaData[deltaData.length - 1]?.delta || 0;
    
    // Task 3: Calculate Style Metrics for AI context
    const ggArea = calculateGG_Area(comparisonLap.data);
    const smoothness = calculateSteeringSmoothness(comparisonLap.data);
    
    let context = `${comparisonLap.driverName} is currently ${Math.abs(finalDelta).toFixed(3)}s ${finalDelta > 0 ? 'slower' : 'faster'} than ${referenceLap.driverName}. 
    Reference driver: ${referenceLap.driverName}, Comparison driver: ${comparisonLap.driverName}. 
    Style Metrics for ${comparisonLap.driverName}: G-G Area: ${ggArea.toFixed(2)} G², Steering Smoothness: ${smoothness.toFixed(3)}.
    Data includes Speed, Throttle, and Brake inputs across the entire lap.`;

    // Add Driver progression data if available
    const compStats = driverStats[comparisonLap.driverName];
    if (compStats && compStats.length > 0) {
      const latest = compStats[compStats.length - 1];
      const previous = compStats.length > 1 ? compStats[compStats.length - 2] : null;
      const trend = previous ? (latest.iRating >= previous.iRating ? 'increased' : 'decreased') : 'is stable';
      
      context += `\nDriver Progression: ${comparisonLap.driverName} currently has an iRating of ${latest.iRating} and a Safety Rating of ${latest.safetyRating.toFixed(2)}. Over their last recorded sessions, their iRating has ${trend}.`;
    }

    return context;
  }, [referenceLap, comparisonLap, deltaData, driverStats]);

  return (
    <DashboardLayout laps={laps} onDeleteLap={deleteLap} telemetryContext={telemetryContext}>
      {/* View Toggle */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit mb-8">
        <button 
          onClick={() => setView('telemetry')}
          className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${view === 'telemetry' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard size={16} />
          Telemetry View
        </button>
        <button 
          onClick={() => setView('stint')}
          className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${view === 'stint' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <Timer size={16} />
          Stint Analysis
        </button>
      </div>

      {view === 'telemetry' ? (
        laps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md shadow-2xl">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Awaiting Telemetry Data...</h2>
              <p className="text-slate-400 mb-8">
                Upload Garage61 CSV files to begin analyzing driver performance at Spa-Francorchamps.
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <TelemetryUploader onUpload={handleUpload} />
            </div>
          </div>
        ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {laps.length < 2 && (
                <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg flex items-center gap-3 text-blue-200 text-sm">
                  <Activity size={18} />
                  <span>Upload a second lap (and mark one as reference) to see the time delta comparison.</span>
                </div>
              )}

              {laps.length > 0 && (
                <>
                  <TelemetryInsights laps={laps} deltaData={deltaData} />
                  <TelemetryChart laps={laps} deltaData={deltaData} />
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <TelemetryUploader onUpload={handleUpload} />

              {stats && (
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-orange-500 font-bold uppercase text-xs tracking-widest mb-4">Performance Insights</h3>
                  <div className="space-y-4">
                    <div className="pt-2">
                      <div className="text-slate-400 text-xs mb-2">Corner Vmin Map</div>
                      <div className="space-y-2">
                        {stats.vmins.map((v, idx) => (
                          <div key={`${v.distance}-${idx}`} className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                            <span className="text-sm">@{v.distance.toFixed(0)}m</span>
                            <span className="text-sm font-mono text-blue-400">{v.speed.toFixed(1)} km/h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )) : (
        <StintAnalysisChart stints={stintData} />
      )}
    </DashboardLayout>
  );
}




