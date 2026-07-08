"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import ConfirmationWarning from "./ConfirmationWarning";
import { Button } from "@/components/ui/button";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

import { useSubmitPreparationData } from "@/features/session-running/hooks/usePreparationMutation";
import { useToast } from "@/components/ui/toast";

interface ConfirmPreparationDialogProps {
  isOpen: boolean;
  activity: ActivityDetail | null;
  data: any; 
  onCancel: () => void;
  onSuccess: () => void;
  sessionId : number;
}

export function ConfirmPreparationDialog({ isOpen, activity, data, onCancel, onSuccess, sessionId }: ConfirmPreparationDialogProps) {
  const submitPrepMutation = useSubmitPreparationData(sessionId);
  const { showToast } = useToast();

  if (!data || !activity) return null;

  const displayFields = [
    { label: "Systolic (mmHg)", value: data.systolic },
    { label: "Diastolic (mmHg)", value: data.diastolic },
    { label: "Pulse (bpm)", value: data.pulse },
    { label: "Respiratory Rate (/min)", value: data.respiratory },
    { label: "Temperature (°C)", value: data.temp },
    { label: "SpO2 (%)", value: data.spo2 },
    { label: "Weight (kg)", value: data.weight },
    { label: "Height (cm)", value: data.height },
    { label: "BMI", value: data.bmi },
    { label: "Waist Circumference (cm)", value: data.waist },
  ];

  const handleConfirm = () => {
    const timestampISO = new Date().toISOString(); 

    const payload = {
      activityId: activity.activityId,
      vitalSign: {
        sessionId,
        measuredAt: timestampISO,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        pulse: parseInt(data.pulse),
        respiratoryRate: parseInt(data.respiratory),
        temperatureC: parseFloat(data.temp),
        spo2: parseFloat(data.spo2),
        assignedBy: 1, 
      },
      anamnesis: {
        sessionId,
        date: timestampISO.split("T")[0], 
        chiefComplaint: data.complaints,
        medicalHistory: data.history || "Tidak ada riwayat penyakit berat",
        assignedBy: 1,
      },
      anthropometry: {
        sessionId,
        measuredAt: timestampISO,
        weightKg: parseFloat(data.weight),
        heightCm: parseFloat(data.height),
        bmi: parseFloat(data.bmi),
        waistCircumferenceCm: parseFloat(data.waist),
        assignedBy: 1,
      }
    };

    submitPrepMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Data Preparation berhasil disimpan secara resmi!");
        if (onSuccess) onSuccess(); 
      },
      onError: (err) => {
        console.error(err);
        showToast("Terjadi kesalahan saat menyimpan data persiapan medis.", "error");
      }
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="w-[92vw] max-w-[672px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white rounded-xl border-none shadow-xl flex flex-col focus-visible:outline-none"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Confirm Preparation Data</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity ? `${activity.phaseCode} | ${activity.activityType}` : "S-101 | PREPARATION_CHECK 07:00"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6 flex-1">
          <ConfirmationWarning />
          
          {/* Grid responsif: 1 kolom di HP, 2 kolom di tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-t border-slate-100 pt-4">
            {displayFields.map((f, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{f.label}</p>
                <p className="text-sm font-semibold text-slate-700">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Keluhan Utama</p>
              <p className="text-sm text-slate-700">{data.complaints}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Riwayat Penyakit</p>
              <p className="text-sm text-slate-700">{data.history || "Tidak ada riwayat penyakit berat"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={submitPrepMutation.isPending}
            className="w-full sm:w-auto h-11 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0070C0] font-semibold rounded-lg px-8 transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={submitPrepMutation.isPending}
            className="w-full sm:w-auto h-11 bg-[#0070C0] hover:bg-[#005A9C] text-white font-semibold rounded-lg px-8 transition-colors"
          >
            {submitPrepMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}