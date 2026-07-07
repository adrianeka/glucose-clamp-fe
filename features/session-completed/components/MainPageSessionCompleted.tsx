import { useRef, useState } from "react";
import SessionCompletedHeader from "./SessionCompletedHeader";
import MainGDChartCompleted from "./MainGDChartCompleted";
import SubChartsCompleted from "./SubChartsCompleted";

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

export default function MainPageSessionCompleted({ sessionId, sessionData }: MainPageSessionCompletedProps) {
    const activities = sessionData?.activities || [];

    const mainChartRef = useRef<HTMLDivElement>(null);
    const subChartsRef = useRef<HTMLDivElement>(null);

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

                    <div className="flex gap-4 w-full max-w-full mb-6 overflow-hidden">
                        <div className="w-[50%] flex-shrink-0" ref={mainChartRef}>
                            <MainGDChartCompleted protocolId={sessionData.protocolId} sessionData={sessionData} />
                        </div>

                        <div className="flex flex-1 min-w-0 w-[50%] flex-shrink-0 gap-4" ref={subChartsRef}>
                            <SubChartsCompleted protocolId={sessionData.protocolId} sessionData={sessionData} />
                        </div>
                    </div>

                    <div className="max-h-[500px] rounded-xl border border-[#E2E4E6] overflow-hidden bg-white shadow-sm flex flex-col">
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                        >
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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