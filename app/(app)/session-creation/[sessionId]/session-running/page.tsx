"use client";

import { useParams } from "next/navigation";
import RunningHeader from "@/features/session-running/components/RunningHeader";
import NextActivityBanner from "@/features/session-running/components/NextActivityBanner";
import MainGDChart from "@/features/session-running/components/MainGDChart";
import SubCharts from "@/features/session-running/components/SubCharts";
import InfusionMonitoringSidebar from "@/features/session-running/components/InfusionMonitoringSidebar";
import { useGlobalConfig } from "@/features/global-configuration-uzy/hooks/globalConfigurationHook";

export default function SessionRunningPage() {
    const { data, isLoading, error } = useGlobalConfig(1);
    if (isLoading) return <div>Loading config...</div>;
    const params = useParams();
    const sessionId = Number(
        params.sessionId
    );
  return (
    // Background #F8F9FB sesuai gambar
    <div className="min-h-screen bg-[#F8F9FB] text-[#333]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Bagian Atas */}
        <RunningHeader />

        <div className="p-3 bg-white rounded-xl border border-[#E2E4E6]">
            {/* Banner Aktivitas Selanjutnya */}
            <div className=" bg-white mb-4 align-middle">
                <NextActivityBanner />
            </div>

            {/* Konten Utama */}
            <div className="mt-6 flex gap-2"> {/* Perbesar gap antar kolom jadi 6 (24px) */}
                <div className="flex-1 min-w-0">
                    <MainGDChart />
                    <div className="mt-2">
                        <SubCharts />
                    </div>
                </div>

                {/* Sidebar dengan lebar yang cukup agar teks tidak bertumpuk */}
                <div style={{
                    width: "450px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}>
                    <InfusionMonitoringSidebar />
                </div>
            </div>
        </div>
        </div>
    </div>
  );
}