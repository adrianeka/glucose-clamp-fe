import api from "@/lib/axios";
import { GlobalConfiguration, GlobalConfigurationRequest } from "./types";

export const globalConfigurationService = {
  // Mendapatkan semua konfigurasi global
  async getConfigurations(page: number = 1, size: number = 100): Promise<GlobalConfiguration[]> {
    const response = await api.get("/global-configuration", {
      params: { pageNumber: page, pageSize: size }
    });

    const pageData = response.data?.data || {};
    const rawContent = pageData.content || [];

    return rawContent.map((item: any) => {
      // Ambil ID secara aman dari berbagai kemungkinan penamaan backend
      const rawId = item.gconfId || 
                    item.gconf_id || 
                    item.globalConfigurationId || 
                    item.global_configuration_id || 
                    item.id;

      const rawKey = item.gconfCode || 
                     item.gconf_code || 
                     item.configurationKey || 
                     item.configuration_key || 
                     item.key;

      const rawValue = item.gconfValue || 
                       item.gconf_value || 
                       item.value;

      const rawName = item.gconfTitle || 
                      item.gconf_title || 
                      item.name;

      const rawDesc = item.gconfDescription || 
                      item.gconf_description || 
                      item.description;

      return {
        // Jangan paksa String(undefined) jika nilainya memang tidak ada
        id: rawId !== undefined && rawId !== null ? String(rawId) : undefined,
        name: rawName || "Activity Confirmation Timer (seconds)",
        key: rawKey,
        value: rawValue !== undefined && rawValue !== null ? String(rawValue) : "60",
        description: rawDesc || "Configure the countdown duration before an activity can be confirmed.",
        status: item.status,
      };
    });
  },

  // Mendapatkan satu konfigurasi berdasarkan ID
  async getConfigurationById(id: string): Promise<GlobalConfiguration> {
    const response = await api.get(`/global-configuration/${id}`);
    const item = response.data?.data || {};

    const rawId = item.gconfId || item.gconf_id || item.globalConfigurationId || item.id;
    const rawKey = item.gconfCode || item.gconf_code || item.configurationKey || item.key;
    const rawValue = item.gconfValue || item.gconf_value || item.value;
    const rawName = item.gconfTitle || item.gconf_title || item.name;
    const rawDesc = item.gconfDescription || item.gconf_description || item.description;

    return {
      id: rawId !== undefined && rawId !== null ? String(rawId) : undefined,
      name: rawName || "Activity Confirmation Timer (seconds)",
      key: rawKey,
      value: rawValue !== undefined && rawValue !== null ? String(rawValue) : "",
      description: rawDesc || "",
      status: item.status,
    };
  },

  // Update konfigurasi berdasarkan ID
  async updateConfiguration(id: string, data: GlobalConfigurationRequest): Promise<void> {
    await api.put(`/global-configuration/${id}`, data);
  }
};