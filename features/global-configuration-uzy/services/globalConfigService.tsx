import api from "@/lib/axios";
import { GlobalConfigResponse } from "../types/globalConfiguration";


export const getGlobalConfigurationById = async (id: number): Promise<GlobalConfigResponse> => {
  // Menggunakan URL yang sesuai dengan contoh API Anda
  const response = await api.get(`/global-configuration/${id}`);
  return response.data;
};