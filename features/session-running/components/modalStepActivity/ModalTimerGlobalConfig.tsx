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
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isOpen) setTimeLeft(duration);
  }, [isOpen, duration]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-7xl font-bold text-slate-700 mb-6 tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase text-center">{activityName}</DialogTitle>
            <DialogDescription className="text-slate-500 pt-2 text-center">
              Time remaining until the next activity. You can confirm now or wait until the timer reaches zero.
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={onConfirm} 
            className="w-full mt-8 bg-[#0070C0] hover:bg-blue-700 h-12 text-lg font-bold"
          >
            OK ({timeLeft}s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}