"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalDeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ModalDeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: ModalDeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-white p-3 border-2 border-[#FF5B5B]">
            <Trash2 size={48} strokeWidth={1.5} className="text-[#FF5B5B]" />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#2D3139] text-center">
            Delete Custom Activity?
          </DialogTitle>
          <DialogDescription className="text-center text-[#707784] mt-2">
            Selected activity will be permanently removed from the phase management list.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            className="flex-1 bg-[#E0F2F2] border-none text-[#0076D2] hover:bg-[#D0EEF0] h-11"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#FF5B5B] hover:bg-[#E54A4A] text-white h-11"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}