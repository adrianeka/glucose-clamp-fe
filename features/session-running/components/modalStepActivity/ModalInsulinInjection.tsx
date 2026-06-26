"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InsulinDialog({ isOpen, onOpenChange, onSubmit, activityData}: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSubmit: (formData : any) => void; activityData:any }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          maxWidth: "36rem",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Input Activity Data</DialogTitle>
          <p className="text-sm text-muted-foreground">{activityData?.scheduleCode} | {activityData?.activityType}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase">Sample Code *</Label>
            <Input className="bg-slate-50" placeholder="PKC-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Tube Type *</Label>
              <Input className="bg-slate-50" placeholder="EDTA" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase">Volume *</Label>
              <Input className="bg-slate-50" placeholder="5.0" />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-bold mb-4">Result PK & C-Peptide</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-blue-600">Result PK *</Label>
                <Input className="bg-slate-50" placeholder="12.8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Unit PK *</Label>
                <Input className="bg-slate-50" placeholder="mg/L" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-blue-600">Result C-Peptide *</Label>
                <Input className="bg-slate-50" placeholder="1.9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Unit C-Peptide *</Label>
                <Input className="bg-slate-50" placeholder="ng/mL" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            style={{
              color: "#0070C0",
              backgroundColor: "#EFF6FF", // blue-50
              border: "none",
              paddingLeft: "2rem",
              paddingRight: "2rem",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            style={{
              backgroundColor: "#0070C0",
              paddingLeft: "2rem",
              paddingRight: "2rem",
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}