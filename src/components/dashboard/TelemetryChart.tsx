'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import { LapData } from '@/types/telemetry';

interface TelemetryChartProps {
  laps: LapData[];
  deltaData?: { distance: number; delta: number }[] | null;
}

const DRIVER_COLORS: Record<string, string> = {
  Peddycord: '#ef4444', // Red
  Emmett: '#3b82f6',    // Blue
  Drew: '#22c55e',      // Green
  Jordan: '#a855f7',    // Purple
};

const CustomTooltip = ({ active, payload, label, laps }: any) => {
  if (active && payload && payload.length) {
    const distance = Math.round(label);
    const refLap = laps.find((l: any) => l.isReferenceLap);
    const compLap = laps.find((l: any) => !l.isReferenceLap);

    return (
      <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-lg shadow-2xl backdrop-blur-sm">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Distance: {distance}m</p>
        <div className="grid grid-cols-2 gap-4">
          {[refLap, compLap].filter(Boolean).map((lap) => {
            const prefix = lap.isReferenceLap ? 'Ref: ' : 'Comp: ';
            const color = DRIVER_COLORS[lap.driverName] || '#94a3b8';
            
            const speed = payload.find((p: any) => p.dataKey === `speed_${lap.driverName}`)?.value;
            const throttle = payload.find((p: any) => p.dataKey === `throttle_${lap.driverName}`)?.value;
            const brake = payload.find((p: any) => p.dataKey === `brake_${lap.driverName}`)?.value;

            return (
              <div key={lap.driverName} className="space-y-1">
                <p className="text-xs font-bold" style={{ color }}>{prefix}{lap.driverName}</p>
                <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-x-2">
                  <span className="text-slate-500">Speed:</span><span className="font-mono text-right">{speed?.toFixed(1) || '0.0'}</span>
                  <span className="text-slate-500">Throt:</span><span className="font-mono text-right">{throttle?.toFixed(0) || '0'}%</span>
                  <span className="text-slate-500">Brake:</span><span className="font-mono text-right">{brake?.toFixed(0) || '0'}%</span>
                </div>
              </div>
            );
          })}
        </div>
        {payload.find((p: any) => p.dataKey === 'deltaValue') && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
              Time Delta: {payload.find((p: any) => p.dataKey === 'deltaValue')?.value.toFixed(3)}s
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ laps, deltaData }) => {
  // Task 3: Data Transformation for Recharts
  const chartData = useMemo(() => {
    if (laps.length === 0) return [];

    const masterLap = laps.find(l => l.isReferenceLap) || laps[0];
    
    return masterLap.data.map((point, index) => {
      const distance = Math.round(point.distance);
      const entry: any = { distance };

      laps.forEach(lap => {
        const lapPoint = lap.data[index] || lap.data[lap.data.length - 1];
        entry[`speed_${lap.driverName}`] = lapPoint.speed;
        entry[`throttle_${lap.driverName}`] = lapPoint.throttle;
        entry[`brake_${lap.driverName}`] = lapPoint.brake;
      });

      if (deltaData) {
        const d = deltaData[index] || deltaData[deltaData.length - 1];
        entry.deltaValue = d ? d.delta : 0;
      }

      return entry;
    });
  }, [laps, deltaData]);

  const renderLines = (dataKeyPrefix: string) => {
    return laps.map((lap) => (
      <Line
        key={`${dataKeyPrefix}_${lap.driverName}`}
        type="monotone"
        dataKey={`${dataKeyPrefix}_${lap.driverName}`}
        name={lap.driverName}
        stroke={DRIVER_COLORS[lap.driverName] || '#94a3b8'}
        dot={false}
        isAnimationActive={false} // Performance: Turn off animations
        strokeWidth={lap.isReferenceLap ? 2.5 : 1.5}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl shadow-xl">
      {/* Task 4: Speed Chart */}
      <div className="h-[200px] md:h-64 w-full">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Speed (km/h)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} syncId="telemetrySync" margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="distance" hide />
            <YAxis stroke="#475569" fontSize={10} unit="km/h" domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip laps={laps} />} />
            <Legend verticalAlign="top" height={36}/>
            {renderLines('speed')}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Throttle Chart */}
      <div className="h-[150px] md:h-48 w-full">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Throttle (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} syncId="telemetrySync" margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="distance" hide />
            <YAxis stroke="#475569" fontSize={10} domain={[0, 105]} />
            <Tooltip content={<CustomTooltip laps={laps} />} />
            {renderLines('throttle')}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Brake Chart */}
      <div className="h-[150px] md:h-48 w-full">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Brake (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} syncId="telemetrySync" margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="distance" hide />
            <YAxis stroke="#475569" fontSize={10} domain={[0, 105]} />
            <Tooltip content={<CustomTooltip laps={laps} />} />
            {renderLines('brake')}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task 1: Delta Chart */}
      <div className="h-[150px] md:h-48 w-full">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Time Delta (s)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} syncId="telemetrySync" margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="distance" 
              stroke="#475569" 
              fontSize={10} 
              tickFormatter={(val) => `${val}m`}
            />
            <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip laps={laps} />} />
            <Line 
              type="monotone" 
              dataKey="deltaValue" 
              stroke="#ef4444" 
              dot={false} 
              strokeWidth={2}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task 1: G-G Friction Ellipse (Traction Circle) */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl shadow-xl mt-4">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          G-G Diagram (Traction Circle)
          <span className="text-[10px] lowercase font-normal text-slate-500">(Lat G vs Long G)</span>
        </h3>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Lateral G" 
                unit="G" 
                stroke="#475569" 
                fontSize={10}
                domain={[-2.5, 2.5]}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Longitudinal G" 
                unit="G" 
                stroke="#475569" 
                fontSize={10}
                domain={[-3.5, 3.5]}
              />
              <ZAxis type="number" range={[10, 10]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Legend verticalAlign="top" height={36}/>
              {laps.map((lap) => (
                <Scatter
                  key={`gg_${lap.driverName}`}
                  name={lap.driverName}
                  data={lap.data
                    .filter((_, i) => i % 10 === 0)
                    .map(p => ({ x: p.latAccel, y: p.longAccel }))
                  }
                  fill={DRIVER_COLORS[lap.driverName] || '#94a3b8'}
                  isAnimationActive={false}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-500 italic mt-2 text-center">
          Performance Note: Visualizing 10% sample of telemetry points to maintain UI responsiveness.
        </p>
      </div>
    </div>
  );
};


