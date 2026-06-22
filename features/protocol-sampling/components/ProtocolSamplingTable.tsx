"use client";

import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  Plus,
} from "lucide-react";
import { Protocol } from "../types/Protocol";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

interface ProtocolSamplingTableProps {
  isLoading: boolean;
  data: Protocol[];
  onView: (protocol: any) => void;
  onEdit: (protocol: any) => void;
  onDelete: (protocol: any) => void;
  onSamplingSchedule: (protocol: Protocol) => void;
}

export default function ProtocolSamplingTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onSamplingSchedule
}: ProtocolSamplingTableProps) {
  const formatDuration = (
    totalMinutes: number
  ) => {
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }

    const hours = Math.floor(
      totalMinutes / 60
    );
    const minutes =
      totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} ${
        hours > 1 ? "hours" : "hour"
      }`;
    }

    return `${hours} h ${minutes} m`;
  };
  if (isLoading) {
    return (
      <TableSkeleton
        rows={5}
        columns={5}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-99 flex flex-col items-center justify-center text-[#707784]">
        <FileText className="w-10 h-10 mb-3 text-[#707784]" />

        <p className="text-sm">
          No protocols created yet
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-99 overflow-hidden rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F8FA] text-left">
            <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
              Protocol ID
            </th>

            <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
              Name
            </th>

            <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
              Duration
            </th>

            <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
              Sampling Schedule
            </th>

            <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.protocol_id}
              className="bg-[#FAFAFA] border-t border-[#E2E4E6]"
            >
              <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-full border border-[#8ED0F9] bg-[#F3FBFF] px-2 py-1 text-xs text-[#0076D2]">
                  {item.protocol_id}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="font-medium text-[#212121]">
                  {item.protocol_name}
                </div>

                <div className="text-xs text-[#707784]">
                  {item.protocol_code} |{" "}
                  {item.version}
                </div>
              </td>

              <td className="px-4 py-4 text-[#212121]">
                {item.duration_hours} h
              </td>

              <td className="px-4 py-4">
                {item.sampling_schedules != "0 phase" ? (
                   <button
                    onClick={() =>
                      onSamplingSchedule(item)
                    }
                    className="text-left text-xs text-[#0076D2] underline hover:text-[#005DA6]"
                  >
                    {item.sampling_schedules}
                  </button>
                ) : (
                  <button
                    onClick={() => onSamplingSchedule(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#0076D2] px-3 py-2 text-xs text-[#0076D2] hover:bg-[#F3FBFF]"
                  >
                    <Plus className="w-3 h-3" />
                    Sampling Schedule
                  </button>
                )}
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Eye
                    className="w-4 h-4 cursor-pointer text-[#0076D2]"
                    onClick={() => onView(item)}
                  />

                  <Pencil
                    className="w-4 h-4 cursor-pointer text-[#FFB800]"
                    onClick={() => onEdit(item)}
                  />

                  <Trash2
                    className="w-4 h-4 cursor-pointer text-[#FF5B5B]"
                    onClick={() => onDelete(item)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}