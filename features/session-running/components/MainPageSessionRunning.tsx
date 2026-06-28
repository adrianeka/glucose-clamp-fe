"use client";

import { useState, useEffect, useMemo } from "react";

// Components
import RunningHeader from "@/features/session-running/components/RunningHeader";
import NextActivityBanner from "@/features/session-running/components/NextActivityBanner";
import MainGDChart from "@/features/session-running/components/MainGDChart";
import SubCharts from "@/features/session-running/components/SubCharts";
import InfusionMonitoringSidebar from "@/features/session-running/components/InfusionMonitoringSidebar";
import ModalViewAllActivity from "@/features/session-running/components/ModalViewAllActivity";
import { PreparationDialog } from "./modalStepActivity/ModalPreparationData";
import { BloodSampleDialog } from "./modalStepActivity/ModalBloodDraw"; 
import ModalOtherActivity from "./modalStepActivity/ModalOtherActivity";
import ModalSessionCompleted from "./modalStepActivity/ModalCompleted";
import { ConfirmBloodDrawDialog } from "@/features/session-running/components/modalStepActivity/ConfirmBloodDrawDialog";
import { ConfirmPreparationDialog } from "@/features/session-running/components/modalStepActivity/ConfirmPreparationDialog";
import { useQueryClient } from "@tanstack/react-query";

// Hooks
import { useGlobalConfig } from "@/features/global-configuration-uzy/hooks/globalConfigurationHook";

interface SessionRunningPageProps {
    sessionId: number;
    sessionData: any;
}

export default function SessionRunningPage({ sessionId, sessionData }: SessionRunningPageProps) {
    const [prepStep, setPrepStep] = useState<"Close" | "FORM" | "CONFIRM" | "DONE">("FORM");
    const [bloodStep, setBloodStep] = useState<"Close" | "FORM" | "CONFIRM" | "DONE">("FORM");

    const [tempPrepData, setTempPrepData] = useState(null);
    const [tempBloodData, setTempBloodData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCompleteOpen, setIsModalCompleteOpen] = useState(false);
    const [processedIds, setProcessedIds] = useState<number[]>([]);
    const { data: configData, isLoading: isConfigLoading } = useGlobalConfig(1);
    // Inisialisasi Mutation Hook
    const queryClient = useQueryClient();

    // LOGIKA ANTREAN
    const dialogQueue = useMemo(() => {
        if (!sessionData?.activities) return [];
        return sessionData.activities.filter((act: any) => 
            act.activityStatus === "IN_PROGRESS" && 
            ["PREPARATION_CHECK","STABILIZATION", "INSULIN_CHECK", "BLOOD_DRAW", "OTHER", "INSULIN_INJECTION", "FINAL_OBSERVATION", "DEXTROSE_STOP_CHECK"].includes(act.activityType) &&
            !processedIds.includes(act.activityId)
        );
    }, [sessionData?.activities, processedIds]);

    const currentActiveDialog = dialogQueue[0];

    const hasMoreDialogs = useMemo(() => {
        if (!currentActiveDialog) return false;
        return dialogQueue.length > 1;
    }, [dialogQueue]);

    // Handler Umum setelah API Sukses
    const handleSuccessStep = (activityId: number) => {
        setProcessedIds((prev) => [...prev, activityId]);
    };

    const handlePreparationDraft = (data: any) => {
        setTempPrepData(data);
        setPrepStep("CONFIRM");
    };

    const handlePrepCancel = () => {
        setPrepStep("Close");
    };
    const handleBackToFormPrep = () => {
        setPrepStep("FORM"); 
    };
    const handlePrepSuccess = async () => {
        setPrepStep("DONE");

        handleSuccessStep(currentActiveDialog.activityId);

        await queryClient.invalidateQueries({
            queryKey: ["session-detail", sessionId]
        });
         await queryClient.refetchQueries({
            queryKey:["session-tracking", sessionId]
        });
    };
    const handleBloodDraft = (data: any) => {
        setTempBloodData(data);
        setBloodStep("CONFIRM");
    };

    const handleBloodCancel = () => {
        setBloodStep("Close");
    };

    const handleBackToFormBlood = () => {
        setBloodStep("FORM"); 
    };

    const handleBloodSuccess = async () => {
        setBloodStep("DONE");
        handleSuccessStep(currentActiveDialog.activityId);

        await queryClient.invalidateQueries({
            queryKey: ["session-detail", sessionId]
        });
        await queryClient.refetchQueries({
            queryKey:["session-tracking", sessionId]
        });
    };
    

    useEffect(() => {
        setPrepStep("FORM");
        setBloodStep("FORM");
        // reset setiap activity berubah
        setTempPrepData(null);
        setTempBloodData(null);
    }, [currentActiveDialog?.activityId]);

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#333]">
            <div className="max-w-[1600px] mx-auto">
                <RunningHeader 
                    sessionData={sessionData}
                    onViewAll={() => setIsModalOpen(true)}
                />

                <div className="p-3 bg-white rounded-xl border border-[#E2E4E6]">
                    <div className=" bg-white mb-4 align-middle">
                        <NextActivityBanner sessionData={sessionData} configData={configData} />
                    </div>

                    <div className="mt-6 flex gap-2">
                        <div className="flex-1 min-w-0">
                            <MainGDChart protocolId={sessionData.protocolId} sessionData={sessionData}/>
                            <div className="mt-2">
                                <SubCharts protocolId={sessionData.protocolId} sessionData={sessionData}/>
                            </div>
                        </div>

                        <div style={{ width: "450px", flexShrink: 0, borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            <InfusionMonitoringSidebar sessionId={sessionData?.sessionId}/>
                        </div>
                    </div>
                </div>
            </div>

            <ModalViewAllActivity 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sessionData={sessionData}
            />

            {/* --- DIALOG RENDERER --- */}
            
            <PreparationDialog
                isOpen={
                    currentActiveDialog?.activityType === "PREPARATION_CHECK" &&
                    prepStep === "FORM"
                }
                activity={currentActiveDialog}
                defaultValues={tempPrepData}
                onSubmit={handlePreparationDraft}
                onCancel={handlePrepCancel}
            />

            <ConfirmPreparationDialog
                sessionId={sessionData?.sessionId}
                isOpen={
                    currentActiveDialog?.activityType === "PREPARATION_CHECK" &&
                    prepStep === "CONFIRM"
                }
                activity={currentActiveDialog}
                data={tempPrepData}
                onCancel={handleBackToFormPrep}
                onSuccess={handlePrepSuccess}
            />

            <BloodSampleDialog
                isOpen={
                    (
                        currentActiveDialog?.activityType === "BLOOD_DRAW" ||
                        currentActiveDialog?.activityType === "INSULIN_CHECK"
                    ) &&
                    bloodStep === "FORM"
                }
                activity={currentActiveDialog}
                defaultValues={tempBloodData}
                onSubmit={handleBloodDraft}
                onCancel={handleBloodCancel}
            />

            <ConfirmBloodDrawDialog
                isOpen={
                    (
                        currentActiveDialog?.activityType === "BLOOD_DRAW" ||
                        currentActiveDialog?.activityType === "INSULIN_CHECK"
                    ) &&
                    bloodStep === "CONFIRM"
                }
                activity={currentActiveDialog}
                data={tempBloodData}
                onCancel={handleBackToFormBlood}
                onSuccess={handleBloodSuccess}
            />

            {/* 4. Other Activities */}
            <ModalOtherActivity
                isOpen={["STABILIZATION","INSULIN_INJECTION","OTHER", "FINAL_OBSERVATION", "DEXTROSE_STOP_CHECK"].includes(currentActiveDialog?.activityType)}
                onOpenChange={(open) => !open && handleSuccessStep(currentActiveDialog.activityId)}
                sessionId={sessionId}
                activityData={currentActiveDialog}
            />

            <ModalSessionCompleted
                isOpen={isModalCompleteOpen}
                sessionId={sessionData?.sessionId}
            />
        </div>
    );
}