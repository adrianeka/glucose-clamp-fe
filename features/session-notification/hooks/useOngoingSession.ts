"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export interface SessionActivityItem {
  activityId: number;
  time: number[]; // [YYYY, MM, DD, HH, mm]
  activityType: string;
  activityDesc: string;
  phaseCode: string;
  phaseName: string;
  activityStatus: string;
  minute: number;
}

export interface OngoingSessionData {
  hasActiveSession: boolean;
  sessionId: number;
  participantName: string;
  protocolName: string;
  nextActivity: SessionActivityItem;
}

// Helper 1: Mengambil objek tanggal absolut asli database
export function parseLocalDateTimeArray(timeArray: number[] | null | undefined): Date | null {
  if (!timeArray || timeArray.length < 5) return null;
  const [year, month, day, hour, minute] = timeArray;
  return new Date(year, month - 1, day, hour, minute);
}

// Helper 2: Memaksa tanggal target menjadi hari ini (Menyelaraskan dengan hook NextActivityCountdown Anda)
export function parseLocalDateTimeToToday(timeArray: number[] | null | undefined): Date | null {
  if (!timeArray || timeArray.length < 5) return null;
  const [_, __, ___, hour, minute] = timeArray;
  
  const target = new Date(); // Ambil tanggal hari ini
  target.setHours(hour, minute, 0, 0); // Setel jam dan menit dari DB ke hari ini
  return target;
}

export function useOngoingSessions() {
  const [sessions, setSessions] = useState<OngoingSessionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOngoingSessions = async () => {
    try {
      const response = await api.get("/session/ongoing-notification");
      const list: OngoingSessionData[] = response.data?.data || [];
      const activeList = list.filter((item) => item.hasActiveSession);
      setSessions(activeList);
    } catch (error) {
      console.error("Gagal memuat data sesi berjalan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingSessions();

    let intervalId: NodeJS.Timeout;

    const startPolling = () => {
      intervalId = setInterval(fetchOngoingSessions, 30000);
    };

    const stopPolling = () => {
      if (intervalId) clearInterval(intervalId);
    };

    startPolling();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchOngoingSessions();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { sessions, isLoading };
}