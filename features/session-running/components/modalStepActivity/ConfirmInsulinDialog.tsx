// features/session-running/components/modalStepActivity/ConfirmInsulinDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationWarning from "./ConfirmationWarning";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

// Mengimpor hook yang murni melakukan hit API complete
import { useCompleteActivity } from "@/features/session-running/hooks/useActivityMutation";

interface ConfirmInsulinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetail | null;
  data: any; // Menerima data { dose } dari ModalInsulinInjection
  onCancel: () => void; // Aksi Go-Back ke modal input
}

export function ConfirmInsulinDialog({ isOpen, onOpenChange, activity, data, onCancel }: ConfirmInsulinDialogProps) {
  const sessionId = activity?.sessionId || 1;
  
  // Daftarkan hook completeActivity
  const completeMutation = useCompleteActivity(sessionId);

  if (!data || !activity) return null;

  const handleConfirm = () => {
    // Pure melakukan hit API ke /activities/{id}/complete
    completeMutation.mutate(activity.activityId, {
      onSuccess: () => {
        alert("Suntik insulin berhasil dikonfirmasi!");
        onOpenChange(false);
      },
      onError: (err) => {
        console.error(err);
        alert("Gagal melakukan konfirmasi tindakan.");
      }
    });
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
            Confirm Insulin Injection
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {`${activity.phaseCode} | Minute ${activity.relativeMinute}m`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <ConfirmationWarning />
          
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Aktivitas Tindakan</p>
              <p className="text-sm font-semibold text-slate-800">Insulin Injection (Suntik Insulin)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Dosis Disuntikkan</p>
                <p className="text-sm font-bold text-emerald-600">{data.dose}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Waktu Tindakan</p>
                <p className="text-sm font-semibold text-slate-800">{formatTime(activity.time)}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button 
            variant="ghost" 
            onClick={onCancel} 
            disabled={completeMutation.isPending}
            className="h-11 bg-[#E0F2FE] hover:bg-[#bae6fd] text-[#0070C0] font-semibold rounded-md px-8 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={completeMutation.isPending}
            className="h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-md px-8 transition-colors"
          >
            {completeMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}