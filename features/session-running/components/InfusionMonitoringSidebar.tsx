"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ModalAddInfusion from "./ModalAddInfusion";

const history = [
  { time: "09:10", glucose: 82.0, rate: 11.5, confirm: "4.0" },
  { time: "08:35", glucose: 87.2, rate: 11.7, confirm: "4.0" },
  { time: "08:10", glucose: 85.9, rate: 11.9, confirm: "4.0" },
];

export default function InfusionMonitoringSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
  <>
    <div className="bg-white rounded-2xl border border-[#E2E4E6] p-6 shadow-sm flex flex-col h-full w-full min-w-0 overflow-hidden">
        <div className="flex items-center justify-between mb-8 gap-4">
            <div className="min-w-0">
                <h3 className="font-bold text-lg text-[#212121] truncate">Infusion Monitoring</h3>
                <p className="text-xs text-[#707784] truncate">Manually recorded infusion data</p>
            </div>

            <button 
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-[#0076D2] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
                onClick={() => setIsModalOpen(true)}
            >
                <Plus size={16} strokeWidth={3} />
                Add Infusion
            </button>
        </div>

        <div className="flex-1 overflow-x-auto min-h-0 bg-[#FAFAFA]">
                <table className="min-w-[300px] text-left">
                    <thead>
                        <tr className="text-[#0076D2] text-[8px] font-bold bg-[#F1F9FA]">
                            <th className="px-4 py-4 align-middle whitespace-nowrap">Time</th>
                            <th className="px-4 py-4 align-middle whitespace-nowrap">Glucose Value</th>
                            <th className="px-4 py-4 align-middle whitespace-nowrap">Rate (GIR)</th>
                            <th className="px-4 py-4 align-middle whitespace-nowrap">Confirmation GIR</th>
                        </tr>
                    </thead>

                    <tbody className="bg-[#FAFAFA]">
                        {history.map((item, i) => (
                            <tr key={i}>
                                <td className="py-5 px-4 whitespace-nowrap">{item.time}</td>
                                <td className="py-5 px-4 whitespace-nowrap">
                                    {item.glucose.toFixed(1)}
                                </td>
                                <td className="py-5 px-4 whitespace-nowrap">
                                    {item.rate.toFixed(1)}
                                </td>
                                <td className="py-5 px-4 whitespace-nowrap">
                                    {item.confirm}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
        {/* Scrollbar dummy / Progress bar */}
        <div className="mt-auto pt-6">
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#D1D5DB] h-full w-1/3 rounded-full"></div>
            </div>
        </div>
    </div>
    
    <ModalAddInfusion 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
  </>
  );
}