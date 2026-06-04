"use client";

import { useState } from "react";
import { useClampStore } from "../store/useClampStore";
import { Protocol } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_FORM: Protocol = {
  protocolId: "PR-24H",
  protocolCode: "EGC001",
  protocolName: "Euglycemic Clamp",
  version: "1.0",
  durationHours: 24,
  insulinDose: 0.5,
  insulinUnit: "U/kgBW SC",
  targetMin: 90,
  targetMax: 100,
  targetUnit: "mg/dL",
};

export function ProtocolSection() {
  const { protocols, saveProtocol } = useClampStore();
  const [form, setForm] = useState<Protocol>(DEFAULT_FORM);
  const [error, setError] = useState("");

  function set(field: keyof Protocol, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!form.protocolId || !form.protocolName) {
      setError("Protocol ID dan Protocol Name wajib diisi.");
      return;
    }
    if (form.targetMin >= form.targetMax) {
      setError("Target min harus lebih kecil dari target max.");
      return;
    }
    saveProtocol(form);
    setError("");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1) Input Protokol</CardTitle>
          <p className="text-xs text-muted-foreground">
            Input durasi, dosis insulin, target glucose, dan identitas protokol.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Protocol ID", field: "protocolId", type: "text" },
              { label: "Protocol Code", field: "protocolCode", type: "text" },
              { label: "Protocol Name", field: "protocolName", type: "text" },
              { label: "Version", field: "version", type: "text" },
              { label: "Durasi (jam)", field: "durationHours", type: "number" },
              { label: "Dosis Insulin", field: "insulinDose", type: "number" },
              { label: "Satuan Dosis", field: "insulinUnit", type: "text" },
              { label: "Target Glucose Min", field: "targetMin", type: "number" },
              { label: "Target Glucose Max", field: "targetMax", type: "number" },
              { label: "Satuan Target", field: "targetUnit", type: "text" },
            ].map(({ label, field, type }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500">{label}</Label>
                <Input
                  type={type}
                  value={(form as any)[field]}
                  onChange={(e) =>
                    set(field as keyof Protocol, type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  step={field === "insulinDose" ? "0.1" : undefined}
                  className="h-9 text-sm"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="sm">
              Simpan Protokol
            </Button>
          </div>
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-3 py-2 text-xs text-blue-800">
            Contoh default: <strong>PR-24H</strong>, dosis insulin{" "}
            <strong>0.5 U/kgBW SC</strong>, target glukosa <strong>90–100 mg/dL</strong>, durasi{" "}
            <strong>24 jam</strong>.
          </div>
        </CardContent>
      </Card>

      {/* Registry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Protocol Registry</CardTitle>
          <p className="text-xs text-muted-foreground">
            Setelah disimpan, protokol akan tersedia untuk dipilih saat membuat session clamp.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocol ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground text-sm py-8">
                      Belum ada protokol
                    </TableCell>
                  </TableRow>
                )}
                {protocols.map((p) => (
                  <TableRow key={p.protocolId}>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                        {p.protocolId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{p.protocolName}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.protocolCode} · v{p.version}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.durationHours} jam</TableCell>
                    <TableCell className="text-sm">
                      {p.insulinDose} {p.insulinUnit}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.targetMin}–{p.targetMax} {p.targetUnit}
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
