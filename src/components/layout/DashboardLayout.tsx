'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LapData } from '@/types/telemetry';
import { Menu, X } from 'lucide-react';
import { TelemetryChat } from '../chat/TelemetryChat';

interface DashboardLayoutProps {
  children: React.ReactNode;
  laps?: LapData[];
  onDeleteLap?: (name: string) => void;
  telemetryContext?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  laps = [], 
  onDeleteLap = () => {}, 
  telemetryContext 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle logic */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        <Sidebar laps={laps} onDeleteLap={onDeleteLap} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 relative overflow-hidden">
        <header className="flex items-center gap-4 px-6 md:px-0">
          <button 
            className="md:hidden text-slate-400 hover:text-white p-2 -ml-2 transition"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Header />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
      
      <TelemetryChat telemetryContext={telemetryContext} />
    </div>
  );
};
