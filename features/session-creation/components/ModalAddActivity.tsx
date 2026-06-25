"use client";

import { useState } from "react";
import { Clock3, ChevronDown, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePhaseConfigs } from "@/features/phase-management/hooks";

interface ModalAddActivityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  sessionId: number;
}

export default function ModalAddActivity({
  open,
  onOpenChange,
  onSubmit,
  sessionId
}: ModalAddActivityProps) {
  const { data: phases, isLoading, isError } = usePhaseConfigs();
  const [form, setForm] = useState({
    phase: "",
    startTime: "07:00",
    activityType: "OTHER",
    activityDesc: "",
  });

  const isFormReady =
    form.phase &&
    form.startTime &&
    form.activityType &&
    form.activityDesc.trim();

  const handleSubmit = () => {
    const selectedPhase = phases?.find(
      (p) => p.code === form.phase
    );

    onSubmit({
        sessionId, // <-- otomatis ikut dikirim
        phaseCode: form.phase,
        phaseName: selectedPhase?.name,
        startTime: form.startTime,
        activityType: form.activityType,
        activityDesc: form.activityDesc,
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[640px] max-w-[640px] sm:max-w-[640px] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[20px] font-semibold text-[#212121]">
            Add Custom Activity
          </DialogTitle>

          <DialogDescription className="text-[#707784]">
            Follow the guided steps to complete custom activity data.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t mt-4" />

        {/* Form */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Phase */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Phase <span className="text-red-500">*</span>
              </label>

               <div className="relative">
                <select
                  value={form.phase}
                  disabled={isLoading}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phase: e.target.value,
                    })
                  }
                  className="w-full h-11 rounded-lg border border-[#E2E4E6] bg-white px-3 appearance-none disabled:bg-gray-50"
                >
                  <option value="">
                    {isLoading ? "Loading phases..." : "Select Phase"}
                  </option>
                  
                  {/* Mapping data dari database */}
                  {phases?.map((phase) => (
                    <option key={phase.id} value={phase.code}>
                      {phase.code} - {phase.name}
                    </option>
                  ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin text-[#707784]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#707784]" />
                  )}
                </div>
              </div>
              {isError && (
                <p className="text-xs text-red-500 mt-1">Failed to load phases</p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Start Time <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Clock3
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707784]"
                />

                <Input
                  type="time"
                  value={form.startTime}
                  className="pl-10"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Activity Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Activity Type <span className="text-red-500">*</span>
              </label>

              <div className="flex h-11 w-full items-center rounded-lg border border-[#E2E4E6] bg-[#F5F8FA] px-3 text-sm text-[#595F6A]">
                {form.activityType || "-"}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Description <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="Aktivitas custom tambahan"
                value={form.activityDesc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activityDesc: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            className="bg-[#DBF2F3] border-none text-[#0076D2] hover:bg-[#D0EEF0]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            className="
              bg-[#0076D2]
              hover:bg-[#0067B8]
              text-white
              min-w-[80px]
              disabled:bg-gray-300
              disabled:text-white
              disabled:hover:bg-gray-300
            "
            disabled={!isFormReady}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}