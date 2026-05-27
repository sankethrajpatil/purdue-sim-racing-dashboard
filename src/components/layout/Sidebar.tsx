'use client';

import React from 'react';
import { Users, Settings, X } from 'lucide-react';
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
      <div className="p-4 border-b border-slate-800 flex justify-between items-center md:hidden">
        <span className="font-bold text-orange-500 text-sm">Dashboard Menu</span>
        <button onClick={onClose} className="text-slate-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <DriverList laps={laps} onDelete={onDeleteLap} />
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition">
          <Settings size={16} />
          Dashboard Settings
        </button>
      </div>
    </aside>
  );
};
