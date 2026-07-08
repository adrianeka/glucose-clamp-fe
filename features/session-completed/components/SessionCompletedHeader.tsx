"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock3, Download, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ClampingReportDocument from "./ClampingReportDocument";
import { pdf } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import dayjs from "dayjs";
import { useProtocolDetail } from "@/features/protocol-sampling/hooks/ProtocolSamplingHook";

export default function SessionCompletedHeader({
    sessionData,
    mainChartRef,
    subChartsRef,
}: {
    sessionData: any;
    mainChartRef: React.RefObject<HTMLDivElement | null>;
    subChartsRef: React.RefObject<HTMLDivElement | null>;
}) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const searchParams = useSearchParams();

    const protocolId = sessionData?.protocolId;
    const { data: protocolResponse } = useProtocolDetail(protocolId);
    const protocol = protocolResponse?.data;

    const targetMin = protocol?.glucose_target_min ?? 80;
    const targetMax = protocol?.glucose_target_max ?? 100;
    const extremeMin = protocol?.glucose_target_min_extreme ?? 70;
    const extremeMax = protocol?.glucose_target_max_extreme ?? 120;

    const calculateAUC = (data: Array<{ time: string; glucose: number }>) => {
        if (!data || data.length < 2) return 0;

        let totalAUC = 0;

        for (let i = 0; i < data.length - 1; i++) {
            const current = data[i];
            const next = data[i + 1];

            const avgGlucose = (current.glucose + next.glucose) / 2;

            const timeCurrent = dayjs(`2026-01-01 T${current.time}`);
            const timeNext = dayjs(`2026-01-01 T${next.time}`);
            const deltaHours = timeNext.diff(timeCurrent, 'minute') / 60;

            totalAUC += avgGlucose * deltaHours;
        }
        return Number(totalAUC.toFixed(2));
    };

    const handleDownload = async () => {
        if (!mainChartRef.current || !subChartsRef.current) return;
        setIsDownloading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const measurementsData = (() => {
                if (!sessionData?.activities?.length) {
                    return [
                        { time: "00:00", glucose: 0, operator: "System", targetMin, targetMax, extremeMin, extremeMax },
                        { time: "24:00", glucose: 0, operator: "System", targetMin, targetMax, extremeMin, extremeMax },
                    ];
                }

                console.log("Daftar Activities:", sessionData.activities);

                return sessionData.activities
                    .flatMap((activity: any) => {
                        const labResults = activity.labResults || [];

                        const glucoseLabs = labResults.filter(
                            (lab: any) => (lab.parameter_name || lab.parameterName) === "Glucose"
                        );

                        return glucoseLabs.map((lab: any) => {
                            const operatorName = lab.updated_by_name || lab.updatedByName || "System";

                            return {
                                time: dayjs(activity.time).format("HH:mm"),
                                glucose: Number(lab.value),
                                operator: operatorName,
                                targetMin,
                                targetMax,
                                extremeMin,
                                extremeMax
                            };
                        });
                    })
                    .sort((a: any, b: any) => a.time.localeCompare(b.time));
            })();

            const pkMeasurements = (() => {
                if (!sessionData?.activities?.length) return [];
                return sessionData.activities
                    .flatMap((activity: any) => {
                        const labs = activity.labResults || [];
                        const pkLabs = labs.filter((lab: any) => lab.parameter_name === "PK");
                        return pkLabs.map((lab: any) => ({
                            time: dayjs(activity.time).format("HH:mm"),
                            value: Number(lab.value),
                            unit: lab.unit || "mg/L",
                            operator: lab.updated_by_name || lab.updatedByName || "System"
                        }));
                    })
                    .sort((a: any, b: any) => a.time.localeCompare(b.time));
            })();

            const cPeptideMeasurements = (() => {
                if (!sessionData?.activities?.length) return [];
                return sessionData.activities
                    .flatMap((activity: any) => {
                        const labs = activity.labResults || [];
                        const peptideLabs = labs.filter((lab: any) => lab.parameter_name === "C-Peptide");
                        return peptideLabs.map((lab: any) => ({
                            time: dayjs(activity.time).format("HH:mm"),
                            value: Number(lab.value),
                            unit: lab.unit || "ng/mL",
                            operator: lab.updated_by_name || lab.updatedByName || "System"
                        }));
                    })
                    .sort((a: any, b: any) => a.time.localeCompare(b.time));
            })();

            const aucValue = calculateAUC(measurementsData);

            const captureOptions = {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#FFFFFF",
                style: { width: "1200px", height: "auto" }
            };

            const [mainChartUrl, subChartsUrl] = await Promise.all([
                toPng(mainChartRef.current, captureOptions),
                toPng(subChartsRef.current, captureOptions)
            ]);

            const doc = (
                <ClampingReportDocument
                    sessionData={sessionData}
                    mainChartImage={mainChartUrl}
                    subChartImage={subChartsUrl}
                    measurements={measurementsData}
                    aucValue={aucValue}
                    glucoseTargets={{
                        targetMin,
                        targetMax,
                        extremeMin,
                        extremeMax
                    }}
                    pkMeasurements={pkMeasurements}
                    cPeptideMeasurements={cPeptideMeasurements}
                />
            );

            const asBlob = await pdf(doc).toBlob();

            // Trigger Download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(asBlob);
            link.download = `Laporan_Clamping_S-${sessionData?.sessionId || "Session"}.pdf`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error("Gagal membuat PDF:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const hasTriggeredDownload = useRef(false);

    useEffect(() => {
        const shouldDownload = searchParams.get("download") === "true";

        if (!shouldDownload || hasTriggeredDownload.current) return;

        if (mainChartRef.current && subChartsRef.current && sessionData) {
            hasTriggeredDownload.current = true;

            handleDownload();

            const url = new URL(window.location.href);
            url.searchParams.delete("download");
            window.history.replaceState({}, "", url.toString());
        }
    }, [searchParams, sessionData, mainChartRef, subChartsRef]);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">            
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <button
                    onClick={() => router.back()}
                    className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
                >
                    <ArrowLeft size={20} />
                </button>

                <h1 className="text-2xl md:text-[30px] font-bold text-[#212121] shrink-0">
                    S-{sessionData?.sessionId}
                </h1>

                <div className="h-6 md:h-10 w-[1px] bg-gray-300 mx-1 md:mx-2 shrink-0" />

                <div className="min-w-0">
                    <div className="font-semibold text-sm md:text-lg text-[#212121] truncate">
                        Participant: {sessionData?.participantName || "Loading..."}
                    </div>
                    <div className="text-xs md:text-sm text-[#707784] truncate">
                        {sessionData?.protocolName} • {sessionData?.visitDate}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 md:px-4 py-2 rounded-lg font-mono font-semibold text-sm md:text-lg text-[#707784] min-w-[120px] md:min-w-[140px] justify-center h-10 md:h-11">
                    <Clock3
                        size={16}
                        className="text-gray-400"
                    />
                    Completed
                </div>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FABA00] border border-[#FABA00] text-white rounded-lg font-medium hover:bg-[#F9C000] transition-colors cursor-pointer disabled:opacity-50 h-10 md:h-11 text-sm md:text-base"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{isDownloading ? "Generating..." : "Download File"}</span>
                </button>
            </div>
        </div>
    );
}