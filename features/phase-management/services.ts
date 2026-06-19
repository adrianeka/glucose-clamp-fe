import api from "@/lib/axios";
import { PhaseConfig } from "./types";

const formatTypeToFrontend = (type: string): string => {
  if (!type) return "Preparation";
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

export const phaseService = {
  async getPhases(): Promise<PhaseConfig[]> {
    const response = await api.get("/phase-configuration");
    const rawContent = response.data?.data?.content || [];

    const mappedData: PhaseConfig[] = rawContent.map((item: any) => ({
      id: item.phaseConfId,
      priority: Number(item.phaseConfPriority),
      code: item.phaseConfCode,
      name: item.phaseConfName,
      type: formatTypeToFrontend(item.phaseConfType),
    }));

    return mappedData.sort((a, b) => a.priority - b.priority);
  },

  async createPhase(data: Omit<PhaseConfig, "id">): Promise<void> {
    const payload = {
      phaseConfCode: data.code,
      phaseConfName: data.name,
      phaseConfType: data.type.toLowerCase(),
      phaseConfPriority: Number(data.priority),
    };
    await api.post("/phase-configuration", payload);
  },

  async updatePhase(id: string | number, data: Omit<PhaseConfig, "id">): Promise<void> {
    const payload = {
      phaseConfCode: data.code,
      phaseConfName: data.name,
      phaseConfType: data.type.toLowerCase(),
      phaseConfPriority: Number(data.priority),
    };
    await api.put(`/phase-configuration/${id}`, payload);
  },

  async deletePhase(id: string | number): Promise<void> {
    await api.delete(`/phase-configuration/${id}`);
  },

  async updatePriorities(payload: { priorities: { id: number | string; priority: number }[] }) {
    // Ganti Axios / Fetch sesuai helper HTTP library yang Anda pakai di project
    const response = await api.put("/phase-configuration/priority", payload);
    return response.data;
  }
};