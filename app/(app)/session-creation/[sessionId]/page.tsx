"use client";

import { useParams } from "next/navigation";

import { useSessionDetail } from "@/features/session-creation/hooks/SessionCreationHook";

import MainPageSessionListActivities from "@/features/session-creation/components/MainPageSessionListActivities";
import MainPageSessionRunning from "@/features/session-running/components/MainPageSessionRunning";

import SessionRunningSkeleton from "@/features/session-running/components/SessionRunningSkeleton";
import MainPageSessionCompleted from "@/features/session-completed/components/MainPageSessionCompleted";

export default function SessionPage() {
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const {
    data: sessionData,
    isLoading,
    error,
  } = useSessionDetail(sessionId);

  if (isLoading) {
    // Belum tahu status session, tampilkan skeleton halaman activities
    // atau skeleton generic sesuai preferensi Anda
    return <SessionRunningSkeleton />;
  }

  if (error || !sessionData) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Session tidak ditemukan.
      </div>
    );
  }

  switch (sessionData.sessionStatus) {
    case "RUNNING":
      return (
        <MainPageSessionRunning
          sessionId={sessionId}
          sessionData={sessionData}
        />
      );

    case "COMPLETED":
      return (
        <MainPageSessionCompleted
          sessionId={sessionId}
          sessionData={sessionData}
        />
      );

    case "INQUEUE":
    case "DRAFT":
    default:
      return (
        <MainPageSessionListActivities
          sessionId={sessionId}
          sessionData={sessionData}
        />
      );
  }
}

