"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOngoingSessions, parseLocalDateTimeArray, parseLocalDateTimeToToday } from "../hooks/useOngoingSession";

export default function ActiveSessionsTicker() {
  const router = useRouter();
  const { sessions, isLoading } = useOngoingSessions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});
  const [isHovered, setIsHovered] = useState(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentIndex >= sessions.length) {
      setCurrentIndex(0);
    }
  }, [sessions, currentIndex]);

  // Timer Hitung Mundur Real-time yang diselaraskan dengan hook halaman Anda
  useEffect(() => {
    if (sessions.length === 0) return;

    const updateAllCountdowns = () => {
      const newCountdowns: { [key: number]: string } = {};

      sessions.forEach((session) => {
        // --- MENGGUNAKAN LOGIKA MEMAKSA HARI INI ---
        const targetDate = parseLocalDateTimeToToday(session.nextActivity?.time);
        if (!targetDate) {
          newCountdowns[session.sessionId] = "00:00:00";
          return;
        }

        const targetTime = targetDate.getTime();
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
          newCountdowns[session.sessionId] = "00:00:00";
          return;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        newCountdowns[session.sessionId] = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      });

      setCountdowns(newCountdowns);
    };

    updateAllCountdowns();
    const intervalId = setInterval(updateAllCountdowns, 1000);

    return () => clearInterval(intervalId);
  }, [sessions]);

  // Logika Bergulir Otomatis (Auto-play)
  useEffect(() => {
    if (sessions.length <= 1 || isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sessions.length);
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [sessions, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? sessions.length - 1 : prevIndex - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sessions.length);
  };

  const handleCardClick = () => {
    const activeSession = sessions[currentIndex];
    if (!activeSession) return;

    router.push(
      `/session-creation/${activeSession.sessionId}`
    );
  };

  if (isLoading || sessions.length === 0) return null;

  const currentSession = sessions[currentIndex];
  const currentCountdown = countdowns[currentSession.sessionId] || "00:00:00";

  // Memformat jam target asli untuk sub-label (Format tetap HH.mm asli dari DB)
  const targetDateObj = parseLocalDateTimeArray(currentSession.nextActivity?.time);
  const formattedTargetClock = targetDateObj
    ? `${String(targetDateObj.getHours()).padStart(2, "0")}.${String(targetDateObj.getMinutes()).padStart(2, "0")}`
    : "--.--";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="relative flex-1 max-w-[480px] lg:max-w-[540px] h-[52px] bg-white border border-[#E84E2C]/30 hover:border-[#E84E2C] rounded-xl shadow-[0px_2px_8px_rgba(232,78,44,0.06)] px-3 py-1.5 flex items-center justify-between cursor-pointer transition-all duration-300 group overflow-hidden select-none"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E84E2C]" />

      <div className="flex items-center gap-3 w-[calc(100%-48px)] pl-1">
        <div className="flex flex-col items-center justify-center bg-[#FFF1EE] border border-[#FFD0C6] px-2 py-1 rounded-lg shrink-0">
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E84E2C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E84E2C]"></span>
            </span>
            <span className="text-[#E84E2C] text-xs font-bold leading-none">
              S-{currentSession.sessionId}
            </span>
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#2D2F35] text-xs font-bold truncate">
              {currentSession.participantName}
            </span>
            <span className="text-[#707784] text-[10px] font-normal shrink-0">
              • Time Remaining:
            </span>
            <span className="text-[#0076D2] text-[11px] font-bold shrink-0 font-mono tracking-wider">
              {currentCountdown}
            </span>
          </div>
          <p className="text-[#707784] text-[10px] font-medium leading-normal truncate">
            {formattedTargetClock} - {currentSession.nextActivity?.activityType} ({currentSession.nextActivity?.activityDesc})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
        {sessions.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="p-1 rounded hover:bg-[#F1F2F4] text-[#707784] hover:text-[#212121] transition-colors"
              aria-label="Previous Session"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="p-1 rounded hover:bg-[#F1F2F4] text-[#707784] hover:text-[#212121] transition-colors"
              aria-label="Next Session"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}