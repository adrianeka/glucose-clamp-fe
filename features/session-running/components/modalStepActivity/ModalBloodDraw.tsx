// components/modalStepActivity/ModalBloodDraw.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

interface BloodSampleDialogProps {
  isOpen: boolean;
  activity: ActivityDetail | null;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
  onCancel?:()=>void;
}

export function BloodSampleDialog({ isOpen, activity, onSubmit, defaultValues, onCancel }: BloodSampleDialogProps) {
  // Gunakan string kosong ("") sebagai default agar user tahu kolom tersebut wajib diisi baru
  const [form, setForm] = useState({
    sampleCode: "",
    tubeType: "",
    volume: "",
    resultPk: "",
    unitPk: "mg/L", // Satuan PK default tetap diisi untuk mempermudah
    resultCPeptide: "",
    unitCPeptide: "ng/mL", // Satuan C-Peptide default tetap diisi
  });

  useEffect(() => {
    if (isOpen && activity) {
      if (defaultValues) {
        // JIKA KEMBALI DARI CONFIRM: Tampilkan kembali ketikan terakhir user
        setForm(defaultValues);
      } else {
        // JIKA BARU DIBUKA (ADD NEW): Bersihkan semua field agar kosong
        setForm({
          sampleCode: activity.scheduleCode || "", // Kode sampel bawaan dari BE (misal: GD-01) tetap diisi otomatis
          tubeType: "",
          volume: "",
          resultPk: "",
          unitPk: "mg/L",
          resultCPeptide: "",
          unitCPeptide: "ng/mL",
        });
      }
    }
  }, [isOpen, activity, defaultValues]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitting = () => {
    // Validasi sederhana sebelum lanjut ke konfirmasi
    if (!form.sampleCode || !form.tubeType || !form.volume || !form.resultPk || !form.unitPk) {
      alert("Mohon lengkapi semua kolom yang wajib diisi (*).");
      return;
    }
    
    if (!isGlucose && (!form.resultCPeptide || !form.unitCPeptide)) {
    alert("Mohon lengkapi kolom PK & C-Peptide.");
      return;
    }
    onSubmit(form);
  };

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
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        style={{
          maxWidth: "36rem",      // max-w-xl
          padding: "2rem",        // p-8
          backgroundColor: "#fff",
          borderRadius: "12px",   // rounded-xl
          border: "none",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)", // shadow-lg
        }}
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Input Activity Data
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity 
              ? `S${activity.sessionId}-${activity.scheduleCode} | ${activity.activityType} ${formatTime(activity.time)}`
              : "S-101 | BLOOD_DRAW 08:30"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6 border-t border-slate-100 mt-3">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Sample Code <span className="text-red-500">*</span>
            </Label>
            <Input 
              className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              placeholder="e.g. PKC-1"
              value={form.sampleCode} 
              onChange={(e) => handleChange("sampleCode", e.target.value)} 
              disabled
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Tube Type <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                placeholder="e.g. Fluoride, EDTA"
                value={form.tubeType} 
                onChange={(e) => handleChange("tubeType", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Volume (mL) <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                placeholder="e.g. 3.0"
                value={form.volume} 
                onChange={(e) => handleChange("volume", e.target.value)} 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 mb-5 text-base">
              {isGlucose ? "Result Glucose" : "Result PK & C-Peptide"}
            </h4>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Result {isGlucose ? "Glucose" : "PK"}<span className="text-red-500">*</span>
                </Label>
                <Input 
                  className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  placeholder="e.g. 95.0"
                  value={form.resultPk} 
                  onChange={(e) => handleChange("resultPk", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Unit {isGlucose ? "Glucose" : "PK"}<span className="text-red-500">*</span>
                </Label>
                <Input 
                  className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  value={form.unitPk} 
                  onChange={(e) => handleChange("unitPk", e.target.value)} 
                />
              </div>

              {!isGlucose && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Result C-Peptide <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      placeholder="e.g. 1.9"
                      value={form.resultCPeptide} 
                      onChange={(e) => handleChange("resultCPeptide", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Unit C-Peptide <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      className="h-11 bg-white border-slate-200 text-slate-800 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      value={form.unitCPeptide} 
                      onChange={(e) => handleChange("unitCPeptide", e.target.value)} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onCancel} 
            style={{
              height: "44px",
              backgroundColor: "#E0F2FE",
              color: "#0070C0",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "0 32px",
              transition: "background-color .2s ease",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmitting}
            style={{
              height: "44px",
              backgroundColor: "#0070C0",
              color: "#FFFFFF",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "0 32px",
              transition: "background-color .2s ease",
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}