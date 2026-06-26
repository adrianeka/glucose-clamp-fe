export interface VitalSignRequest {
  sessionId: number;
  measuredAt: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  respiratoryRate: number;
  temperatureC: number;
  spo2: number;
  assignedBy: number;
}

export interface AnamnesisRequest {
  sessionId: number;
  date: string;
  chiefComplaint: string;
  medicalHistory: string;
  assignedBy: number;
}

export interface AnthropometryRequest {
  sessionId: number;
  measuredAt: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  waistCircumferenceCm: number;
  assignedBy: number;
}