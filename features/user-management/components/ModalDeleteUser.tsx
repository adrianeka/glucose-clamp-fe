"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
}

export default function ModalDeleteUser({
  open,
  onOpenChange,
  onConfirm,
  userName,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="!max-w-[500px] w-full p-0 overflow-hidden gap-0">
        <AlertDialogTitle className="sr-only">
          Delete User Confirmation
        </AlertDialogTitle>
        <div className="flex flex-col items-center px-8 py-8">
          <Trash2
            size={48}
            strokeWidth={1.8}
            className="text-[#FF5A31] mb-4"
          />

          <h2 className="text-2xl font-bold text-center">
            Delete User?
          </h2>

          <p className="text-center text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">
              {userName}
            </span>{" "}
            will be permanently removed
            <br />
            from the user list.
          </p>
        </div>

        <div className="border-t px-6 py-4 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-[#DFF4F5] text-[#0076D2] hover:bg-[#D0EFF0]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="flex-1 bg-[#FF5630] hover:bg-[#F24C21] text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}