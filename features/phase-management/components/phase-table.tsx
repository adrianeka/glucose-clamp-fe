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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { phaseService } from "../services";
import { PhaseConfig } from "../types";

function CodeBadge({ code }: { code: string }) {
  return (
    <div className="px-3 py-1 bg-[#EBF3FC] text-[#0076D2] rounded-full border border-[#C4DDF6] inline-flex items-center">
      <span className="text-[#0076D2] text-xs font-semibold leading-[14px]">{code}</span>
    </div>
  );
}

function TableRow({
  phase,
  onEdit,
  onDelete,
}: {
  phase: PhaseConfig;
  onEdit: (p: PhaseConfig) => void;
  onDelete: (p: PhaseConfig) => void;
}) {
  return (
    <div className="flex items-center w-full bg-white border-b border-gray-100 py-3.5 hover:bg-[#F9FBFC] transition-colors">
      {/* Priority Column */}
      <div className="w-[120px] flex-shrink-0 px-6 text-sm text-[#2D2F35] font-medium">
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
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default ke 10 entri sesuai gambar

  const [phases, setPhases] = useState<PhaseConfig[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<PhaseConfig | null>(null);
  const [editTarget, setEditTarget] = useState<PhaseConfig | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Debounce input pencarian
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const refetchData = async () => {
    const allPhases = await phaseService.getPhases();
    
    // Filter data di sisi client
    const filtered = allPhases.filter((p) => {
      const target = debouncedSearch.toLowerCase();
      return (
        p.code.toLowerCase().includes(target) ||
        p.name.toLowerCase().includes(target) ||
        p.type.toLowerCase().includes(target)
      );
    });

    setTotalElements(filtered.length);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));

    // Slicing data sesuai pembagian halaman (pagination)
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

    setPhases(paginated);
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

  // Memuat data
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

  return (
    <>
      {/* Kontainer kartu putih besar tunggal yang membungkus seluruh elemen halaman */}
      <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 min-w-0">
        
        {/* Row Header: Judul Halaman di kiri, Pencarian & Tombol Tambah sejajar di kanan */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
              Phase Management
            </h1>
            <p className="text-[#707784] text-sm font-normal leading-5">
              Configure sequential clinical workflow phases
            </p>
          </div>
          
          {/* Kolom Pencarian & Tombol Add Sejajar (Sesuai Gambar Mockup) */}
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
        </div>

        {/* Struktur Tabel Utama */}
        <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white">
          {/* Baris Judul Kolom Tabel (Header) */}
          <div className="flex items-center w-full bg-[#F8FAFC] border-b border-gray-100 py-1">
            {[
              { label: "Priority", width: "w-[120px]" },
              { label: "Code", width: "w-[180px]" },
              { label: "Name", width: "flex-1" },
              { label: "Type", width: "w-[220px]" },
              { label: "Actions", width: "w-[150px] justify-end" },
            ].map(({ label, width }) => (
              <div
                key={label}
                className={cn(
                  "flex-shrink-0 h-12 px-6 py-3 flex items-center text-[#0076D2] text-sm font-semibold",
                  width
                )}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Baris Isi Tabel */}
          <div className="flex flex-col">
            {loading ? (
              <div className="py-20 text-center text-[#707784] text-sm">
                Memuat data...
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500 text-sm">{error}</div>
            ) : phases.length > 0 ? (
              phases.map((p) => (
                <TableRow
                  key={p.id}
                  phase={p}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="py-20 text-center text-[#707784] text-sm">
                No phase configurations found.
              </div>
            )}
          </div>

          {/* Footer Pagination (Sesuai Layout Gambar Mockup) */}
          {!loading && totalElements > 0 && (
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              {/* Sisi Kiri: Entri baris terhitung */}
              <div className="flex items-center gap-2 text-sm text-[#707784]">
                <div className="relative inline-flex items-center">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none cursor-pointer text-[#2D2F35]"
                  >
                    <option value={5}>5 Entries</option>
                    <option value={10}>10 Entries</option>
                    <option value={25}>25 Entries</option>
                    <option value={50}>50 Entries</option>
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <span>of {totalElements} entries</span>
              </div>

              {/* Sisi Kanan: Tombol nomor halaman */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M5 9L1 5L5 1" stroke="#707784" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;

                  if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(currentPage - pageNum) <= 1) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#EBF3FC] text-[#0076D2]"
                            : "text-[#707784] hover:bg-gray-100"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span key={pageNum} className="w-9 h-9 flex items-center justify-center text-sm text-[#707784]">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1 9L5 5L1 1" stroke="#707784" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Phase Configuration?"
          itemName={deleteTarget.name}
        />
      )}

      {/* Modal Edit */}
      <EditPhaseModal
        phase={editTarget}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={refetchData}
      />
    </>
  );
}