"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface GdChartProps {
  labels: string[];
  glucoseData: (number | null)[];
  rateData: (number | null)[];
  targetMin?: number;
  targetMax?: number;
}

export function GdChart({
  labels,
  glucoseData,
  rateData,
  targetMin = 90,
  targetMax = 100,
}: GdChartProps) {
  const data = useMemo(
    () =>
      labels.map((label, i) => ({
        label,
        glucose: glucoseData[i],
        rate: rateData[i],
      })),
    [labels, glucoseData, rateData]
  );

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="glucose"
            domain={[70, 110]}
            tick={{ fontSize: 10, fill: "#2563eb" }}
            label={{ value: "mg/dL", angle: -90, position: "insideLeft", fontSize: 10, fill: "#2563eb" }}
          />
          <YAxis
            yAxisId="rate"
            orientation="right"
            domain={[0, 4]}
            tick={{ fontSize: 10, fill: "#d97706" }}
            label={{ value: "rate", angle: 90, position: "insideRight", fontSize: 10, fill: "#d97706" }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            labelStyle={{ fontWeight: 700 }}
          />
          <Legend
            iconSize={10}
            wrapperStyle={{ fontSize: 11 }}
          />
          <ReferenceLine
            yAxisId="glucose"
            y={targetMin}
            stroke="#16a34a"
            strokeDasharray="6 4"
            label={{ value: `Min ${targetMin}`, fontSize: 9, fill: "#16a34a", position: "insideBottomRight" }}
          />
          <ReferenceLine
            yAxisId="glucose"
            y={targetMax}
            stroke="#16a34a"
            strokeDasharray="6 4"
            label={{ value: `Max ${targetMax}`, fontSize: 9, fill: "#16a34a", position: "insideTopRight" }}
          />
          <Line
            yAxisId="glucose"
            type="monotone"
            dataKey="glucose"
            name="Glucose (mg/dL)"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="rate"
            name="Infusion Rate"
            stroke="#d97706"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
