"use client";

import { ArrowLeft, Clock3, Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionStart } from "../hooks/SessionCreationHook";
import { useToast } from "@/components/ui/toast";

interface ActivitiesHeaderProps {
  sessionId: number;
  participant: string;
  protocol: string;
  visitDate: string;
}

export default function ActivitiesHeader({
  sessionId,
  participant,
  protocol,
  visitDate,
}: ActivitiesHeaderProps) {
  const router = useRouter();
  const {showToast} = useToast();
  const { mutate: startSession, isPending } = useSessionStart();

  const handleRunActivities = () => {
    // Panggil API start session
    startSession(sessionId, {
      onSuccess: () => {
        showToast("running session successfully"),
        router.push(`/session-creation/${sessionId}/session-running`);
      },
      onError: (error:any) => {
        // Opsional: Tambahkan toast atau alert jika gagal
        showToast(error.message, "error"),
        console.error(error);
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-[#707784]"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-4xl font-semibold">
          {sessionId}
        </h1>

        <div>
          <div className="font-medium text-[#43474F]">
            Participant: {participant}
          </div>

          <div className="text-sm text-[#707784]">
            {protocol} • {visitDate}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <Clock3 size={16} />
          <span className="font-semibold">
            16:00:00
          </span>
        </div>

        <button
          className="flex items-center gap-2 rounded-lg bg-[#2DB742] px-4 py-2 text-white hover:bg-[#259635] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleRunActivities}
          disabled={isPending} // Disable tombol saat loading
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