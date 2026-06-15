"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PARTICIPANTS, type Participant } from "../../../lib/data";
import { ParticipantDetailModal } from "./participant-detail-modal";

const ITEMS_PER_PAGE = 6;

// Status Badge

function StatusBadge({ status }: { status: Participant["status"] }) {
  if (status === "Active") {
    return (
      <div className="flex items-center gap-1 px-1.5 py-1 bg-[#EEF8F4] rounded-full border border-[#C9EBDE]">
        <CheckCircle2 size={16} className="text-[#52BD94]" />
        <span className="text-[#4BAC87] text-xs font-medium leading-[14px]">Active</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 px-1.5 py-1 bg-[#FAFAFA] rounded-full border border-[#E2E4E6]">
      <XCircle size={16} className="text-[#595F6A]" />
      <span className="text-[#595F6A] text-xs font-medium leading-[14px]">Inactive</span>
    </div>
  );
}

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
}: {
  participant: Participant;
  onView: (p: Participant) => void;
}) {
  return (
    <div className="flex items-start w-full bg-[#FAFAFA] rounded-lg overflow-hidden py-1">
      <div className="w-[100px] flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <IdBadge id={participant.id} />
      </div>
      <div className="w-[160px] flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <MrBadge mr={participant.medicalRecord} />
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.name}</span>
      </div>
      <div className="w-[120px] flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.gender}</span>
      </div>
      <div className="w-[120px] flex-shrink-0 h-[60px] px-4 py-2 flex flex-col items-start gap-0.5">
        <span className="text-[#212121] text-sm font-normal leading-5">{participant.dob}</span>
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start">
        <span className="text-[#43474F] text-sm font-normal leading-5">{participant.phone}</span>
      </div>
      <div className="w-[120px] flex-shrink-0 h-[60px] px-4 py-2 flex items-start">
        <StatusBadge status={participant.status} />
      </div>
      <div className="flex-1 h-[60px] px-4 py-2 flex items-start gap-3">
        <button
          onClick={() => onView(participant)}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="View detail"
        >
          <Eye size={18} className="text-[#0076D2]" />
        </button>
        <button className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Edit">
          <Pencil size={18} className="text-[#FABA00]" />
        </button>
        <button className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Delete">
          <Trash2 size={18} className="text-[#FF5630]" />
        </button>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1 justify-end">
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
  );
}

export function ParticipantTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = PARTICIPANTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.medicalRecord.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleView = (p: Participant) => {
    setSelectedParticipant(p);
    setModalOpen(true);
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
          <Button
            onClick={() => router.push("/participant-management/add")}
            className="bg-[#0076D2] hover:bg-[#005fa3] text-[#FAFAFA] text-lg font-medium leading-5 px-6 py-3 h-auto rounded-lg gap-2"
          >
            <Plus size={20} className="text-[#FAFAFA]" />
            Add Participant
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-[346px]">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2F35]" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-10 bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base placeholder:text-[#707784] h-10 focus-visible:ring-[#0076D2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#43474F] text-sm font-semibold leading-4 tracking-wide uppercase">
              Participant Registry
            </span>
            <Badge
              variant="outline"
              className="bg-[#F1F9FA] border-[#C4EAEE] text-[#0076D2] text-xs font-medium leading-[14px] rounded-full px-2 py-1"
            >
              {filtered.length}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-[#FAFAFA]">
          <div className="flex items-center w-full bg-[#F1F9FA] rounded-lg overflow-hidden">
            {[
              { label: "ID", width: "w-[100px]" },
              { label: "Medical Record", width: "w-[160px]" },
              { label: "Participant", width: "flex-1" },
              { label: "Gender", width: "w-[120px]" },
              { label: "DOB", width: "w-[120px]" },
              { label: "Phone", width: "flex-1" },
              { label: "Status", width: "w-[120px]" },
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
            {paginated.length > 0 ? (
              paginated.map((p) => (
                <TableRow key={p.id} participant={p} onView={handleView} />
              ))
            ) : (
              <div className="py-10 text-center text-[#707784] text-sm">
                No participants found.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ParticipantDetailModal
        participant={selectedParticipant}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
