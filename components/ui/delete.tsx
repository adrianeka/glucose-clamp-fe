"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  itemName: string;
  description?: string;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete Item?",
  itemName,
  description = "will be permanently removed from the list.",
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* 
        MENGUBAH STYLE FIXED WIDTH MENJADI KELAS TAILWIND YANG RESPONSIF:
        - w-[92vw] untuk layar HP (92% lebar viewport)
        - sm:w-[480px] max-w-[480px] untuk layar tablet/PC ke atas
      */}
      <DialogContent
        className="w-[92vw] sm:w-[480px] max-w-[480px] p-0 gap-0 rounded-xl overflow-hidden border-0 shadow-xl [&>button]:hidden focus-visible:outline-none"
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col items-center gap-4 px-6 sm:px-8 pt-10 pb-8 text-center bg-white">
          <Trash2 size={48} strokeWidth={1.5} className="text-[#E84E2C]" />
          <h2 className="text-[#2D2F35] text-xl font-bold leading-6">
            {title}
          </h2>
          <p className="text-[#43474F] text-base leading-6">
            <span className="font-semibold">{itemName}</span> {description}
          </p>
        </div>

        <div className="flex gap-4 px-6 sm:px-8 py-6 border-t border-[#E2E4E6] bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 h-auto !rounded-xl border-0 bg-[#DBF2F3] text-[#0076D2] text-base font-medium hover:bg-[#c5e9eb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "flex-1 px-6 py-3 h-auto !rounded-xl border-0 text-base font-medium text-[#FAFAFA]",
              "bg-[#E84E2C] hover:bg-[#d6431f]"
            )}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}