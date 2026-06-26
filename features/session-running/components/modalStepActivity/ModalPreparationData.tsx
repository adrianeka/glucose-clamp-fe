"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PreparationDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  activityData  // Tambahkan prop ini
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: () => void;
  activityData?: any 
}) {
  const fields = [
    { id: "systolic", label: "Systolic (mmHg)", placeholder: "120" },
    { id: "diastolic", label: "Diastolic (mmHg)", placeholder: "80" },
    { id: "pulse", label: "Pulse (bpm)", placeholder: "72" },
    { id: "respiratory", label: "Respiratory Rate (/min)", placeholder: "16" },
    { id: "temp", label: "Temperature (°C)", placeholder: "36.5" },
    { id: "spo2", label: "SpO2 (%)", placeholder: "98" },
    { id: "weight", label: "Weight (kg)", placeholder: "65.0" },
    { id: "height", label: "Height (cm)", placeholder: "170" },
    { id: "bmi", label: "BMI", placeholder: "22.5" },
    { id: "waist", label: "Waist Circumference (cm)", placeholder: "80.0" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
            style={{
            maxWidth: "48rem", // sama dengan max-w-3xl
            maxHeight: "90vh",
            overflowY: "auto",
            }}
        >
            <DialogHeader>
            <DialogTitle
                style={{
                fontSize: "1.5rem", // 24px
                fontWeight: 700,
                }}
            >
                Input Preparation Data
            </DialogTitle>

            <p
                style={{
                fontSize: "0.875rem", // 14px
                color: "#6b7280",
                }}
            >
                S-101 | PREPARATION_CHECK 07:00
            </p>
            </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-xs font-bold uppercase">
                {field.label} <span className="text-red-500">*</span>
              </Label>
              <Input id={field.id} className="bg-slate-50" placeholder={field.placeholder} />
            </div>
          ))}
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-bold uppercase">Keluhan Utama *</Label>
            <Textarea className="bg-slate-50" placeholder="Tidak ada keluhan utama" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-bold uppercase">Riwayat Penyakit *</Label>
            <Textarea className="bg-slate-50" placeholder="Tidak ada riwayat penyakit berat" />
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[#0070C0] bg-blue-50 border-none px-8">Cancel</Button>
          <Button onClick={onSubmit} className="bg-[#0070C0] hover:bg-blue-700 px-8">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}