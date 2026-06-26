// components/modalStepActivity/ConfirmBloodDrawDialog.tsx
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
        style={{
          maxWidth: "36rem",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "none",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)",
        }}
      >
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
            onClick={handleCancelAction}
            disabled={createBloodSampleMutation.isPending}
            style={{
              height: "44px",
              backgroundColor: "#E0F2FE",
              color: "#0070C0",
              fontWeight: 600,
              borderRadius: "6px",
              paddingLeft: "32px",
              paddingRight: "32px",
              transition: "background-color .2s ease",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={createBloodSampleMutation.isPending}
            style={{
              height: "44px",
              backgroundColor: "#0070C0",
              color: "#FFFFFF",
              fontWeight: 600,
              borderRadius: "6px",
              paddingLeft: "32px",
              paddingRight: "32px",
              transition: "background-color .2s ease",
            }}
          >
            {createBloodSampleMutation.isPending
              ? "Confirming..."
              : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}