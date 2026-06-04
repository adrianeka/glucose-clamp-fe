"use client";

import { useState } from "react";
import { useClampStore, getSessionStartMinutes, minuteToClock } from "../store/useClampStore";
import { Session } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS = ["DRAFT", "PREP", "RUNNING", "COMPLETED"];

const BADGE_COLORS: Record<string, string> = {
  BLOOD_DRAW: "bg-blue-50 text-blue-700 border-blue-300",
  INSULIN_INJECTION: "bg-orange-50 text-orange-700 border-orange-300",
  INSULIN_CHECK: "bg-purple-50 text-purple-700 border-purple-300",
};

export function SessionSection() {
  const { protocols, activities, sessions, createSession } = useClampStore();

  const [form, setForm] = useState({
    sessionId: "S-101",
    participant: "PAT001 - Adrian Saputra",
    protocolId: "",
    visitDate: "2026-05-31",
    startTime: "07:00",
    fastingHours: 10,
    status: "DRAFT",
    // Vital sign
    systolic: "", diastolic: "", pulse: "", respiratoryRate: "", temperatureC: "", spo2: "",
    // Anthropometry
    weightKg: "", heightCm: "", bmi: "", waistCm: "",
    // Anamneses
    anamDate: "2026-05-31", keluhanUtama: "", riwayatPenyakit: "",
  });

  const [sessionPreview, setSessionPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set(field: string, value: string | number) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "weightKg" || field === "heightCm") {
        const w = Number(next.weightKg);
        const h = Number(next.heightCm);
        next.bmi = w > 0 && h > 0 ? (w / (h / 100) ** 2).toFixed(1) : "";
      }
      return next;
    });
  }

  function handleCreate() {
    if (!form.sessionId || !form.participant) { setError("Session ID dan Partisipan wajib diisi."); return; }
    if (!form.protocolId) { setError("Pilih protokol yang valid."); return; }
    const protocol = protocols.find((p) => p.protocolId === form.protocolId);
    if (!protocol) { setError("Protokol tidak ditemukan."); return; }

    const session: Session = {
      sessionId: form.sessionId,
      participant: form.participant,
      protocolId: form.protocolId,
      visitDate: form.visitDate,
      startTime: form.startTime,
      fastingHours: Number(form.fastingHours),
      status: form.status,
      generatedActivities: activities.filter((a) => a.protocolId === form.protocolId).length,
      vitalSign: { systolic: form.systolic, diastolic: form.diastolic, pulse: form.pulse, respiratoryRate: form.respiratoryRate, temperatureC: form.temperatureC, spo2: form.spo2 },
      anthropometry: { weightKg: form.weightKg, heightCm: form.heightCm, bmi: form.bmi, waistCm: form.waistCm },
      anamneses: { tanggal: form.anamDate, keluhanUtama: form.keluhanUtama, riwayatPenyakit: form.riwayatPenyakit },
    };
    createSession(session);
    setSessionPreview(`Session ${session.sessionId} berhasil dibuat. Partisipan: ${session.participant} · Protokol: ${protocol.protocolId} - ${protocol.protocolName} · Durasi: ${protocol.durationHours} jam`);
    setError("");
  }

  const sessionActivities = activities.filter((a) => a.protocolId === form.protocolId);
  const startMins = form.startTime ? (parseInt(form.startTime.split(":")[0]) * 60 + parseInt(form.startTime.split(":")[1])) : 420;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3) Create Session Clamp</CardTitle>
          <p className="text-xs text-muted-foreground">Session dibuat dengan memilih protokol yang sudah tersedia.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Session ID", field: "sessionId" },
              { label: "Partisipan", field: "participant" },
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500">{label}</Label>
                <Input value={(form as any)[field]} onChange={(e) => set(field, e.target.value)} className="h-9 text-sm" />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Pilih Protokol</Label>
              <Select value={form.protocolId} onValueChange={(v) => set("protocolId", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Pilih protokol..." /></SelectTrigger>
                <SelectContent>
                  {protocols.map((p) => <SelectItem key={p.protocolId} value={p.protocolId}>{p.protocolId} - {p.protocolName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Visit Date</Label>
              <Input type="date" value={form.visitDate} onChange={(e) => set("visitDate", e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Start Time</Label>
              <Input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Fasting Hours</Label>
              <Input type="number" value={form.fastingHours} onChange={(e) => set("fastingHours", Number(e.target.value))} className="h-9 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-xs font-bold text-slate-500">Session Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vital Sign */}
          <div className="border-t pt-3">
            <p className="text-xs font-bold text-slate-500 mb-2">VITAL SIGN</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Systolic (mmHg)", field: "systolic" },
                { label: "Diastolic (mmHg)", field: "diastolic" },
                { label: "Pulse (bpm)", field: "pulse" },
                { label: "Resp Rate (/min)", field: "respiratoryRate" },
                { label: "Temperature (°C)", field: "temperatureC" },
                { label: "SpO2 (%)", field: "spo2" },
              ].map(({ label, field }) => (
                <div key={field} className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">{label}</Label>
                  <Input type="number" value={(form as any)[field]} onChange={(e) => set(field, e.target.value)} className="h-8 text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Anthropometry */}
          <div className="border-t pt-3">
            <p className="text-xs font-bold text-slate-500 mb-2">ANTHROPOMETRY</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Weight (kg)", field: "weightKg" },
                { label: "Height (cm)", field: "heightCm" },
                { label: "BMI (auto)", field: "bmi", readonly: true },
                { label: "Waist (cm)", field: "waistCm" },
              ].map(({ label, field, readonly }) => (
                <div key={field} className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">{label}</Label>
                  <Input
                    type="number"
                    value={(form as any)[field]}
                    onChange={(e) => !readonly && set(field, e.target.value)}
                    readOnly={readonly}
                    className={`h-8 text-sm ${readonly ? "bg-slate-50" : ""}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Anamneses */}
          <div className="border-t pt-3">
            <p className="text-xs font-bold text-slate-500 mb-2">ANAMNESES</p>
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-slate-400">Tanggal</Label>
                <Input type="date" value={form.anamDate} onChange={(e) => set("anamDate", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-slate-400">Keluhan Utama</Label>
                <Textarea value={form.keluhanUtama} onChange={(e) => set("keluhanUtama", e.target.value)} rows={2} className="text-sm resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-slate-400">Riwayat Penyakit</Label>
                <Textarea value={form.riwayatPenyakit} onChange={(e) => set("riwayatPenyakit", e.target.value)} rows={3} className="text-sm resize-none" />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleCreate} size="sm">Buat Session Clamp</Button>
          </div>

          {sessionPreview && (
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              {sessionPreview}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Generated Activities</CardTitle>
          <p className="text-xs text-muted-foreground">Daftar activity digenerate dari sampling schedule dan protokol terpilih.</p>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="rounded-lg border overflow-auto max-h-[520px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Minute</TableHead>
                  {sessions.length > 0 && <TableHead>Time</TableHead>}
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground text-sm py-8">
                      Belum ada activity. Generate dari sampling schedule.
                    </TableCell>
                  </TableRow>
                )}
                {sessionActivities.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{i + 1}</TableCell>
                    <TableCell className="text-sm">{a.protocolId}</TableCell>
                    <TableCell className="text-sm">{a.phaseName}</TableCell>
                    <TableCell className="text-sm">{a.minute}</TableCell>
                    {sessions.length > 0 && (
                      <TableCell className="text-sm">{minuteToClock(a.minute, startMins)}</TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${BADGE_COLORS[a.activityType] ?? ""}`}>
                        {a.activityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
