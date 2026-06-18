"use client";

import { ConfirmDeleteDialog } from "@/components/ui/delete";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { EditParticipantModal } from "./edit-participant-modal";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllParticipants, searchParticipants, deleteParticipant } from "../services";
import {Participant} from "../types";
import { ParticipantDetailModal } from "./participant-detail-modal";

const ITEMS_PER_PAGE = 6;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

function IdBadge({ id }: { id: string }) {
  return (
    <div className="px-1.5 py-1 bg-[#F1F9FA] rounded-full border border-[#C4EAEE]">
      <span className="text-[#0076D2] text-xs font-medium leading-[14px]">{id}</span>
    </div>
  );
}

function MrBadge({ mr }: { mr: string }) {
  return (
    <div className="px-1.5 py-1 bg-[#FAFAFA] rounded-full border border-[#E2E4E6]">
      <span className="text-[#595F6A] text-xs font-medium leading-[14px]">{mr}</span>
    </div>
  );
}

function TableRow({
  participant,
  onView,
  onEdit,
  onDelete,
}: {
  participant: Participant;
  onView: (p: Participant) => void;
  onEdit: (p: Participant) => void;
  onDelete: (p: Participant) => void;
}) {
  return (
    <div className="flex items-start w-full bg-[#FAFAFA] rounded-lg overflow-hidden py-1">
      <div className="flex-1 flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <MrBadge mr={participant.medicalRecordNo} />
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.name}</span>
      </div>
      <div className="flex-1 flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.gender}</span>
      </div>
      <div className="flex-1 flex-shrink-0 h-[60px] px-4 py-2 flex flex-col items-start gap-0.5">
        <span className="text-[#212121] text-sm font-normal leading-5">{participant.age}</span>
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.numberPhone}</span>
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start gap-3">
        <button
          onClick={() => onView(participant)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="View detail"
        >
          <Eye size={18} className="text-[#0076D2]" />
        </button>
        <button
          onClick={() => onEdit(participant)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Edit"
        >
          <Pencil size={18} className="text-[#FABA00]" />
        </button>
        <button
          onClick={() => onDelete(participant)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Delete"
        >
          <Trash2 size={18} className="text-[#FF5630]" />
        </button>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setSizeDropdownOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E4E6] rounded-lg text-[#43474F] text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {pageSize} Entries
          <ChevronDown size={14} className="text-[#707784]" />
        </button>
        {sizeDropdownOpen && (
          <div className="absolute bottom-full mb-1 left-0 bg-white border border-[#E2E4E6] rounded-lg shadow-lg py-1 w-32 z-10">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onPageSizeChange(size);
                  setSizeDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-[#43474F] hover:bg-gray-50"
              >
                {size} Entries
              </button>
            ))}
          </div>
        )}
        <span className="text-[#707784] text-sm">of {totalElements} entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
            <path d="M9 1L5 4L1 1" stroke="#707784" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-lg text-lg font-medium leading-5 transition-colors",
              page === currentPage ? "bg-[#DBF2F3] text-[#0076D2]" : "text-[#707784] hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
            <path d="M1 4L5 1L9 4" stroke="#707784" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ParticipantTableProps {
  onAddParticipant: () => void;
  refreshKey?: number;
}

export function ParticipantTable({
  onAddParticipant,
  refreshKey,
}: ParticipantTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);
  const [editTarget, setEditTarget] = useState<Participant | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const refresh = async () => {
      try {
        await refetchData();
      } catch (err) {
        console.error(err);
      }
    };

    refresh();
  }, [refreshKey]);

  const refetchData = async () => {
    const result = debouncedSearch
      ? await searchParticipants(debouncedSearch, currentPage, pageSize)
      : await getAllParticipants(currentPage, pageSize);

    setParticipants(result.data.content);
    setTotalElements(result.data.totalElements);
    setTotalPages(Math.max(1, result.data.totalPages));
  };

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await refetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data participant");
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, currentPage, pageSize]);


  const handleView = (p: Participant) => {
    setSelectedParticipant(p);
    setModalOpen(true);
  };

  const handleDeleteClick = (p: Participant) => {
    setDeleteTarget(p);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteParticipant(deleteTarget.participantId);
      setDeleteTarget(null);
      await refetchData();
      showToast("Delete participant successfully");
    } catch (err) {
      showToast("Failed to delete participant", "error");
    }
  };

  const handleEditClick = (p: Participant) => {
    setEditTarget(p);
    setEditModalOpen(true);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
              Participant Management
            </h1>
            <p className="text-[#707784] text-sm font-normal leading-5">
              Manage and view all registered study participants
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[260px]">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2F35]" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base placeholder:text-[#707784] h-10 focus-visible:ring-[#0076D2]"
              />
            </div>
            <Button
              onClick={onAddParticipant}
              className="bg-[#0076D2] hover:bg-[#005fa3] text-[#FAFAFA] text-lg font-medium leading-5 px-6 py-3 h-auto rounded-lg gap-2"
            >
              <Plus size={20} className="text-[#FAFAFA]" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-[#FAFAFA]">
          <div className="flex items-center w-full bg-[#F1F9FA] rounded-lg overflow-hidden">
            {[
              { label: "Medical Record", width: "flex-1" },
              { label: "Participant", width: "flex-1" },
              { label: "Gender", width: "flex-1" },
              { label: "Age", width: "flex-1" },
              { label: "Phone", width: "flex-1" },
              { label: "Actions", width: "flex-1" },
            ].map(({ label, width }) => (
              <div
                key={label}
                className={cn("flex-shrink-0 h-14 px-4 py-2 flex items-center", width)}
              >
                <span className="text-[#0076D2] text-base font-semibold leading-[18px]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="py-10 text-center text-[#707784] text-sm">
                Memuat data...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500 text-sm">{error}</div>
            ) : participants.length > 0 ? (
              participants.map((p) => (
                <TableRow
                  key={p.participantId}
                  participant={p}
                  onView={handleView}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="py-10 text-center text-[#707784] text-sm">
                No participants found.
              </div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <ParticipantDetailModal
        participant={selectedParticipant}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Participant?"
          itemName={deleteTarget.name}
        />
      )}
      <EditParticipantModal
        participant={editTarget}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={refetchData}
      />
    </>
  );
}