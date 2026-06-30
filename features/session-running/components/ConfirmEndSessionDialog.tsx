"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationWarning from "./modalStepActivity/ConfirmationWarning"; // Reuse komponen warning yang Anda miliki
import { useCompleteSession } from "@/features/session-running/hooks/useActivityMutation"; // sesuaikan path hook Anda
import { useToast } from "@/components/ui/toast";

interface ConfirmEndSessionDialogProps {
  isOpen: boolean;
  sessionData: any;
  data: { category: string; notes: string } | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ConfirmEndSessionDialog({
  isOpen,
  sessionData,
  data,
  onCancel,
  onSuccess,
}: ConfirmEndSessionDialogProps) {
  const { showToast } = useToast();
  const sessionId = sessionData?.sessionId || 1;
  const completeSessionMutation = useCompleteSession(sessionId);

  if (!data || !sessionData) return null;

  const handleConfirm = () => {
    const payload = {
      endTime: new Date().toISOString().split('.')[0], // Mengikuti format LocalDateTime (yyyy-MM-ddTHH:mm:ss)
      endReasonCategory: data.category,
      endReasonDetail: data.notes,
    };

    completeSessionMutation.mutate(payload, {
      onSuccess: () => {
        showToast("Session berhasil diselesaikan secara resmi!");
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error(error);
        showToast("Gagal mengakhiri session.", "error");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        style={{
          maxWidth: "440px",
          padding: "2.5rem",
          backgroundColor: "#fff",
          borderRadius: "24px",
          border: "none",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        }}
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Verify Termination
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            Please verify the termination summary details before locking into the registry.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <ConfirmationWarning />

          {/* Details Summary Card */}
          <div className="space-y-4 p-5 bg-[#FAFAFA] border border-[#E2E4E6] rounded-xl text-sm text-slate-800">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Session ID</span>
              <span className="font-semibold text-slate-800">S-{sessionData.sessionId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Participant</span>
              <span className="font-semibold text-slate-800">{sessionData.participantName || "Adrian Saputra"}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Reason Category</span>
              <span className="font-semibold text-[#FF5A36]">{data.category}</span>
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-slate-500 font-medium">Detailed Notes</span>
              <span className="text-slate-700 italic bg-white p-3 rounded-md border border-slate-100 block max-h-[100px] overflow-y-auto leading-relaxed">
                "{data.notes}"
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={completeSessionMutation.isPending}
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
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={completeSessionMutation.isPending}
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
            {completeSessionMutation.isPending ? "Ending..." : "Confirm & End"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}