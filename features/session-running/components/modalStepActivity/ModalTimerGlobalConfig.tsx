"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TimerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  duration: number;
  activityName: string;
  onConfirm: () => void;
}

export function TimerDialog({ isOpen, onOpenChange, duration, activityName, onConfirm }: TimerDialogProps) {
  // Jika kita ingin popup selalu sinkron dengan banner, 
  // gunakan 'duration' langsung dari props daripada membuat state internal baru.
  
  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds); // Cegah angka negatif
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]  max-w-[400px] sm:max-w-[400px] p-10">
        <div className="flex flex-col items-center text-center">
          <span className={`text-[54px] font-bold mb-6 tracking-tighter ${duration <= 10 ? 'text-red-500' : 'text-slate-700'}`}>
            {formatTime(duration)}
          </span>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase text-center">
              UPCOMING: {activityName}
            </DialogTitle>
            <DialogDescription className="text-slate-500 pt-2 text-center">
              The current activity is ending soon. The next activity will start in {duration} seconds.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={onConfirm}
            style={{
                width: '100%',
                marginTop: '32px',
                backgroundColor: '#0070C0',
                color: 'white',
                height: '30px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005a9c')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070C0')}
            >
                OK ({duration}s)
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}