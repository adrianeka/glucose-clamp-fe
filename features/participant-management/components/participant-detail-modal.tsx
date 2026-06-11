"use client";

import { X, PilcrowSquare, FileText, User, CalendarDays, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { type Participant } from "../../../lib/data";

function formatDob(dob: string): string {
  if (!dob) return "—";
  const date = new Date(dob);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const ageDiff = Date.now() - date.getTime();
  const age = Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
  return `${formatted} (${age} yo)`;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="self-stretch flex items-start gap-3">
      <div className="w-4 h-4 mt-0.5 shrink-0 text-[#99A1AF]">{icon}</div>
      <div className="flex-1 flex justify-between items-start">
        <span className="text-[#43474F] text-sm font-normal leading-4">
          {label}
        </span>
        <span className="text-[#101828] text-sm font-normal leading-5 text-right">
          {value}
        </span>
      </div>
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
      <DialogContent className="p-0 gap-0 rounded-xl overflow-hidden w-[360px] max-w-[360px] border-0 shadow-xl [&>button]:hidden">
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
          <div className="flex flex-col gap-3">
            <SectionLabel>Medical Identity</SectionLabel>
            <DetailRow
              icon={<PilcrowSquare size={16} className="text-[#99A1AF]" />}
              label="Participant ID"
              value={participant.id}
            />
            <DetailRow
              icon={<FileText size={16} className="text-[#99A1AF]" />}
              label="Medical Record No."
              value={participant.medicalRecord}
            />
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Personal Data</SectionLabel>
            <DetailRow
              icon={<User size={16} className="text-[#99A1AF]" />}
              label="Gender"
              value={participant.gender}
            />
            <DetailRow
              icon={<CalendarDays size={16} className="text-[#99A1AF]" />}
              label="Date of Birth"
              value={formatDob(participant.dob)}
            />
            <DetailRow
              icon={<Phone size={16} className="text-[#99A1AF]" />}
              label="Phone Number"
              value={`+62${participant.phone}`}
            />
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Audit Trail</SectionLabel>
            <div className="self-stretch h-5 flex justify-between items-center">
              <span className="text-[#43474F] text-sm font-normal leading-4">
                Created by
              </span>
              <span className="text-[#101828] text-sm font-normal leading-5 text-right">
                Admin · 10/01/2024, 15:00:00
              </span>
            </div>
            <div className="self-stretch h-5 flex justify-between items-start">
              <span className="text-[#43474F] text-sm font-normal leading-4">
                Updated by
              </span>
              <span className="text-[#101828] text-sm font-normal leading-5 text-right">
                Admin · 10/06/2026, 10:55:19
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
