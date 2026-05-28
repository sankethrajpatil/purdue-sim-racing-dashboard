'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Settings, X, LayoutDashboard, TrendingUp } from 'lucide-react';
import { DriverList } from '../telemetry/DriverList';
import { LapData } from '@/types/telemetry';

interface SidebarProps {
  laps: LapData[];
  onDeleteLap: (name: string) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ laps, onDeleteLap, onClose }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
          PURDUE<span className="text-orange-600">SIM</span>
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition border border-transparent hover:border-slate-700/50"
        >
          <LayoutDashboard size={18} className="text-orange-500" />
          <span className="text-sm font-medium">Telemetry</span>
        </Link>
        <Link 
          href="/drivers" 
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition border border-transparent hover:border-slate-700/50"
        >
          <TrendingUp size={18} className="text-orange-500" />
          <span className="text-sm font-medium">Driver Progress</span>
        </Link>
      </nav>

      <div className="flex-1 p-4 overflow-y-auto border-t border-slate-800/50">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Comparison</p>
        </div>
        <DriverList laps={laps} onDelete={onDeleteLap} />
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition w-full px-4">
          <Settings size={16} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
