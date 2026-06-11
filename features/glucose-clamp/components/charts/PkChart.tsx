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

interface PkChartProps {
  labels: string[];
  pkData: (number | null)[];
}

export function PkChart({ labels, pkData }: PkChartProps) {
  const data = useMemo(
    () => labels.map((label, i) => ({ label, pk: pkData[i] })),
    [labels, pkData]
  );

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8b5cf6" }}
            label={{ value: "mg/L", angle: -90, position: "insideLeft", fontSize: 10, fill: "#8b5cf6" }}
          />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} labelStyle={{ fontWeight: 700 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="pk"
            name="PK (mg/L)"
            stroke="#8b5cf6"
            fill="url(#colorPk)"
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