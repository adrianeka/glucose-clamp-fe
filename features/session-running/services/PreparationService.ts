// features/session-running/services/preparationService.ts
import api from "@/lib/axios";
import { AnamnesisRequest, AnthropometryRequest, VitalSignRequest } from "../types/Preparation";

export const preparationService = {
  saveVitalSign: async (payload: VitalSignRequest) => {
    const response = await api.post("/vital-signs", payload);
    return response.data;
  },
  saveAnamnesis: async (payload: AnamnesisRequest) => {
    const response = await api.post("/anamneses", payload);
    return response.data;
  },
  saveAnthropometry: async (payload: AnthropometryRequest) => {
    const response = await api.post("/anthropometries", payload);
    return response.data;
  }
};