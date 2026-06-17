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
  const [form, setForm] = useState<FormData>({
    medicalRecordNo: "",
    fullName: "",
    gender: "",
    dob: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // sync form state whenever a new participant is selected
  useEffect(() => {
    if (participant) {
      setForm({
        medicalRecordNo: participant.medicalRecordNo,
        fullName: participant.name,
        gender: participant.gender as "Male" | "Female",
        dob: String(participant.dob).slice(0, 10),
        phone: participant.numberPhone,
      });
    }
  }, [participant]);

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
        style={{ width: "560px", maxWidth: "560px" }}
        className="p-0 gap-0 rounded-xl overflow-hidden border-0 shadow-xl [&>button]:hidden"
      >
        <button
          onClick={handleCancel}
          className="!flex absolute top-6 right-8 w-6 h-6 items-center justify-center text-[#707784] hover:opacity-70"
        >
          <span className="text-2xl leading-none">−</span>
        </button>

        <DialogHeader className="px-8 pt-6 pb-5 space-y-0">
          <DialogTitle className="text-[#2D2F35] text-2xl font-bold leading-7">
            Edit Participant
          </DialogTitle>
          <p className="text-[#707784] text-sm font-normal leading-5 mt-1.5">
            {participant.name}
          </p>
        </DialogHeader>

        <div className="px-8 pb-2 flex flex-col gap-5 border-t border-[#E2E4E6] pt-5">
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>ID Participant</FieldLabel>
              <Input
                value={participant.participantId}
                disabled
                className="bg-[#F1F1F1] border-[#E2E4E6] rounded-md text-[#707784] text-base font-normal leading-6 h-[42px] cursor-not-allowed"
              />
            </div>
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Medical Record No.</FieldLabel>
              <Input
                value={form.medicalRecordNo}
                onChange={(e) => handleChange({ medicalRecordNo: e.target.value })}
                className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={form.fullName}
                onChange={(e) => handleChange({ fullName: e.target.value })}
                className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
              />
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
                      "flex-1 px-3 bg-[#FAFAFA] rounded-md border flex items-center gap-2 transition-colors",
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

          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Date of Birth</FieldLabel>
              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2F35] pointer-events-none"
                />
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange({ dob: e.target.value })}
                  className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] pl-11 focus-visible:ring-[#0076D2]"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[11px]">
              <FieldLabel>Phone Number</FieldLabel>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2F35] pointer-events-none"
                />
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange({ phone: e.target.value })}
                  className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] pl-11 focus-visible:ring-[#0076D2]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-6 mt-2 border-t border-[#E2E4E6]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-3 h-auto !rounded-1xl border-0 bg-[#DBF2F3] text-[#0076D2] text-base font-medium hover:bg-[#c5e9eb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className={cn(
              "px-6 py-3 h-auto !rounded-1xl text-base font-medium text-[#FAFAFA] border-0",
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