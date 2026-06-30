"use client";

import { useEffect, useState } from "react";
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
import { phaseService } from "../services";
import { PhaseConfig } from "../types";

interface FormData {
  code: string;
  name: string;
  type: string;
  priority: string;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5">
      <Label className="text-[#2D2F35] text-sm font-semibold leading-4">
        {children}
      </Label>
      <span className="text-[#E84E2C] text-sm font-semibold leading-4">*</span>
    </div>
  );
}

interface EditPhaseModalProps {
  phase: PhaseConfig | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditPhaseModal({
  phase,
  open,
  onClose,
  onSuccess,
}: EditPhaseModalProps) {
  const { showToast } = useToast();

  const getSafePriority = (priority: any): string => {
    const backendPriority = Number(priority);
    return backendPriority < 1 || isNaN(backendPriority) ? "1" : String(priority);
  };

  const getInitialForm = (): FormData => {
    if (phase) {
        return {
          code: phase.code,
          name: phase.name,
          type: phase.type,
          priority: getSafePriority(phase.priority),
        };
      }
      return { code: "", name: "", type: "", priority: "1" };
    };

  const [form, setForm] = useState<FormData>(getInitialForm);

  // KUNCI PERBAIKAN: Reset data form setiap kali modal dibuka kembali
  useEffect(() => {
    if (open) {
      setForm(getInitialForm());
    }
  }, [open, phase]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!phase) return null;

  const isComplete =
    form.code.trim() !== "" &&
    form.name.trim() !== "" &&
    form.type.trim() !== "" &&
    form.priority.trim() !== "";

  const handleChange = (partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isComplete || !phase.id) return;
    setIsSubmitting(true);
    try {
      await phaseService.updatePhase(phase.id, {
        code: form.code,
        name: form.name,
        type: form.type,
        priority: Number(form.priority),
      });
      onSuccess?.();
      onClose();
      showToast("Edit phase config successfully");
   } catch (err: any) {
      const errorMessage = err?.response?.data?.details || err?.response?.data?.message;

      if (errorMessage) {
        showToast(errorMessage, "error");
      } else {
        showToast("Failed to add phase configuration", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent
        style={{ width: "560px", maxWidth: "560px" }}
        className="p-0 gap-0 rounded-2xl overflow-hidden border-0 shadow-xl [&>button]:hidden"
      >
        <button
          onClick={handleCancel}
          className="!flex absolute top-6 right-8 w-6 h-6 items-center justify-center text-[#707784] hover:opacity-70"
        >
          <span className="text-2xl leading-none">−</span>
        </button>

        <DialogHeader className="px-8 pt-6 pb-5 space-y-0">
          <DialogTitle className="text-[#2D2F35] text-2xl font-bold leading-7">
            Edit Phase Config
          </DialogTitle>
          <p className="text-[#707784] text-sm font-normal leading-5 mt-1.5">
            {phase.name}
          </p>
        </DialogHeader>

        {/* Form Inputs Ditumpuk Vertikal ke Bawah Sesuai Gambar Mockup */}
        <div className="px-8 pb-4 flex flex-col gap-5 border-t border-[#E2E4E6] pt-5 bg-white">
          {/* Phase Code */}
          <div className="flex flex-col gap-[11px]">
            <FieldLabel>Phase Code</FieldLabel>
            <Input
              value={form.code}
              onChange={(e) => handleChange({ code: e.target.value })}
              className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
              placeholder="Phase Code"
            />
          </div>

          {/* Phase Name */}
          <div className="flex flex-col gap-[11px]">
            <FieldLabel>Phase Name</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
              placeholder="Phase Name"
            />
          </div>

          {/* Type Selection */}
          <div className="flex flex-col gap-[11px]">
            <FieldLabel>Type</FieldLabel>
            <div className="relative">
              <select
                value={form.type}
                onChange={(e) => handleChange({ type: e.target.value })}
                className="w-full px-3 bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2] appearance-none cursor-pointer focus:outline-none"
              >
                <option value="" disabled hidden>
                  Type
                </option>
                {["Preparation", "Stabilization", "Pre-insulin", "Post-insulin", "Finalization"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-[#2D2F35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-[11px]">
            <FieldLabel>Priority</FieldLabel>
            <Input
              type="number"
              min="0"
              value={form.priority}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  handleChange({ priority: "" });
                  return;
                }
                const numVal = parseInt(val, 10);
                if (numVal < 1) {
                  handleChange({ priority: "1" });
                  showToast("Priority must be 1 or greater", "error");
                } else {
                  handleChange({ priority: val });
                }
              }}
              className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
              placeholder="0"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-8 py-6 border-t border-[#E2E4E6] bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-3 h-auto !rounded-xl border-0 bg-[#DBF2F3] text-[#0076D2] text-base font-medium hover:bg-[#c5e9eb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className={cn(
              "px-6 py-3 h-auto !rounded-xl text-base font-medium text-[#FAFAFA] border-0",
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