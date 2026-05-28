'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Users, Upload, TrendingUp, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DriverStatsChart } from '@/components/dashboard/DriverStatsChart';
import { DriverStatRecord } from '@/types/telemetry';

export default function DriversPage() {
  const [stats, setStats] = useState<DriverStatRecord[]>([]);
  const [driverName, setDriverName] = useState('Andrew');
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Map Garage61 Driver Statistics CSV structure
        const parsedStats: DriverStatRecord[] = results.data
          .map((row: any) => ({
            date: row['Date'] || row['date'],
            iRating: row['iRating'] || row['irating'] || 0,
            safetyRating: row['Safety Rating'] || row['safety_rating'] || 0,
            cleanLapPercentage: row['Clean Lap %'] || row['clean_lap_percent'] || 0,
          }))
          .filter((s: DriverStatRecord) => s.date && s.iRating > 0)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setStats(parsedStats);
        setIsParsing(false);
      },
      error: (err) => {
        console.error('Stats parsing failed', err);
        setIsParsing(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-orange-500" size={20} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance Tracking</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Driver Progression</h1>
            <p className="text-slate-400 mt-2">Analyze career iRating and Safety Rating growth over time.</p>
          </div>

          <div className="flex gap-4">
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Andrew">Andrew</option>
              <option value="Jordan">Jordan</option>
              <option value="Emmett">Emmett</option>
            </select>
            
            <label className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition shadow-lg shadow-orange-900/20">
              <Upload size={18} />
              {isParsing ? 'Processing...' : 'Upload Stats'}
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={isParsing} />
            </label>
          </div>
        </header>

        {stats.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600">
              <Users size={40} />
            </div>
            <div className="max-w-md">
              <h2 className="text-xl font-bold text-white mb-2">No Driver Data Loaded</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upload your 'Driver Statistics' CSV export from Garage61 to visualize your career progression charts.
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 text-left max-w-sm">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-[11px] text-blue-200/70">
                To export: Go to your Garage61 profile, navigate to 'Statistics', and look for the 'Download CSV' button in the progression section.
              </p>
            </div>
          </div>
        ) : (
          <DriverStatsChart data={stats} driverName={driverName} />
        )}
      </div>
    </DashboardLayout>
  );
}