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
  data: any; // Menerima form data dari modal input
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
        style={{
          maxWidth: "42rem",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        }}
      >
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
            style={{
              height: "44px",
              backgroundColor: "#E0F2FE",
              color: "#0070C0",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "0 32px",
              transition: "background-color 0.2s ease",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={submitPrepMutation.isPending}
            style={{
              height: "44px",
              backgroundColor: "#0070C0",
              color: "#FFFFFF",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "0 32px",
              transition: "background-color 0.2s ease",
            }}
          >
            {submitPrepMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}