"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActivityDetail } from "@/features/session-running/services/ActivityService";

interface PreparationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: ActivityDetail | null;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
}

export function PreparationDialog({ isOpen, onOpenChange, activity, onSubmit, defaultValues }: PreparationDialogProps) {
  const [form, setForm] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    respiratory: "",
    temp: "",
    spo2: "",
    weight: "",
    height: "",
    bmi: "",
    waist: "",
    complaints: "",
    history: "",
  });

  // Kalkulasi BMI Otomatis saat Tinggi atau Berat berubah
  useEffect(() => {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height);
    if (w > 0 && h > 0) {
      const calculatedBmi = (w / ((h / 100) ** 2)).toFixed(1);
      setForm((prev) => ({ ...prev, bmi: calculatedBmi }));
    } else {
      setForm((prev) => ({ ...prev, bmi: "" }));
    }
  }, [form.weight, form.height]);

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        setForm(defaultValues);
      } else {
        setForm({
          systolic: "",
          diastolic: "",
          pulse: "",
          respiratory: "",
          temp: "",
          spo2: "",
          weight: "",
          height: "",
          bmi: "",
          waist: "",
          complaints: "",
          history: "",
        });
      }
    }
  }, [isOpen, defaultValues]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitting = () => {
    // Validasi input wajib terisi
    const requiredFields = ["systolic", "diastolic", "pulse", "respiratory", "temp", "spo2", "weight", "height", "waist", "complaints"];
    const isAnyEmpty = requiredFields.some((field) => !form[field as keyof typeof form]);
    
    if (isAnyEmpty) {
      alert("Mohon lengkapi semua kolom bertanda bintang (*).");
      return;
    }

    onSubmit(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-8 bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Input Preparation Data</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            {activity ? `${activity.phaseCode} | ${activity.activityType}` : "S-101 | PREPARATION_CHECK 07:00"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-5 py-4 border-t border-slate-100 mt-3">
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Systolic (mmHg) *</Label><Input placeholder="e.g. 120" value={form.systolic} onChange={(e) => handleChange("systolic", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Diastolic (mmHg) *</Label><Input placeholder="e.g. 80" value={form.diastolic} onChange={(e) => handleChange("diastolic", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Pulse (bpm) *</Label><Input placeholder="e.g. 72" value={form.pulse} onChange={(e) => handleChange("pulse", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Respiratory Rate (/min) *</Label><Input placeholder="e.g. 16" value={form.respiratory} onChange={(e) => handleChange("respiratory", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Temperature (°C) *</Label><Input placeholder="e.g. 36.5" value={form.temp} onChange={(e) => handleChange("temp", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">SpO2 (%) *</Label><Input placeholder="e.g. 98" value={form.spo2} onChange={(e) => handleChange("spo2", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Weight (kg) *</Label><Input placeholder="e.g. 65.0" value={form.weight} onChange={(e) => handleChange("weight", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Height (cm) *</Label><Input placeholder="e.g. 170" value={form.height} onChange={(e) => handleChange("height", e.target.value)} /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">BMI (Auto)</Label><Input value={form.bmi} readOnly placeholder="22.5" className="bg-slate-50 pointer-events-none select-none" /></div>
          <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Waist Circumference (cm) *</Label><Input placeholder="e.g. 80.0" value={form.waist} onChange={(e) => handleChange("waist", e.target.value)} /></div>
          
          <div className="col-span-2 space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Keluhan Utama *</Label>
            <Textarea placeholder="Tulis keluhan utama..." value={form.complaints} onChange={(e) => handleChange("complaints", e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Riwayat Penyakit</Label>
            <Textarea placeholder="Tulis riwayat penyakit..." value={form.history} onChange={(e) => handleChange("history", e.target.value)} />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-11 bg-[#E0F2FE] hover:bg-[#bae6fd] text-[#0070C0] font-semibold rounded-md px-8 transition-colors">Cancel</Button>
          <Button onClick={handleSubmitting} className="h-11 bg-[#0070C0] hover:bg-blue-700 text-white font-semibold rounded-md px-8 transition-colors">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}