"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ModalAddInfusion from "./ModalAddInfusion";
import { useInfusion } from "../hooks/useInfusionMonitoring";
import { Session } from "inspector/promises";

// const history = [
//   { time: "09:10", glucose: 82.0, rate: 11.5, confirm: "4.0" , adjustment_note : "ini adalah keterangan"},
//   { time: "08:35", glucose: 87.2, rate: 11.7, confirm: "4.0" , adjustment_note : "ini adalah keterangan"},
//   { time: "08:10", glucose: 85.9, rate: 11.9, confirm: "4.0" , adjustment_note : "ini adalah keterangan"},
// ];

interface Props {
  sessionId: number;
}

export default function InfusionMonitoringSidebar({
  sessionId,
}: Props) {
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
        <div className="flex items-center justify-between mb-8 gap-4">
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
            className="flex items-center gap-1 px-3 py-2 bg-[#0076D2] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} strokeWidth={3} />
            Add Infusion
          </button>
        </div>

        <div className="flex-1 overflow-x-auto min-h-0 bg-[#FAFAFA]">
          <table className="min-w-[300px] text-left">
            <thead>
              <tr className="text-[#0076D2] text-[8px] font-bold bg-[#F1F9FA]">
                <th className="px-4 py-4">Time</th>
                <th className="px-4 py-4">Glucose Value</th>
                <th className="px-4 py-4">Rate (GIR)</th>
                <th className="px-4 py-4">Confirmation GIR</th>
                <th className="px-4 py-4">Adjustment Note</th>
              </tr>
            </thead>

            <tbody className="bg-[#FAFAFA]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    No infusion data
                  </td>
                </tr>
              ) : (
                history.map((item: any) => (
                  <tr key={item.infusionId}>
                    <td className="py-5 px-4">
                      {formatTime(item.time)}
                    </td>

                    <td className="py-5 px-4">
                      {item.glucoseValue ?? "-"}
                    </td>

                    <td className="py-5 px-4">
                      {item.recommendedGir ?? "-"}
                    </td>

                    <td className="py-5 px-4">
                      {item.actualGir ?? "-"}
                    </td>

                    <td className="py-5 px-4">
                      {item.adjustmentNote || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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