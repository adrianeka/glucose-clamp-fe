"use client";
import { ArrowLeft, Clock3, MoreVertical,CircleStop, CirclePause } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionCountdown } from "../hooks/sessionRunningHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import ModalConfirmationEndSessionRunning from "./ModalConfirmationEndSessionRunning";

export default function RunningHeader({ sessionData, onViewAll }: { sessionData: any, onViewAll: () => void }) {
  const router = useRouter();
  const [openEndDialog, setOpenEndDialog] = useState(false);

  //Ambil menit terakhir (270)
  const activities = sessionData?.activities || [];
  const lastActivity = activities.length > 0 ? activities[activities.length - 1] : null;
  const totalMinutes = lastActivity ? lastActivity.minute : 0;

  // Hook akan otomatis menghitung sisa waktu berdasarkan jam sekarang
  const countdown = useSessionCountdown(sessionData?.startTime, totalMinutes);

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        {/* Tombol Back */}
        <button 
          onClick={() => router.back()} 
          className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Session ID */}
        <h1 className="text-[30px] font-bold text-[#212121]">
          S-{sessionData?.sessionId}
        </h1>

        {/* Divider Vertical */}
        <div className="h-10 w-[1px] bg-gray-300 mx-2" />

        {/* Info Partisipan & Protokol */}
        <div>
          <div className="font-semibold text-lg text-[#212121]">
            Participant: {sessionData?.participantName || "Loading..."}
          </div>
          <div className="text-sm text-[#707784]">
            {sessionData?.protocolName} • {sessionData?.visitDate}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Button View All */}
        <button 
          onClick={onViewAll}
          className="px-4 py-2 bg-white border border-[#0076D2] text-[#0076D2] rounded-lg font-medium hover:bg-blue-50 transition-colors">
          View All Activities
        </button>

        {/* Timer Box */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-mono font-bold text-lg text-[#212121] min-w-[140px] justify-center">
          <Clock3 size={20} className="text-gray-400" />
          {countdown}
        </div>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg">
              <MoreVertical size={20} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 rounded-xl border border-gray-200 p-2 shadow-lg"
          >
            <DropdownMenuItem
              onClick={() => setOpenEndDialog(true)}
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

        <ModalConfirmationEndSessionRunning
          open={openEndDialog}
          onOpenChange={setOpenEndDialog}
          onConfirm={() => {
            console.log("END SESSION");
            setOpenEndDialog(false);
          }}
        />
      </div>
    </div>
  );
}