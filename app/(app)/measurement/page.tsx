"use client";

import { DashboardStats } from "@/features/measurement-list/components/DashboardStats";
import { PatientTable } from "@/features/measurement-list/components/PatientTable";

export default function MeasurementListPage() {
  return (
    <div className="flex-1 w-full max-w-[1728px] mx-auto flex flex-col overflow-y-auto">
      <DashboardStats />
      <PatientTable />
    </div>
  );
}