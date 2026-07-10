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
  canEditPhase: boolean;
  canDeletePhase: boolean;
}

export default function ProtocolSamplingTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onSamplingSchedule,
  canEditPhase,
  canDeletePhase
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
      return `${hours} ${hours > 1 ? "hours" : "hour"
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
    <div className="min-h-99 overflow-hidden rounded-xl border border-[#E2E4E6]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#F5F8FA] text-left">
              <th className="px-4 py-4 text-[#0076D2] text-sm font-semibold">
                Protocol Code
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
                  <span className="inline-flex items-center rounded-full border border-[#C4EAEE] bg-[#F1F9FA] px-2 py-1 text-xs text-[#0076D2]">
                    {item.protocol_code} |{" "} {item.version}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="font-medium text-[#212121]">
                    {item.protocol_name}
                  </div>
                </td>

                <td className="px-4 py-4 text-[#212121]">
                  {item.duration_hours} h
                </td>

                <td className="px-4 py-4">
                  {item.is_used ? (
                    item.sampling_schedules !== "0 phase" ? (
                      <span 
                        className="text-xs text-gray-400 cursor-not-allowed select-none"
                        title="Sampling schedule tidak dapat diubah karena protokol sudah digunakan dalam sesi."
                      >
                        {item.sampling_schedules}
                      </span>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-300 cursor-not-allowed"
                        title="Sampling schedule tidak dapat ditambah karena protokol sudah digunakan dalam sesi."
                      >
                        <Plus className="w-3 h-3" />
                        Sampling Schedule
                      </button>
                    )
                  ) : (
                    item.sampling_schedules !== "0 phase" ? (
                      <button
                        onClick={() => onSamplingSchedule(item)}
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
                    )
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {/* Tombol View */}
                    <span title="View Detail" className="inline-flex">
                      <Eye
                        className="w-4 h-4 cursor-pointer text-[#0076D2] hover:text-[#005DA6] transition-colors"
                        onClick={() => onView(item)}
                      />
                    </span>

                    {/* Tombol Edit */}
                    {canEditPhase && (
                      <span 
                        title={item.is_used ? "Protokol ini telah digunakan dalam sesi aktif sehingga tidak dapat diubah." : "Edit"} 
                        className="inline-flex"
                      >
                        <Pencil
                          className={`w-4 h-4 transition-colors ${
                            item.is_used
                              ? "cursor-not-allowed text-gray-300 opacity-50"
                              : "cursor-pointer text-[#FFB800] hover:text-[#DCA000]"
                          }`}
                          onClick={() => !item.is_used && onEdit(item)}
                        />
                      </span>
                    )}

                    {/* Tombol Delete */}
                    {canDeletePhase && (
                      <span 
                        title={item.is_used ? "Protokol ini telah digunakan dalam sesi aktif sehingga tidak dapat dihapus." : "Delete"} 
                        className="inline-flex"
                      >
                        <Trash2
                          className={`w-4 h-4 transition-colors ${
                            item.is_used
                              ? "cursor-not-allowed text-gray-300 opacity-50"
                              : "cursor-pointer text-[#FF5B5B] hover:text-[#D94141]"
                          }`}
                          onClick={() => !item.is_used && onDelete(item)}
                        />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}