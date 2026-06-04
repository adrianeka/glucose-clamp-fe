import { create } from "zustand";
import { Protocol, Schedule, Activity, Session, RunState, InfusionEntry, RuntimePoint } from "../types";

interface ClampStore {
  protocols: Protocol[];
  schedules: Schedule[];
  activities: Activity[];
  sessions: Session[];
  run: RunState;
  infusionHistory: InfusionEntry[];
  runtimeLog: string[];

  // Protocol
  saveProtocol: (p: Protocol) => void;

  // Schedule
  addScheduleRows: (rows: Omit<Schedule, "id">[]) => void;
  updateScheduleRow: (id: string, field: keyof Schedule, value: boolean) => void;

  // Activities
  generateActivities: (protocolId: string) => string | null;
  clearActivities: (protocolId: string) => void;

  // Session
  createSession: (s: Session) => void;

  // Run
  prepareRun: (sessionId: string) => string | null;
  advanceStep: (manualData?: ManualStepData) => AdvanceResult;
  stopRun: () => void;
  resetRun: () => void;

  // Infusion
  addInfusion: (entry: InfusionEntry) => void;

  // Misc
  addRuntimeLog: (msg: string) => void;
  resetDemo: () => void;
  seedDefaultProtocol: () => void;
}

export interface ManualStepData {
  isInsulinInjection?: boolean;
  dose?: string;
  glucose?: number;
  unit?: string;
  pk?: number;
  cp?: number;
}

export interface AdvanceResult {
  warning: string;
  finished: boolean;
  chartPoint: RuntimePoint;
}

const INITIAL_RUN: RunState = {
  sessionId: null,
  queue: [],
  currentIndex: -1,
  glucose: 95.0,
  rate: 0.0,
  flowRate: 0.0,
  timerActive: false,
  fullLabels: [],
  fullGlucose: [],
  fullRate: [],
  fullPk: [],
  fullCp: [],
};

function getSessionStartMinutes(session: Session): number {
  const parts = (session.startTime || "07:00").split(":");
  return parseInt(parts[0] || "7", 10) * 60 + parseInt(parts[1] || "0", 10);
}

function minuteToClock(minute: number, startMins: number): string {
  const total = startMins + minute;
  const normalized = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getScheduleCode(s: Schedule, allSchedules: Schedule[]): string {
  const protocolSchedules = allSchedules.filter((item) => item.protocolId === s.protocolId);
  let gdCounter = 1;
  let code = "-";
  for (const item of protocolSchedules) {
    let itemCode = "-";
    if (item.bloodDraw) {
      if (item.phaseName.toLowerCase().includes("baseline")) {
        itemCode = `${item.labelPrefix}${item.minute}`;
      } else {
        itemCode = `${item.labelPrefix}${gdCounter}`;
        gdCounter++;
      }
    }
    if (item.id === s.id) {
      code = itemCode;
      break;
    }
  }
  return code;
}

function buildActivities(protocol: Protocol, schedules: Schedule[]): Activity[] {
  const filtered = schedules.filter((s) => s.protocolId === protocol.protocolId);
  const result: Activity[] = [];
  let gdCounter = 1;
  let pkcCounter = 1;

  for (const schedule of filtered) {
    if (schedule.bloodDraw) {
      if (schedule.phaseName.toLowerCase().includes("baseline")) {
        const sCode = `${schedule.labelPrefix}${schedule.minute}`;
        result.push({
          protocolId: protocol.protocolId,
          phaseName: schedule.phaseName,
          minute: schedule.minute,
          activityType: "BLOOD_DRAW",
          sampleCode: sCode,
          description: `Blood draw ${sCode} @ minute ${schedule.minute}`,
        });
      } else {
        const sCode = `${schedule.labelPrefix}${gdCounter}`;
        result.push({
          protocolId: protocol.protocolId,
          phaseName: schedule.phaseName,
          minute: schedule.minute,
          activityType: "BLOOD_DRAW",
          sampleCode: sCode,
          description: `Blood draw ${sCode} @ minute ${schedule.minute}`,
        });
        gdCounter++;
      }
    }
    if (schedule.insulinInject) {
      result.push({
        protocolId: protocol.protocolId,
        phaseName: schedule.phaseName,
        minute: schedule.minute,
        activityType: "INSULIN_INJECTION",
        sampleCode: "",
        description: `Inject insulin ${protocol.insulinDose} ${protocol.insulinUnit} @ minute ${schedule.minute}`,
      });
    }
    if (schedule.insulinCheck) {
      result.push({
        protocolId: protocol.protocolId,
        phaseName: schedule.phaseName,
        minute: schedule.minute,
        activityType: "INSULIN_CHECK",
        sampleCode: `PKC-${pkcCounter}`,
        description: `PK/C-Peptide check PKC-${pkcCounter} @ minute ${schedule.minute}`,
      });
      pkcCounter++;
    }
  }

  result.sort((a, b) => a.minute - b.minute || a.activityType.localeCompare(b.activityType));
  return result;
}

export const useClampStore = create<ClampStore>((set, get) => ({
  protocols: [],
  schedules: [],
  activities: [],
  sessions: [],
  run: INITIAL_RUN,
  infusionHistory: [],
  runtimeLog: [],

  saveProtocol: (p) =>
    set((s) => {
      const idx = s.protocols.findIndex((x) => x.protocolId === p.protocolId);
      const next = [...s.protocols];
      if (idx >= 0) next[idx] = p;
      else next.push(p);
      return { protocols: next };
    }),

  addScheduleRows: (rows) =>
    set((s) => {
      const next = [...s.schedules];
      for (const row of rows) {
        const exists = next.some(
          (x) => x.protocolId === row.protocolId && x.phaseName === row.phaseName && x.minute === row.minute
        );
        if (!exists) {
          next.push({ ...row, id: Math.random().toString(36).substring(2, 11) });
        }
      }
      next.sort((a, b) => a.minute - b.minute);
      return { schedules: next };
    }),

  updateScheduleRow: (id, field, value) =>
    set((s) => {
      const next = s.schedules.map((x) => (x.id === id ? { ...x, [field]: value } : x));
      return { schedules: next };
    }),

  generateActivities: (protocolId) => {
    const { protocols, schedules } = get();
    const protocol = protocols.find((p) => p.protocolId === protocolId);
    if (!protocol) return "Protokol tidak ditemukan.";
    const filteredSchedules = schedules.filter((s) => s.protocolId === protocolId);
    if (filteredSchedules.length === 0) return "Belum ada schedule untuk protokol ini.";

    const generated = buildActivities(protocol, filteredSchedules);
    set((s) => ({
      activities: [...s.activities.filter((a) => a.protocolId !== protocolId), ...generated],
    }));
    return null;
  },

  clearActivities: (protocolId) =>
    set((s) => ({ activities: s.activities.filter((a) => a.protocolId !== protocolId) })),

  createSession: (session) =>
    set((s) => {
      const idx = s.sessions.findIndex((x) => x.sessionId === session.sessionId);
      const next = [...s.sessions];
      if (idx >= 0) next[idx] = session;
      else next.push(session);
      return { sessions: next };
    }),

  prepareRun: (sessionId) => {
    const { sessions, activities } = get();
    const session = sessions.find((s) => s.sessionId === sessionId);
    if (!session) return "Session tidak ditemukan.";
    const queue = activities.filter((a) => a.protocolId === session.protocolId);
    if (queue.length === 0) return "Belum ada generated activities untuk protokol session ini.";

    const startMins = getSessionStartMinutes(session);
    const startLabel = session.startTime || "07:00";
    const initPoint: RuntimePoint = {
      label: `Start ${startLabel}`,
      glucose: 95.0,
      rate: 0.0,
      pk: null,
      cp: null,
    };

    set({
      run: {
        sessionId,
        queue: JSON.parse(JSON.stringify(queue)),
        currentIndex: -1,
        glucose: 95.0,
        rate: 0.0,
        flowRate: 0.0,
        timerActive: false,
        fullLabels: [initPoint.label],
        fullGlucose: [95.0],
        fullRate: [0.0],
        fullPk: [null],
        fullCp: [null],
      },
      infusionHistory: [],
    });
    get().addRuntimeLog(`Run prepared for session ${sessionId}.`);
    return null;
  },

  advanceStep: (manualData) => {
    const s = get();
    const { run, sessions, protocols } = s;

    if (run.currentIndex >= run.queue.length - 1) {
      return { warning: "Run selesai.", finished: true, chartPoint: { label: "", glucose: run.glucose, rate: run.rate, pk: null, cp: null } };
    }

    const newIndex = run.currentIndex + 1;
    const act = run.queue[newIndex];

    let glucose = run.glucose;
    let rate = run.rate;
    let flowRate = run.flowRate;
    let warning = "";
    let pkVal: number | null = null;
    let cpVal: number | null = null;

    const session = sessions[sessions.length - 1];
    const protocol = session ? protocols.find((p) => p.protocolId === session.protocolId) : null;
    const targetMin = protocol?.targetMin ?? 90;
    const targetMax = protocol?.targetMax ?? 100;

    if (manualData) {
      if (manualData.isInsulinInjection) {
        glucose = Math.max(80, glucose - 3.0);
      } else {
        if (manualData.glucose && manualData.glucose > 0) glucose = manualData.glucose;
        if (manualData.pk !== undefined) pkVal = manualData.pk;
        if (manualData.cp !== undefined) cpVal = manualData.cp;

        if (glucose <= targetMin && manualData.glucose) {
          rate = Math.min(3.5, rate + 0.2);
          warning = `Glucose menyentuh/di bawah batas target (${targetMin} mg/dL). Infusion rate dinaikkan.`;
        }
        if (glucose >= targetMax && manualData.glucose) {
          rate = Math.max(0.5, rate - 0.2);
          warning = `Glucose menyentuh/di atas batas target (${targetMax} mg/dL). Infusion rate diturunkan.`;
        }
      }
    } else {
      if (act.activityType === "INSULIN_INJECTION") {
        glucose = Math.max(80, glucose - 3.0);
      } else if (act.activityType === "BLOOD_DRAW") {
        const swing = (Math.random() - 0.5) * 4;
        glucose = Math.max(78, Math.min(104, glucose + swing));
        if (glucose <= targetMin) {
          rate = Math.min(3.5, rate + 0.2);
          warning = `Glucose menyentuh/di bawah batas target (${targetMin} mg/dL), infusion rate dinaikkan.`;
        } else if (glucose >= targetMax) {
          rate = Math.max(0.5, rate - 0.2);
          warning = `Glucose menyentuh/di atas batas target (${targetMax} mg/dL), infusion rate diturunkan.`;
        }
      } else if (act.activityType === "INSULIN_CHECK") {
        warning = "PK/C-Peptide check dilakukan pada step ini.";
        pkVal = 10.0 + Math.random() * 5.0;
        cpVal = 1.0 + Math.random() * 0.5;
      }
    }

    const startMins = session ? getSessionStartMinutes(session) : 7 * 60;
    const timeLabel = minuteToClock(act.minute, startMins);
    const label = `${newIndex + 1} · ${timeLabel}`;

    const newRun: RunState = {
      ...run,
      currentIndex: newIndex,
      glucose,
      rate,
      flowRate,
      fullLabels: [...run.fullLabels, label],
      fullGlucose: [...run.fullGlucose, parseFloat(glucose.toFixed(1))],
      fullRate: [...run.fullRate, parseFloat(rate.toFixed(1))],
      fullPk: [...run.fullPk, pkVal !== null ? parseFloat(pkVal.toFixed(1)) : null],
      fullCp: [...run.fullCp, cpVal !== null ? parseFloat(cpVal.toFixed(1)) : null],
    };

    const finished = newIndex >= run.queue.length - 1;
    set({ run: newRun });

    let logText = `Processed ${act.activityType} at ${timeLabel}.`;
    if (manualData) {
      if (manualData.isInsulinInjection) logText += ` [Insulin Injected: ${manualData.dose}]`;
      else {
        if (manualData.glucose) logText += ` [Glucose: ${manualData.glucose} ${manualData.unit}]`;
        if (manualData.pk !== undefined) logText += ` [PK: ${manualData.pk}, CP: ${manualData.cp}]`;
      }
    } else {
      logText += ` Glucose ${glucose.toFixed(1)} | Rate ${rate.toFixed(1)}`;
      if (pkVal) logText += ` | PK ${pkVal.toFixed(1)} | CP ${cpVal?.toFixed(1)}`;
    }
    get().addRuntimeLog(logText);

    return {
      warning,
      finished,
      chartPoint: { label, glucose, rate, pk: pkVal, cp: cpVal },
    };
  },

  stopRun: () => set((s) => ({ run: { ...s.run, timerActive: false } })),
  resetRun: () => set({ run: INITIAL_RUN }),

  addInfusion: (entry) =>
    set((s) => ({
      infusionHistory: [entry, ...s.infusionHistory],
      run: {
        ...s.run,
        glucose: entry.glucose ?? s.run.glucose,
        rate: entry.rateGir ?? s.run.rate,
        flowRate: entry.flowRate ?? s.run.flowRate,
        fullLabels: [...s.run.fullLabels, "Override"],
        fullGlucose: [...s.run.fullGlucose, entry.glucose ?? s.run.glucose],
        fullRate: [...s.run.fullRate, entry.rateGir ?? s.run.rate],
        fullPk: [...s.run.fullPk, null],
        fullCp: [...s.run.fullCp, null],
      },
    })),

  addRuntimeLog: (msg) =>
    set((s) => ({
      runtimeLog: [`${new Date().toLocaleTimeString("id-ID")} - ${msg}`, ...s.runtimeLog].slice(0, 30),
    })),

  resetDemo: () =>
    set({
      protocols: [],
      schedules: [],
      activities: [],
      sessions: [],
      run: INITIAL_RUN,
      infusionHistory: [],
      runtimeLog: [],
    }),

  seedDefaultProtocol: () => {
    const protocol: Protocol = {
      protocolId: "PR-24H",
      protocolCode: "EGC001",
      protocolName: "Euglycemic Clamp",
      version: "1.0",
      durationHours: 24,
      insulinDose: 0.5,
      insulinUnit: "U/kgBW SC",
      targetMin: 90,
      targetMax: 100,
      targetUnit: "mg/dL",
    };

    const seedPhases = [
      { phaseName: "Baseline", startMinute: -30, endMinute: -10, intervalMinutes: 10, labelPrefix: "T", bloodDraw: true, insulinInject: false, insulinCheck: false },
      { phaseName: "Baseline", startMinute: 0, endMinute: 0, intervalMinutes: 10, labelPrefix: "T", bloodDraw: true, insulinInject: true, insulinCheck: false },
      { phaseName: "Phase 1", startMinute: 10, endMinute: 480, intervalMinutes: 10, labelPrefix: "GD", bloodDraw: true, insulinInject: false, insulinCheck: false },
      { phaseName: "Phase 2", startMinute: 500, endMinute: 840, intervalMinutes: 20, labelPrefix: "GD", bloodDraw: true, insulinInject: false, insulinCheck: false },
      { phaseName: "Phase 3", startMinute: 870, endMinute: 1440, intervalMinutes: 30, labelPrefix: "GD", bloodDraw: true, insulinInject: false, insulinCheck: false },
    ];

    const schedules: Schedule[] = [];
    for (const phase of seedPhases) {
      let counter = 1;
      for (let minute = phase.startMinute; minute <= phase.endMinute; minute += phase.intervalMinutes) {
        schedules.push({
          id: Math.random().toString(36).substring(2, 11),
          protocolId: "PR-24H",
          phaseName: phase.phaseName,
          minute,
          bloodDraw: phase.bloodDraw,
          insulinInject: phase.insulinInject && minute === phase.startMinute,
          insulinCheck: false,
          labelPrefix: phase.labelPrefix,
        });
        counter++;
      }
    }

    set({ protocols: [protocol], schedules, activities: [] });

    const generated = buildActivities(protocol, schedules);
    set((s) => ({
      activities: [...s.activities.filter((a) => a.protocolId !== "PR-24H"), ...generated],
    }));
    get().addRuntimeLog("Default protocol loaded.");
  },
}));

export { getScheduleCode, minuteToClock, getSessionStartMinutes };
