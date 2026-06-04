"use client";

import { useState, useRef, useCallback } from "react";
import { useClampStore, getSessionStartMinutes, minuteToClock } from "../store/useClampStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GdChart, PkChart, CPeptideChart } from "./charts";
import { ActivityModal, InfusionModal, CountdownModal, WarningModal } from "./Modals";

const STEP_STATUS: Record<number, string> = {};

export function RunSection() {
  const {
    sessions,
    protocols,
    run,
    infusionHistory,
    runtimeLog,
    prepareRun,
    advanceStep,
    stopRun,
    addInfusion,
    addRuntimeLog,
  } = useClampStore();

  const [summary, setSummary] = useState<string>(
    'Klik <strong>Prepare Run</strong> setelah session dibuat. Lalu gunakan <strong>Next Step</strong> untuk menjalankan activity satu per satu.'
  );
  const [warning, setWarning] = useState("");

  // Modal states
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [infusionModalOpen, setInfusionModalOpen] = useState(false);
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [autoRunning, setAutoRunning] = useState(false);

  const latestSession = sessions[sessions.length - 1];
  const latestProtocol = latestSession
    ? protocols.find((p) => p.protocolId === latestSession.protocolId)
    : null;

  const protocolDose = latestProtocol
    ? `${latestProtocol.insulinDose} ${latestProtocol.insulinUnit}`
    : "0.5 U/kgBW SC";

  const nextActivity = run.queue[run.currentIndex + 1] ?? null;
  const startMins = latestSession ? getSessionStartMinutes(latestSession) : 420;

  function handlePrepare() {
    if (!latestSession) { alert("Buat session clamp terlebih dahulu."); return; }
    const err = prepareRun(latestSession.sessionId);
    if (err) { alert(err); return; }
    setSummary(`<strong>Run siap.</strong><br>Session: ${latestSession.sessionId}<br>Protocol: ${latestSession.protocolId}<br>Total activities: <strong>${run.queue.length}</strong>`);
    setWarning("");
  }

  function handleManualNext() {
    if (!run.queue.length) { alert("Klik Prepare Run terlebih dahulu."); return; }
    if (run.currentIndex >= run.queue.length - 1) { alert("Run selesai."); return; }
    setActivityModalOpen(true);
  }

  function handleTimerNext() {
    if (!run.queue.length) { alert("Klik Prepare Run terlebih dahulu."); return; }
    if (run.currentIndex >= run.queue.length - 1) { alert("Run selesai."); return; }
    setCountdownOpen(true);
  }

  function handleSimulateStep() {
    if (!run.queue.length) { alert("Klik Prepare Run terlebih dahulu."); return; }
    if (run.currentIndex >= run.queue.length - 1) {
      setSummary(`<strong>Run selesai.</strong><br>Semua activities telah diproses.`);
      setWarning("");
      return;
    }
    doAdvance(undefined);
  }

  function doAdvance(manualData: Parameters<typeof advanceStep>[0]) {
    const result = advanceStep(manualData);
    const act = run.queue[run.currentIndex + 1] ?? run.queue[run.currentIndex];
    const timeLabel = act ? minuteToClock(act.minute, startMins) : "--:--";

    setSummary(
      `<strong>Current Step:</strong> ${Math.min(run.currentIndex + 2, run.queue.length)}/${run.queue.length}<br><strong>Time:</strong> ${timeLabel}<br><strong>Activity:</strong> ${act?.activityType}<br><strong>Description:</strong> ${act?.description}`
    );

    if (result.warning) {
      setWarning(result.warning);
      // If it's a glucose-out-of-range warning from manual, show modal
      if (manualData?.glucose) {
        setWarningMessage(result.warning);
        setWarningModalOpen(true);
        return;
      }
    } else {
      setWarning("");
    }

    if (result.finished) {
      setSummary((prev) => prev + `<br><span class="text-green-700 font-semibold">✓ Last step reached</span>`);
      stopSimulateAll();
    }
  }

  function handleSimulateAll() {
    if (autoRunning) return;
    setAutoRunning(true);
    autoTimerRef.current = setInterval(() => {
      const { run: r } = useClampStore.getState();
      if (r.currentIndex >= r.queue.length - 1) {
        stopSimulateAll();
        return;
      }
      useClampStore.getState().advanceStep();
    }, 1200);
    addRuntimeLog("Auto run started.");
  }

  function stopSimulateAll() {
    if (autoTimerRef.current) { clearInterval(autoTimerRef.current); autoTimerRef.current = null; }
    setAutoRunning(false);
  }

  function handleStop() {
    stopRun();
    stopSimulateAll();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">4) Run Session Step-by-Step + Runtime Chart</CardTitle>
        <p className="text-xs text-muted-foreground">
          Session berjalan berdasarkan activity yang sebelumnya digenerate dari protokol + sampling schedule.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
          {/* Left: charts + activity list */}
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handlePrepare}>Prepare Run</Button>
              <Button size="sm" onClick={handleManualNext}>Next Step (Input)</Button>
              <Button size="sm" variant="outline" onClick={handleTimerNext}>Next Step (Timer)</Button>
              <Button size="sm" variant="outline" onClick={handleSimulateStep}>Simulate Step</Button>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSimulateAll} disabled={autoRunning}>
                {autoRunning ? "Running…" : "Simulate All"}
              </Button>
              <Button size="sm" variant="destructive" onClick={handleStop}>Stop</Button>
            </div>

            {/* Charts */}
            <div className="space-y-3">
              <div className="rounded-lg border p-3 bg-white">
                <p className="text-xs text-muted-foreground font-medium mb-1">GD Chart (Glucose & Rate)</p>
                <GdChart
                  labels={run.fullLabels}
                  glucoseData={run.fullGlucose}
                  rateData={run.fullRate}
                  targetMin={latestProtocol?.targetMin}
                  targetMax={latestProtocol?.targetMax}
                />
              </div>
              <div className="rounded-lg border p-3 bg-white">
                <p className="text-xs text-muted-foreground font-medium mb-1">PK Chart (mg/L)</p>
                <PkChart labels={run.fullLabels} pkData={run.fullPk} />
              </div>
              <div className="rounded-lg border p-3 bg-white">
                <p className="text-xs text-muted-foreground font-medium mb-1">C-Peptide Chart (ng/mL)</p>
                <CPeptideChart labels={run.fullLabels} cpData={run.fullCp} />
              </div>
            </div>

            {/* Activity Queue */}
            <div className="rounded-lg border overflow-auto max-h-72 p-2">
              {run.queue.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6">Belum ada queue. Klik Prepare Run.</p>
              )}
              {run.queue.map((act, idx) => {
                const isDone = idx < run.currentIndex;
                const isActive = idx === run.currentIndex;
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-2.5 mb-2 text-sm ${
                      isActive ? "border-blue-400 bg-blue-50" : isDone ? "border-green-400 bg-green-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">
                      Step {idx + 1} · {minuteToClock(act.minute, startMins)} · {act.phaseName}
                    </div>
                    <div className="font-semibold">{act.activityType}</div>
                    <div className="text-xs text-muted-foreground">{act.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: KPIs + summary + infusion + log */}
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Current Step", value: Math.max(0, run.currentIndex + 1) },
                { label: "Glucose", value: run.glucose.toFixed(1) },
                { label: "Infusion Rate", value: run.rate.toFixed(1) },
                { label: "Flow Rate", value: run.flowRate.toFixed(1) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border bg-white p-3 shadow-sm">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-2xl font-extrabold mt-1">{value}</div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-3 py-2 text-xs text-blue-800"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
            {warning && (
              <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {warning}
              </div>
            )}

            {/* Infusion Monitoring */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Infusion Monitoring</CardTitle>
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white h-7 text-xs"
                  onClick={() => {
                    if (!run.sessionId) { alert("Tidak ada session yang sedang berjalan."); return; }
                    setInfusionModalOpen(true);
                  }}
                >
                  + Add Data
                </Button>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="rounded-lg border overflow-auto max-h-44">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Time</TableHead>
                        <TableHead className="text-xs">Glucose</TableHead>
                        <TableHead className="text-xs">GIR</TableHead>
                        <TableHead className="text-xs">Conf. Rate</TableHead>
                        <TableHead className="text-xs">Flow Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infusionHistory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                            Belum ada history
                          </TableCell>
                        </TableRow>
                      )}
                      {infusionHistory.map((entry, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{entry.actualTime}</TableCell>
                          <TableCell className="text-xs">{entry.glucose}</TableCell>
                          <TableCell className="text-xs">{entry.rateGir}</TableCell>
                          <TableCell className="text-xs">{entry.confirmRate || "-"}</TableCell>
                          <TableCell className="text-xs">{entry.flowRate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Runtime Log */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-base">Runtime Log</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <ul className="max-h-48 overflow-auto text-xs space-y-1 pl-4 list-disc">
                  {runtimeLog.length === 0 && (
                    <li className="text-muted-foreground">Belum ada log</li>
                  )}
                  {runtimeLog.map((msg, i) => (
                    <li key={i} className="text-muted-foreground">{msg}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>

      {/* Modals */}
      <ActivityModal
        open={activityModalOpen}
        activity={nextActivity}
        protocolDose={protocolDose}
        onClose={() => setActivityModalOpen(false)}
        onSave={(data) => {
          setActivityModalOpen(false);
          doAdvance(data);
        }}
      />

      <InfusionModal
        open={infusionModalOpen}
        initialGlucose={run.glucose}
        onClose={() => setInfusionModalOpen(false)}
        onSave={(entry) => {
          addInfusion(entry);
          addRuntimeLog(`[Infusion] Time: ${entry.actualTime}, Glucose: ${entry.glucose}, GIR: ${entry.rateGir}, Flow: ${entry.flowRate}`);
        }}
      />

      <CountdownModal
        open={countdownOpen}
        activityLabel={nextActivity ? `${nextActivity.activityType}${nextActivity.sampleCode ? ` - ${nextActivity.sampleCode}` : ""}` : "Aktivitas Berikutnya"}
        onConfirm={() => {
          setCountdownOpen(false);
          doAdvance(undefined);
        }}
      />

      <WarningModal
        open={warningModalOpen}
        message={warningMessage}
        onOpenInfusion={() => {
          setWarningModalOpen(false);
          setInfusionModalOpen(true);
        }}
      />
    </Card>
  );
}
