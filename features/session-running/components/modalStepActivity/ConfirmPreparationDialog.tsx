import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ConfirmationWarning from "./ConfirmationWarning";
import { Button } from "@/components/ui/button";

export function ConfirmPreparationDialog({ 
  isOpen, 
  onOpenChange, 
  data, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  data: any; 
  onConfirm: () => void;
}) {
  const displayFields = [
    { label: "Systolic (mmHg)", value: data?.systolic || "120" },
    { label: "Diastolic (mmHg)", value: data?.diastolic || "80" },
    { label: "Pulse (bpm)", value: data?.pulse || "72" },
    { label: "Respiratory Rate (/min)", value: data?.respiratory || "16" },
    { label: "Temperature (°C)", value: data?.temp || "36.5" },
    { label: "SpO2 (%)", value: data?.spo2 || "98" },
    { label: "Weight (kg)", value: data?.weight || "65.0" },
    { label: "Height (cm)", value: data?.height || "170" },
    { label: "BMI", value: data?.bmi || "22.5" },
    { label: "Waist Circumference (cm)", value: data?.waist || "80.0" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirm Preparation Data</DialogTitle>
          <p className="text-sm text-muted-foreground">S-101 | PREPARATION_CHECK 07:00</p>
        </DialogHeader>

        <div className="py-4">
          <ConfirmationWarning />
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
            {displayFields.map((f, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">{f.label}</p>
                <p className="text-sm font-semibold text-slate-700">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Keluhan Utama</p>
              <p className="text-sm text-slate-700">{data?.complaints || "Tidak ada keluhan utama"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Riwayat Penyakit</p>
              <p className="text-sm text-slate-700">{data?.history || "Tidak ada riwayat penyakit berat"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[#0070C0] bg-blue-50 border-none px-8">Cancel</Button>
          <Button onClick={onConfirm} className="bg-[#0070C0] hover:bg-blue-700 px-8">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}