import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";

interface ConfirmExecutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  executedGir: string;
  patientId: string;
  onConfirm: () => void;
}

export function ConfirmExecutionDialog({
  isOpen,
  onClose,
  executedGir,
  patientId,
  onConfirm,
}: ConfirmExecutionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="min-w-[750px] bg-white p-12 rounded-[32px] gap-8 flex flex-col items-center border-none shadow-xl">
        <div className="h-[100px] w-[100px] rounded-[24px] bg-[#F1F9FA] flex items-center justify-center">
          <Droplet className="text-[#0076D2] h-[52px] w-[52px]" strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col gap-4 text-center items-center">
          <DialogTitle className="text-[28px] font-bold text-[#595F6A] leading-tight">Confirm GIR Execution</DialogTitle>
          <DialogDescription className="text-lg text-[#707784] leading-relaxed max-w-[600px]">
            You are about to log an executed GIR of <span className="text-[22px] font-bold text-[#595F6A]">{executedGir}</span> mg/kg/min for patient <br/><span className="font-bold text-[#595F6A]">{patientId}</span>. Please ensure this value matches the current setting on the physical infusion pump before proceeding.
          </DialogDescription>
        </div>

        <div className="flex w-full gap-4 justify-between mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-[48px] rounded-full border-none bg-[#FAFAFA] text-base font-semibold text-[#0076D2] hover:bg-gray-100 shadow-none"
          >
            Edit Value
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 h-[48px] rounded-full bg-[#0076D2] hover:bg-[#005ea8] text-base font-semibold text-white shadow-none"
          >
            Yes, Confirm Execution
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
