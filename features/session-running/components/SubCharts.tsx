"use client";

import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

const dummyPKData = [
  { time: "07:00", value: 85 },
  { time: "08:00", value: 75 },
  { time: "09:00", value: 78 },
  { time: "10:00", value: 84 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg bg-[#4B5563] px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>Value: {payload[0]?.value}</p>
    </div>
  );
}

export default function SubCharts() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-2 gap-2 min-w-0">
      {/* PK Chart */}
      <div className="bg-white rounded-xl border border-[#E2E4E6] p-5 shadow-sm min-w-0 overflow-hidden">
        <h3 className="mb-4 text-sm font-bold text-[#595F6A] uppercase tracking-wide">
          PK Chart (mg/L)
        </h3>

        <ResponsiveContainer
          width="100%"
          height={180}
          debounce={100}
        >
          <AreaChart
            data={dummyPKData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#E8EDF2"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 10 }}
            />

            <YAxis
              domain={[70, 110]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 10 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFB84D"
              fill="#FFF1D9"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#FFB84D",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* C-Peptide Chart */}
      <div className="bg-white rounded-xl border border-[#E2E4E6] p-5 shadow-sm min-w-0 overflow-hidden">
        <h3 className="mb-4 text-sm font-bold text-[#595F6A] uppercase tracking-wide">
          C-Peptide Chart (ng/mL)
        </h3>

        <ResponsiveContainer
          width="100%"
          height={180}
          debounce={100}
        >
          <AreaChart
            data={dummyPKData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#E8EDF2"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 10 }}
            />

            <YAxis
              domain={[70, 110]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#707784", fontSize: 10 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFD84D"
              fill="#FFF9D6"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#FFD84D",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}