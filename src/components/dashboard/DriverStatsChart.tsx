'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DriverStatRecord } from '@/types/telemetry';

interface DriverStatsChartProps {
  data: DriverStatRecord[];
  driverName: string;
}

export const DriverStatsChart: React.FC<DriverStatsChartProps> = ({ data, driverName }) => {
  if (data.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            iRating Progression
            <span className="text-xs font-normal text-slate-500">({driverName})</span>
          </h3>
          <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-orange-500 text-xs font-bold font-mono">
              Current: {data[data.length - 1].iRating}
            </span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Line 
                type="monotone" 
                dataKey="iRating" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            Safety Rating Progression
            <span className="text-xs font-normal text-slate-500">({driverName})</span>
          </h3>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-500 text-xs font-bold font-mono">
              Current: {data[data.length - 1].safetyRating.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="safetyRating" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};