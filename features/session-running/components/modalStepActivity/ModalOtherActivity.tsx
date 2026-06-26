"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalOtherActivityProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityData?: any;
}

export default function ModalOtherActivity({
  isOpen,
  onOpenChange,
  activityData,
}: ModalOtherActivityProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {activityData?.activityName || "OTHER ACTIVITY"}
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
              {activityData?.activityDesc ||
                "Please perform the following activity before continuing to the next session."}
            </DialogDescription>
          </DialogHeader>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            style={{
              width: "100%",
              marginTop: "32px",
              backgroundColor: "#0070C0",
              color: "#FFFFFF",
              height: "40px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#005A9C")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0070C0")
            }
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}