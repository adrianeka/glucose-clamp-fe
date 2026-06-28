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
    glucose_drop_trigger_percentage: "",      // State baru
    initial_glucose_infusion_rate: "",        // State baru
    initial_glucose_infusion_rate_unit: "",   // State baru
  });

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
    form.initial_glucose_infusion_rate_unit.trim(); 

  const handleSubmit = () => {
    onSubmit({
      protocol_code: form.protocol_code,
      protocol_name: form.protocol_name,
      insulin_dose_rule: form.insulin_dose_rule,
      insulin_dose_unit: form.insulin_dose_unit,
      glucose_target_min: Number(form.glucose_target_min),
      glucose_target_max: Number(form.glucose_target_max),
      glucose_target_unit: form.glucose_target_unit,
      glucose_target_min_extreme: Number(form.glucose_target_min_extreme),
      glucose_target_max_extreme: Number(form.glucose_target_max_extreme),
      duration_hours: Number(form.duration_hours),
      glucose_drop_trigger_percentage: Number(form.glucose_drop_trigger_percentage),
      initial_glucose_infusion_rate: Number(form.initial_glucose_infusion_rate),    
      initial_glucose_infusion_rate_unit: form.initial_glucose_infusion_rate_unit,  
      version: Number(form.version),
      sampling_schedules: [],
    });
  };

  const { showToast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
              onChange={(e) =>
                setForm({
                  ...form,
                  protocol_code: e.target.value,
                })
              }
            />
          </div>

          {/* Name + Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Protocol Name <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="e.g. Euglycemic Clamp"
                value={form.protocol_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    protocol_name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Version <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="e.g. 1.0"
                value={form.version}
                onChange={(e) =>
                  setForm({
                    ...form,
                    version: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="border-t" />

          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">
                Duration (hours) <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                min="1"
                placeholder="e.g. 24"
                value={form.duration_hours}
                onChange={(e) => {
                  const val = e.target.value;
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

            </div>

            <div>
              <label className="text-sm font-medium">
                Insulin Dose <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="e.g. 0.5"
                value={form.insulin_dose_rule}
                onChange={(e) =>
                  setForm({
                    ...form,
                    insulin_dose_rule: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dose Unit <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="e.g. U/KgBWSC"
                value={form.insulin_dose_unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    insulin_dose_unit: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">
                Target Glucose Min <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                min="1"
                placeholder="e.g. 80"
                value={form.glucose_target_min}
                onChange={(e) => {
                  const val = e.target.value;
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
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Glucose Max <span className="text-red-500">*</span>
              </label>

              <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={form.glucose_target_max}
                  onChange={(e) => {
                    const val = e.target.value;
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
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Unit <span className="text-red-500">*</span>
              </label>

              <Input
              placeholder="e.g. mg/dl"
                value={form.glucose_target_unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_unit: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Target Glucose Min Extreme <span className="text-red-500">*</span>
              </label>

                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 70"
                  value={form.glucose_target_min_extreme}
                  onChange={(e) => {
                    const val = e.target.value;
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
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Glucose Max Extreme <span className="text-red-500">*</span>
              </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 180"
                  value={form.glucose_target_max_extreme}
                  onChange={(e) => {
                    const val = e.target.value;
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
            </div>
          </div>

          <div className="border-t" />

          {/* Row 4 (Infusion Parameters - Tambahan Baru) */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium">
                Glucose Drop Trigger (%) <span className="text-red-500">*</span>
              </label>

              <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={form.glucose_drop_trigger_percentage}
                  onChange={(e) => {
                    const val = e.target.value;
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
            </div>

            <div>
              <label className="text-sm font-medium">
                Initial Infusion Rate <span className="text-red-500">*</span>
              </label>

              <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={form.initial_glucose_infusion_rate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setForm({ ...form, initial_glucose_infusion_rate: "" });
                      return;
                    }
                    const numVal = parseInt(val, 10);
                    if (numVal < 1) {
                      setForm({ ...form, initial_glucose_infusion_rate: "1" });
                      showToast("Initial Infusion Rate must be 1 or greater", "error");
                    } else {
                      setForm({ ...form, initial_glucose_infusion_rate: val });
                    }
                  }}
                />
            </div>

            <div>
              <label className="text-sm font-medium">
                Infusion Rate Unit <span className="text-red-500">*</span>
              </label>

              <Input
                placeholder="e.g. mg/kgBB/min"
                value={form.initial_glucose_infusion_rate_unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    initial_glucose_infusion_rate_unit: e.target.value,
                  })
                }
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            className="
                bg-[#0076D2]
                w-20
                hover:bg-[#0076D2]/90
                text-white
                rounded-lg
                disabled:bg-gray-300
                disabled:text-white
              "
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