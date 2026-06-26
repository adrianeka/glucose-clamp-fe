"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useCompleteActivity } from "../../hooks/useActivityMutation";
import { useToast } from "@/components/ui/toast";

interface ModalOtherActivityProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityData?: any;
  sessionId: number;
}

export default function ModalOtherActivity({
  isOpen,
  onOpenChange,
  activityData,
  sessionId,
}: ModalOtherActivityProps) {
  const {showToast} = useToast();

  const completeActivityMutation =
    useCompleteActivity(sessionId);

  const handleConfirm = async () => {

    if (!activityData?.activityId) return;

    try {
      await completeActivityMutation.mutateAsync(
        activityData.activityId
      );
      onOpenChange(false);
      showToast("Confirmed Activity Successfully");
    } catch (err) {
      console.error(err);
    }

  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        style={{
          maxWidth: "400px",
          width: "400px",
          padding: "32px",
        }}
      >

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >

          <DialogHeader>

            <DialogTitle
              style={{
                fontSize: "20px",
                fontWeight: 700,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >

              {activityData?.activityType
                ? `${activityData.activityType} ACTIVITY`
                : "OTHER ACTIVITY"}

            </DialogTitle>

            <DialogDescription
              style={{
                marginTop: "12px",
                fontSize: "14px",
                lineHeight: "22px",
                color: "#64748B",
                textAlign: "center",
              }}
            >

              {activityData?.activityDesc}

            </DialogDescription>

          </DialogHeader>

          <div
            style={{
              marginTop: "24px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#334155",
            }}
          >

            Apakah sudah melaksanakan kegiatan tersebut?

          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              completeActivityMutation.isPending
            }
            style={{
              width: "100%",
              marginTop: "24px",
              backgroundColor: "#0070C0",
              color: "#FFFFFF",
              height: "40px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
              opacity:
                completeActivityMutation.isPending
                  ? 0.7
                  : 1,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#005A9C")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#0070C0")
            }
          >

            {completeActivityMutation.isPending
              ? "Confirming..."
              : "Confirm"}

          </button>

        </div>

      </DialogContent>

    </Dialog>
  );
}