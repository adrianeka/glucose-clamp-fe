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
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/lib/utils";

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
    const queryClient = useQueryClient();

    // LOGIKA ANTREAN
    const dialogQueue = useMemo(() => {
        if (!sessionData?.activities) return [];
        return sessionData.activities.filter((act: any) =>
            act.activityStatus === "IN_PROGRESS" &&
            ["PREPARATION_CHECK", "STABILIZATION", "INSULIN_CHECK", "BLOOD_DRAW", "OTHER", "INSULIN_INJECTION", "FINAL_OBSERVATION", "DEXTROSE_STOP_CHECK"].includes(act.activityType) &&
            !processedIds.includes(act.activityId)
        );
    }, [sessionData?.activities, processedIds]);

    const currentActiveDialog = dialogQueue[0];

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
            queryKey: ["session-tracking", sessionId]
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
            queryKey: ["session-tracking", sessionId]
        });
    };

    useEffect(() => {
        setPrepStep("FORM");
        setBloodStep("FORM");
        setTempPrepData(null);
        setTempBloodData(null);
    }, [currentActiveDialog?.activityId]);

    // completed session
    useEffect(() => {
        if (sessionData) {
            const isAllCompleted = sessionData.completedActivities === sessionData.totalActivities;
            const isProgressMax = sessionData.progressPercentage === 100;

            if ((isAllCompleted || isProgressMax) && sessionData.sessionStatus === "RUNNING") {
                setIsModalCompleteOpen(true);
            } else {
                setIsModalCompleteOpen(false);
            }
        }
    }, [sessionData?.completedActivities, sessionData?.totalActivities, sessionData?.progressPercentage, sessionData?.sessionStatus]);
    
    const { canEdit: canEditSession } = usePermission("SESSION");
    const { canView: canViewBD } = usePermission("BLOODDRAW");
    const { canView: canViewIM } = usePermission("INFUSIONMONITORING");
    const { canAdd: canAddPC } = usePermission("PREPARATIONCHECK");

    const showCharts = canViewBD;
    const showInfusion = canViewIM;

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#333] p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto">
                <RunningHeader
                    sessionData={sessionData}
                    onViewAll={() => setIsModalOpen(true)}
                    canEnd={canEditSession}
                />

                <div className="p-3 md:p-5 bg-white rounded-xl border border-[#E2E4E6]">
                    <div className="bg-white mb-4 align-middle">
                        <NextActivityBanner sessionData={sessionData} configData={configData} />
                    </div>

                    <div className="mt-6 flex flex-col lg:flex-row gap-4">
                        {/* Wrapper Grafik */}
                        {showCharts && (
                            <div className="flex-1 min-w-0 w-full">
                                <MainGDChart protocolId={sessionData.protocolId} sessionData={sessionData} />
                                <div className="mt-4">
                                    <SubCharts protocolId={sessionData.protocolId} sessionData={sessionData} />
                                </div>
                            </div>
                        )}

                        {showInfusion && (
                            <div 
                                className={cn(
                                    "w-full min-w-0",
                                    showCharts ? "lg:w-[450px] lg:shrink-0" : "flex-1"
                                )}
                                style={{ 
                                    borderRadius: "8px", 
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
                                }}
                            >
                                <InfusionMonitoringSidebar sessionId={sessionData?.sessionId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalViewAllActivity
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sessionData={sessionData}
            />

            {/* --- DIALOG RENDERER --- */}
            {canAddPC && (
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
            )}

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

            <ModalOtherActivity
                isOpen={["STABILIZATION", "INSULIN_INJECTION", "OTHER", "FINAL_OBSERVATION", "DEXTROSE_STOP_CHECK"].includes(currentActiveDialog?.activityType)}
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