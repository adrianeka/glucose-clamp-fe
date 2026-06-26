"use client";

import { CirclePause } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModalConfirmationEndSessionRunningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ModalConfirmationEndSessionRunning({
  open,
  onOpenChange,
  onConfirm,
}: ModalConfirmationEndSessionRunningProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[440px] rounded-[24px] p-10">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-[70px] h-[70px] rounded-full border-[3px] border-[#FF5A36] mb-6">
            <CirclePause
              size={36}
              strokeWidth={2.5}
              className="text-[#FF5A36]"
            />
          </div>

          <AlertDialogTitle className="text-[22px] font-bold text-[#212121] mb-2">
            End Clamp Session?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-[16px] text-[#707784] leading-relaxed">
            Are you sure you want to manually end the current clamp session?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row gap-4 mt-8 sm:justify-center">
          <AlertDialogCancel
            className="flex-1"
            style={{
                height: "30px",
                borderRadius: "4px",
                backgroundColor: "#D9F3F6",
                color: "#009BB1",
                border: "none",
                fontWeight: 700,
                fontSize: "16px",
                transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C2EBF0";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#D9F3F6";
            }}
        >
            Cancel
            </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1"
            style={{
                height: "30px",
                borderRadius: "4px",
                backgroundColor: "#FF5A36",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                fontSize: "16px",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E64A2E";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FF5A36";
            }}
            >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}