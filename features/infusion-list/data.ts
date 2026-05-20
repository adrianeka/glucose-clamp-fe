import { Patient } from "./types";

export const mockPatients: Patient[] = [
  { 
    id: "1", 
    name: "Budi Santoso", 
    patientId: "SUBJ-2026-0144", 
    room: "ICU - 01", 
    status: "Ready for Analysis", 
    brand: "Brand A",
    age: 45,
    weight: 70.5,
    medicalHistory: "Type 2 Diabetes (controlled), No drug allergies."
  },
  { 
    id: "2", 
    name: "Siti Aminah", 
    patientId: "SUBJ-2026-0145", 
    room: "ICU - 02", 
    status: "In Cycle", 
    brand: "Brand B",
    age: 52,
    weight: 62.0,
    medicalHistory: "Hypertension, Type 1 Diabetes."
  },
  { 
    id: "3", 
    name: "John Doe", 
    patientId: "SUBJ-2026-0146", 
    room: "ICU - 03", 
    status: "Completed", 
    brand: "Brand B",
    age: 38,
    weight: 85.2,
    medicalHistory: "Asthma, Prediabetes."
  },
  { 
    id: "4", 
    name: "Charlie Watt", 
    patientId: "SUBJ-2026-0147", 
    room: "ICU - 04", 
    status: "Completed", 
    brand: "Brand A",
    age: 61,
    weight: 78.0,
    medicalHistory: "Type 2 Diabetes, High Cholesterol."
  },
];
