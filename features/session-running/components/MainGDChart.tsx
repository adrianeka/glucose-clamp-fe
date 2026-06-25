"use client";

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceLine,
} from "recharts";

// Data Dummy
const dummyGDData = [
  { time: "07:00", glucose: 86, rate: 1.0 },
  { time: "07:30", glucose: 81, rate: 0.8 },
  { time: "08:00", glucose: 105, rate: 3.8 },
  { time: "08:30", glucose: 92, rate: 2.2 },
  { time: "09:00", glucose: 88, rate: 1.8 },
  { time: "09:30", glucose: 79, rate: 1.5 },
  { time: "10:00", glucose: 84, rate: 2.1 },
];

// Perbaikan Typing pada Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg bg-[#4B5563] px-3 py-2 text-xs text-white shadow-lg border-none">
      <p className="font-semibold mb-1 border-b border-gray-500 pb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold text-white">{entry.value}</span> 
          {entry.name === "Glucose" ? " mg/dL" : ""}
        </p>
      ))}
    </div>
  );
};

export default function MainGDChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E4E6] p-5 shadow-sm w-full min-w-0 overflow-hidden">
      <h3 className="mb-5 text-sm font-bold text-[#595F6A] uppercase tracking-wide">
        GD Chart (Glucose & Rate)
      </h3>

      <div className="w-full min-w-0">
        <ResponsiveContainer
            width="100%"
            height={250}
            debounce={100}
        >
            <ComposedChart
                data={dummyGDData}
                margin={{
                    top: 10,
                    right: 0,
                    left: 10,
                    bottom: 10,
                }}
            >
            <CartesianGrid stroke="#E8EDF2" strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 11 }}
              dy={10}
            />

            {/* Sumbu Y Kiri untuk Glucose */}
            <YAxis
              yAxisId="left"
              domain={[60, 120]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 11 }}
            />

            {/* Sumbu Y Kanan untuk Rate */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 11 }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Garis Target Min & Max */}
            <ReferenceLine yAxisId="left" y={90} stroke="#FF7F7F" strokeDasharray="3 3" />
            <ReferenceLine yAxisId="left" y={102} stroke="#FF7F7F" strokeDasharray="3 3" />

            {/* Area untuk Infusion Rate */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              name="Infusion Rate"
              stroke="#7BC67E"
              fill="#7BC67E"
              fillOpacity={0.1}
              strokeWidth={2}
            />

            {/* Line untuk Glucose */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="glucose"
              name="Glucose"
              stroke="#8B8AEF"
              strokeWidth={3}
              dot={{ r: 4, fill: "#FFFFFF", stroke: "#8B8AEF", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Manual */}
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '24px' }}>
    
        {/* Item 1: Glucose */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <div 
            style={{ 
                width: '20px', 
                height: '10px', 
                backgroundColor: '#8B8AEF', 
                borderRadius: '2px',
                marginRight: '8px' // Jarak kotak ke teks
            }} 
            />
            <span style={{ fontSize: '11px', color: '#707784', fontWeight: '500' }}>Glucose</span>
        </div>

        {/* Item 2: Target Min & Max (Dashed) */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <div 
            style={{ 
                width: '20px', 
                height: '10px', 
                border: '1px dashed #FF7F7F',
                borderRadius: '2px',
                marginRight: '8px' // Jarak kotak ke teks
            }} 
            />
            <span style={{ fontSize: '11px', color: '#707784', fontWeight: '500' }}>Target Min & Max</span>
        </div>

        {/* Item 3: Target Min & Max (Fill) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
            style={{ 
                width: '20px', 
                height: '10px', 
                backgroundColor: 'rgba(255, 127, 127, 0.3)',
                borderRadius: '2px',
                marginRight: '8px' // Jarak kotak ke teks
            }} 
            />
            <span style={{ fontSize: '11px', color: '#707784', fontWeight: '500' }}>Target Min & Max</span>
        </div>

    </div>
    </div>
  );
}