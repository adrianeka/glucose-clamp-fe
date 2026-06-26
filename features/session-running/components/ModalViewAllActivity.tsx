"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Activity {
  activityId: number;
  phaseName: string;
  time: string;
  activityType: string;
  activityDesc: string;
  activityStatus: string;
}

interface ModalViewAllActivityProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: any;
}

export default function ModalViewAllActivity({
  isOpen,
  onClose,
  sessionData,
}: ModalViewAllActivityProps) {
  const activities = sessionData?.activities || [];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-[#EAF8EC] text-[#43A047]";
      case "IN_PROGRESS":
        return "bg-[#FFF5E6] text-[#FF9800]";
      case "IN_QUEUE":
        return "bg-[#F3F4F6] text-[#707784]";
      default:
        return "bg-[#F3F4F6] text-[#707784]";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent
            style={{
                maxWidth: "1200px",
                width: "95vw",
                height: "90vh",
                padding: 0,
                overflow: "hidden",
                border: "none",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
            }}>
        {/* Header Section */}
        <DialogHeader className="px-8 py-6 border-b border-gray-100 space-y-1">
          <DialogTitle className="text-[28px] font-bold text-[#212121]">
            All Activities
          </DialogTitle>
          <p className="text-[#707784] font-medium">
            S-{sessionData?.sessionId} | {sessionData?.participantName}
          </p>
        </DialogHeader>

        {/* Content Section */}
        <div className="flex-1 overflow-hidden p-6 bg-[#F8F9FB]">
          <div className="h-full rounded-xl border border-[#E2E4E6] overflow-hidden bg-white shadow-sm flex flex-col">
            
            {/* ScrollArea mengisi seluruh tinggi container putih */}
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
                    <th className="w-[130px] px-4 py-4 text-left text-xs font-bold text-[#0076D2] uppercase tracking-wider">Status</th>
                    <th className="w-[80px] px-4 py-4 text-center text-xs font-bold text-[#0076D2] uppercase tracking-wider">Action</th>
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
                      <td className="px-4 py-4">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 uppercase tracking-wide ${getStatusBadge(item.activityStatus)}`}
                            style={{
                                fontSize: "12px",
                                fontWeight: 700,
                            }}
                            >
                            {item.activityStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[#B0B4BB]">-</span>
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
      </DialogContent>
    </Dialog>
  );
}