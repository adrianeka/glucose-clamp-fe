"use client";

import { useState, useEffect, useRef } from "react";
import { useClampStore, ManualStepData } from "../store/useClampStore";
import { Activity } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Activity Modal ────────────────────────────────────────────────────────────

interface ActivityModalProps {
  open: boolean;
  activity: Activity | null;
  protocolDose: string;
  onClose: () => void;
  onSave: (data: ManualStepData) => void;
}

export function ActivityModal({ open, activity, protocolDose, onClose, onSave }: ActivityModalProps) {
  const [glucose, setGlucose] = useState(95);
  const [unit, setUnit] = useState("mg/dL");
  const [pk, setPk] = useState(0);
  const [cp, setCp] = useState(0);
  const [tubeType, setTubeType] = useState("");
  const [volume, setVolume] = useState(0);

  if (!activity) return null;

  const isInjection = activity.activityType === "INSULIN_INJECTION";
  const isCheck = activity.activityType === "INSULIN_CHECK";

  function handleSave() {
    if (isInjection) {
      if (!confirm(`Apakah Anda yakin telah menyuntikkan insulin sebesar ${protocolDose}?`)) return;
      onSave({ isInsulinInjection: true, dose: protocolDose });
    } else if (isCheck) {
      if (!confirm(`Simpan hasil: PK ${pk} mg/L, C-Peptide ${cp} ng/mL?`)) return;
      onSave({ pk, cp });
    } else {
      if (!confirm(`Simpan hasil: Glucose ${glucose} ${unit}?`)) return;
      onSave({ glucose, unit });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isInjection ? "Konfirmasi Insulin Injection" : "Input Activity Data"}</DialogTitle>
        </DialogHeader>

        {isInjection ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 border p-3 text-sm">
              <p className="text-muted-foreground text-xs mb-1">Deskripsi Tugas:</p>
              <p className="font-semibold text-blue-700">{activity.description}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Dosis Insulin Terdaftar (Protokol)</Label>
              <Input value={protocolDose} readOnly className="bg-slate-50 font-bold" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Sample Code</Label>
              <Input value={activity.sampleCode || "-"} readOnly className="bg-slate-50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500">Tube Type</Label>
                <Input value={tubeType} onChange={(e) => setTubeType(e.target.value)} placeholder="e.g. EDTA" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500">Volume (ml)</Label>
                <Input type="number" step="0.1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
              </div>
            </div>
            <div className="border-t pt-3">
              {isCheck ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Result PK & C-Peptide</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Result PK</Label>
                      <Input type="number" step="0.1" value={pk} onChange={(e) => setPk(Number(e.target.value))} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Unit PK</Label>
                      <Input value="mg/L" readOnly className="bg-slate-50" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Result C-Peptide</Label>
                      <Input type="number" step="0.1" value={cp} onChange={(e) => setCp(Number(e.target.value))} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Unit C-Peptide</Label>
                      <Input value="ng/mL" readOnly className="bg-slate-50" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Result Glucose</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Value</Label>
                      <Input type="number" step="0.1" value={glucose} onChange={(e) => setGlucose(Number(e.target.value))} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-slate-500">Unit</Label>
                      <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} className={isInjection ? "bg-green-600 hover:bg-green-700" : ""}>
            {isInjection ? "Konfirmasi & Suntik" : "Save Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Infusion Modal ────────────────────────────────────────────────────────────

interface InfusionModalProps {
  open: boolean;
  initialGlucose: number;
  onClose: () => void;
  onSave: (data: { actualTime: string; glucose: number; rateGir: number; confirmRate: string; flowRate: number }) => void;
}

export function InfusionModal({ open, initialGlucose, onClose, onSave }: InfusionModalProps) {
  const [actualTime, setActualTime] = useState("00:00");
  const [glucose, setGlucose] = useState(initialGlucose);
  const [rateGir, setRateGir] = useState(0);
  const [confirmRate, setConfirmRate] = useState("");
  const [flowRate, setFlowRate] = useState(0);

  useEffect(() => { setGlucose(initialGlucose); }, [initialGlucose]);

  function handleSave() {
    if (!confirm(`Simpan data infusion?\n- Time: ${actualTime}\n- Glucose: ${glucose} mg/dL\n- GIR: ${rateGir}\n- Flow Rate: ${flowRate} ml/h`)) return;
    onSave({ actualTime, glucose, rateGir, confirmRate, flowRate });
    setActualTime("00:00"); setRateGir(0); setConfirmRate(""); setFlowRate(0);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Add Infusion Data</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {[
            { label: "Actual Time", type: "time", value: actualTime, set: setActualTime },
            { label: "Glucose Value (mg/dL)", type: "number", value: glucose, set: (v: string) => setGlucose(Number(v)) },
            { label: "Rate (GIR)", type: "number", value: rateGir, set: (v: string) => setRateGir(Number(v)) },
            { label: "Confirmation Rate", type: "text", value: confirmRate, set: setConfirmRate },
            { label: "Flow Rate (ml/h)", type: "number", value: flowRate, set: (v: string) => setFlowRate(Number(v)) },
          ].map(({ label, type, value, set }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">{label}</Label>
              <Input type={type} value={value as any} onChange={(e) => (set as any)(e.target.value)} step={type === "number" ? "0.1" : undefined} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-white">Save Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Countdown Modal ───────────────────────────────────────────────────────────

interface CountdownModalProps {
  open: boolean;
  activityLabel: string;
  onConfirm: () => void;
}

export function CountdownModal({ open, activityLabel, onConfirm }: CountdownModalProps) {
  const [count, setCount] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) { if (intervalRef.current) clearInterval(intervalRef.current); setCount(60); return; }
    setCount(60);
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [open]);

  const canConfirm = count <= 55;
  const mins = Math.floor(count / 60);
  const secs = count % 60;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm text-center" hideClose>
        <DialogHeader>
          <DialogTitle className="text-blue-700">{activityLabel}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Waktu Tersisa Menuju Aktivitas:</p>
        <div className="text-5xl font-extrabold text-red-600 my-4">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        {canConfirm && (
          <p className="text-xs text-muted-foreground">Waktu tersisa. Anda bisa mengklik OK sekarang atau menunggu.</p>
        )}
        <DialogFooter className="justify-center">
          <Button disabled={!canConfirm} onClick={onConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Warning Modal ────────────────────────────────────────────────────────────

interface WarningModalProps {
  open: boolean;
  message: string;
  onOpenInfusion: () => void;
}

export function WarningModal({ open, message, onOpenInfusion }: WarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm text-center" hideClose>
        <DialogHeader>
          <DialogTitle className="text-amber-600">Peringatan Batas Target Glucose</DialogTitle>
        </DialogHeader>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: message }} />
        <DialogFooter className="justify-center">
          <Button onClick={onOpenInfusion} className="bg-amber-500 hover:bg-amber-600 text-white">
            Buka Infusion Monitoring
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
