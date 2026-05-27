'use client';

import React from 'react';
import { Upload, Users, Flag, Settings } from 'lucide-react';

export const Sidebar = () => {
  const drivers = [
    { name: 'Peddycord', type: 'Reference Lap', color: 'text-blue-400' },
    { name: 'Emmett', type: 'Driver', color: 'text-orange-400' },
    { name: 'Drew', type: 'Driver', color: 'text-orange-400' },
    { name: 'Jordan', type: 'Driver', color: 'text-orange-400' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="p-6 border-b border-slate-800">
        <button className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200">
          <Upload size={18} />
          Upload CSVs
        </button>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users size={14} />
            Drivers
          </h2>
          <ul className="space-y-2">
            {drivers.map((driver) => (
              <li key={driver.name} className="flex flex-col p-2 hover:bg-slate-800 rounded transition duration-150 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{driver.name}</span>
                  {driver.name === 'Peddycord' && <Flag size={14} className="text-blue-400" />}
                </div>
                <span className={`text-[10px] uppercase font-bold ${driver.color}`}>
                  {driver.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition">
          <Settings size={16} />
          Dashboard Settings
        </button>
      </div>
    </aside>
  );
};
