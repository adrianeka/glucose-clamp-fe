import api from "@/lib/axios";

export const sessionEndService = {
  complete: async (
    sessionId: number,
    payload: { endTime: string; endReasonCategory: string; endReasonDetail: string }
  ) => {
    const { data } = await api.post(`/session/${sessionId}/complete`, payload);
    return data;
  },
};