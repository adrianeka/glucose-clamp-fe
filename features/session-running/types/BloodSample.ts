
export interface LabResultDetails {
  parameterName: string;
  value: number; // Dipetakan dari BigDecimal di BE
  unit: string;
}

export interface BloodSampleRequest {
  activityId: number; // Di BE berupa Long
  collectedBy: number; // Di BE berupa Integer
  sampleTime: string; // Format ISO string (e.g., 2026-05-21T07:10:00)
  sampleType: string; // "Glucose" atau "Insulin"
  tubeType: string;
  volumeMl: number; // Di BE berupa Integer
  labResults: LabResultDetails[];
}

// Untuk update data jika diperlukan nanti
export interface BloodSampleUpdateRequest extends BloodSampleRequest {}

export interface BloodSampleStatusUpdateRequest {
  status: string; // Sesuaikan dengan status enum di BE jika ada
}