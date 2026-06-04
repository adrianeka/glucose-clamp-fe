"use client";

import { useClampStore } from "../store/useClampStore";

export function KpiBar() {
  const { protocols, schedules, activities } = useClampStore();

  const kpis = [
    { label: "Protocols", value: protocols.length },
    { label: "Schedule Rows", value: schedules.length },
    { label: "Generated Activities", value: activities.length },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map(({ label, value }) => (
        <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-3xl font-extrabold mt-2">{value}</div>
        </div>
      ))}
    </div>
  );
}
