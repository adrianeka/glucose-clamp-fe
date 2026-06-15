"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Activity, Check, Clock, AlertCircle, AlertTriangle } from "lucide-react";

type Log = {
  id: string;
  time: string;
  value: number;
  cycle: number;
  status: "In-Range" | "Out-Range";
  user: string;
};

interface MeasurementDashboardProps {
  operatorName?: string;
}

const DEBUG_SPEED_MULTIPLIER = 50;

export function MeasurementDashboard({
  operatorName = "Maghfira Whatley",
}: MeasurementDashboardProps) {
  const [cycle, setCycle] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [currentReading, setCurrentReading] = useState<number | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [systemTime, setSystemTime] = useState<string>("--:--:-- --");
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(150); 

  const isCompleted = cycle > 6;

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const clockInterval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountdownOpen) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000 / DEBUG_SPEED_MULTIPLIER);
    }
    return () => clearInterval(interval);
  }, [isCountdownOpen]);

  const handleConfirmSubmit = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    const isRange = val >= 90 && val <= 140; 
    
    const newLog: Log = {
      id: `REC-00${44 + logs.length}`, 
      time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: val,
      cycle: cycle,
      status: isRange ? "In-Range" : "Out-Range",
      user: operatorName,
    };

    setLogs((prev) => [newLog, ...prev]);
    setCurrentReading(val);
    setInputValue("");
    
    setCycle((prev) => prev + 1);
    setIsConfirmOpen(false);
    
    if (cycle < 6) {
      setTimeLeft(150); 
      setIsCountdownOpen(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isCurrentInRange = currentReading !== null ? (currentReading >= 90 && currentReading <= 140) : true;

  return (
    <div className="flex-1 flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h1 className="text-[34px] font-bold text-[#2D2F35] leading-tight">Glucose Measurement</h1>
          <p className="text-lg font-medium text-[#707784]">Input glucose reading from analyzer for current cycle</p>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex flex-col gap-2 rounded-[20px] border px-5 py-4 w-[286px] shadow-sm transition-colors duration-300 ${
            currentReading === null 
              ? "bg-[#FAFAFA] border-[#E2E4E6]" 
              : isCurrentInRange 
                ? "bg-[#EEF8F4] border-[#52BD94]" 
                : "bg-[#FFEEEA] border-[#E84E2C]"
          }`}>
            <div className="flex items-center gap-2">
              <Activity className={`h-5 w-5 ${currentReading === null ? 'text-[#707784]' : 'text-black'}`} />
              <span className="text-base font-medium text-[#2D2F35]">Current Glucose Level</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[28px] font-bold text-[#2D2F35] leading-none">
                {currentReading !== null ? currentReading : "-"}
              </span>
              <span className="text-lg text-[#707784] pb-1">mg/dL</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-base font-medium text-[#707784]">System Time</span>
            <span className="text-[42px] font-bold text-[#2D2F35] leading-none">{systemTime}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-[1.67px] border-[#0076D2]" />
            <span className="text-base font-medium text-[#43474F]">Cycle Progress</span>
          </div>
          <div className="flex h-3 w-full gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-colors duration-500 ${
                  i < cycle ? "bg-[#0076D2]" : "bg-[#E2E4E6]"
                }`} 
              />
            ))}
          </div>
          <div className="flex justify-between w-full">
            <span className="text-xs text-[#707784]">Cycle 1</span>
            <span className="text-xs text-[#707784]">Cycle 6</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-[#E2E8F0] bg-white p-10 shadow-sm mt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium text-[#43474F]">Glucose Value (mg/dL)</label>
              {!isCompleted && <div className="h-1.5 w-1.5 rounded-full bg-[#E84E2C]" />}
            </div>
            <Input 
              type="number" 
              placeholder="0" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isCompleted}
              className="h-14 rounded-xl border-[#E2E4E6] bg-[#FAFAFA] px-4 text-lg text-[#707784] disabled:opacity-50"
            />
            <span className="text-sm text-[#595F6A]">
              {isCompleted ? "All 6 cycles have been completed." : "Enter the exact value from the analyzer"}
            </span>
          </div>

          <Button 
            disabled={!inputValue || isCompleted}
            onClick={() => setIsConfirmOpen(true)}
            className="h-11 w-fit rounded-full bg-[#0076D2] hover:bg-[#005ea8] px-6 text-lg font-medium text-white shadow-none disabled:bg-[#A9ADB5]"
          >
            <Check className="mr-2 h-5 w-5" />
            {isCompleted ? "Measurement Complete" : "Submit Reading for Confirmation"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-lg border border-[#E2E8F0] bg-white p-10 shadow-sm">
        <div className="flex flex-col gap-1 text-center w-full">
          <h2 className="text-[22px] font-bold text-[#43474F] text-left">Glucose Measurement Logs</h2>
          <p className="text-base text-[#43474F] text-left">
            A chronological record of blood glucose readings analyzed during each cycle for monitoring and audit purposes
          </p>
        </div>
        
        {logs.length === 0 ? (
          <p className="text-base text-[#43474F] pt-4">No readings yet</p>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-4 py-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className="flex items-center gap-6">
                  <span className="text-base text-[#707784] w-24">{log.id}</span>
                  <span className="text-base font-medium text-[#43474F] w-28">{log.time}</span>
                  <span className="text-base font-medium text-[#2D2F35]">
                    Glucose reading confirmed : {log.value} mg/dL, Cycle {log.cycle}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-base text-[#45556C]">by {log.user}</span>
                  {log.status === "In-Range" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4BAC87] px-2.5 py-1 text-xs font-medium text-white">
                      <Check className="h-3 w-3" /> In-Range
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E84E2C] px-2.5 py-1 text-xs font-medium text-white">
                      <AlertCircle className="h-3 w-3" /> Out-Range
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent showCloseButton={false} className="max-w-[500px] p-9 rounded-[28px] gap-10 flex flex-col items-center border-none shadow-xl">
          <div className="h-[100px] w-[100px] rounded-2xl bg-[#F1F9FA] flex items-center justify-center">
            <div className="h-[70px] w-[70px] bg-[#0076D2] rounded-xl flex items-center justify-center">
              <Check className="text-white h-10 w-10" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 text-center items-center">
            <DialogTitle className="text-[28px] font-bold text-[#2D2F35] leading-tight">Confirm Glucose Input</DialogTitle>
            <DialogDescription className="text-lg text-[#707784] leading-relaxed max-w-[400px]">
              Submit <span className="text-[22px] font-bold text-[#43474F]">{inputValue} mg/dL</span> as the current reading?
              <br/>This value will be used for dosage calculation and logged for audit.
            </DialogDescription>
          </div>

          <div className="flex w-full gap-4 justify-between mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)}
              className="flex-1 h-12 rounded-full border-none bg-[#FAFAFA] text-lg font-medium text-[#0076D2] hover:bg-gray-100"
            >
              Edit
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              className="flex-1 h-12 rounded-full bg-[#0076D2] hover:bg-[#005ea8] text-lg font-medium text-white"
            >
              Yes, Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCountdownOpen} onOpenChange={setIsCountdownOpen}>
        <DialogContent className="max-w-[500px] p-9 rounded-[28px] gap-10 flex flex-col items-center border-none shadow-xl">
          <DialogTitle className="sr-only">Countdown Timer</DialogTitle>
          <DialogDescription className="sr-only">Waiting for next sample.</DialogDescription>

          {timeLeft > 60 && (
            <>
              <div className="h-[100px] w-[100px] rounded-2xl bg-[#F1F9FA] flex items-center justify-center">
                <Clock className="h-[52px] w-[52px] text-[#0076D2]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-2 text-center items-center w-full">
                <span className="text-[28px] font-bold text-[#2D2F35]">Next Sample Due</span>
                <span className="text-[54px] font-bold text-[#2D2F35] leading-tight">{formatTime(timeLeft)}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C9EBDE] bg-[#EEF8F4] px-3 py-1.5 text-base font-medium text-[#4BAC87]">
                <div className="h-3 w-3 rounded-full border-[1.5px] border-[#52BD94]" /> On Schedule
              </div>
              <p className="text-base font-medium text-[#2D2F35] text-center max-w-[400px]">
                Please prepare the analyzer for the next cycle. You will be notified when it's time to take the next blood sample.
              </p>
            </>
          )}

          {timeLeft <= 60 && timeLeft > 0 && (
            <>
              <div className="h-[100px] w-[100px] rounded-2xl bg-[#FDF9F6] flex items-center justify-center">
                <Clock className="h-[52px] w-[52px] text-[#FABA00]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-2 text-center items-center w-full">
                <span className="text-[28px] font-bold text-[#2D2F35]">Next Sample Due</span>
                <span className="text-[54px] font-bold text-[#FABA00] leading-tight">{formatTime(timeLeft)}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE7BA] bg-[#FFF7E9] px-3 py-1.5 text-base font-medium text-[#E8A01D]">
                <AlertTriangle className="h-4 w-4" /> Attention Required
              </div>
              <p className="text-base font-medium text-[#2D2F35] text-center max-w-[400px]">
                Please begin preparing the analyzer immediately. The next blood sample window opens in less than a minute.
              </p>
            </>
          )}

          {timeLeft <= 0 && (
            <>
              <div className="h-[100px] w-[100px] rounded-2xl bg-[#FFEEEA] flex items-center justify-center">
                <Clock className="h-[52px] w-[52px] text-[#F02102]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-2 text-center items-center w-full">
                <span className="text-[28px] font-bold text-[#2D2F35]">Next Sample Due</span>
                <span className="text-[54px] font-bold text-[#F02102] leading-tight">00:00</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFCBBF] bg-[#FFEEEA] px-3 py-1.5 text-base font-medium text-[#E84E2C]">
                <AlertCircle className="h-4 w-4" /> Overdue
              </div>
              <p className="text-base font-medium text-[#2D2F35] text-center max-w-[400px]">
                The waiting period is over. Please take the next blood sample now and record the results in the system.
              </p>
              <Button 
                onClick={() => setIsCountdownOpen(false)}
                className="h-11 w-full mt-2 rounded-full bg-[#0076D2] hover:bg-[#005ea8] text-lg font-medium text-white"
              >
                Take Sample Now
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}