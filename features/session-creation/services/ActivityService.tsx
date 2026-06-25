import api from "@/lib/axios";

export interface CreateActivityRequest {
  sessionId: number;
  phaseCode: string;
  phaseName: string;
  startTime: string;
  activityType: string;
  activityDesc: string;
}

export const createActivity = async (
  payload: CreateActivityRequest
) => {
  const response = await api.post(
    "/activities",
    payload
  );

  return response.data;
};

export const deleteActivity = async (activityId: number) => {
  const response = await api.delete(`/activities/${activityId}`);
  return response.data;
};

export const updateActivity = async (
  activityId: number,
  payload: CreateActivityRequest
) => {
  const response = await api.put(`/activities/${activityId}`, payload);
  return response.data;
};