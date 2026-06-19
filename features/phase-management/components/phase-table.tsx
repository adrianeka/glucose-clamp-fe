"use client";

import { ConfirmDeleteDialog } from "@/components/ui/delete";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { EditPhaseModal } from "./edit-phase-modal";
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { phaseService } from "../services";
import { PhaseConfig } from "../types";
import { TablePagination } from "@/components/ui/table-pagination";

function CodeBadge({ code }: { code: string }) {
  return (
    <div className="px-3 py-1 bg-[#EBF3FC] text-[#0076D2] rounded-full border border-[#C4DDF6] inline-flex items-center">
      <span className="text-[#0076D2] text-xs font-semibold leading-[14px]">{code}</span>
    </div>
  );
}

interface TableRowProps {
  phase: PhaseConfig;
  onEdit: (p: PhaseConfig) => void;
  onDelete: (p: PhaseConfig) => void;
  isReordering: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function TableRow({
  phase,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TableRowProps) {
  return (
    <div
      draggable={isReordering}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center w-full bg-white border-b border-gray-100 py-3.5 hover:bg-[#F9FBFC] transition-colors",
        isReordering && "cursor-grab active:cursor-grabbing"
      )}
    >
      {/* Drag Handle Column (Only Visible in Reorder Mode) */}
      {isReordering && (
        <div className="w-[48px] flex-shrink-0 pl-6 flex items-center justify-center text-gray-400">
          <GripVertical size={18} className="cursor-grab active:cursor-grabbing text-[#A9ADB5]" />
        </div>
      )}

      {/* Priority Column */}
      <div className={cn(
        "w-[120px] flex-shrink-0 px-6 text-sm text-[#2D2F35] font-medium",
        isReordering && "pl-2"
      )}>
        {phase.priority}
      </div>

      {/* Code Badge Column */}
      <div className="w-[180px] flex-shrink-0 px-6">
        <CodeBadge code={phase.code} />
      </div>

      {/* Name Column */}
      <div className="flex-1 px-6 text-sm text-[#2D2F35] font-normal">
        {phase.name}
      </div>

      {/* Type Column */}
      <div className="w-[220px] flex-shrink-0 px-6 text-sm text-[#43474F] font-normal">
        {phase.type}
      </div>

      {/* Actions Column */}
      <div className="w-[150px] flex-shrink-0 px-6 flex items-center justify-end gap-4">
        {isReordering ? (
          <div className="flex items-center gap-4">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className={cn(
                "transition-opacity",
                isFirst ? "opacity-30 cursor-not-allowed text-[#A9ADB5]" : "hover:opacity-70 text-[#0076D2]"
              )}
              aria-label="Move Up"
            >
              <ArrowUp size={18} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className={cn(
                "transition-opacity",
                isLast ? "opacity-30 cursor-not-allowed text-[#A9ADB5]" : "hover:opacity-70 text-[#0076D2]"
              )}
              aria-label="Move Down"
            >
              <ArrowDown size={18} />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onEdit(phase)}
              className="hover:opacity-70 transition-opacity"
              aria-label="Edit"
            >
              <Pencil size={18} className="text-[#FABA00]" />
            </button>
            <button
              onClick={() => onDelete(phase)}
              className="hover:opacity-70 transition-opacity"
              aria-label="Delete"
            >
              <Trash2 size={18} className="text-[#FF5630]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface PhaseTableProps {
  onAddPhase: () => void;
  refreshKey?: number;
}

export function PhaseTable({ onAddPhase, refreshKey }: PhaseTableProps) {
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [phases, setPhases] = useState<PhaseConfig[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<PhaseConfig | null>(null);
  const [editTarget, setEditTarget] = useState<PhaseConfig | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // States untuk pengaturan prioritas
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedPhases, setReorderedPhases] = useState<PhaseConfig[]>([]);
  const [isSubmittingPriority, setIsSubmittingPriority] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const refetchData = async () => {
    const allPhases = await phaseService.getPhases();
    
    // Urutkan berdasarkan prioritas default
    const sortedPhases = [...allPhases].sort((a, b) => a.priority - b.priority);

    const filtered = sortedPhases.filter((p) => {
      const target = debouncedSearch.toLowerCase();
      return (
        p.code.toLowerCase().includes(target) ||
        p.name.toLowerCase().includes(target) ||
        p.type.toLowerCase().includes(target)
      );
    });

    setTotalElements(filtered.length);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));

    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

    setPhases(paginated);
    
    // Inisialisasi daftar reorder jika tidak sedang dalam mode edit urutan
    if (!isReordering) {
      setReorderedPhases(paginated);
    }
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        await refetchData();
      } catch (err) {
        console.error(err);
      }
    };

    refresh();
  }, [refreshKey, itemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await refetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data phase configuration");
        setPhases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, currentPage, itemsPerPage]);

  // Handler untuk mengaktifkan mode prioritas
  const startReordering = () => {
    setReorderedPhases([...phases]);
    setIsReordering(true);
  };

  const cancelReordering = () => {
    setReorderedPhases([...phases]);
    setIsReordering(false);
  };

  // Navigasi manual menggunakan tombol up/down
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reorderedPhases.length) return;

    const updated = [...reorderedPhases];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Menyesuaikan nilai urutan prioritas sesuai baris baru
    const adjusted = updated.map((item, idx) => ({
      ...item,
      priority: idx + 1,
    }));

    setReorderedPhases(adjusted);
  };

  // Drag and Drop native handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...reorderedPhases];
    const draggedItem = updated[draggedIndex];
    
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    const adjusted = updated.map((item, idx) => ({
      ...item,
      priority: idx + 1,
    }));

    setDraggedIndex(index);
    setReorderedPhases(adjusted);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Menyimpan perubahan prioritas baru ke backend dengan endpoint Bulk Update
  const applyPriorityChanges = async () => {
    setIsSubmittingPriority(true);
    try {
      // Menyiapkan Payload sesuai struktur PhaseConfigurationBulkPriorityRequest DTO
      const payload = {
        priorities: reorderedPhases
          .filter((phase) => phase.id !== undefined)
          .map((phase) => ({
            id: phase.id!,
            priority: phase.priority,
          })),
      };

      // Memanggil fungsi endpoint bulk pada services
      await phaseService.updatePriorities(payload);

      showToast("Priority updated successfully");
      setIsReordering(false);
      await refetchData();
    } catch (err) {
      showToast("Failed to update priority configuration", "error");
    } finally {
      setIsSubmittingPriority(false);
    }
  };

  const handleDeleteClick = (p: PhaseConfig) => {
    setDeleteTarget(p);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    try {
      await phaseService.deletePhase(deleteTarget.id);
      setDeleteTarget(null);
      await refetchData();
      showToast("Delete phase config successfully");
    } catch (err) {
      showToast("Failed to delete phase configuration", "error");
    }
  };

  const handleEditClick = (p: PhaseConfig) => {
    setEditTarget(p);
    setEditModalOpen(true);
  };

  // Memeriksa jika ada perubahan prioritas dibanding state awal
  const hasPriorityChanges = JSON.stringify(phases.map(p => p.id + '-' + p.priority)) !== JSON.stringify(reorderedPhases.map(p => p.id + '-' + p.priority));

  return (
    <>
      <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 min-w-0">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
              Phase Management
            </h1>
            <p className="text-[#707784] text-sm font-normal leading-5">
              Configure sequential clinical workflow phases
            </p>
          </div>
          
          {/* Ubah Kontrol Header Sesuai Mode Aktif */}
          {isReordering ? (
            <div className="flex items-center gap-3">
              <Button
                onClick={cancelReordering}
                className="bg-[#EBF3FC] hover:bg-[#D4E7FA] text-[#0076D2] text-base font-semibold px-6 py-2.5 h-10 rounded-lg border-0"
              >
                Cancel
              </Button>
              <Button
                onClick={applyPriorityChanges}
                disabled={!hasPriorityChanges || isSubmittingPriority}
                className={cn(
                  "text-base font-semibold px-6 py-2.5 h-10 rounded-lg border-0 text-white",
                  hasPriorityChanges && !isSubmittingPriority
                    ? "bg-[#0076D2] hover:bg-[#005fa3]"
                    : "bg-[#A9ADB5] cursor-not-allowed"
                )}
              >
                {isSubmittingPriority ? "Applying..." : "Apply Priority"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#FAFAFA] border-gray-200 rounded-lg text-base placeholder:text-[#707784] h-10 focus-visible:ring-[#0076D2]"
                />
              </div>
              <Button
                onClick={onAddPhase}
                className="bg-[#0076D2] hover:bg-[#005fa3] text-[#FAFAFA] text-base font-semibold px-5 py-2.5 h-10 rounded-lg gap-2"
              >
                <Plus size={20} className="text-[#FAFAFA]" />
                Add
              </Button>
            </div>
          )}
        </div>

        {/* Table Structure */}
        <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white">
          
          {/* Table Header Row */}
          <div className="flex items-center w-full bg-[#F8FAFC] border-b border-gray-100 py-1">
            {isReordering && (
              <div className="w-[48px] flex-shrink-0" />
            )}
            
            <div className={cn(
              "w-[120px] flex-shrink-0 px-6 py-3 flex items-center text-[#0076D2] text-sm font-semibold",
              isReordering && "pl-2"
            )}>
              <span>Priority</span>
              
              {/* Tombol pemicu prioritas dengan tooltip perbaikan */}
              {!isReordering && (
                <div className="relative group flex items-center">
                  <button
                    onClick={startReordering}
                    className="ml-2.5 p-1 bg-[#EBF3FC] hover:bg-[#D4E7FA] rounded-md transition-colors flex items-center justify-center border-0"
                    aria-label="Change Priority"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5H13.5M2.5 8H13.5M2.5 11.5H13.5" stroke="#0076D2" strokeWidth="1.6" strokeLinecap="round"/>
                      <circle cx="5" cy="4.5" r="1.5" fill="#0076D2" />
                      <circle cx="11" cy="8" r="1.5" fill="#0076D2" />
                      <circle cx="6.5" cy="11.5" r="1.5" fill="#0076D2" />
                    </svg>
                  </button>
                  {/* Tooltip dimunculkan ke arah bawah (top-full mt-2) agar tidak terpotong overflow-hidden tabel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-[#2D2F35] text-white text-xs px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap z-20 pointer-events-none">
                    Change Priority
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#2D2F35]" />
                  </div>
                </div>
              )}
            </div>

            <div className="w-[180px] flex-shrink-0 px-6 py-3 text-[#0076D2] text-sm font-semibold">
              Code
            </div>
            <div className="flex-1 px-6 py-3 text-[#0076D2] text-sm font-semibold">
              Name
            </div>
            <div className="w-[220px] flex-shrink-0 px-6 py-3 text-[#0076D2] text-sm font-semibold">
              Type
            </div>
            <div className="w-[150px] flex-shrink-0 px-6 py-3 flex items-center justify-end text-[#0076D2] text-sm font-semibold">
              Actions
            </div>
          </div>

          {/* Table Body Row */}
          <div className="flex flex-col">
            {loading ? (
              <div className="py-20 text-center text-[#707784] text-sm">
                Memuat data...
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500 text-sm">{error}</div>
            ) : (isReordering ? reorderedPhases : phases).length > 0 ? (
              (isReordering ? reorderedPhases : phases).map((p, idx) => (
                <TableRow
                  key={p.id}
                  phase={p}
                  isReordering={isReordering}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onMoveUp={() => moveItem(idx, "up")}
                  onMoveDown={() => moveItem(idx, "down")}
                  isFirst={idx === 0}
                  isLast={idx === (isReordering ? reorderedPhases : phases).length - 1}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                />
              ))
            ) : (
              <div className="py-20 text-center text-[#707784] text-sm">
                No phase configurations found.
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          {!loading && totalElements > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={itemsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 25, 50]}
                disabled={isReordering}
              />
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Phase Configuration?"
          itemName={deleteTarget.name}
        />
      )}

      <EditPhaseModal
        phase={editTarget}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={refetchData}
      />
    </>
  );
}