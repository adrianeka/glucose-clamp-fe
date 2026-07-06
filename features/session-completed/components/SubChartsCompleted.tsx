"use client";

import { useMemo } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
  Label,
} from "recharts";
import dayjs from "dayjs";

// Custom Tooltip bawaan Anda
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
    <div
      style={{
        backgroundColor: "#707784",
        borderRadius: "8px",
        padding: "8px 12px",
        color: "#FFFFFF",
        fontSize: "12px",
        opacity: 1,
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      }}
    >
      <p className="font-semibold">{label}</p>
      <p>Value: {payload[0]?.value}</p>
    </div>
  );
}

interface Props {
  protocolId: number;
  sessionData: any;
}

export default function SubChartsCompleted({ protocolId, sessionData }: Props) {
  const EMPTY_CHART = [
    { time: "07:00", value: 0 },
    { time: "10:00", value: 0 },
  ];

  // 1. Data PK
  const gdDataPK = useMemo(() => {
    if (!sessionData?.activities) return EMPTY_CHART;
    const filtered = sessionData.activities
      .flatMap((activity: any) =>
        (activity.labResults || [])
          .filter((lab: any) => lab.parameter_name === "PK")
          .map((lab: any) => ({
            time: dayjs(activity.time).format("HH:mm"),
            value: Number(lab.value),
          }))
      )
      .sort((a: any, b: any) => a.time.localeCompare(b.time));
    return filtered.length ? filtered : EMPTY_CHART;
  }, [sessionData]);

  // 2. Data C-Peptide
  const gdDataPeptide = useMemo(() => {
    if (!sessionData?.activities) return EMPTY_CHART;
    const filtered = sessionData.activities
      .flatMap((activity: any) =>
        (activity.labResults || [])
          .filter((lab: any) => lab.parameter_name === "C-Peptide")
          .map((lab: any) => ({
            time: dayjs(activity.time).format("HH:mm"),
            value: Number(lab.value),
          }))
      )
      .sort((a: any, b: any) => a.time.localeCompare(b.time));
    return filtered.length ? filtered : EMPTY_CHART;
  }, [sessionData]);

  return (
    <>
      {/* ==================== 1. PK CHART ==================== */}
      <div className="bg-white rounded-2xl border border-[#E2E4E6] p-5 shadow-sm min-w-0 overflow-hidden flex flex-col justify-between">
        <div>
          <h3 className="mb-6 text-sm font-bold text-[#595F6A] tracking-wide">
            PK Chart (mg/L)
          </h3>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={gdDataPK}
              margin={{
                top: 5,
                right: 25,
                left: -25, // Disesuaikan agar pas di tengah & memberi ruang untuk Label vertikal
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="pkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFB84D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FFB84D" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#E8EDF2" strokeDasharray="4 4" />

              <XAxis
                dataKey="time"
                tickLine={true}
                axisLine={{ stroke: "#707784" }}
                tick={{ fill: "#707784", fontSize: 11 }}
                dy={8}
              />

              <YAxis
                domain={[70, 110]}
                tickLine={true}
                axisLine={{ stroke: "#707784" }}
                tick={{ fill: "#707784", fontSize: 11 }}
                dx={-4}
              >
                {/* Label vertikal di samping kiri */}
                <Label
                  value="mg/dL"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fill: "#707784", fontSize: 10 }}
                  offset={-5}
                />
              </YAxis>

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFB84D"
                fill="url(#pkGradient)"
                strokeWidth={2}
                dot={{ r: 4, fill: "#FFFFFF", stroke: "#FFB84D", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend di kiri bawah */}
        <div className="flex items-center gap-2 mt-4 pl-4">
          <div className="w-4 h-3 bg-[#FFF1D9] border border-[#FFB84D] rounded-sm" />
          <span className="text-xs text-[#707784]">PK (mg/L)</span>
        </div>
      </div>

      {/* ==================== 2. C-PEPTIDE CHART ==================== */}
      <div className="bg-white rounded-2xl border border-[#E2E4E6] p-5 shadow-sm min-w-0 overflow-hidden flex flex-col justify-between">
        <div>
          <h3 className="mb-6 text-sm font-bold text-[#595F6A] tracking-wide">
            C-Peptide Chart (ng/mL)
          </h3>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={gdDataPeptide}
              margin={{
                top: 5,
                right: 25,
                left: -25,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="peptideGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD84D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FFD84D" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#E8EDF2" strokeDasharray="4 4" />

              <XAxis
                dataKey="time"
                tickLine={true}
                axisLine={{ stroke: "#707784" }}
                tick={{ fill: "#707784", fontSize: 11 }}
                dy={8}
              />

              <YAxis
                domain={[70, 110]}
                tickLine={true}
                axisLine={{ stroke: "#707784" }}
                tick={{ fill: "#707784", fontSize: 11 }}
                dx={-4}
              >
                <Label
                  value="mg/dL"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fill: "#707784", fontSize: 10 }}
                  offset={-5}
                />
              </YAxis>

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFD84D"
                fill="url(#peptideGradient)"
                strokeWidth={2}
                dot={{ r: 4, fill: "#FFFFFF", stroke: "#FFD84D", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend di kiri bawah */}
        <div className="flex items-center gap-2 mt-4 pl-4">
          <div className="w-4 h-3 bg-[#FFF9D6] border border-[#FFD84D] rounded-sm" />
          <span className="text-xs text-[#707784]">C-Peptide (ng/mL)</span>
        </div>
      </div>
    </>
  );
}