"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import ConfirmationWarning from "./ConfirmationWarning";
import { Button } from "@/components/ui/button";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

import { useSubmitPreparationData } from "@/features/session-running/hooks/usePreparationMutation";

interface ConfirmPreparationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetail | null;
  data: any; // Menerima form data dari modal input
  onCancel: () => void;
}

export function ConfirmPreparationDialog({ isOpen, onOpenChange, activity, data, onCancel }: ConfirmPreparationDialogProps) {
  const sessionId = activity?.sessionId || 1;
  const submitPrepMutation = useSubmitPreparationData(sessionId);

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
    const timestampISO = new Date().toISOString(); // "2026-05-21T07:10:00"

    const payload = {
      activityId: activity.activityId,
      // 1. DTO VitalSign
      vitalSign: {
        sessionId,
        measuredAt: timestampISO,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        pulse: parseInt(data.pulse),
        respiratoryRate: parseInt(data.respiratory),
        temperatureC: parseFloat(data.temp),
        spo2: parseFloat(data.spo2),
        assignedBy: 1, // Mock user ID
      },
      // 2. DTO Anamnesis
      anamnesis: {
        sessionId,
        date: timestampISO.split("T")[0], // YYYY-MM-DD
        chiefComplaint: data.complaints,
        medicalHistory: data.history || "Tidak ada riwayat penyakit berat",
        assignedBy: 1,
      },
      // 3. DTO Anthropometry
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

    // Jalankan mutasi paralel 3 API + 1 complete activity
    submitPrepMutation.mutate(payload, {
      onSuccess: () => {
        alert("Data Preparation berhasil disimpan secara resmi!");
        onOpenChange(false);
      },
      onError: (err) => {
        console.error(err);
        alert("Terjadi kesalahan saat menyimpan data persiapan medis.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-8 bg-white rounded-xl border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Confirm Preparation Data</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity ? `${activity.phaseCode} | ${activity.activityType}` : "S-101 | PREPARATION_CHECK 07:00"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <ConfirmationWarning />
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
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

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button 
            variant="ghost" 
            onClick={onCancel} 
            disabled={submitPrepMutation.isPending}
            className="h-11 bg-[#E0F2FE] hover:bg-[#bae6fd] text-[#0070C0] font-semibold rounded-md px-8 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={submitPrepMutation.isPending}
            className="h-11 bg-[#0070C0] hover:bg-blue-700 text-white font-semibold rounded-md px-8 transition-colors"
          >
            {submitPrepMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}