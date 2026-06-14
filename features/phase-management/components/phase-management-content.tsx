"use client";

import { AddPhaseForm } from "./add-phase-form";
import { PhaseConfigTable } from "./phase-config-table";

export function PhaseManagementContent() {
  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-140px)]">
      <div className="flex items-center gap-2">
        <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
          Phase Management
        </h1>
        <div className="w-[1.5px] h-6 bg-[#C6C8CE]" />
        <span className="text-[#707784] text-sm font-normal leading-5">
          Configure sequential clinical workflow phases
        </span>
      </div>

      <div className="flex gap-6 items-start h-full pb-6">
        <div className="w-[380px] flex-shrink-0">
          <AddPhaseForm />
        </div>
        <div className="flex-1">
          <PhaseConfigTable />
        </div>
      </div>
    </div>
  );
}
