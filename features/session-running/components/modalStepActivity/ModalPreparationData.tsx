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
  activity: ActivityDetail | null;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
  onCancel?:()=>void;
}

export function PreparationDialog({ isOpen, activity, onSubmit, defaultValues, onCancel }: PreparationDialogProps) {
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
    <Dialog open={isOpen}>
      <DialogContent
        style={{
          maxWidth: "42rem",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
        }}
      >
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
              color: "#fff",
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