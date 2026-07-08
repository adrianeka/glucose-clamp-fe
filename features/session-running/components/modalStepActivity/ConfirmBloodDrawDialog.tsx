"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationWarning from "./ConfirmationWarning";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";
import { useCreateBloodSample } from "@/features/session-running/hooks/useActivityMutation";
import { useToast } from "@/components/ui/toast";

interface ConfirmBloodDrawDialogProps {
  isOpen: boolean;
  activity: ActivityDetail | null;
  data: any;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function ConfirmBloodDrawDialog({ isOpen, activity, data, onCancel, onSuccess }: ConfirmBloodDrawDialogProps) {
  const {showToast} = useToast();
  const sessionId = activity?.sessionId || 1;
  const createBloodSampleMutation = useCreateBloodSample(sessionId);

  if (!data || !activity) return null;

  const isGlucose = activity.activityType === "BLOOD_DRAW";

  const handleConfirm = () => {
    const payload = {
      activityId: activity.activityId,
      collectedBy: 1, 
      sampleTime: new Date().toISOString(),
      sampleType: isGlucose ? "Glucose" : "Insulin",
      tubeType: data.tubeType,
      volumeMl: Math.round(parseFloat(data.volume)) || 0,
      labResults: isGlucose
        ? [
            {
              parameterName: "Glucose",
              value: parseFloat(data.resultPk) || 0,
              unit: data.unitPk,
            },
          ]
        : [
            {
              parameterName: "PK",
              value: parseFloat(data.resultPk) || 0,
              unit: data.unitPk,
            },
            {
              parameterName: "C-Peptide",
              value: parseFloat(data.resultCPeptide) || 0,
              unit: data.unitCPeptide,
            },
          ],
    };

    createBloodSampleMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Data Blood Sample berhasil disimpan!");
         if (onSuccess) onSuccess(); 
      },
      onError: (error) => {
        console.error(error);
        showToast("Gagal menyimpan data Blood Sample.", "error");
      }
    });
  };

  const handleCancelAction = () => {
    onCancel
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
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className="w-[92vw] max-w-[576px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white rounded-xl border-none shadow-xl flex flex-col focus-visible:outline-none"
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Confirm Activity Data
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity 
              ? `${activity.phaseCode} | ${activity.activityType} ${formatTime(activity.time)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 my-4">
          <ConfirmationWarning />

          {/* Grid responsif: 1 kolom di ponsel, 2 kolom di tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <span className="text-xs text-slate-400 block">Tube Type</span>
              <span className="text-sm font-semibold text-slate-800">{data.tubeType}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Volume (mL)</span>
              <span className="text-sm font-semibold text-slate-800">{data.volume} mL</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
              {isGlucose ? "Result Glucose" : "Result PK & C-Peptide"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Result {isGlucose ? "Glucose" : "PK"}</span>
                <span className="text-sm font-semibold text-slate-800">{data.resultPk}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Unit {isGlucose ? "Glucose" : "PK"}</span>
                <span className="text-sm font-semibold text-slate-800">{data.unitPk}</span>
              </div>

              {!isGlucose && (
                <>
                  <div>
                    <span className="text-xs text-slate-400 block">Result C-Peptide</span>
                    <span className="text-sm font-semibold text-slate-800">{data.resultCPeptide}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Unit C-Peptide</span>
                    <span className="text-sm font-semibold text-slate-800">{data.unitCPeptide}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            variant="ghost"
            onClick={handleCancelAction}
            disabled={createBloodSampleMutation.isPending}
            className="w-full sm:w-auto h-11 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0070C0] font-semibold rounded-lg px-8 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={createBloodSampleMutation.isPending}
            className="w-full sm:w-auto h-11 bg-[#0070C0] hover:bg-[#005A9C] text-white font-semibold rounded-lg px-8 transition-colors"
          >
            {createBloodSampleMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}