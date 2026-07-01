"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ModalAddInfusion from "./ModalAddInfusion";
import { useInfusion } from "../hooks/useInfusionMonitoring";

interface Props {
  sessionId: number;
}

export default function InfusionMonitoringSidebar({ sessionId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { useGetInfusionsBySession } = useInfusion(sessionId);
  const { data, isLoading } = useGetInfusionsBySession();

  const history = data?.data ?? [];

  const formatTime = (time?: number[]) => {
    if (!time) return "-";
    const [, , , hour, minute] = time;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E2E4E6] p-6 shadow-sm flex flex-col h-full w-full min-w-0 overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="font-bold text-lg text-[#212121]">
              Infusion Monitoring
            </h3>
            <p className="text-xs text-[#707784]">
              Manually recorded infusion data
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0076D2] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={14} strokeWidth={3} />
            Add Infusion
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto min-h-0 bg-[#FAFAFA] rounded-xl border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse table-fixed min-w-[500px]">
            <thead>
              <tr className="text-[#0076D2] text-sm font-bold bg-[#F1F9FA] border-b border-[#E2E4E6]">
                <th className="px-4 py-3.5 w-[15%]">Time</th>
                <th className="px-4 py-3.5 w-[20%]">Glucose Value</th>
                <th className="px-4 py-3.5 w-[25%]">Recommendation (GIR)</th>
                <th className="px-4 py-3.5 w-[20%]">Actual GIR</th>
                <th className="px-4 py-3.5 w-[20%]">Adjustment Note</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-[#E2E4E6]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-gray-500">
                    No infusion data
                  </td>
                </tr>
              ) : (
                history.map((item: any) => (
                  <tr key={item.infusionId} className="hover:bg-[#FAFAFA] transition-colors text-sm text-[#212121]">
                    <td className="py-4 px-4 font-medium">
                      {formatTime(item.time)}
                    </td>

                    <td className="py-4 px-4">
                      {item.glucoseValue ?? "-"}
                    </td>

                    <td className="py-4 px-4">
                      {item.recommendedGir ?? "-"}
                    </td>

                    <td className="py-4 px-4">
                      {item.actualGir ?? "-"}
                    </td>

                    <td className="py-4 px-4">
                      {item.adjustmentNote ? (
                        item.adjustmentNote.length > 10 ? (
                          <div className="relative group inline-block">
                            {/* Teks Terpotong */}
                            <span className="cursor-help border-b border-dotted border-gray-400">
                              {item.adjustmentNote.substring(0, 10)}...
                            </span>

                            {/* Tooltip Popup */}
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-30 w-52 bg-gray-800 text-white text-xs rounded-lg p-2.5 shadow-lg pointer-events-none whitespace-normal break-all">
                              {item.adjustmentNote}
                              {/* Segitiga Tooltip */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                            </div>
                          </div>
                        ) : (
                          item.adjustmentNote
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Progress Bar Footer */}
        <div className="mt-auto pt-6">
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#D1D5DB] h-full w-1/3 rounded-full" />
          </div>
        </div>
      </div>

      <ModalAddInfusion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionId={sessionId}
      />
    </>
  );
}