'use client';

import React from 'react';
import { LayoutDashboard, Map } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-white">
      <div className="flex items-center gap-4">
        <LayoutDashboard className="text-orange-500" />
        <h1 className="text-xl font-bold tracking-tight">
          Purdue Sim Racing Telemetry
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          <Map size={16} className="text-blue-400" />
          <span className="text-xs font-semibold">Spa-Francorchamps</span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Vehicle: <span className="text-slate-200">VRS Corvette C8.R</span>
        </div>
      </div>
    </header>
  );
};
