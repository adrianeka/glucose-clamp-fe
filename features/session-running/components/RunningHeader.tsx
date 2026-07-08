"use client";

import { useState } from "react";
import { ArrowLeft, Clock3, MoreVertical, CircleStop } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModalConfirmationEndSessionRunning } from "./ModalConfirmationEndSessionRunning";
import { ConfirmEndSessionDialog } from "./ConfirmEndSessionDialog";
import SessionCountdown from "./helper/SessionCoundown";

export default function RunningHeader({
  sessionData,
  onViewAll,
  canEnd
}: {
  sessionData: any;
  onViewAll: () => void;
  canEnd: boolean;
}) {
  const router = useRouter();

  const [endSessionStep, setEndSessionStep] = useState<"Close" | "FORM" | "CONFIRM">("Close");
  const [tempEndSessionData, setTempEndSessionData] = useState<{ category: string; notes: string } | null>(null);

  const activities = sessionData?.activities || [];
  const lastActivity = activities.length > 0 ? activities[activities.length - 1] : null;
  const totalMinutes = lastActivity ? lastActivity.minute : 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        {/* Tombol Back */}
        <button
          onClick={() => router.back()}
          className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Session ID */}
        <h1 className="text-2xl md:text-[30px] font-bold text-[#212121] shrink-0">
          S-{sessionData?.sessionId}
        </h1>

        {/* Divider Vertical */}
        <div className="h-8 md:h-10 w-[1px] bg-gray-300 mx-1 md:mx-2 shrink-0" />

        {/* Info Partisipan & Protokol */}
        <div className="min-w-0">
          <div className="font-semibold text-base md:text-lg text-[#212121] truncate">
            Participant: {sessionData?.participantName || "Loading..."}
          </div>
          <div className="text-xs md:text-sm text-[#707784] truncate">
            {sessionData?.protocolName} • {sessionData?.visitDate}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
        {/* Button View All */}
        <button
          onClick={onViewAll}
          className="px-3.5 py-2 bg-white border border-[#0076D2] text-[#0076D2] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          View All Activities
        </button>

        {/* Timer Box */}
        <SessionCountdown
          startTime={sessionData?.startTime}
          totalMinutes={totalMinutes}
        />

        {/* More Actions */}
        {canEnd && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 rounded-xl border border-gray-200 p-2 shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => setEndSessionStep("FORM")}
                className="focus:bg-transparent data-[highlighted]:bg-transparent focus:text-red-600 data-[highlighted]:text-red-600"
                style={{
                  color: "#dc2626",
                  borderRadius: "8px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  cursor: "pointer",
                }}
              >
                <CircleStop
                  size={16}
                  style={{
                    color: "#dc2626",
                    marginRight: "8px",
                  }}
                />
                End Clamp Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ================= MODAL ALUR TERMINASI SESI (STEP 1 & 2) ================= */}
        {endSessionStep === "FORM" && (
          <ModalConfirmationEndSessionRunning
            isOpen={true}
            defaultValues={tempEndSessionData}
            onCancel={() => {
              setEndSessionStep("Close");
              setTempEndSessionData(null);
            }}
            onSubmit={(data) => {
              setTempEndSessionData(data);
              setEndSessionStep("CONFIRM");
            }}
            mode="manual"
          />
        )}

        {/* ================= MODAL RINGKASAN VERIFIKASI (STEP 3) ================= */}
        <ConfirmEndSessionDialog
          isOpen={endSessionStep === "CONFIRM"}
          sessionData={sessionData}
          data={tempEndSessionData}
          onCancel={() => setEndSessionStep("FORM")}
          onSuccess={() => {
            setEndSessionStep("Close");
            setTempEndSessionData(null);
          }}
        />
      </div>
    </div>
  );
}