"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useNextActivityCountdown } from "../hooks/useNextActivityCountdown";
import { useNextProgressActivity } from "@/features/session-creation/hooks/SessionCreationHook";
import { useParams } from "next/navigation";
import { TimerDialog } from "./modalStepActivity/ModalTimerGlobalConfig";
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

    if (typeof time === "string") {
      return new Date(time).getTime();
    }

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

      if (time.length === 7 || hour < 7) {
        return new Date(Date.UTC(
          year,
          month - 1,
          day,
          hour,
          minute,
          second,
          Math.floor(nano / 1_000_000)
        )).getTime();
      }

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
  }, [sessionData]);

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
  }, [sessionData]);

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
        className="border border-[#E2E4E6] rounded-2xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between bg-[#FAFAFA] gap-4 md:gap-6"
      >
        {/* PANEL KIRI: INFO AKTIVITAS */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="bg-[#EAF5FD] color-[#0076D2] text-xs font-extrabold px-3.5 py-1 rounded-full border border-[#B3E5FC] inline-flex items-center"
            >
              Next Activity
            </span>

            <NextActivityCountdown
              activityTime={
                nextActivities?.[0]?.time
              }
            />
          </div>

          <div className="flex flex-col gap-0.5 text-sm font-bold text-[#212121] max-w-full lg:max-w-[600px] overflow-hidden">
            {displayedActivities.length > 0 ? (
              <>
                {displayedActivities.map((activity: any) => {
                  // Menyusun teks lengkap (Full Text) untuk ditampilkan di popup hover
                  const fullText = `${formatTime(activity.time)} - ${activity.activityType}${
                    activity.activityDesc ? ` (${activity.activityDesc})` : ""
                  }`;

                  return (
                    <div
                      key={activity.activityId}
                      // cursor-help memberikan indikasi visual bahwa elemen ini memiliki petunjuk (popup)
                      className="truncate cursor-help hover:text-[#0076D2] transition-colors"
                      title={fullText}
                    >
                      {formatTime(activity.time)} - {activity.activityType}
                      {activity.activityDesc
                        ? ` (${activity.activityDesc})`
                        : ""}
                    </div>
                  );
                })}

                {hiddenCount > 0 && (
                  <div className="text-[#707784] font-medium text-xs mt-0.5">
                    ... dan {hiddenCount} aktivitas lainnya
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-500 font-medium">No upcoming activity</span>
            )}
          </div>
        </div>

        {/* PANEL KANAN: GLUCOSE & INFUSION GIR */}
        <div 
          className="flex items-center gap-8 sm:gap-16 lg:gap-24 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#E2E4E6] md:pl-6 lg:pl-10"
        >
          {/* STATS: GLUCOSE */}
          <div className="text-left">
            <div className="text-[11px] text-[#707784] font-semibold uppercase tracking-wider mb-1">
              Glucose
            </div>
            <div className="text-2xl font-bold text-[#212121]">
              {latestGlucose?.value ??
                latestGlucose?.glucoseValue ??
                "--"}
            </div>
          </div>

          {/* STATS: INFUSION GIR */}
          <div className="text-left border-l border-[#E2E4E6] pl-6 md:pl-10">
            <div className="text-[11px] text-[#707784] font-semibold uppercase tracking-wider mb-1">
              Infusion Gir
            </div>
            <div className="text-2xl font-bold text-[#212121]">
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