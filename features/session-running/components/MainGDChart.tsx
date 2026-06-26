"use client";

import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
} from "recharts";

import { useProtocolDetail } from "@/features/protocol-sampling/hooks/ProtocolSamplingHook";
import dayjs from "dayjs";

interface Props {
  protocolId: number;
  sessionData: any;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
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
      <p className="mb-1 border-b border-gray-500 pb-1 font-semibold">
        {label}
      </p>

      <p>
        Glucose :
        <span className="ml-1 font-bold">
          {payload[0].value}
        </span>{" "}
        mg/dL
      </p>
    </div>
  );
};

export default function MainGDChart({
  protocolId,
  sessionData
}: Props) {
  const { data } = useProtocolDetail(protocolId);

  const protocol = data?.data;

  const targetMin = protocol?.glucose_target_min ?? 80;
  const targetMax = protocol?.glucose_target_max ?? 100;

  const extremeMin =
    protocol?.glucose_target_min_extreme ?? 70;

  const extremeMax =
    protocol?.glucose_target_max_extreme ?? 120;

  const gdData = useMemo(() => {
    if (!sessionData?.activities?.length) {
      return [
        { time: "00:00", glucose: 0 },
        { time: "24:00", glucose: 0 },
      ];
    }

    const glucoseData = sessionData.activities
        .flatMap((activity: any) =>
            (activity.labResults || [])
                .filter(
                    (lab: any) =>
                        lab.parameter_name === "Glucose"
                )
                .map((lab: any) => ({
                    time: dayjs(activity.time).format("HH:mm"),
                    glucose: Number(lab.value),
                    activityId: activity.activityId,
                    scheduleCode: activity.scheduleCode
                }))
        )
        .sort(
          (
            a: {
              time: string;
              glucose: number;
              activityId: number;
              scheduleCode: string;
            },
            b: {
              time: string;
              glucose: number;
              activityId: number;
              scheduleCode: string;
            }
          ) => a.time.localeCompare(b.time)
        );
        if (!glucoseData.length) {
          return [
            { time: "00:00", glucose: 0 },
            { time: "24:00", glucose: 0 },
          ];
        }
      return glucoseData;
  }, [sessionData]);

  return (
    <div className="w-full rounded-xl border border-[#E2E4E6] bg-white p-5 shadow-sm">

      <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#595F6A]">
        GD Chart (Glucose)
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={gdData}
          margin={{
            top: 10,
            right: 0,
            left: 10,
            bottom: 10,
          }}
        >

          <defs>
            <linearGradient
              id="glucoseGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#86EFAC"
                stopOpacity={0.8}
              />

              <stop
                offset="50%"
                stopColor="#86EFAC"
                stopOpacity={0.5}
              />

              <stop
                offset="80%"
                stopColor="#86EFAC"
                stopOpacity={0.2}
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#E8EDF2"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#707784",
              fontSize: 11,
            }}
          />

          <YAxis
            domain={[60, 130]}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#707784",
              fontSize: 11,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Target */}
          <ReferenceLine
            y={targetMin}
            stroke="#F59E0B"
            strokeDasharray="5 5"
          />

          <ReferenceLine
            y={targetMax}
            stroke="#F59E0B"
            strokeDasharray="5 5"
          />

          {/* Extreme */}
          <ReferenceLine
            y={extremeMin}
            stroke="#EF4444"
            strokeDasharray="5 5"
          />

          <ReferenceLine
            y={extremeMax}
            stroke="#EF4444"
            strokeDasharray="5 5"
          />

          <Area
            type="monotone"
            dataKey="glucose"
            stroke="none"
            fill="url(#glucoseGradient)"
          />

          <Line
            type="monotone"
            dataKey="glucose"
            stroke="#8B8AEF"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#FFFFFF",
              stroke: "#8B8AEF",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
            }}
          />

        </ComposedChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginTop: 24,
          alignItems: "center",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 4,
              background: "#8B8AEF",
              marginRight: 8,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#707784",
            }}
          >
            Glucose
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              borderTop: "2px dashed #F59E0B",
              marginRight: 8,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#707784",
            }}
          >
            Target Range
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              borderTop: "2px dashed #EF4444",
              marginRight: 8,
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#707784",
            }}
          >
            Extreme Range
          </span>
        </div>

      </div>

    </div>
  );
}