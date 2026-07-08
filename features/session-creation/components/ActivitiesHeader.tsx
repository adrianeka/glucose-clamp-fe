"use client";

import { ArrowLeft, Clock3, Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionStart } from "../hooks/SessionCreationHook";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";

interface ActivitiesHeaderProps {
  sessionId: number;
  participant: string;
  protocol: string;
  visitDate: string;
  statusSession: string;
  displayTime?: any;
  canRun: boolean;
}

export default function ActivitiesHeader({
  sessionId,
  participant,
  protocol,
  visitDate,
  statusSession,
  displayTime,
  canRun
}: ActivitiesHeaderProps) {
  const router = useRouter();
  const {showToast} = useToast();
  const { mutate: startSession, isPending } = useSessionStart();

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const handleRunActivities = () => {
    startSession(sessionId, {
      onSuccess: () => {
        showToast("Running session successfully");
        router.refresh();
      },
      onError: (error: any) => {
        showToast(error.message, "error");
        console.error(error);
      },
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl md:text-4xl font-semibold text-[#212121] shrink-0">
          S-{sessionId}
        </h1>

        <div className="h-6 md:h-8 w-[1px] bg-gray-300 mx-1 shrink-0" />

        <div className="min-w-0">
          <div className="font-semibold text-sm md:text-base text-[#43474F] truncate">
            Participant: {participant}
          </div>

          <div className="text-xs md:text-sm text-[#707784] truncate">
            {protocol} • {visitDate}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
        <div className="flex items-center gap-2 rounded-lg border px-3 md:px-4 py-2 bg-white text-sm md:text-base">
          <Clock3 size={16} className="text-gray-400" />
          <span className="font-mono font-bold text-[#212121]">
            {displayTime} 
          </span>
        </div>

        <button
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg bg-[#2DB742] px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-[#259635] disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-10 md:h-11"
          onClick={handleRunActivities}
          disabled={isPending || statusSession == "COMPLETED" || !canRun}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          {isPending ? "Starting..." : "Run Activities"}
        </button>
      </div>
    </div>
  );
}