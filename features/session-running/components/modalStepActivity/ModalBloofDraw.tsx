"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GlucoseDialog({ isOpen, onOpenChange, onSubmit, activityData  }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSubmit: () => void; activityData?: any;  }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Input Activity Data</DialogTitle>
          <p className="text-sm text-muted-foreground">S-101 | BLOOD_DRAW 08:30</p>
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
            <h4 className="font-bold mb-4">Result Glucose</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-blue-600">Result PK *</Label>
                <Input className="bg-slate-50" placeholder="12.8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase">Unit PK *</Label>
                <Input className="bg-slate-50" placeholder="mg/L" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[#0070C0] bg-blue-50 border-none px-8">Cancel</Button>
          <Button onClick={onSubmit} className="bg-[#0070C0] hover:bg-blue-700 px-8">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}