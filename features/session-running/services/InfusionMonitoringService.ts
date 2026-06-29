import api from "@/lib/axios";

const API_URL = "/infusion-monitoring";

export const infusionService = {
  getBySessionId: async (
    sessionId: number,
    pageNumber = 1,
    pageSize = 10
  ) => {
    const { data } = await api.get(
      `${API_URL}/session/${sessionId}`,
      {
        params: {
          pageNumber,
          pageSize,
        },
      }
    );

    return data;
  },

  getRecommendationGir: async (
    sessionId: number
  ) => {
    const { data } = await api.get(
      `${API_URL}/recommendation`,
      {
        params: {
          sessionId,
        },
      }
    );

    return data;
  },

  addInfusion: async (payload: any) => {
    const { data } = await api.post(
      API_URL,
      payload
    );

    return data;
  },
};