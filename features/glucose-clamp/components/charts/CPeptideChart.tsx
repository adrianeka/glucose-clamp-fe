"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface CPeptideChartProps {
  labels: string[];
  cpData: (number | null)[];
}

export function CPeptideChart({ labels, cpData }: CPeptideChartProps) {
  const data = useMemo(
    () => labels.map((label, i) => ({ label, cp: cpData[i] })),
    [labels, cpData]
  );

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#ec4899" }}
            label={{ value: "ng/mL", angle: -90, position: "insideLeft", fontSize: 10, fill: "#ec4899" }}
          />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} labelStyle={{ fontWeight: 700 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="cp"
            name="C-Peptide (ng/mL)"
            stroke="#ec4899"
            fill="url(#colorCp)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}