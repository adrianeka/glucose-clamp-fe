// features/session-running/components/modalStepActivity/ModalInsulinInjection.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

interface ModalInsulinInjectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetail | null;
  onSubmit: (formData: any) => void;
}

export function ModalInsulinInjection({ isOpen, onOpenChange, activity, onSubmit }: ModalInsulinInjectionProps) {
  if (!activity) return null;

  // Fungsi untuk memotong awalan dan mengambil teks dosisnya saja secara langsung
  const getDoseFromDesc = (desc: string) => {
    return desc.replace(/^(?:Injeksi insulin|Inject insulin)\s+/i, "");
  };

  const dose = getDoseFromDesc(activity.activityDesc);

  const handleSubmitting = () => {
    onSubmit({ dose }); // Teruskan dosis statis ini ke tahap konfirmasi
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    try {
      const timePart = timeStr.split("T")[1];
      return timePart ? timePart.substring(0, 5) : ""; 
    } catch {
      return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-8 bg-white rounded-xl border-none shadow-lg">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Konfirmasi Insulin Injection
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {`${activity.phaseCode} | Minute ${activity.relativeMinute}m`}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 p-6 bg-slate-50/80 border border-slate-100 rounded-xl space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deskripsi Tugas:
            </span>
            <p className="text-base font-bold text-blue-600">
              {activity.activityDesc}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label className="text-sm font-semibold text-slate-700">
              Dosis Insulin Terdaftar (Protokol)
            </Label>
            <Input 
              type="text" 
              value={dose} 
              disabled // Field dinonaktifkan sepenuhnya karena nilai bersifat statis dari database
              className="h-11 bg-slate-50 border-slate-200 text-slate-500 font-bold rounded-md select-none pointer-events-none"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button 
            variant="ghost"
            onClick={() => onOpenChange(false)} 
            className="h-11 bg-[#E0F2FE] hover:bg-[#bae6fd] text-[#0070C0] font-semibold rounded-md px-8 transition-colors"
          >
            Batal
          </Button>
          <Button 
            onClick={handleSubmitting} 
            className="h-11 bg-[#0070C0] hover:bg-blue-700 text-white font-semibold rounded-md px-8 transition-colors"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}