"use client";

import { useRouter } from "next/navigation";
import { Session } from "../types/Session";

interface SessionCreationTableProps {
  data: Session[];
  isLoading?: boolean;
  onViewActivities: (session: Session) => void;
}

export default function SessionCreationTable({
  data,
  onViewActivities,
}: SessionCreationTableProps) {

  const router = useRouter();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PREP":
        return "In Queue";

      case "RUNNING":
        return "On Progress";

      case "HOLD":
        return "On Hold";

      case "COMPLETED":
        return "Completed";

      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PREP":
        return "bg-[#F3F4F6] text-[#707784]";

      case "RUNNING":
        return "bg-[#EAF4FF] text-[#0076D2]";

      case "HOLD":
        return "bg-[#FFF4E5] text-[#F57C00]";

      case "COMPLETED":
        return "bg-[#EAF8EC] text-[#43A047]";

      default:
        return "bg-[#F3F4F6] text-[#707784]";
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#E2E4E6] bg-white">
      
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="bg-[#F5F8FA]">
            <th className="whitespace-nowrap px-4 py-4 text-left text-sm font-semibold text-[#0076D2] w-[100px]">
              Session ID
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2] min-w-[150px]">
              Participant
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2] min-w-[200px]">
              Protocol
            </th>

            <th className="whitespace-nowrap px-4 py-4 text-left text-sm font-semibold text-[#0076D2] w-[120px]">
              Visit Date
            </th>

            <th className="whitespace-nowrap px-4 py-4 text-left text-sm font-semibold text-[#0076D2] w-[120px]">
              Status
            </th>

            <th className="whitespace-nowrap px-4 py-4 text-center text-sm font-semibold text-[#0076D2] w-[140px]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.sessionId}
              className="border-t border-[#E2E4E6] bg-[#FAFAFA] hover:bg-[#F5F8FA] transition-colors"
            >
              <td className="whitespace-nowrap px-4 py-5 text-sm text-[#595F6A]">
                {item.sessionId}
              </td>

              <td className="px-4 py-5 text-sm text-[#595F6A] font-medium">
                {item.participantName}
              </td>

              <td className="px-4 py-5">
                <div className="text-sm text-[#595F6A] font-medium">
                  {item.protocolName}
                </div>

                <div className="text-xs text-[#A9ADB5] mt-0.5">
                  {item.protocolId} | V
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-5 text-sm text-[#595F6A]">
                {item.visitDate}
              </td>

              <td className="whitespace-nowrap px-4 py-5">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusStyle(
                    item.sessionStatus
                  )}`}
                >
                  {getStatusLabel(item.sessionStatus)}
                </span>
              </td>

              <td className="whitespace-nowrap px-4 py-5 text-center flex items-center justify-center gap-2">
                <button
                  onClick={() => onViewActivities(item)}
                  className="rounded-md border border-[#0076D2] px-3 py-1.5 text-xs font-medium text-[#0076D2] hover:bg-[#F3FBFF] transition-colors"
                >
                  View Activities
                </button>
                {item.sessionStatus === "COMPLETED" && (
                  <button
                    onClick={() => {
                      router.push(`/session-creation/${item.sessionId}?download=true`);
                    }}
                    className="rounded-md border border-[#FABA00] px-3 py-1 text-xs text-[#FABA00] hover:bg-[#FFF7E5]"
                  >
                    Download Files
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}