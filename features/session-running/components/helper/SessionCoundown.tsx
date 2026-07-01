"use client";

import { Clock3 } from "lucide-react";
import { useSessionCountdown } from "../../hooks/sessionRunningHook";

interface SessionCountdownProps {
  startTime?: string;
  totalMinutes: number;
}

export default function SessionCountdown({
  startTime,
  totalMinutes,
}: SessionCountdownProps) {

  const countdown = useSessionCountdown(
    startTime,
    totalMinutes
  );

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-mono font-bold text-lg text-[#212121] min-w-[140px] justify-center">
      <Clock3
        size={20}
        className="text-gray-400"
      />

      {countdown}
    </div>
  );
}