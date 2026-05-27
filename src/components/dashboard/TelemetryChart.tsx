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

interface TelemetryChartProps {
  data: any[];
  dataKey: string;
  name: string;
  color: string;
  unit?: string;
  syncId?: string;
}


export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  dataKey,
  name,
  color,
  unit,
  syncId,
}) => {
  return (
    <div className="h-64 w-full bg-slate-900 p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-white text-sm font-semibold mb-2">{name}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId={syncId}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="distance" 
            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
            stroke="#94a3b8"
          />
          <YAxis 
            label={{ value: unit, angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
            stroke="#94a3b8"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
