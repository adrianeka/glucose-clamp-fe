"use client";

import { Activity } from "../types/Activities";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { SquarePen, Trash2 } from "lucide-react";
import { useDeleteActivity } from "../hooks/ActvityHook";

interface ActivitiesTableProps {
  data: Activity[];
  loading?: boolean;
  onEdit: (activity: Activity) => void;  // Tambahkan ini
  onDelete: (id: number) => void;        // Tambahkan ini
}

const ActionCell = ({ 
  activity, 
  onEdit, 
  onDelete 
}: { 
  activity: Activity, 
  onEdit: (a: Activity) => void, 
  onDelete: (id: number) => void 
}) => {
  if (activity.activityType !== "OTHER") {
    return <span className="text-[#707784]">-</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onEdit(activity)} className="transition-opacity hover:opacity-70">
        <SquarePen size={15} strokeWidth={2.5} className="text-[#FFB800]" />
      </button>
      <button onClick={() => onDelete(activity.activityId)} className="transition-opacity hover:opacity-70">
        <Trash2 size={15} strokeWidth={2.5} className="text-[#FF5B5B]" />
      </button>
    </div>
  );
};

export default function ActivitiesTable({
  data,
  loading = false,
  onEdit,
  onDelete
}: ActivitiesTableProps) {

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return <TableSkeleton rows={10} columns={7} />;
  }

  return (
    <div className="rounded-xl border border-[#E2E4E6] bg-white overflow-hidden flex flex-col">
      {/* Container Tabel dengan Scroll Internal */}
      <div className="overflow-y-auto max-h-[calc(100vh-350px)] scrollbar-thin"> 
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="sticky top-0 z-20 bg-[#F1F9FA]">
            <tr>
              <th className="w-[60px] px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">No</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Phase</th>
              <th className="w-[90px] px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Time</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Activity Type</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Description</th>
              <th className="w-[120px] px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Status</th>
              <th className="w-[100px] px-4 py-4 text-left text-xs font-semibold text-[#0076D2]">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E4E6]">
            {data.map((item, index) => (
              <tr key={item.activityId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-[#595F6A]">{index + 1}</td>
                <td className="max-w-[160px] truncate px-4 py-4 text-sm text-[#595F6A]">{item.phaseName}</td>
                <td className="px-4 py-4 text-sm text-[#595F6A] whitespace-nowrap">{formatTime(item.time)}</td>
                <td className="px-4 py-4 text-sm text-[#595F6A] whitespace-nowrap">{item.activityType}</td>
                <td className="px-4 py-4 text-sm text-[#595F6A]">
                  <div className="line-clamp-2" title={item.activityDesc}>{item.activityDesc}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium 
                    ${item.activityStatus === 'COMPLETED' ? 'bg-[#EAF8EC] text-[#43A047]' : 
                      item.activityStatus === 'INPUT_DATA' ? 'bg-[#FFF5E6] text-[#FF9800]' : 
                      'bg-[#F3F4F6] text-[#707784]'}`}>
                    {item.activityStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <ActionCell activity={item} onDelete={onDelete} onEdit={onEdit}/>
                </td>
              </tr>
            ))}
            
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center text-[#707784]">No activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}