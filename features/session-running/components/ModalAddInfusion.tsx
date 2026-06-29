"use client";

import { Clock, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"; // Pastikan path ini benar sesuai struktur shadcn anda
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import dayjs from "dayjs";
import { useInfusion } from "../hooks/useInfusionMonitoring";
import { Textarea } from "@/components/ui/textarea";

interface ModalAddInfusionProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number
}

export default function ModalAddInfusion({ isOpen, onClose, sessionId }: ModalAddInfusionProps) {
  const userId = localStorage.getItem('user_id');
  const { useAddInfusion } = useInfusion(sessionId);
  const addInfusion = useAddInfusion();
  const [form, setForm] = useState({
    time: dayjs().format("YYYY-MM-DDTHH:mm"),
    glucoseValue: "",
    confirmationRateMinKg: "",
    rateMinKg: "",
    flowRateMlHr: "",
    adjustmentNote: "",
  });

  const handleSubmit = () => {
    addInfusion.mutate({
      sessionId,
      time: form.time,
      glucoseValue: Number(form.glucoseValue),
      confirmationRateMinKg:
        Number(form.confirmationRateMinKg),
      rateMinKg:
        Number(form.rateMinKg),
      flowRateMlHr:
        Number(form.flowRateMlHr),
      adjustmentNote:
        form.adjustmentNote,
      monitoredBy: userId
    },{
        onSuccess:()=>{
            onClose();
        }
    });

  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          width: "540px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          padding: 0,
          overflow: "hidden",
          border: "1px solid #E2E4E6",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        
        {/* Header Section */}
        <div className="pt-5 pb-4 px-10 border-b border-[#F1F3F5] relative">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-[20px] font-bold text-[#1F2937]">
              Add Infusion Data
            </DialogTitle>
            <DialogDescription className="text-[#707784] text-[12px]">
              Follow the guided steps to complete the infusion data.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Session ID - Disabled style */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-[#4B5563]">
              Session ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input 
                disabled 
                value={sessionId}
                className="bg-[#E9ECEF] border-[#DEE2E6] text-[#495057] h-12 rounded-xl opacity-100 disabled:opacity-100"
              />
            </div>
          </div>

          {/* Actual Time */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-[#4B5563]">
              Actual Time <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                <Clock size={18} />
              </div>

              <Input
                type="datetime-local"
                className="pl-10"
                value={form.time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Grid Layouts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Glucose Value (mg/dL) <span className="text-red-500">*</span>
              </Label>
              <Input
                className="h-10"
                value={form.glucoseValue}
                onChange={(e)=>
                  setForm(prev=>({
                      ...prev,
                      glucoseValue:e.target.value
                  }))
                }
            />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Flow Rate (ml/h) <span className="text-red-500">*</span>
              </Label>
              <Input
                className="h-10"
                value={form.flowRateMlHr}
                onChange={(e)=>
                  setForm(prev=>({
                      ...prev,
                      flowRateMlHr:e.target.value
                  }))
                }
            />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Recommendation GIR <span className="text-red-500">*</span>
              </Label>
              <Input 
                disabled 
                value="4.0" 
                className="bg-[#E9ECEF] border-[#DEE2E6] h-10 rounded-xl opacity-100 disabled:opacity-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Confirmation GIR <span className="text-red-500">*</span>
              </Label>
              <Input
                className="h-10"
                value={form.confirmationRateMinKg}
                onChange={(e)=>
                    setForm(prev=>({
                        ...prev,
                        confirmationRateMinKg:e.target.value
                    }))
                }
              />
            </div>

          </div>
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-[#4B5563]">
              Adjustment Note
            </Label>

            <Textarea
              placeholder="Enter adjustment note..."
              value={form.adjustmentNote}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  adjustmentNote: e.target.value,
                }))
              }
              className="
                min-h-[96px]
                rounded-xl
                border-[#E2E8F0]
                resize-none
                focus-visible:ring-[#0076D2]
              "
            />
          </div>
        </div>

        {/* Footer */}
        <div className="
          border-t
          border-[#E2E4E6]
          px-5
          py-4
          flex
          justify-end
          gap-2
          bg-white
          shrink-0
        ">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            style={{
              backgroundColor: "#D9F2F5",
              color: "#0076D2",
              opacity: 1,
            }}
            className="
              h-9
              px-5
              rounded-md
              font-semibold
              border-none
              hover:opacity-90
              transition
            "
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={addInfusion.isPending}
            className="
              h-9
              px-5
              rounded-md
              bg-[#0076D2]
              hover:bg-[#0066B8]
              text-white
              font-semibold
              shadow-none
            "
          >
            {addInfusion.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}