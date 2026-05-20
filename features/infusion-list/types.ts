export type PatientStatus = "Ready for Analysis" | "In Cycle" | "Completed";

export interface Patient {
  id: string;
  name: string;
  patientId: string;
  room: string;
  status: PatientStatus;
  brand: string;
  age: number;
  weight: number;
  medicalHistory: string;
}
