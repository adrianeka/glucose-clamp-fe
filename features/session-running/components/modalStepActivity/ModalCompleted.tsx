"use client";

import { useRouter } from "next/navigation";
import { CircleCheckBig } from "lucide-react";
import { useNextProgressActivity } from "@/features/session-creation/hooks/SessionCreationHook";

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";

interface ModalSessionCompletedProps {
  isOpen: boolean;
  sessionId: number;
}

export default function ModalSessionCompleted({
  isOpen,
  sessionId,
}: ModalSessionCompletedProps) {
    const { mutate: nextProgress } = useNextProgressActivity();
  const router = useRouter();

  const handleOk = () => {
    nextProgress(sessionId, {
      onSuccess: () => {
      },
      onError: () => {
      },
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        style={{
          maxWidth: "460px",
          padding: "40px 32px 24px",
          borderRadius: "14px",
        }}
      >
        <DialogTitle className="text-2xl font-bold">Activity Complete</DialogTitle>
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
            style={{
              width: "100%",
              height: 44,
              marginTop: 40,
              border: "none",
              borderRadius: 6,
              background: "#28B82E",
              color: "#FFF",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#239F28";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#28B82E";
            }}
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}