"use client";

import { useRouter } from "next/navigation";
import { CircleCheckBig } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { sessionEndService } from "../../services/SessionEndService";

interface ModalSessionCompletedProps {
  isOpen: boolean;
  sessionId: number;
}

export default function ModalSessionCompleted({
  isOpen,
  sessionId,
}: ModalSessionCompletedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: completeSession, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        endTime: new Date().toISOString(),
        endReasonCategory: "Completed per Protocol",
        endReasonDetail: "All activities have been successfully recorded and verified.",
      };
      return await sessionEndService.complete(sessionId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["session-detail", sessionId],
      });
    },
    onError: (error) => {
      console.error("Gagal menyelesaikan sesi secara permanen:", error);
      alert("Terjadi kesalahan saat menyimpan status akhir sesi.");
    },
  });

  const handleOk = () => {
    completeSession();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[92vw] max-w-[460px] p-6 sm:p-10 bg-white rounded-2xl border-none shadow-xl flex flex-col focus-visible:outline-none"
      >
        <DialogTitle className="text-2xl font-bold text-center sr-only">Activity Complete</DialogTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#29B52D",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <CircleCheckBig size={40} color="white" strokeWidth={3} />
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#2F3441",
              marginBottom: 12,
            }}
          >
            Session S-{sessionId} Completed
          </h2>

          <p
            style={{
              color: "#707784",
              fontSize: 18,
              lineHeight: 1.5,
              maxWidth: 330,
            }}
          >
            All activities have been recorded and the session is now closed.
          </p>

          <button
            onClick={handleOk}
            disabled={isPending}
            style={{
              width: "100%",
              height: 44,
              marginTop: 40,
              border: "none",
              borderRadius: 6,
              background: isPending ? "#A3E6A5" : "#28B82E",
              color: "#FFF",
              fontWeight: 700,
              fontSize: 18,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isPending) e.currentTarget.style.background = "#239F28";
            }}
            onMouseLeave={(e) => {
              if (!isPending) e.currentTarget.style.background = "#28B82E";
            }}
          >
            {isPending ? "Processing..." : "OK"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}