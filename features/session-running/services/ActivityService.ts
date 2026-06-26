import api from "@/lib/axios";

export interface ActivityDetail {
  activityId: number;
  sessionId: number;
  actorId: number;
  phaseCode: string;
  phaseName: string;
  time: string; // ISO format: "2026-05-31T16:28:30"
  relativeMinute: number; // Menggunakan nama field sesuai respons BE
  activityType: "PREPARATION_CHECK" | "BLOOD_DRAW" | "INSULIN_CHECK" | "INSULIN_INJECTION" | "FINAL_OBSERVATION";
  activityDesc: string;
  activityStatus: string;
  status: string;
  scheduleCode: string;
}

export const activityService = {
  getById: async (activityId: number): Promise<ActivityDetail> => {
    const response = await api.get(`/activities/${activityId}`);
    // Karena BE membungkus data di dalam objek "data":
    return response.data.data; 
  },
  
  completeActivity: async (activityId: number) => {
    const response = await api.post(`/activities/${activityId}/complete`);
    return response.data; // Mengembalikan hasil konfirmasi dari backend
  }
};
