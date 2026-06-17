"use client";

import { X, FileText, User, CalendarDays, Phone, Hash, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { type Participant } from "../../../lib/data";

function calculateAge(dob: string): string {
  if (!dob) return "—";
  const birth = new Date(dob);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}y ${months}m`;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatAuditDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function DetailTable({
  rows,
}: {
  rows: { icon: React.ReactNode; label: string; value: string }[];
}) {
  return (
    <div className="self-stretch border border-[#E2E4E6] rounded-lg overflow-hidden">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex ${i !== rows.length - 1 ? "border-b border-[#E2E4E6]" : ""}`}
        >
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-r border-[#E2E4E6] text-[#43474F] text-sm">
            <span className="w-4 h-4 shrink-0 text-[#99A1AF]">{row.icon}</span>
            {row.label}
          </div>
          <div className="flex-1 flex items-center justify-end px-4 py-3 text-[#101828] text-sm font-medium text-right">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="self-stretch text-[#6A7282] text-sm font-medium leading-4">
      {children}
    </span>
  );
}

interface ParticipantDetailModalProps {
  participant: Participant | null;
  open: boolean;
  onClose: () => void;
}

export function ParticipantDetailModal({
  participant,
  open,
  onClose,
}: ParticipantDetailModalProps) {
  if (!participant) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 rounded-xl overflow-hidden !w-[600px] !max-w-[600px] border-0 shadow-xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Participant Detail — {participant.name}</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="p-5 bg-[#0076D2] flex-row justify-between items-start space-y-0">
          <div className="flex flex-col gap-[9px]">
            <span className="text-[#FAFAFA] text-base font-normal leading-[18px]">
              Participant Detail
            </span>
            <span className="text-[#FAFAFA] text-lg font-semibold leading-5">
              {participant.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center text-[#FAFAFA] hover:opacity-70 transition-opacity mt-0.5"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </DialogHeader>

        <div className="p-5 bg-[#FAFAFA] rounded-b-xl flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <SectionLabel>Medical Identity</SectionLabel>
            <DetailTable
              rows={[
                { icon: <Hash size={16} />, label: "Participant ID", value: participant.participantId },
                { icon: <FileText size={16} />, label: "Medical Record No.", value: participant.medicalRecordNo },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Personal Data</SectionLabel>
            <DetailTable
              rows={[
                { icon: <User size={16} />, label: "Gender", value: participant.gender },
                { icon: <Calendar size={16} />, label: "Age", value: calculateAge(participant.dob) },
                { icon: <CalendarDays size={16} />, label: "Date of Birth", value: formatDate(participant.dob) },
                { icon: <Phone size={16} />, label: "Phone Number", value: `+62${participant.numberPhone}` },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SectionLabel>Audit Trail</SectionLabel>
            <DetailTable
              rows={[
                {
                  icon: <User size={16} />,
                  label: "Created by",
                  value: `${participant.createdBy ?? "Admin"} · ${formatAuditDate(participant.createdAt)}`,
                },
                {
                  icon: <User size={16} />,
                  label: "Updated by",
                  value: participant.updatedAt
                    ? `${participant.updatedBy ?? "Admin"} · ${formatAuditDate(participant.updatedAt)}`
                    : "-",
                },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}