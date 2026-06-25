"use client";

import { useState, useEffect } from "react";
import { Clock3, ChevronDown, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePhaseConfigs } from "@/features/phase-management/hooks";
import { Activity } from "../types/Activities";

interface ModalEditActivityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  activity: Activity | null;
  isLoadingSubmit?: boolean;
}

export default function ModalEditActivity({
  open,
  onOpenChange,
  onSubmit,
  activity,
  isLoadingSubmit
}: ModalEditActivityProps) {
  const { data: phases, isLoading: isLoadingPhases } = usePhaseConfigs();
  const [form, setForm] = useState({
    phase: "",
    startTime: "",
    activityType: "OTHER",
    activityDesc: "",
  });

  useEffect(() => {
    if (activity && open) {
        const date = new Date(activity.time);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const timeFormatted = `${hours}:${minutes}`; // Hasil: "09:50" (pasti pakai titik dua)

        console.log("FORMATTED TIME :: ", timeFormatted);
        
        setForm({
        phase: activity.phaseCode,
        startTime: timeFormatted,
        activityType: activity.activityType,
        activityDesc: activity.activityDesc,
        });
    }
    }, [activity, open]);

  const handleSubmit = () => {
    const selectedPhase = phases?.find((p) => p.code === form.phase);
    onSubmit({
      phaseCode: form.phase,
      phaseName: selectedPhase?.name,
      startTime: form.startTime,
      activityType: form.activityType,
      activityDesc: form.activityDesc,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[640px] sm:max-w-[640px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[20px] font-semibold text-[#212121]">Edit Custom Activity</DialogTitle>
          <DialogDescription className="text-[#707784]">Modify the activity details below.</DialogDescription>
        </DialogHeader>

        <div className="border-t mt-4" />

        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">Phase *</label>
              <div className="relative">
                <select
                  value={form.phase}
                  onChange={(e) => setForm({ ...form, phase: e.target.value })}
                  className="w-full h-11 rounded-lg border border-[#E2E4E6] bg-white px-3 appearance-none"
                >
                  {phases?.map((phase) => (
                    <option key={phase.id} value={phase.code}>{phase.code} - {phase.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707784] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">Start Time *</label>
              <div className="relative">
                <Clock3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707784]" />
                <Input type="time" value={form.startTime} className="pl-10" onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">Activity Type *</label>
              <div className="flex h-11 w-full items-center rounded-lg border border-[#E2E4E6] bg-[#F5F8FA] px-3 text-sm text-[#595F6A]">
                OTHER
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">Description *</label>
              <Input value={form.activityDesc} onChange={(e) => setForm({ ...form, activityDesc: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" className="bg-[#DBF2F3] border-none text-[#0076D2] hover:bg-[#D0EEF0]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#0076D2] hover:bg-[#0067B8] text-white min-w-[80px]" onClick={handleSubmit} disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}