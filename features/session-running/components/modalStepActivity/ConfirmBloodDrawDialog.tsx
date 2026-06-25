import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ConfirmationWarning from "./ConfirmationWarning";
import { Button } from "@/components/ui/button";

export function ConfirmGlucoseDialog({ isOpen, onOpenChange, data, onConfirm }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirm Activity Data</DialogTitle>
          <p className="text-sm text-muted-foreground">S-101 | BLOOD_DRAW 08:30</p>
        </DialogHeader>

        <div className="py-4">
          <ConfirmationWarning />
          
          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Sample Code</p>
              <p className="text-sm font-semibold text-slate-700">PKC-1</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Tube Type</p>
                <p className="text-sm font-semibold text-slate-700">EDTA</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Volume</p>
                <p className="text-sm font-semibold text-slate-700">5.0</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold mb-4 uppercase text-slate-800">Result Glucose</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Result PK</p>
                <p className="text-sm font-semibold text-slate-700">12.8</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Unit PK</p>
                <p className="text-sm font-semibold text-slate-700">mg/L</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[#0070C0] bg-blue-50 border-none px-8">Cancel</Button>
          <Button onClick={onConfirm} className="bg-[#0070C0] hover:bg-blue-700 px-8">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}