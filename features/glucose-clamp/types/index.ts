// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Protocol {
  protocolId: string;
  protocolCode: string;
  protocolName: string;
  version: string;
  durationHours: number;
  insulinDose: number;
  insulinUnit: string;
  targetMin: number;
  targetMax: number;
  targetUnit: string;
}

export interface Schedule {
  id: string;
  protocolId: string;
  phaseName: string;
  minute: number;
  bloodDraw: boolean;
  insulinInject: boolean;
  insulinCheck: boolean;
  labelPrefix: string;
}

export type ActivityType = "BLOOD_DRAW" | "INSULIN_INJECTION" | "INSULIN_CHECK";

export interface Activity {
  protocolId: string;
  phaseName: string;
  minute: number;
  activityType: ActivityType;
  sampleCode: string;
  description: string;
}

export interface VitalSign {
  systolic: string;
  diastolic: string;
  pulse: string;
  respiratoryRate: string;
  temperatureC: string;
  spo2: string;
}

export interface Anthropometry {
  weightKg: string;
  heightCm: string;
  bmi: string;
  waistCm: string;
}

export interface Anamneses {
  tanggal: string;
  keluhanUtama: string;
  riwayatPenyakit: string;
}

export interface Session {
  sessionId: string;
  participant: string;
  protocolId: string;
  visitDate: string;
  startTime: string;
  fastingHours: number;
  status: string;
  generatedActivities: number;
  vitalSign: VitalSign;
  anthropometry: Anthropometry;
  anamneses: Anamneses;
}

export interface InfusionEntry {
  actualTime: string;
  glucose: number;
  rateGir: number;
  confirmRate: string;
  flowRate: number;
}

export interface RuntimePoint {
  label: string;
  glucose: number;
  rate: number;
  pk: number | null;
  cp: number | null;
}

export interface RunState {
  sessionId: string | null;
  queue: Activity[];
  currentIndex: number;
  glucose: number;
  rate: number;
  flowRate: number;
  timerActive: boolean;
  fullLabels: string[];
  fullGlucose: (number | null)[];
  fullRate: (number | null)[];
  fullPk: (number | null)[];
  fullCp: (number | null)[];
}
