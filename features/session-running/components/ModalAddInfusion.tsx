"use client";

import React from "react";
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

interface ModalAddInfusionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAddInfusion({ isOpen, onClose }: ModalAddInfusionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Overlay/Backdrop sudah dihandle otomatis oleh Shadcn dengan efek redup (bg-black/80) */}
      {/* <DialogContent className=" w-[550px] max-w-[550px] sm:max-w-[550px] p-0 overflow-hidden border-none rounded-[20px]"> */}
      <DialogContent
        className="
            w-110
            max-w-110
            sm:max-w-[110]
            p-0
            overflow-hidden
            border
            border-[#E2E4E6]
            rounded-2xl
            shadow-xl
            gap-0
        "
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
        <div className="p-10 space-y-6">
          {/* Session ID - Disabled style */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-[#4B5563]">
              Session ID <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input 
                disabled 
                value="S-101 | Adrian Saputra" 
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Clock size={18} />
              </div>
              <Input 
                placeholder="00:00" 
                className="pl-10 h-12 border-[#E2E8F0] rounded-xl focus-visible:ring-[#0076D2]"
              />
            </div>
          </div>

          {/* Grid Layouts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Glucose Value (mg/dL) <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="0.0" className="h-12 border-[#E2E8F0] rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Flow Rate (ml/h) <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="0.0" className="h-12 border-[#E2E8F0] rounded-xl" />
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
                className="bg-[#E9ECEF] border-[#DEE2E6] h-12 rounded-xl opacity-100 disabled:opacity-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#4B5563]">
                Confirmation GIR <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="0.0" className="h-12 border-[#E2E8F0] rounded-xl" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E4E6] px-5 py-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            // Menggunakan inline style untuk memaksa warna
            style={{ 
                backgroundColor: "#D9F2F5", 
                color: "#0076D2",
                opacity: 1 
            }}
            className="
            h-9
            px-5
            rounded-md
            font-bold
            hover:opacity-90
            border-none
            "
        >
            Cancel
        </Button>

          <Button
                disabled
                style={{ backgroundColor: '#9c9fa2', opacity: 1 }} // Force background & opacity
                className="
                    h-9
                    px-5
                    text-white
                    rounded-md
                    font-medium
                    cursor-not-allowed
                "
                >
                Submit
                </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}