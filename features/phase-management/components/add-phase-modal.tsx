"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phaseService } from "../services";
import { useToast } from "@/components/ui/toast";

interface FormData {
  code: string;
  name: string;
  type: string;
  priority: string;
}

const initialForm: FormData = {
  code: "",
  name: "",
  type: "",
  priority: "0",
};

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

interface AddPhaseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPhaseModal({
  open,
  onClose,
  onSuccess,
}: AddPhaseModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Memperoleh prioritas berurutan secara otomatis ketika modal dibuka
  useEffect(() => {
    if (open) {
      phaseService
        .getPhases()
        .then((phases) => {
          const priorities = phases.map((p) => p.priority);
          const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0;
          setForm({
            code: "",
            name: "",
            type: "",
            priority: String(maxPriority + 1),
          });
        })
        .catch(() => {
          setForm({
            code: "",
            name: "",
            type: "",
            priority: "0",
          });
        });
    }
  }, [open]);

  const isComplete =
    form.code.trim() !== "" &&
    form.name.trim() !== "" &&
    form.type.trim() !== "" &&
    form.priority.trim() !== "";

  const handleChange = (partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    onClose();
  };

  const handleMinimize = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    try {
      await phaseService.createPhase({
        code: form.code,
        name: form.name,
        type: form.type,
        priority: Number(form.priority),
      });
      setForm(initialForm);
      onSuccess?.();
      onClose();
      showToast("Add phase config successfully");
    } catch (err) {
      showToast("Failed to add phase configuration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleMinimize()}>
      <DialogContent
        style={{ width: "560px", maxWidth: "560px" }}
        className="p-0 gap-0 rounded-2xl overflow-hidden border-0 shadow-xl [&>button]:hidden"
      >
        <button
          onClick={handleMinimize}
          className="!flex absolute top-6 right-8 w-6 h-6 items-center justify-center text-[#707784] hover:opacity-70"
        >
          <span className="text-2xl leading-none">−</span>
        </button>

        <DialogHeader className="px-8 pt-6 pb-5 space-y-0">
          <DialogTitle className="text-[#2D2F35] text-2xl font-bold leading-7">
            Add New Phase
          </DialogTitle>
          <p className="text-[#707784] text-sm font-normal leading-5 mt-1.5">
            Follow the guided steps to complete the participant data.
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
              onChange={(e) => handleChange({ priority: e.target.value })}
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
            {isSubmitting ? "Saving..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}