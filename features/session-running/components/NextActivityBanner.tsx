"use client";

import { useEffect, useRef, useState } from "react";
import { useNextActivityCountdown } from "../hooks/useNextActivityCountdown";
import { useNextProgressActivity } from "@/features/session-creation/hooks/SessionCreationHook";
import { useParams } from "next/navigation";
import { TimerDialog } from "./modalStepActivity/ModalTimerGlobalConfig"; // Pastikan path import benar

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
  const nextActivity = sessionData?.nextActivities?.[0];
  const [now, setNow] = useState<Date | null>(null);
  const warningThreshold = configData?.timerThresholdSeconds ?? 60; 

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // State untuk Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);

  const {
    timeLeft: remainingTime,
    secondsLeft,
    initialized,
  } = useNextActivityCountdown(nextActivity?.time);
  
  const { mutate: nextProgress } = useNextProgressActivity();
  const expiredRef = useRef(false);

  // Logika untuk menampilkan Dialog saat mendekati waktu (Contoh: < 60 detik)
  useEffect(() => {
    if (initialized && secondsLeft <= warningThreshold && secondsLeft > 0 && !hasShownDialog) {
      setIsDialogOpen(true);
      setHasShownDialog(true);
    }
    
    // Reset status dialog jika activity berubah (waktu di-reset)
    if (secondsLeft > warningThreshold) {
      setHasShownDialog(false);
    }
  }, [secondsLeft, initialized, hasShownDialog, warningThreshold]);

  // Logika Auto-Progress saat waktu habis
  useEffect(() => {
    if (!initialized || !nextActivity) return;

    const isExpired = remainingTime === "00:00:00" || remainingTime === "00:00";

    if (!isExpired) {
      expiredRef.current = false;
      return;
    }

    if (expiredRef.current) return;

    // expiredRef.current = true;
    nextProgress(sessionId, {
      onSuccess: () => {
        setHasShownDialog(false); 
      },
      onError: () => {
        expiredRef.current = false;
      },
    });
    handleConfirmNext(); 

  }, [initialized, remainingTime, nextActivity?.time, sessionData]);

  const handleConfirmNext = () => {
    setIsDialogOpen(false);
  };

  const formatTime = (time: string) => {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const latestInfusion = [...(sessionData?.infusion ?? [])]
    .sort(
      (a, b) =>
        new Date(b.time).getTime() -
        new Date(a.time).getTime()
    )[0];

  const glucoseFromLab =
    sessionData?.activities
      ?.flatMap((activity: any) =>
        (activity.labResults ?? []).map((lab: any) => ({
          value: lab.value,
          time: activity.time,
          parameter: lab.parameter_name
        }))
      )
      .filter(
        (lab: any) =>
          lab.parameter?.toLowerCase() === "glucose"
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() -
          new Date(a.time).getTime()
      )[0];

  const glucoseFromInfusion =
    [...(sessionData?.infusion ?? [])]
      .filter(i => i.glucoseValue != null)
      .sort(
        (a, b) =>
          new Date(b.time).getTime() -
          new Date(a.time).getTime()
      )[0];

  const latestGlucose = [glucoseFromLab, glucoseFromInfusion]
    .filter(Boolean)
    .sort(
      (a: any, b: any) =>
        new Date(b.time).getTime() -
        new Date(a.time).getTime()
    )[0];

  const latestRate =
  [...(sessionData?.infusion ?? [])]
    .filter(i => i.flowRateMlHr != null)
    .sort(
      (a, b) =>
        new Date(b.time).getTime() -
        new Date(a.time).getTime()
    )[0];
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
                fontWeight: 500,
                padding: "4px 14px",
                borderRadius: "100px",
                border: "1px solid #B3E5FC",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Next Activity
            </span>

            <span
              style={{
                color: remainingTime === "00:00" ? "#D32F2F" : "#0076D2",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Time Remaining: {remainingTime || "00:00"}
            </span>

            <span className="ml-2 font-mono font-bold">
              Waktu sekarang : {now
                ? now.toLocaleString("sv-SE").replace(" ", "T")
                : "--:--:--"}
            </span>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#212121",
              maxWidth: 600
            }}
          >
            {nextActivity
              ? `${formatTime(nextActivity.time)} - ${nextActivity.activityType} (${nextActivity.activityDesc})`
              : "No upcoming activity"}
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
              Infusion Rate
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#212121"
              }}
            >
              {latestRate?.flowRateMlHr ?? "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Render Timer Dialog */}
      <TimerDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        duration={secondsLeft} // Mengikuti sisa detik dari hook banner
        activityName={nextActivity?.activityType || "Next Activity"}
        onConfirm={handleConfirmNext}
      />
    </>
  );
}