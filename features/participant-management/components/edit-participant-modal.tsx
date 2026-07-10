"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateParticipant } from "../services";
import { Participant } from "../types";

interface FormData {
  medicalRecordNo: string;
  fullName: string;
  gender: "Male" | "Female" | "";
  dob: string;
  phone: string;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-0.5">
      <Label className="text-[#707784] text-sm font-medium leading-4">
        {children}
      </Label>
      <span className="text-[#E84E2C] text-sm leading-4">*</span>
    </div>
  );
}

interface EditParticipantModalProps {
  participant: Participant | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditParticipantModal({
  participant,
  open,
  onClose,
  onSuccess,
}: EditParticipantModalProps) {
  const { showToast } = useToast();

  const getInitialForm = (): FormData => {
    if (participant) {
      return {
        medicalRecordNo: participant.medicalRecordNo,
        fullName: participant.name,
        gender: participant.gender as "Male" | "Female",
        dob: String(participant.dob).slice(0, 10),
        phone: participant.numberPhone,
      };
    }
    return {
      medicalRecordNo: "",
      fullName: "",
      gender: "Male",
      dob: "",
      phone: "",
    };
  };

  const [form, setForm] = useState<FormData>(getInitialForm);

  useEffect(() => {
    if (open) {
      setForm(getInitialForm());
    }
  }, [open, participant]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!participant) return null;

  const isComplete =
    form.medicalRecordNo.trim() !== "" &&
    form.fullName.trim() !== "" &&
    form.gender !== "" &&
    form.dob.trim() !== "" &&
    form.phone.trim() !== "";

  const handleChange = (partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    try {
      await updateParticipant(participant.participantId, {
        medicalRecordNo: form.medicalRecordNo,
        name: form.fullName,
        gender: form.gender,
        dob: form.dob,
        numberPhone: form.phone,
      });
      onSuccess?.();
      onClose();
      showToast("Edit participant successfully");
    } catch (err) {
      showToast("Failed to edit participant", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent
        className="p-0 gap-0 rounded-xl border-0 shadow-xl [&>button]:hidden w-[calc(100%-32px)] max-w-[560px] md:w-[560px] flex flex-col overflow-hidden"
      >
        <button
          onClick={handleCancel}
          className="!flex absolute top-6 right-8 w-6 h-6 items-center justify-center text-[#707784] hover:opacity-70 z-50"
        >
          <span className="text-2xl leading-none">−</span>
        </button>

        <DialogHeader className="px-6 md:px-8 pt-6 pb-5 space-y-0 shrink-0">
          <DialogTitle className="text-[#2D2F35] text-2xl font-bold leading-7">
            Edit Participant
          </DialogTitle>
          <p className="text-[#707784] text-sm font-normal leading-5 mt-1.5">
            {participant.name}
          </p>
        </DialogHeader>

        {/* Form Container: Ditambahkan kalkulasi tinggi dinamis dan scroll yang aman */}
        <div className="px-6 md:px-8 pb-6 flex flex-col gap-5 border-t border-[#E2E4E6] pt-5 max-h-[calc(100vh-180px)] md:max-h-[60vh] overflow-y-auto">

          {/* Baris 1: ID Participant & Medical Record */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>ID Participant</FieldLabel>
              <Input
                value={participant.participantId}
                disabled
                className="bg-[#F1F1F1] border-[#E2E4E6] rounded-md text-[#707784] text-base font-normal leading-6 h-[42px] cursor-not-allowed w-full"
              />
            </div>
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Medical Record</FieldLabel>
              <Input
                value={form.medicalRecordNo}
                maxLength={50}
                onChange={(e) => handleChange({ medicalRecordNo: e.target.value })}
                className={`bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2] w-full ${form.medicalRecordNo.length >= 50
                  ? 'text-red-500 border-red-500 focus-visible:ring-red-500'
                  : 'text-[#2D2F35]'
                  }`}
                placeholder="e.g. MR889106"
              />
              <span className={`text-xs text-right ${form.medicalRecordNo.length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {form.medicalRecordNo.length}/50
              </span>
            </div>
          </div>

          {/* Baris 2: Full Name & Gender */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={form.fullName}
                maxLength={100}
                onChange={(e) => handleChange({ fullName: e.target.value })}
                className={`bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2] w-full ${form.fullName.length >= 100
                  ? 'text-red-500 border-red-500 focus-visible:ring-red-500'
                  : 'text-[#2D2F35]'
                  }`}
                placeholder="e.g. Adrian Saputra"
              />
              <span className={`text-xs text-right ${form.fullName.length >= 100 ? 'text-red-500' : 'text-gray-400'}`}>
                {form.fullName.length}/100
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Gender</FieldLabel>
              <div className="flex gap-3 h-[42px]">
                {(["Male", "Female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange({ gender: g })}
                    className={cn(
                      "flex-1 px-3 bg-[#FAFAFA] rounded-md border flex items-center justify-center sm:justify-start gap-2 transition-colors",
                      form.gender === g
                        ? "border-[#0076D2]"
                        : "border-[#E2E4E6] hover:border-[#A9ADB5]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                        form.gender === g ? "border-[#0076D2]" : "border-[#C6C8CE]"
                      )}
                    >
                      {form.gender === g && (
                        <div className="w-2 h-2 rounded-full bg-[#0076D2]" />
                      )}
                    </div>
                    <span className="text-[#2D2F35] text-sm font-medium leading-[18px]">
                      {g}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Baris 3: Date of Birth & Phone Number */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Date of Birth</FieldLabel>
              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2F35] pointer-events-none z-20"
                />
                <div
                  className={cn(
                    "absolute inset-0 flex items-center pl-11 bg-[#FAFAFA] border border-[#E2E4E6] rounded-md text-base font-normal pointer-events-none z-10 h-[42px]",
                    form.dob ? "text-[#2D2F35]" : "text-[#A9ADB5]"
                  )}
                >
                  {form.dob
                    ? form.dob.split("-").reverse().join("/")
                    : "dd/mm/yyyy"
                  }
                </div>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange({ dob: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-[42px] z-15 cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <div className="h-[42px] w-full" />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Phone Number</FieldLabel>
              <div className="relative">
                <Phone
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${form.phone.length >= 16 ? 'text-red-500' : 'text-[#2D2F35]'}`}
                />
                <Input
                  value={form.phone}
                  maxLength={16}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleChange({ phone: value });
                  }}
                  className={`bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base font-normal leading-6 h-[42px] pl-11 focus-visible:ring-[#0076D2] w-full ${form.phone.length >= 16
                    ? 'text-red-500 border-red-500 focus-visible:ring-red-500'
                    : 'text-[#2D2F35]'
                    }`}
                  placeholder="e.g. 081234567890"
                />
              </div>
              <span className={`text-xs text-right ${form.phone.length >= 16 ? 'text-red-500' : 'text-gray-400'}`}>
                {form.phone.length}/16
              </span>
            </div>
          </div>

        </div>

        {/* Footer Tombol Aksi: Berada di luar scrollbox utama agar posisinya tetap 'sticky' di bawah */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 md:px-8 py-6 border-t border-[#E2E4E6] bg-white shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-3 h-[42px] sm:h-auto !rounded-1xl border-0 bg-[#DBF2F3] text-[#0076D2] text-base font-medium hover:bg-[#c5e9eb] w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className={cn(
              "px-6 py-3 h-[42px] sm:h-auto !rounded-1xl text-base font-medium text-[#FAFAFA] border-0 w-full sm:w-auto",
              isComplete && !isSubmitting
                ? "bg-[#0076D2] hover:bg-[#005fa3]"
                : "bg-[#A9ADB5] cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Saving..." : "Edit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}