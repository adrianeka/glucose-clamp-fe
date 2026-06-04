"use client";

import { useState } from "react";
import { useClampStore, getScheduleCode } from "../store/useClampStore";
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

const PHASES = ["Baseline", "Phase 1", "Phase 2", "Phase 3"];
const INTERVALS = ["10", "20", "30"];
const PREFIXES = ["GD", "T"];

export function ScheduleSection() {
  const { protocols, schedules, activities, addScheduleRows, updateScheduleRow, generateActivities } =
    useClampStore();

  const [protocolId, setProtocolId] = useState("");
  const [phaseName, setPhaseName] = useState("Baseline");
  const [startMinute, setStartMinute] = useState(0);
  const [endMinute, setEndMinute] = useState(60);
  const [intervalMinutes, setIntervalMinutes] = useState("10");
  const [labelPrefix, setLabelPrefix] = useState("GD");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!protocolId) { setError("Simpan protokol terlebih dahulu."); return; }
    if (endMinute < startMinute) { setError("End minute harus >= start minute."); return; }
    const rows = [];
    for (let minute = startMinute; minute <= endMinute; minute += Number(intervalMinutes)) {
      rows.push({ protocolId, phaseName, minute, bloodDraw: true, insulinInject: false, insulinCheck: false, labelPrefix });
    }
    addScheduleRows(rows);
    setError("");
  }

  function handleGenerate() {
    if (!protocolId) { setError("Pilih protokol untuk generate activity."); return; }
    const err = generateActivities(protocolId);
    if (err) setError(err);
    else setError("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2) Input Sampling Schedule</CardTitle>
          <p className="text-xs text-muted-foreground">Schedule akan menjadi sumber auto-generate activity.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Pilih Protokol</Label>
              <Select value={protocolId} onValueChange={setProtocolId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Pilih protokol..." />
                </SelectTrigger>
                <SelectContent>
                  {protocols.map((p) => (
                    <SelectItem key={p.protocolId} value={p.protocolId}>
                      {p.protocolId} - {p.protocolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Phase Name</Label>
              <Select value={phaseName} onValueChange={setPhaseName}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Start Minute</Label>
              <Input type="number" value={startMinute} onChange={(e) => setStartMinute(Number(e.target.value))} className="h-9 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">End Minute</Label>
              <Input type="number" value={endMinute} onChange={(e) => setEndMinute(Number(e.target.value))} className="h-9 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Interval (menit)</Label>
              <Select value={intervalMinutes} onValueChange={setIntervalMinutes}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTERVALS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500">Label Prefix</Label>
              <Select value={labelPrefix} onValueChange={setLabelPrefix}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PREFIXES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleAdd}>Tambah Schedule Row</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerate}>
              Generate Activities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sampling Schedule Registry</CardTitle>
          <p className="text-xs text-muted-foreground">
            Stakeholder dapat melihat hubungan langsung schedule terhadap activity.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Minute</TableHead>
                  <TableHead className="text-center">Blood Draw</TableHead>
                  <TableHead className="text-center">Insulin Inject</TableHead>
                  <TableHead className="text-center">Insulin Check</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground text-sm py-8">
                      Belum ada schedule
                    </TableCell>
                  </TableRow>
                )}
                {schedules.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm">{s.protocolId}</TableCell>
                    <TableCell className="text-sm">{s.phaseName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 text-xs">
                        {getScheduleCode(s, schedules)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{s.minute}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={s.bloodDraw}
                        onChange={(e) => updateScheduleRow(s.id, "bloodDraw", e.target.checked)}
                        className="accent-blue-600 w-4 h-4"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={s.insulinInject}
                        onChange={(e) => updateScheduleRow(s.id, "insulinInject", e.target.checked)}
                        className="accent-blue-600 w-4 h-4"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={s.insulinCheck}
                        onChange={(e) => updateScheduleRow(s.id, "insulinCheck", e.target.checked)}
                        className="accent-blue-600 w-4 h-4"
                      />
                    </TableCell>
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
