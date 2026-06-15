"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Droplet } from "lucide-react";
import { ConfirmExecutionDialog } from "./ConfirmExecutionDialog";

interface InfusionDashboardProps {
  patientId: string;
}

export function InfusionDashboard({ patientId }: InfusionDashboardProps) {
  const [systemTime, setSystemTime] = useState<string>("10:06:06 AM");
  const [executedGir, setExecutedGir] = useState<string>("2");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const clockInterval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-7">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-[34px] font-bold text-[#43474F] leading-tight">Infusion Pump Execution</h1>
          <p className="text-lg font-medium text-[#707784]">Confirm and execute GIR adjustments for the current cycle.</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-base font-medium text-[#707784]">System Time</span>
          <span className="text-[36px] font-bold text-[#43474F] leading-none">{systemTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column: Current Status */}
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#0076D2]" />
            <h2 className="text-[22px] font-bold text-[#43474F]">Current Status</h2>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-[#F1F9FA] p-6">
            <span className="text-base font-medium text-[#0076D2]">Latest Glucose in Cycle</span>
            <div className="flex items-end gap-2">
              <span className="text-[42px] font-bold text-[#2D2F35] leading-none">105</span>
              <span className="text-base font-medium text-[#0076D2] pb-1">mg/dL</span>
            </div>
            <span className="text-sm font-medium text-[#707784] mt-2">Cycle 1 - 9:15:00 AM</span>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-[#FFFBF4] p-6">
            <span className="text-base font-medium text-[#E8A01D]">Target Range</span>
            <div className="flex items-end gap-2">
              <span className="text-[42px] font-bold text-[#2D2F35] leading-none">90 - 110</span>
              <span className="text-base font-medium text-[#E8A01D] pb-1">mg/dL</span>
            </div>
          </div>
        </div>

        {/* Right Column: GIR Control */}
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <Droplet className="h-6 w-6 text-[#0076D2]" />
            <h2 className="text-[22px] font-bold text-[#43474F]">GIR Control</h2>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <span className="text-sm font-medium text-[#707784] uppercase tracking-wider">RECOMMENDED GIR</span>
            <span className="text-[64px] font-bold text-[#0076D2] leading-none">2</span>
            <span className="text-sm font-medium text-[#707784]">mg/kg/min</span>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#43474F]">Executed GIR (mg/kg/min)</label>
            <Input 
              type="number" 
              placeholder="2" 
              value={executedGir}
              onChange={(e) => setExecutedGir(e.target.value)}
              className="h-14 rounded-xl border-[#E2E4E6] bg-[#FAFAFA] px-4 text-lg text-[#2D2F35]"
            />
            <span className="text-sm text-[#707784]">
              Confirm and execute GIR adjustments for the current cycle.
            </span>
          </div>

          <Button 
            onClick={() => setIsConfirmOpen(true)}
            className="mt-2 h-12 w-[220px] mx-auto rounded-full bg-[#0076D2] hover:bg-[#005ea8] px-6 text-lg font-medium text-white shadow-none"
          >
            Confirm Executing
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-transparent bg-white p-8 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] mt-2">
        <div className="flex flex-col gap-1 w-full text-left">
          <h2 className="text-[22px] font-bold text-[#43474F]">Infusion Pump Execution Logs</h2>
          <p className="text-base text-[#707784]">
            A detailed record of all Glucose Infusion Rate (GIR) adjustments and pump activities for audit trail purposes.
          </p>
        </div>
        
        <div className="py-8 text-center w-full">
          <p className="text-base font-medium text-[#707784]">No readings yet</p>
        </div>
      </div>

      <ConfirmExecutionDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        executedGir={executedGir}
        patientId={patientId}
        onConfirm={() => {
          // Add confirm logic here
          console.log("Confirmed GIR execution");
        }}
      />
    </div>
  );
}
