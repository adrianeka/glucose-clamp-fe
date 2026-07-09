import { useEffect, useRef, useState } from "react";
import SessionCompletedHeader from "./SessionCompletedHeader";
import MainGDChartCompleted from "./MainGDChartCompleted";
import SubChartsCompleted from "./SubChartsCompleted";
import { getProtocolById } from "@/features/protocol-sampling/services/ProtocolSamplingService";

interface MainPageSessionCompletedProps {
    sessionId: number;
    sessionData: any;
}

interface Activity {
    activityId: number;
    phaseName: string;
    time: string;
    activityType: string;
    activityDesc: string;
    activityStatus: string;
}

interface ProtocolDetail {
    protocol_id: number;
    protocol_code: string;
    protocol_name: string;
    insulin_dose_rule: string;
    insulin_dose_unit: string;
    glucose_target_min: number;
    glucose_target_max: number;
    glucose_target_unit: string;
    glucose_target_min_extreme: number;
    glucose_target_max_extreme: number;
    duration_hours: number;
    glucose_drop_trigger_percentage: number;
    initial_glucose_infusion_rate: number;
    initial_glucose_infusion_rate_unit: string;
    version: number;
}

export default function MainPageSessionCompleted({ sessionId, sessionData }: MainPageSessionCompletedProps) {
    const activities = sessionData?.activities || [];

    const mainChartRef = useRef<HTMLDivElement>(null);
    const subChartsRef = useRef<HTMLDivElement>(null);

    const [protocolDetail, setProtocolDetail] = useState<ProtocolDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        const fetchProtocol = async () => {
            if (sessionData?.protocolId) {
                setIsLoading(true);
                try {
                    const response = await getProtocolById(sessionData.protocolId);
                    setProtocolDetail(response.data);
                } catch (error) {
                    console.error("Failed to fetch protocol details:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProtocol();
    }, [sessionData?.protocolId]);

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#333]">
            <div className="max-w-[1600px] mx-auto">
                <SessionCompletedHeader
                    sessionData={sessionData}
                    mainChartRef={mainChartRef}
                    subChartsRef={subChartsRef}
                />

                <div className="p-5 bg-white rounded-xl border border-[#E2E4E6] mt-6">
                    <div className="bg-white mb-6 align-middle">
                        <h1 className="text-xl font-bold text-[#43474F]">Session Activities</h1>
                        <p className="text-[#737780] text-sm">Activities based on the selected protocol.</p>
                    </div>
                    <div className="mb-6 w-full bg-white rounded-xl border border-[#E2E4E6] p-5 text-[#43474F] text-sm font-medium shadow-sm">
                        <h2 className="text-[#737780] font-bold text-sm mb-4">Protocol Configuration - {protocolDetail?.protocol_name}</h2>

                        {isLoading ? (
                            <div className="text-center py-4 text-[#737780] animate-pulse">
                                Loading protocol configurations...
                            </div>
                        ) : protocolDetail ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">

                                <div className="space-y-0">
                                    <div className="grid grid-cols-[200px_10px_1fr] py-2.5 border-b border-[#E2E4E6]">
                                        <div>Duration</div>
                                        <div>:</div>
                                        <div className="font-semibold text-slate-800">{protocolDetail.duration_hours ?? "-"} hours</div>
                                    </div>
                                    <div className="grid grid-cols-[200px_10px_1fr] py-2.5 border-b border-[#E2E4E6]">
                                        <div>Insulin Dose</div>
                                        <div>:</div>
                                        <div className="font-semibold text-slate-800">{protocolDetail.insulin_dose_rule ?? "-"} {protocolDetail.insulin_dose_unit ?? "-"}</div>
                                    </div>
                                </div>

                                <div className="space-y-0">
                                    <div className="grid grid-cols-[200px_10px_1fr] py-2.5 border-b border-[#E2E4E6]">
                                        <div>Target Glucose</div>
                                        <div>:</div>
                                        <div className="font-semibold text-slate-800">
                                            {protocolDetail.glucose_target_min ?? "-"} - {protocolDetail.glucose_target_max ?? "-"} {protocolDetail.glucose_target_unit ?? "-"}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[200px_10px_1fr] py-2.5">
                                        <div>Target Glucose Extreme</div>
                                        <div>:</div>
                                        <div className="font-semibold text-slate-800">
                                            {protocolDetail.glucose_target_min_extreme ?? "-"} - {protocolDetail.glucose_target_max_extreme ?? "-"} {protocolDetail.glucose_target_unit ?? "-"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="text-center py-4 text-sm text-amber-600">
                                Protocol detail data is unavailable.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-full mb-6 overflow-hidden">
                        <div className="w-full lg:w-[45%] flex-shrink-0" ref={mainChartRef}>
                            <MainGDChartCompleted protocolId={sessionData.protocolId} sessionData={sessionData} />
                        </div>
                        <div className="flex flex-col md:flex-row flex-1 min-w-0 w-full lg:w-[55%] flex-shrink-0 gap-4" ref={subChartsRef}>
                            <SubChartsCompleted protocolId={sessionData.protocolId} sessionData={sessionData} />
                        </div>
                    </div>

                    <div className="max-h-[500px] rounded-xl border border-[#E2E4E6] overflow-hidden bg-white shadow-sm flex flex-col w-full">
                        <div
                            className="w-full overflow-x-auto"
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "auto",
                            }}
                        >
                            <table className="min-w-[700px] w-full" style={{ borderCollapse: "collapse" }}>
                                <thead className="sticky top-0 z-30 bg-[#F1F9FA]">
                                    <tr>
                                        <th className="w-[60px] px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">No</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">Phase</th>
                                        <th className="w-[100px] px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">Time</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">Activity Type</th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E4E6]">
                                    {activities.map((item: Activity, index: number) => (
                                        <tr key={item.activityId} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-4 text-sm text-[#595F6A]">{index + 1}</td>
                                            <td className="px-4 py-4 text-sm text-[#595F6A] font-medium">{item.phaseName}</td>
                                            <td className="px-4 py-4 text-sm text-[#595F6A] whitespace-nowrap font-mono">{formatTime(item.time)}</td>
                                            <td className="px-4 py-4 text-sm text-[#0076D2] font-semibold text-[12px]">{item.activityType}</td>
                                            <td className="px-4 py-4 text-sm text-[#595F6A]">
                                                <div className="line-clamp-2" title={item.activityDesc}>{item.activityDesc}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {activities.length === 0 && (
                                <div className="py-20 text-center text-[#707784]">No activities found</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}