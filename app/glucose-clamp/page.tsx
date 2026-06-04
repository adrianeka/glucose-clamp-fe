"use client";

import { useState } from "react";
import { useClampStore } from "@/features/glucose-clamp/store/useClampStore";
import {
  Sidebar,
  KpiBar,
  ProtocolSection,
  ScheduleSection,
  SessionSection,
  RunSection,
} from "@/features/glucose-clamp/components";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function GlucoseClampPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { seedDefaultProtocol, resetDemo } = useClampStore();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (mobile: overlay, desktop: persistent) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed lg:static z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col gap-5 p-5">
        {/* Topbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Simulasi Demo Stakeholder</h2>
              <p className="text-sm text-muted-foreground">
                Flow demo:{" "}
                <strong>protocol setup → schedule setup → activity generation → session creation → run session</strong>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={seedDefaultProtocol}>
              Load Example Protocol
            </Button>
            <Button variant="ghost" onClick={resetDemo}>
              Reset Demo
            </Button>
          </div>
        </div>

        {/* KPI bar */}
        <KpiBar />

        {/* Sections */}
        <ProtocolSection />
        <ScheduleSection />
        <SessionSection />
        <RunSection />
      </main>
    </div>
  );
}
