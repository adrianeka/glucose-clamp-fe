"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CirclePause, ChevronDown, ChevronUp } from "lucide-react";

interface ModalConfirmationEndSessionRunningProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
  mode?: "manual" | "critical";
  glucoseValue?: number;
  glucoseMin?: number;
  glucoseMax?: number;
}

export function ModalConfirmationEndSessionRunning({
  isOpen,
  onCancel,
  onSubmit,
  defaultValues,
  mode,
  glucoseMax,
  glucoseMin,
  glucoseValue
}: ModalConfirmationEndSessionRunningProps) {
  console.log("dipanggil mode ::", mode);
  const [internalStep, setInternalStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Completed per Protocol",
    "Glucose Exceeded Critical Limits",
    "Participant Medical Condition Deteriorated",
    "Equipment Malfunction / Error",
    "Other (Please Specify)",
  ];

  // Sinkronisasi state saat modal dibuka atau kembali dari konfirmasi
  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        setCategory(defaultValues.category);
        setNotes(defaultValues.notes);
        setInternalStep(2);
      } else {
        setCategory("");
        setNotes("");
        setInternalStep(1);
      }
    }
    setIsDropdownOpen(false);
  }, [isOpen, defaultValues]);

  // Klik di luar untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitting = () => {
    if (!category) {
      alert("Please select a Reason Category.");
      return;
    }
    if (!notes.trim()) {
      alert("Please provide detailed notes for clinical documentation.");
      return;
    }
    onSubmit({ category, notes });
  };
  // console.log("internal step ::", internalStep);
  // console.log("mode ::", mode);
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        style={{
          maxWidth: "440px",
          padding: "2.5rem", // p-10
          backgroundColor: "#fff",
          borderRadius: "24px",
          border: "none",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        }}
      >
        {/* ================= STEP 1: INITIAL CONFIRMATION ================= */}
        {internalStep === 1 && (
          <>
            {mode === "manual" ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-[70px] h-[70px] rounded-full border-[3px] border-[#FF5A36] mb-6">
                  <CirclePause
                    size={36}
                    strokeWidth={2.5}
                    className="text-[#FF5A36]"
                  />
                </div>

                <DialogHeader className="flex flex-col items-center">
                  <DialogTitle className="text-[22px] font-bold text-[#212121] mb-2">
                    End Clamp Session?
                  </DialogTitle>

                  <DialogDescription className="text-[16px] text-[#707784] leading-relaxed">
                    Are you sure you want to manually end the current clamp session?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row gap-4 w-full mt-8">
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1"
                    style={{
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: "#D9F3F6",
                      color: "#009BB1",
                      fontWeight: 700,
                      fontSize: "16px",
                      border: "none",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => setInternalStep(2)}
                    className="flex-1"
                    style={{
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: "#FF5A36",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "16px",
                      border: "none",
                    }}
                  >
                    Yes
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-[70px] h-[70px] rounded-full border-[3px] border-[#FF5A36] mb-6">
                  <CirclePause
                    size={36}
                    strokeWidth={2.5}
                    className="text-[#FF5A36]"
                  />
                </div>

                <DialogHeader className="flex flex-col items-center">
                  <DialogTitle className="text-[22px] font-bold text-[#212121] mb-2">
                    Critical Glucose Alert
                  </DialogTitle>

                  <DialogDescription className="text-[16px] text-[#707784] leading-relaxed">
                    Latest glucose result is outside the acceptable range.
                  </DialogDescription>
                </DialogHeader>

                <div className="w-full mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="text-sm text-[#707784]">
                    Current Glucose
                  </div>

                  <div className="text-[30px] font-bold text-[#FF5A36]">
                    {glucoseValue}
                  </div>

                  <div className="mt-3 text-sm text-[#707784]">
                    Reference Range
                  </div>

                  <div className="font-semibold text-[#212121]">
                    {glucoseMin} – {glucoseMax}
                  </div>
                </div>

                <DialogFooter className="flex flex-row gap-4 w-full mt-8">
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1"
                    style={{
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: "#D9F3F6",
                      color: "#009BB1",
                      fontWeight: 700,
                      fontSize: "16px",
                      border: "none",
                    }}
                  >
                    Dismiss
                  </Button>

                  <Button
                    onClick={() => {
                      setCategory(
                        "Glucose Exceeded Critical Limits"
                      );
                      setNotes(
                        `Glucose value (${glucoseValue}) exceeded acceptable range (${glucoseMin}-${glucoseMax}).`
                      );
                      setInternalStep(2);
                    }}
                    className="flex-1"
                    style={{
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: "#FF5A36",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "16px",
                      border: "none",
                    }}
                  >
                    Proceed
                  </Button>
                </DialogFooter>
              </div>
            )}
          </>
        )}

        {/* ================= STEP 2: FORM REASON ================= */}
        {internalStep === 2 && (
          <div className="flex flex-col w-full">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-[22px] font-bold text-[#212121] text-center sm:text-left">
                Session Termination Reason
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#707784] leading-normal text-center sm:text-left pb-4 border-b border-slate-100">
                A reason is required for audit and study documentation purposes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Dropdown Category */}
              <div className="flex flex-col gap-2" ref={dropdownRef}>
                <Label className="text-sm font-semibold text-[#212121]">
                  Reason Category <span className="text-[#FF5A36]">*</span>
                </Label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-11 px-4 border border-[#E2E4E6] rounded-lg text-left bg-[#FAFAFA] text-slate-800 flex items-center justify-between focus:outline-none focus:border-[#FF5A36] cursor-pointer"
                    style={{ fontSize: "14px" }}
                  >
                    <span className={category ? "text-slate-800 font-medium" : "text-slate-400"}>
                      {category || "Choose a Reason Category"}
                    </span>
                    {isDropdownOpen ? (
                      <ChevronUp size={18} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-500" />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#E2E4E6] rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-[220px] overflow-y-auto">
                      {categories.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-3 text-sm text-slate-800 hover:bg-[#FAFAFA] cursor-pointer transition-colors"
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea Notes */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#212121]">
                  Detailed Notes <span className="text-[#FF5A36]">*</span>
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide detailed information about why the session was terminated."
                  rows={4}
                  className="w-full p-4 border border-[#E2E4E6] rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:border-[#FF5A36] resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-row gap-4 w-full mt-6 border-t border-slate-100 pt-6">
              <Button
                variant="ghost"
                onClick={() => {
                    setInternalStep(1);
                }}
                className="flex-1"
                style={{
                  height: "36px",
                  borderRadius: "4px",
                  backgroundColor: "#E0F2FE",
                  color: "#0070C0",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmitting}
                className="flex-1"
                style={{
                  height: "36px",
                  borderRadius: "4px",
                  backgroundColor: "#FF5A36",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                }}
              >
                Submit & Verify
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}