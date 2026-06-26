"use client";

import { useParams } from "next/navigation";
import RunningHeader from "@/features/session-running/components/RunningHeader";
import NextActivityBanner from "@/features/session-running/components/NextActivityBanner";
import MainGDChart from "@/features/session-running/components/MainGDChart";
import SubCharts from "@/features/session-running/components/SubCharts";
import InfusionMonitoringSidebar from "@/features/session-running/components/InfusionMonitoringSidebar";
import { useGlobalConfig } from "@/features/global-configuration-uzy/hooks/globalConfigurationHook";
import { useState, useEffect, useMemo } from "react";
import ModalViewAllActivity from "@/features/session-running/components/ModalViewAllActivity";
import InsulinDialog from "@/features/session-running/components/modalStepActivity/ModalInsulinInjection";
import PreparationDialog from "@/features/session-running/components/modalStepActivity/ModalPreparationData";
import { GlucoseDialog } from "@/features/session-running/components/modalStepActivity/ModalBloofDraw";
import ModalOtherActivity from "./modalStepActivity/ModalOtherActivity";
import ModalSessionCompleted from "./modalStepActivity/ModalCompleted";
import { useNextProgressActivity } from "@/features/session-creation/hooks/SessionCreationHook";
import { useRouter } from "next/navigation";

interface SessionRunningPageProps{
    sessionId: number;
    sessionData: any;
}

export default function SessionRunningPage({sessionId, sessionData}:SessionRunningPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCompleteOpen, setIsModalCompleteOpen] = useState(false);
    const { mutate: nextProgress } = useNextProgressActivity();
    const router = useRouter();
    
    // State untuk melacak aktivitas yang sudah disubmit agar tidak double popup
    const [processedIds, setProcessedIds] = useState<number[]>([]);
    const { data: configData, isLoading: isConfigLoading } = useGlobalConfig(1);

    // LOGIKA ANTREAN: Filter aktivitas IN_PROGRESS yang membutuhkan input data
    const dialogQueue = useMemo(() => {
        if (!sessionData?.activities) return [];
        return sessionData.activities.filter((act: any) => 
            act.activityStatus === "IN_PROGRESS" && 
            ["PREPARATION_CHECK", "INSULIN_CHECK", "BLOOD_DRAW", "OTHER", "INSULIN_INJECTION", "FINAL_OBSERVATION", "DEXTROSE_STOP_CHECK"].includes(act.activityType) &&
            !processedIds.includes(act.activityId)
        );
    }, [sessionData?.activities, processedIds]);

    // Ambil aktivitas pertama dari antrean
    const currentActiveDialog = dialogQueue[0];

    const hasMoreDialogs = useMemo(() => {
        if (!currentActiveDialog) return false;

        return sessionData.activities.some(
            (act: any) =>
            act.activityStatus === "IN_PROGRESS" &&
            !processedIds.includes(act.activityId) &&
            act.activityId !== currentActiveDialog.activityId &&
            [
                "PREPARATION_CHECK",
                "INSULIN_CHECK",
                "BLOOD_DRAW",
                "OTHER",
                "INSULIN_INJECTION",
                "FINAL_OBSERVATION",
                "DEXTROSE_STOP_CHECK",
            ].includes(act.activityType)
        );
    }, [sessionData.activities, processedIds, currentActiveDialog]);

    const handleFormSubmit = () => {
        if (!currentActiveDialog) return;

        // tandai selesai lokal
        setProcessedIds((prev) => [...prev, currentActiveDialog.activityId]);

        // masih ada dialog berikutnya
        if (hasMoreDialogs) {
            return;
        }

        // ini memang dialog terakhir
        // setIsModalCompleteOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#333]">
            <div className="max-w-[1600px] mx-auto">
                
                <RunningHeader 
                    sessionData={sessionData}
                    onViewAll={() => setIsModalOpen(true)}
                />

                <div className="p-3 bg-white rounded-xl border border-[#E2E4E6]">
                    <div className=" bg-white mb-4 align-middle">
                        <NextActivityBanner sessionData={sessionData} />
                    </div>

                    <div className="mt-6 flex gap-2">
                        <div className="flex-1 min-w-0">
                            <MainGDChart />
                            <div className="mt-2">
                                <SubCharts />
                            </div>
                        </div>

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
            <ModalViewAllActivity 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sessionData={sessionData}
            />

            {/* Dialog akan muncul secara otomatis dan berurutan sesuai antrean di bawah ini */}
            
            {/* Dialog Input Data Phase: PREPARATION_CHECK */}
            <PreparationDialog 
                isOpen={currentActiveDialog?.activityType === "PREPARATION_CHECK"}
                onOpenChange={(open) => !open && handleFormSubmit()}
                onSubmit={handleFormSubmit}
                activityData={currentActiveDialog} 
            />

            {/* Dialog Input Data Phase: INSULIN_CHECK */}
            <InsulinDialog 
                isOpen={currentActiveDialog?.activityType === "INSULIN_CHECK"}
                onOpenChange={(open) => !open && handleFormSubmit()}
                onSubmit={handleFormSubmit}
                activityData={currentActiveDialog}
            />

            <GlucoseDialog 
                isOpen={currentActiveDialog?.activityType === "BLOOD_DRAW"}
                onOpenChange={(open) => !open && handleFormSubmit()}
                onSubmit={handleFormSubmit}
                activityData={currentActiveDialog}
            />

            <ModalOtherActivity
                isOpen={currentActiveDialog?.activityType === "OTHER" ||  currentActiveDialog?.activityType ==="FINAL_OBSERVATION" || currentActiveDialog?.activityType ==="DEXTROSE_STOP_CHECK"}
                onOpenChange={(open) => !open && handleFormSubmit()}
                activityData={currentActiveDialog}
            />

            <ModalSessionCompleted
                isOpen={isModalCompleteOpen}
                sessionId={sessionData?.sessionId}
            />
        </div>
    );
}