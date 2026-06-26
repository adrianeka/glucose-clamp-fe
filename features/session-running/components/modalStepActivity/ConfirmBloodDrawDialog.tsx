"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationWarning from "./ConfirmationWarning";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

interface ConfirmBloodDrawDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetail | null;
  data: any; // Menerima data dari form ModalBloodDraw
  onConfirm: () => void; // Aksi mutasi API final
}

export function ConfirmBloodDrawDialog({ isOpen, onOpenChange, activity, data, onConfirm }: ConfirmBloodDrawDialogProps) {
  if (!data) return null;

  const isGlucose = activity?.activityType === "BLOOD_DRAW";

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
            Confirm Activity Data
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity 
              ? `${activity.phaseCode} | ${activity.activityType} ${formatTime(activity.time)}`
              : "S-101 | BLOOD_DRAW 08:30"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <ConfirmationWarning />
          
          {/* Detail Atas */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Sample Code</p>
              <p className="text-sm font-semibold text-slate-800">{data.sampleCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tube Type</p>
                <p className="text-sm font-semibold text-slate-800">{data.tubeType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Volume</p>
                <p className="text-sm font-semibold text-slate-800">{data.volume} mL</p>
              </div>
            </div>
          </div>

          {/* Detail Hasil Lab (Dinamis: Glucose atau Insulin PK) */}
          <div className="pt-5 border-t border-slate-100">
            <h4 className="text-sm font-bold mb-4 uppercase text-slate-800 tracking-wider">
              {isGlucose ? "Result Glucose" : "Result PK & C-Peptide"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Result {isGlucose ? "Glucose" : "PK"}</p>
                <p className="text-sm font-semibold text-slate-800">{data.resultPk}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Unit {isGlucose ? "Glucose" : "PK"}</p>
                <p className="text-sm font-semibold text-slate-800">{data.unitPk}</p>
              </div>

              {!isGlucose && (
                <>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Result C-Peptide</p>
                    <p className="text-sm font-semibold text-slate-800">{data.resultCPeptide}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Unit C-Peptide</p>
                    <p className="text-sm font-semibold text-slate-800">{data.unitCPeptide}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="h-11 bg-[#E0F2FE] hover:bg-[#bae6fd] text-[#0070C0] font-semibold rounded-md px-8 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="h-11 bg-[#0070C0] hover:bg-blue-700 text-white font-semibold rounded-md px-8 transition-colors"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}