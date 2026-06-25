"use client";
import { ArrowLeft, Clock3, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RunningHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#212121",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          S-101
        </h1>
        <div className="h-10 w-[1px] bg-gray-300 mx-2" />
        <div>
          <div className="font-semibold text-lg text-[#212121]">Participant: Adrian Saputra</div>
          <div className="text-sm text-[#707784]">
            EGC001 v1.0 • Euglycemic Clamp • 2026-06-10, 07:00
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-white border border-[#0076D2] text-[#0076D2] rounded-lg font-medium hover:bg-blue-50 transition-colors">
          View All Activities
        </button>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-mono font-bold text-lg text-[#212121]">
          <Clock3 size={20} className="text-gray-400" />
          14:32:19
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}