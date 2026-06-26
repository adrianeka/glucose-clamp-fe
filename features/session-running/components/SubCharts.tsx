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
} from "recharts";

import dayjs from "dayjs";

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

export default function SubCharts({
  protocolId,
  sessionData
}: Props) {
  const EMPTY_CHART = [
    { time: "00:00", value: 0 },
    { time: "24:00", value: 0 },
  ];

  const gdDataPK = useMemo(() => {
      if (!sessionData?.activities) return EMPTY_CHART;
  
      return sessionData.activities
          .flatMap((activity: any) =>
              (activity.labResults || [])
                  .filter(
                      (lab: any) =>
                          lab.parameter_name === "PK"
                  )
                  .map((lab: any) => ({
                      time: dayjs(activity.time).format("HH:mm"),
                      value: Number(lab.value),
                      activityId: activity.activityId,
                      scheduleCode: activity.scheduleCode
                  }))
          )
          .sort(
            (
              a: {
                time: string;
                value: number;
                activityId: number;
                scheduleCode: string;
              },
              b: {
                time: string;
                value: number;
                activityId: number;
                scheduleCode: string;
              }
            ) => a.time.localeCompare(b.time)
          );
    }, [sessionData]);


    const gdDataPeptide = useMemo(() => {
      if (!sessionData?.activities) return EMPTY_CHART;
  
      return sessionData.activities
          .flatMap((activity: any) =>
              (activity.labResults || [])
                  .filter(
                      (lab: any) =>
                          lab.parameter_name === "C-Peptide"
                  )
                  .map((lab: any) => ({
                      time: dayjs(activity.time).format("HH:mm"),
                      value: Number(lab.value),
                      activityId: activity.activityId,
                      scheduleCode: activity.scheduleCode
                  }))
          )
          .sort(
            (
              a: {
                time: string;
                value: number;
                activityId: number;
                scheduleCode: string;
              },
              b: {
                time: string;
                value: number;
                activityId: number;
                scheduleCode: string;
              }
            ) => a.time.localeCompare(b.time)
          );
    }, [sessionData]);
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
            data={gdDataPK}
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
            data={gdDataPeptide}
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