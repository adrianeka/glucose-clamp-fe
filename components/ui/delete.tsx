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
      <DialogContent
        style={{ width: "480px", maxWidth: "480px" }}
        className="p-0 gap-0 rounded-xl overflow-hidden border-0 shadow-xl [&>button]:hidden"
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        <div className="flex flex-col items-center gap-4 px-8 pt-10 pb-8 text-center">
          <Trash2 size={48} strokeWidth={1.5} className="text-[#E84E2C]" />
          <h2 className="text-[#2D2F35] text-xl font-bold leading-6">
            {title}
          </h2>
          <p className="text-[#43474F] text-base leading-6">
            <span className="font-semibold">{itemName}</span> {description}
          </p>
        </div>

        <div className="flex gap-4 px-8 py-6 border-t border-[#E2E4E6]">
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