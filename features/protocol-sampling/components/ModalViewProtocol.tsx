"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { X } from "lucide-react";

interface ModalViewProtocolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] border-b last:border-b-0">
    <div className="px-3 py-2 text-xs text-[#595F6A] bg-[#FAFAFA] font-medium sm:font-normal">
      {label}
    </div>

    <div className="px-3 py-2 text-xs text-[#212121] break-all sm:break-normal">
      {value ?? "-"}
    </div>
  </div>
);

export default function ModalViewProtocol({
  open,
  onOpenChange,
  data,
}: ModalViewProtocolProps) {
  if (!data) return null;

  const createdAt = data.created_at
    ? new Date(
        data.created_at[0],
        data.created_at[1] - 1,
        data.created_at[2],
        data.created_at[3],
        data.created_at[4]
      ).toLocaleString()
    : "-";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          w-[95vw]
          max-w-[540px]
          sm:max-w-[540px]
          max-h-[90vh]
          overflow-y-auto
          p-0
          gap-0
          rounded-xl

          [&>button]:hidden
        "
      >
        <DialogTitle className="sr-only">
          Protocol Detail - {data.protocol_name}
        </DialogTitle>

        {/* Header */}
        <div className="bg-[#0076D2] text-white px-6 py-4 relative">
          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            className="
              absolute
              right-4
              top-4
              text-white
              hover:opacity-80
              transition-opacity
            "
          >
            <X className="w-5 h-5" />
          </button>

          <p className="text-xs opacity-90">
            Protocol Detail
          </p>

          <h2 className="text-[20px] sm:text-[24px] font-semibold leading-tight pr-6">
            {data.protocol_name}
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Medical Identity */}
          <div>
            <h3 className="text-xs font-medium text-[#707784] mb-2">
              Medical Identity
            </h3>

            <div className="border rounded-lg overflow-hidden">
              <Row
                label="Protocol Code"
                value={data.protocol_code}
              />

              <Row
                label="Protocol Name"
                value={data.protocol_name}
              />

              <Row
                label="Version"
                value={data.version}
              />
            </div>
          </div>

          {/* Protocol Configuration */}
          <div>
            <h3 className="text-xs font-medium text-[#707784] mb-2">
              Protocol Configuration
            </h3>

            <div className="border rounded-lg overflow-hidden">
              <Row
                label="Duration (hours)"
                value={data.duration_hours}
              />

              <Row
                label="Insulin Dose"
                value={data.insulin_dose_rule}
              />

              <Row
                label="Dose Unit"
                value={data.insulin_dose_unit}
              />

              <Row
                label="Target Glucose Min"
                value={data.glucose_target_min}
              />

              <Row
                label="Target Glucose Max"
                value={data.glucose_target_max}
              />

              <Row
                label="Target Unit"
                value={data.glucose_target_unit}
              />

              <Row
                label="Target Glucose Min Extreme"
                value={
                  data.glucose_target_min_extreme ??
                  "-"
                }
              />

              <Row
                label="Target Glucose Max Extreme"
                value={
                  data.glucose_target_max_extreme ??
                  "-"
                }
              />
            </div>
          </div>

          {/* Audit Trail */}
          <div>
            <h3 className="text-xs font-medium text-[#707784] mb-2">
              Audit Trail
            </h3>

            <div className="border rounded-lg overflow-hidden">
              <Row
                label="Created By"
                value={`${data.created_by_name ?? "-"} • ${createdAt}`}
              />

              <Row
                label="Updated By"
                value={
                  data.updated_by_name ?? "-"
                }
              />

              <Row
                label="Status"
                value={
                  data.status ?? "-"
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}