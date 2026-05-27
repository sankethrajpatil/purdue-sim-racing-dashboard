'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Awaiting Telemetry Data...</h2>
          <p className="text-slate-400 mb-8">
            Upload Garage61 CSV files from the sidebar to begin analyzing driver performance at Spa-Francorchamps.
          </p>
          <div className="flex justify-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>Peddycord</span>
            <span>•</span>
            <span>Emmett</span>
            <span>•</span>
            <span>Drew</span>
            <span>•</span>
            <span>Jordan</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


