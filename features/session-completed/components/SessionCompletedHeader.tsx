"use client";

import { useState } from "react";
import { ArrowLeft, Clock3, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SessionCompletedHeader({
    sessionData,
}: {
    sessionData: any;
}) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
                {/* Tombol Back */}
                <button
                    onClick={() => router.back()}
                    className="text-[#707784] hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Session ID */}
                <h1 className="text-[30px] font-bold text-[#212121]">
                    S-{sessionData?.sessionId}
                </h1>

                {/* Divider Vertical */}
                <div className="h-10 w-[1px] bg-gray-300 mx-2" />

                {/* Info Partisipan & Protokol */}
                <div>
                    <div className="font-semibold text-lg text-[#212121]">
                        Participant: {sessionData?.participantName || "Loading..."}
                    </div>
                    <div className="text-sm text-[#707784]">
                        {sessionData?.protocolName} • {sessionData?.visitDate}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg font-mono font-semibold text-lg text-[#707784] min-w-[140px] justify-center">
                    <Clock3
                        size={20}
                        className="text-gray-400"
                    />
                    Completed
                </div>

                <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FABA00] border border-[#FABA00] text-white rounded-lg font-medium hover:bg-[#F9C000] transition-colors cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                </button>
            </div>
        </div>
    );
}