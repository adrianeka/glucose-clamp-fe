"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useNextActivityCountdown } from "../hooks/useNextActivityCountdown";
import { useNextProgressActivity } from "@/features/session-creation/hooks/SessionCreationHook";
import { useParams } from "next/navigation";
import { TimerDialog } from "./modalStepActivity/ModalTimerGlobalConfig"; // Pastikan path import benar
import { ModalConfirmationEndSessionRunning } from "./ModalConfirmationEndSessionRunning";
import { ConfirmEndSessionDialog } from "./ConfirmEndSessionDialog";
import NextActivityCountdown from "./helper/NextActivityCoundown";
import NextActivityManager from "./helper/NextActivityManager";

interface NextActivityBannerProps {
  sessionData: any;
  configData: any;
}

export default function NextActivityBanner({
  sessionData,
  configData,
}: NextActivityBannerProps) {
  const params = useParams();
  const sessionId = Number(params.sessionId);
  const nextActivities = sessionData?.nextActivities ?? [];
  const nextActivity = nextActivities?.[0];
  const displayedActivities = nextActivities.slice(0, 3);
  const hiddenCount = Math.max(
    nextActivities.length - displayedActivities.length,
    0
  );
  // const [now, setNow] = useState<Date | null>(null);
  const warningThreshold = Number(configData?.data?.gconfValue) ?? 60; 
  const [endSessionStep, setEndSessionStep] = useState<"Close" | "FORM" | "CONFIRM">("Close");

  const [tempEndSessionData, setTempEndSessionData] = useState<{ category: string; notes: string; } | null>(null);

  const formatTime = (time: string) => {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const toTimestamp = (time: any) => {
    if (!time) return 0;

    // ISO String
    if (typeof time === "string") {
      return new Date(time).getTime();
    }

    // Java LocalDateTime serialized as array
    if (Array.isArray(time)) {
      const [
        year,
        month,
        day,
        hour = 0,
        minute = 0,
        second = 0,
        nano = 0
      ] = time;

      return new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        Math.floor(nano / 1_000_000)
      ).getTime();
    }

    return new Date(time).getTime();
  };

  const infusionSummary = useMemo(() => {
    const infusion = [...(sessionData?.infusion ?? [])].sort(
      (a, b) => toTimestamp(b.time) - toTimestamp(a.time)
    );

    return {
      latestInfusion: infusion[0],

      latestRate: infusion.find(
        i => i.flowRateMlHr != null
      ),

      latestGlucoseFromInfusion: infusion.find(
        i => i.glucoseValue != null
      ),
    };
  }, [sessionData?.infusion]);

  const glucoseFromLab = useMemo(() => {
    return (
      sessionData?.activities
        ?.flatMap((activity: any) =>
          (activity.labResults ?? []).map((lab: any) => ({
            value: lab.value,
            time: lab.updated_at,
            parameter: lab.parameter_name,
            min: lab.reference_range_min,
            max: lab.reference_range_max,
            abnormalFlag: lab.abnormal_flag
          }))
        )
        .filter(
          (lab: any) =>
            lab.parameter?.toLowerCase() === "glucose"
        )
        .sort(
          (a: any, b: any) =>
            toTimestamp(b.time) -
            toTimestamp(a.time)
        )[0]
    );
  }, [sessionData?.activities]);

  const latestRate = infusionSummary.latestRate;
  const latestGlucose = useMemo(() => {
    return [
      glucoseFromLab,
      infusionSummary.latestGlucoseFromInfusion,
    ]
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          toTimestamp(b.time) -
          toTimestamp(a.time)
      )[0];
  }, [
    glucoseFromLab,
    infusionSummary.latestGlucoseFromInfusion,
  ]);

  const abnormalShownRef = useRef(false);

  useEffect(() => {
    if (!glucoseFromLab) return;

    if (abnormalShownRef.current) return;

    const value = glucoseFromLab.value;
    const min = glucoseFromLab.min;
    const max = glucoseFromLab.max;

    const isCritical =
      (min != null && value < min) ||
      (max != null && value > max);

    if (!isCritical) return;

    abnormalShownRef.current = true;

    setEndSessionStep("FORM");

  }, [glucoseFromLab]);
  return (
    <>
      <div
        style={{
          border: "1px solid #E2E4E6",
          borderRadius: "16px",
          padding: "15px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FAFAFA",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                background: "#EAF5FD",
                color: "#0076D2",
                fontSize: "13px",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "100px",
                border: "1px solid #B3E5FC",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Next Activity
            </span>

            <NextActivityCountdown
              activityTime={
                  nextActivities?.[0]?.time
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#212121",
              maxWidth: 600,
            }}
          >
            {displayedActivities.length > 0 ? (
              <>
                {displayedActivities.map((activity: any) => (
                  <div
                    key={activity.activityId}
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {formatTime(activity.time)} - {activity.activityType}
                    {activity.activityDesc
                      ? ` (${activity.activityDesc})`
                      : ""}
                  </div>
                ))}

                {hiddenCount > 0 && (
                  <div
                    style={{
                      color: "#707784",
                      fontWeight: 500,
                      fontSize: "13px",
                    }}
                  >
                    ... dan {hiddenCount} aktivitas lainnya
                  </div>
                )}
              </>
            ) : (
              "No upcoming activity"
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "150px" }}>
          <div style={{ textAlign: "left", borderLeft: "1px solid #E2E4E6", paddingLeft: "24px" }}>
            <div style={{ fontSize: "12px", color: "#707784", fontWeight: 500, textTransform: "uppercase", marginBottom: "4px" }}>
              Glucose
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#212121"
              }}
            >
              {latestGlucose?.value ??
              latestGlucose?.glucoseValue ??
              "--"}
            </div>
          </div>

          <div style={{ textAlign: "left", borderLeft: "1px solid #E2E4E6", paddingLeft: "24px", paddingRight: "50px" }}>
            <div style={{ fontSize: "12px", color: "#707784", fontWeight: 500, textTransform: "uppercase", marginBottom: "4px" }}>
              Infusion Gir
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#212121"
              }}
            >
              {latestRate?.actualGir ?? "--"}
            </div>
          </div>
        </div>
      </div>
      <NextActivityManager
          sessionId={sessionId}
          nextActivity={nextActivity}
          warningThreshold={
              warningThreshold
          }
      />
      {endSessionStep === "FORM" && (
        <ModalConfirmationEndSessionRunning
          isOpen={endSessionStep === "FORM"}
          defaultValues={tempEndSessionData}
          onCancel={() => {
            setEndSessionStep("Close");
            setTempEndSessionData(null);
          }}
          onSubmit={(data) => {
            setTempEndSessionData(data);
            setEndSessionStep("CONFIRM");
          }}
          mode="critical"
          glucoseValue={glucoseFromLab?.value}
          glucoseMin={glucoseFromLab?.min}
          glucoseMax={glucoseFromLab?.max}
        />
      )}
      <ConfirmEndSessionDialog
        isOpen={endSessionStep === "CONFIRM"}
        sessionData={sessionData}
        data={tempEndSessionData}
        onCancel={() =>
          setEndSessionStep("FORM")
        }
        onSuccess={() => {
          setEndSessionStep("Close");
          setTempEndSessionData(null);
        }}
      />
    </>
  );
}