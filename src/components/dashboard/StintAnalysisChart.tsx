'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { StintData } from '@/types/telemetry';
import { calculateTireDegradation } from '@/utils/telemetryMath';
import { Timer, TrendingUp, Info } from 'lucide-react';

interface StintAnalysisChartProps {
  stints: StintData[];
}

const DRIVER_COLORS: Record<string, string> = {
  Peddycord: '#ef4444', // Red
  Emmett: '#3b82f6',    // Blue
  Drew: '#22c55e',      // Green
  Jordan: '#a855f7',    // Purple
};

export const StintAnalysisChart: React.FC<StintAnalysisChartProps> = ({ stints }) => {
  const chartData = useMemo(() => {
    if (stints.length === 0) return [];

    // Find the longest stint to determine x-axis
    const maxLaps = Math.max(...stints.map(s => s.laps.length));
    const data = [];

    for (let i = 0; i < maxLaps; i++) {
      const entry: any = { lapIndex: i + 1 };
      stints.forEach(stint => {
        const lap = stint.laps[i];
        if (lap) {
          entry[stint.driverName] = lap.lapTime;
        }
      });
      data.push(entry);
    }
    return data;
  }, [stints]);

  const degData = useMemo(() => {
    return stints.map(stint => {
      const lapTimes = stint.laps.map(l => l.lapTime);
      const degradation = calculateTireDegradation(lapTimes);
      return {
        name: stint.driverName,
        degradation: degradation,
      };
    });
  }, [stints]);

  const formatLapTime = (time: number) => {
    if (!time) return '';
    const mins = Math.floor(time / 60);
    const secs = (time % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  if (stints.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
          <Timer size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Stint Data Loaded</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Upload multi-lap race telemetry to analyze long-run pace and tire degradation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task 2: Lap Time vs. Tyre Age */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Timer size={20} className="text-orange-500" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Race Pace (Lap Time vs. Tyre Age)</h3>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 20, right: 20, top: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="lapIndex" 
                stroke="#475569" 
                fontSize={10} 
                label={{ value: 'Lap Number (Tire Age)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                domain={['auto', 'auto']}
                tickFormatter={(val) => val.toFixed(1)}
                label={{ value: 'Lap Time (s)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                formatter={(val: any) => [formatLapTime(val as number), 'Lap Time']}
              />
              <Legend verticalAlign="top" height={36}/>
              {stints.map(s => (
                <Line
                  key={s.driverName}
                  type="monotone"
                  dataKey={s.driverName}
                  stroke={DRIVER_COLORS[s.driverName] || '#94a3b8'}
                  strokeWidth={2}
                  dot={{ r: 4, fill: DRIVER_COLORS[s.driverName] }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task 2: Driver Degradation */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-red-500" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Tire Degradation Rate</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={degData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={10} label={{ value: 'Seconds Lost / Lap', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                  formatter={(val: any) => [`+${(val as number).toFixed(3)}s / lap`, 'Degradation']}
                />
                <Bar dataKey="degradation" name="Degradation" radius={[0, 4, 4, 0]}>
                  {degData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DRIVER_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-center">
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 mb-4">
            <Info className="text-blue-500 mb-2" size={24} />
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Strategy Note</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Degradation is calculated by finding the average lap time increase while excluding outliers like 
              <span className="text-blue-400 font-bold"> in-laps </span> and 
              <span className="text-blue-400 font-bold"> out-laps</span>. A lower value indicates better tire management.
            </p>
          </div>
          <div className="space-y-4">
            {degData.map(d => (
              <div key={d.name} className="flex justify-between items-center">
                <span className="text-xs font-bold" style={{ color: DRIVER_COLORS[d.name] }}>{d.name}</span>
                <span className="text-xs font-mono text-white">+{d.degradation.toFixed(3)}s/lp</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};