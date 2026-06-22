"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ModalDeleteProtocolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocolName?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ModalDeleteProtocol({
  open,
  onOpenChange,
  protocolName,
  onConfirm,
  loading = false,
}: ModalDeleteProtocolProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[420px] p-0 gap-0">
        <DialogTitle/>
        <div className="flex flex-col items-center px-8 py-8">
          <div className="mb-4">
            <Trash2
              size={48}
              className="text-[#FF5A36]"
              strokeWidth={1.8}
            />
          </div>

          <h2 className="text-lg font-semibold text-[#1F2937]">
            Delete Protocol & Sampling?
          </h2>

          <p className="mt-3 text-center text-sm text-[#6B7280]">
            <span className="font-semibold text-[#374151]">
              {protocolName}
            </span>{" "}
            will be permanently removed from
            the protocol & sampling list.
          </p>
        </div>

        <div className="border-t px-6 py-4 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 bg-[#DDF3F3] text-[#1694A4] hover:bg-[#D1EEEE]"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-[#FF5A36] hover:bg-[#F04A24]"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}