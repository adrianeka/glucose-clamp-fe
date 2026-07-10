"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface ModalAddProtocolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export default function ModalAddProtocol({
  open,
  onOpenChange,
  onSubmit,
}: ModalAddProtocolProps) {
  const [form, setForm] = useState({
    protocol_code: "",
    protocol_name: "",
    version: "",
    duration_hours: "",
    insulin_dose_rule: "",
    insulin_dose_unit: "",
    glucose_target_min: "",
    glucose_target_max: "",
    glucose_target_unit: "",
    glucose_target_min_extreme: "",
    glucose_target_max_extreme: "",
    glucose_drop_trigger_percentage: "",
    initial_glucose_infusion_rate: "",
    initial_glucose_infusion_rate_unit: "",
  });

  const { showToast } = useToast();

  const minTarget = Number(form.glucose_target_min);
  const maxTarget = Number(form.glucose_target_max);
  const minExtreme = Number(form.glucose_target_min_extreme);
  const maxExtreme = Number(form.glucose_target_max_extreme);
  const versionNum = Number(form.version);
  const durationNum = Number(form.duration_hours);
  const dropTriggerNum = Number(form.glucose_drop_trigger_percentage);
  const infusionRateNum = Number(form.initial_glucose_infusion_rate);

  const isDoseUnitError = form.insulin_dose_unit.includes("^");
  const isTargetUnitError = form.glucose_target_unit.includes("^");
  const isInfusionUnitError = form.initial_glucose_infusion_rate_unit.includes("^");

  const isVersionError = versionNum > 999.9 || form.version.length > 5;
  const isDurationError = durationNum > 720;
  const isInsulinDoseError = Number(form.insulin_dose_rule) > 999.9;
  const isDropTriggerError = dropTriggerNum > 100;
  const isInfusionRateError = infusionRateNum > 999.9;
  const isGlucoseTargetOverflow =
    minTarget > 999 || maxTarget > 999 || minExtreme > 999 || maxExtreme > 999;

  const isMinMaxError =
    form.glucose_target_min && form.glucose_target_max && minTarget >= maxTarget;

  const isMinExtremeError =
    form.glucose_target_min_extreme && form.glucose_target_min && minExtreme >= minTarget;

  const isMaxExtremeError =
    form.glucose_target_max && form.glucose_target_max_extreme && maxTarget >= maxExtreme;

  const isTargetLogicValid =
    !isMinMaxError && !isMinExtremeError && !isMaxExtremeError && !isGlucoseTargetOverflow;

  const isFormReady =
    form.protocol_code.trim() &&
    form.protocol_name.trim() &&
    form.version &&
    form.duration_hours &&
    form.insulin_dose_rule &&
    form.insulin_dose_unit.trim() &&
    form.glucose_target_min &&
    form.glucose_target_max &&
    form.glucose_target_unit.trim() &&
    form.glucose_target_min_extreme &&
    form.glucose_target_max_extreme &&
    form.glucose_drop_trigger_percentage &&
    form.initial_glucose_infusion_rate &&
    form.initial_glucose_infusion_rate_unit.trim() &&
    isTargetLogicValid &&
    !isDoseUnitError && !isTargetUnitError && !isInfusionUnitError &&
    !isVersionError && !isDurationError && !isInsulinDoseError &&
    !isDropTriggerError && !isInfusionRateError;

  const handleSubmit = () => {
    if (!isFormReady) return;

    onSubmit({
      protocol_code: form.protocol_code,
      protocol_name: form.protocol_name,
      insulin_dose_rule: form.insulin_dose_rule,
      insulin_dose_unit: form.insulin_dose_unit,
      glucose_target_min: minTarget,
      glucose_target_max: maxTarget,
      glucose_target_unit: form.glucose_target_unit,
      glucose_target_min_extreme: minExtreme,
      glucose_target_max_extreme: maxExtreme,
      duration_hours: Number(form.duration_hours),
      glucose_drop_trigger_percentage: Number(form.glucose_drop_trigger_percentage),
      initial_glucose_infusion_rate: Number(form.initial_glucose_infusion_rate),
      initial_glucose_infusion_rate_unit: form.initial_glucose_infusion_rate_unit,
      version: Number(form.version),
      sampling_schedules: [],
    });
  };

  const errorInputClass = "border-red-500 focus-visible:ring-red-500 bg-red-50/30 text-red-900 placeholder:text-red-300";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Protocol
          </DialogTitle>
          <DialogDescription>
            Clearly enter duration, dose, insulin, and glucose target.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Protocol Code */}
          <div>
            <label className="text-sm font-medium">
              Protocol Code <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="EGC002"
              value={form.protocol_code}
              onChange={(e) => setForm({ ...form, protocol_code: e.target.value })}
            />
          </div>

          {/* Name + Version */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Protocol Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Euglycemic Clamp"
                value={form.protocol_name}
                onChange={(e) => setForm({ ...form, protocol_name: e.target.value })}
              />
            </div>
            <div>
              <label className={`text-sm font-medium ${isVersionError ? "text-red-500" : ""}`}>
                Version <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 1.0"
                className={isVersionError ? errorInputClass : ""}
                value={form.version}
                onChange={(e) => {
                  let sanitized = e.target.value.replace(/,/g, ".");
                  sanitized = sanitized.replace(/[^0-9.]/g, "");

                  const parts = sanitized.split(".");
                  if (parts.length > 2) {
                    sanitized = parts[0] + "." + parts.slice(1).join("");
                  }
                  // Batasi maksimal 10 angka di belakang koma
                  if (parts[1] && parts[1].length > 10) {
                    sanitized = parts[0] + "." + parts[1].slice(0, 10);
                  }
                  if (sanitized.length > 15) return;

                  setForm({ ...form, version: sanitized });
                }}
              />
              {isVersionError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal versi adalah 999.9</p>
              )}
            </div>
          </div>

          <div className="border-t" />

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`text-sm font-medium ${isDurationError ? "text-red-500" : ""}`}>
                Duration (hours) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text" // Diubah ke text agar pembatasan regex string berjalan sempurna tanpa intervensi browser
                placeholder="e.g. 24"
                className={isDurationError ? errorInputClass : ""}
                value={form.duration_hours}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, ""); // Hanya boleh angka bulat
                  if (val.length > 5) return; // Mencegah spam angka bulat kepanjangan

                  if (val === "") {
                    setForm({ ...form, duration_hours: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, duration_hours: "1" });
                    showToast("Duration must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, duration_hours: val });
                  }
                }}
              />
              {isDurationError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal 720 jam (30 hari)</p>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${isInsulinDoseError ? "text-red-500" : ""}`}>
                Insulin Dose <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 0.5"
                className={isInsulinDoseError ? errorInputClass : ""}
                value={form.insulin_dose_rule}
                onChange={(e) => {
                  let sanitized = e.target.value.replace(/,/g, ".");
                  sanitized = sanitized.replace(/[^0-9.]/g, "");

                  const parts = sanitized.split(".");
                  if (parts.length > 2) {
                    sanitized = parts[0] + "." + parts.slice(1).join("");
                  }
                  // Batasi maksimal 10 angka di belakang koma
                  if (parts[1] && parts[1].length > 10) {
                    sanitized = parts[0] + "." + parts[1].slice(0, 10);
                  }
                  if (sanitized.length > 15) return;

                  setForm({ ...form, insulin_dose_rule: sanitized });
                }}
              />
              {isInsulinDoseError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal dosis adalah 999.9</p>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${isDoseUnitError ? "text-red-500" : ""}`}>
                Dose Unit <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. U/KgBWSC"
                className={isDoseUnitError ? errorInputClass : ""}
                value={form.insulin_dose_unit}
                onChange={(e) => {
                  let value = e.target.value;
                  const superscriptMap: { [key: string]: string } = {
                    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
                  };
                  value = value.replace(/\^([0-9])/g, (match, p1) => superscriptMap[p1] || match);
                  const sanitized = value.replace(/[^a-zA-Z\/\(\)\.\u0370-\u03FF\u2070-\u2079²³\^]/g, "");
                  setForm({ ...form, insulin_dose_unit: sanitized });
                }}
              />
              {isDoseUnitError && (
                <p className="text-[11px] text-red-500 mt-1">Invalid character '^'</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`text-sm font-medium ${(isMinMaxError || minTarget > 999) ? "text-red-500" : ""}`}>
                Target Glucose Min <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 80"
                className={(isMinMaxError || minTarget > 999) ? errorInputClass : ""}
                value={form.glucose_target_min}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 5) return;

                  if (val === "") {
                    setForm({ ...form, glucose_target_min: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, glucose_target_min: "1" });
                    showToast("Target Glucose Min must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, glucose_target_min: val });
                  }
                }}
              />
              {isMinMaxError && (
                <p className="text-[11px] text-red-500 mt-1">Must be less than Max</p>
              )}
              {minTarget > 999 && !isMinMaxError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal target 999 mg/dL</p>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${(isMinMaxError || isMaxExtremeError || maxTarget > 999) ? "text-red-500" : ""}`}>
                Target Glucose Max <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 150"
                className={(isMinMaxError || isMaxExtremeError || maxTarget > 999) ? errorInputClass : ""}
                value={form.glucose_target_max}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 5) return;

                  if (val === "") {
                    setForm({ ...form, glucose_target_max: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, glucose_target_max: "1" });
                    showToast("Target Glucose Max must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, glucose_target_max: val });
                  }
                }}
              />
              {isMinMaxError && (
                <p className="text-[11px] text-red-500 mt-1">Must be greater than Min</p>
              )}
              {isMaxExtremeError && !isMinMaxError && (
                <p className="text-[11px] text-red-500 mt-1">Must be less than Max Extreme</p>
              )}
              {maxTarget > 999 && !isMinMaxError && !isMaxExtremeError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal target 999 mg/dL</p>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${isTargetUnitError ? "text-red-500" : ""}`}>
                Target Unit <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. mg/dl"
                className={isTargetUnitError ? errorInputClass : ""}
                value={form.glucose_target_unit}
                onChange={(e) => {
                  let value = e.target.value;
                  const superscriptMap: { [key: string]: string } = {
                    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
                  };
                  value = value.replace(/\^([0-9])/g, (match, p1) => superscriptMap[p1] || match);
                  const sanitized = value.replace(/[^a-zA-Z\/\(\)\.\u0370-\u03FF\u2070-\u2079²³\^]/g, "");
                  setForm({ ...form, glucose_target_unit: sanitized });
                }}
              />
              {isTargetUnitError && (
                <p className="text-[11px] text-red-500 mt-1">Invalid character '^'</p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium ${(isMinExtremeError || minExtreme > 999) ? "text-red-500" : ""}`}>
                Target Glucose Min Extreme <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 70"
                className={(isMinExtremeError || minExtreme > 999) ? errorInputClass : ""}
                value={form.glucose_target_min_extreme}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 5) return;

                  if (val === "") {
                    setForm({ ...form, glucose_target_min_extreme: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, glucose_target_min_extreme: "1" });
                    showToast("Target Glucose Min Extreme must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, glucose_target_min_extreme: val });
                  }
                }}
              />
              {isMinExtremeError && (
                <p className="text-[11px] text-red-500 mt-1">Must be less than Target Min</p>
              )}
              {minExtreme > 999 && !isMinExtremeError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal target 999 mg/dL</p>
              )}
            </div>

            <div>
              <label className={`text-sm font-medium ${(isMaxExtremeError || maxExtreme > 999) ? "text-red-500" : ""}`}>
                Target Glucose Max Extreme <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 180"
                className={(isMaxExtremeError || maxExtreme > 999) ? errorInputClass : ""}
                value={form.glucose_target_max_extreme}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 5) return;

                  if (val === "") {
                    setForm({ ...form, glucose_target_max_extreme: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, glucose_target_max_extreme: "1" });
                    showToast("Target Glucose Max Extreme must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, glucose_target_max_extreme: val });
                  }
                }}
              />
              {isMaxExtremeError && (
                <p className="text-[11px] text-red-500 mt-1">Must be greater than Target Max</p>
              )}
              {maxExtreme > 999 && !isMaxExtremeError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal target 999 mg/dL</p>
              )}
            </div>
          </div>

          <div className="border-t" />

          {/* Row 4 (Infusion Parameters) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className={`text-sm font-medium ${isDropTriggerError ? "text-red-500" : ""}`}>
                Glucose Drop Trigger (%) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 10"
                className={isDropTriggerError ? errorInputClass : ""}
                value={form.glucose_drop_trigger_percentage}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 5) return;

                  if (val === "") {
                    setForm({ ...form, glucose_drop_trigger_percentage: "" });
                    return;
                  }
                  const numVal = parseInt(val, 10);
                  if (numVal < 1) {
                    setForm({ ...form, glucose_drop_trigger_percentage: "1" });
                    showToast("Glucose Drop Trigger must be 1 or greater", "error");
                  } else {
                    setForm({ ...form, glucose_drop_trigger_percentage: val });
                  }
                }}
              />
              {isDropTriggerError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal persentase 100%</p>
              )}
            </div>
            <div>
              <label className={`text-sm font-medium ${isInfusionRateError ? "text-red-500" : ""}`}>
                Initial Infusion Rate <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 2"
                className={isInfusionRateError ? errorInputClass : ""}
                value={form.initial_glucose_infusion_rate}
                onChange={(e) => {
                  let sanitized = e.target.value.replace(/,/g, ".");
                  sanitized = sanitized.replace(/[^0-9.]/g, "");

                  const parts = sanitized.split(".");
                  if (parts.length > 2) {
                    sanitized = parts[0] + "." + parts.slice(1).join("");
                  }
                  // Batasi maksimal 10 angka di belakang koma
                  if (parts[1] && parts[1].length > 10) {
                    sanitized = parts[0] + "." + parts[1].slice(0, 10);
                  }
                  if (sanitized.length > 15) return;

                  setForm({ ...form, initial_glucose_infusion_rate: sanitized });
                }}
              />
              {isInfusionRateError && (
                <p className="text-[11px] text-red-500 mt-1">Maksimal kecepatan 999.9</p>
              )}
            </div>
            <div>
              <label className={`text-sm font-medium ${isInfusionUnitError ? "text-red-500" : ""}`}>
                Infusion Rate Unit <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. mg/kgBB/min"
                className={isInfusionUnitError ? errorInputClass : ""}
                value={form.initial_glucose_infusion_rate_unit}
                onChange={(e) => {
                  let value = e.target.value;
                  const superscriptMap: { [key: string]: string } = {
                    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
                  };
                  value = value.replace(/\^([0-9])/g, (match, p1) => superscriptMap[p1] || match);
                  const sanitized = value.replace(/[^a-zA-Z\/\(\)\.\u0370-\u03FF\u2070-\u2079²³\^]/g, "");
                  setForm({ ...form, initial_glucose_infusion_rate_unit: sanitized });
                }}
              />
              {isInfusionUnitError && (
                <p className="text-[11px] text-red-500 mt-1">Invalid character '^'</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#0076D2] w-20 hover:bg-[#0076D2]/90 text-white rounded-lg disabled:bg-gray-300 disabled:text-white"
            disabled={!isFormReady}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}