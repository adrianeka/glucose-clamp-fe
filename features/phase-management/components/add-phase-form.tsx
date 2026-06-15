"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-start gap-0.5">
      <Label className="text-[#707784] text-sm font-medium leading-4">
        {children}
      </Label>
      {required && (
        <span className="w-[5.51px] h-[5.73px] bg-[#E84E2C] mt-0.5 shrink-0" />
      )}
    </div>
  );
}

export function AddPhaseForm() {
  const [phaseCode, setPhaseCode] = useState("");
  const [phaseName, setPhaseName] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isComplete = phaseCode.trim() !== "" && phaseName.trim() !== "" && type !== "" && priority.trim() !== "";

  const options = ["Preparation", "Pre-Insulin", "Post-Insulin", "Finalization"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6">
      <h2 className="text-[#2D2F35] text-lg font-semibold leading-5">
        Add New Phase
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-[11px]">
          <FieldLabel required>Phase Code</FieldLabel>
          <Input
            value={phaseCode}
            onChange={(e) => setPhaseCode(e.target.value)}
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="Phase Code"
          />
        </div>

        <div className="flex flex-col gap-[11px]">
          <FieldLabel required>Phase Name</FieldLabel>
          <Input
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="Phase Name"
          />
        </div>

        <div className="flex flex-col gap-[11px]" ref={dropdownRef}>
          <FieldLabel required>Type</FieldLabel>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-full bg-[#FAFAFA] border border-[#E2E4E6] rounded-md text-base font-normal leading-6 h-[42px] px-3 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#0076D2]",
                type === "" ? "text-[#A9ADB5]" : "text-[#2D2F35]"
              )}
            >
              <span>{type || "Type"}</span>
              {isDropdownOpen ? (
                <ChevronUp size={20} className="text-[#707784]" />
              ) : (
                <ChevronDown size={20} className="text-[#707784]" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E4E6] rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] py-2 z-10 flex flex-col gap-1">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setType(opt);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-[#2D2F35] text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[11px]">
          <FieldLabel required>Priority</FieldLabel>
          <Input
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            type="number"
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="0"
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button
            disabled={!isComplete}
            className={cn(
              "px-4 py-2 h-auto rounded-lg text-sm font-medium leading-[18px] gap-1.5 text-[#FAFAFA] border-0",
              isComplete
                ? "bg-[#0076D2] hover:bg-[#005fa3]"
                : "bg-[#A9ADB5] cursor-not-allowed"
            )}
          >
            <CheckCircle2 size={18} />
            Add Phase Config
          </Button>
        </div>
      </div>
    </div>
  );
}
