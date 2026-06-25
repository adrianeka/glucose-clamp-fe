"use client";

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
    <div className="overflow-hidden rounded-xl border border-[#E2E4E6]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F8FA]">
            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2]">
              Session ID
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2]">
              Participant
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2]">
              Protocol
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2]">
              Visit Date
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-[#0076D2]">
              Status
            </th>

            <th className="px-4 py-4 text-center text-sm font-semibold text-[#0076D2]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.sessionId}
              className="border-t border-[#E2E4E6] bg-[#FAFAFA]"
            >
              <td className="px-4 py-5 text-sm text-[#595F6A]">
                {item.sessionId}
              </td>

              <td className="px-4 py-5 text-sm text-[#595F6A]">
                {item.participantName}
              </td>

              <td className="px-4 py-5">
                <div className="text-sm text-[#595F6A]">
                  {item.protocolName}
                </div>

                <div className="text-xs text-[#A9ADB5]">
                  {item.protocolId} | V
                </div>
              </td>

              <td className="px-4 py-5 text-sm text-[#595F6A]">
                {item.visitDate}
              </td>

              <td className="px-4 py-5">
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusStyle(
                        item.sessionStatus
                    )}`}
                    >
                    {getStatusLabel(item.sessionStatus)}
                </span>
              </td>

              <td className="px-4 py-5 text-center">
                <button
                  onClick={() => onViewActivities(item)}
                  className="rounded-md border border-[#0076D2] px-3 py-1 text-xs text-[#0076D2] hover:bg-[#F3FBFF]"
                >
                  View Activities
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}