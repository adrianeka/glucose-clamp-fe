"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ModalEditProtocolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (protocolId: number, data: any) => void;
  data: any;
}

export default function ModalEditProtocol({
  open,
  onOpenChange,
  onSubmit,
  data,
}: ModalEditProtocolProps) {
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
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      protocol_code: data.protocol_code ?? "",
      protocol_name: data.protocol_name ?? "",
      version: String(data.version ?? ""),
      duration_hours: String(data.duration_hours ?? ""),
      insulin_dose_rule: data.insulin_dose_rule ?? "",
      insulin_dose_unit: data.insulin_dose_unit ?? "",
      glucose_target_min: String(data.glucose_target_min ?? ""),
      glucose_target_max: String(data.glucose_target_max ?? ""),
      glucose_target_unit: data.glucose_target_unit ?? "",
      glucose_target_min_extreme: String(
        data.glucose_target_min_extreme ?? ""
      ),
      glucose_target_max_extreme: String(
        data.glucose_target_max_extreme ?? ""
      ),
    });
  }, [data]);

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
    form.glucose_target_max_extreme;

  const handleSubmit = () => {
    onSubmit(data.protocol_id,{
      protocol_code: form.protocol_code,
      protocol_name: form.protocol_name,
      version: Number(form.version),
      duration_hours: Number(form.duration_hours),
      insulin_dose_rule: form.insulin_dose_rule,
      insulin_dose_unit: form.insulin_dose_unit,
      glucose_target_min: Number(
        form.glucose_target_min
      ),
      glucose_target_max: Number(
        form.glucose_target_max
      ),
      glucose_target_unit:
        form.glucose_target_unit,
      glucose_target_min_extreme: Number(
        form.glucose_target_min_extreme
      ),
      glucose_target_max_extreme: Number(
        form.glucose_target_max_extreme
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-145 max-w-145 sm:max-w-145 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Protocol
          </DialogTitle>

          <DialogDescription>
            Update protocol configuration and glucose targets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">

          {/* Protocol Code */}
          <div>
            <label className="text-sm font-medium">
              Protocol Code
              <span className="text-red-500">*</span>
            </label>

            <Input
              value={form.protocol_code}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Name + Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Protocol Name
                <span className="text-red-500">*</span>
              </label>

              <Input
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
                Version
                <span className="text-red-500">*</span>
              </label>

              <Input
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
                Duration (hours)
                <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                value={form.duration_hours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration_hours: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Insulin Dose
                <span className="text-red-500">*</span>
              </label>

              <Input
                value={form.insulin_dose_rule}
                onChange={(e) =>
                  setForm({
                    ...form,
                    insulin_dose_rule:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dose Unit
                <span className="text-red-500">*</span>
              </label>

              <Input
                value={form.insulin_dose_unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    insulin_dose_unit:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">
                Target Glucose Min
                <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                value={form.glucose_target_min}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_min:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Glucose Max
                <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                value={form.glucose_target_max}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_max:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Unit
                <span className="text-red-500">*</span>
              </label>

              <Input
                value={form.glucose_target_unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_unit:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Target Glucose Min Extreme
                <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                value={form.glucose_target_min_extreme}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_min_extreme:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Target Glucose Max Extreme
                <span className="text-red-500">*</span>
              </label>

              <Input
                type="number"
                value={form.glucose_target_max_extreme}
                onChange={(e) =>
                  setForm({
                    ...form,
                    glucose_target_max_extreme:
                      e.target.value,
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
            disabled={!isFormReady}
            onClick={handleSubmit}
            className="
                bg-[#0076D2]
                w-20
                hover:bg-[#0076D2]/90
                text-white
                rounded-lg
                disabled:bg-gray-300
                disabled:text-white
              "
          >
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}