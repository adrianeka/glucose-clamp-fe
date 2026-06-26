import api from "@/lib/axios";
import { BloodSampleRequest, BloodSampleStatusUpdateRequest } from "../types/BloodSample";

export const bloodSampleService = {
  // Mendapatkan semua data blood samples
  getAll: async (pageNumber = 1, pageSize = 10) => {
    const response = await api.get("/blood-samples", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  // Mendapatkan data blood sample berdasarkan ID
  getById: async (id: number) => {
    const response = await api.get(`/blood-samples/${id}`);
    return response.data;
  },

  // Menambahkan data blood sample baru (POST /blood-samples)
  add: async (payload: BloodSampleRequest) => {
    const response = await api.post("/blood-samples", payload);
    return response.data;
  },

  // Memperbarui data blood sample (PUT /blood-samples/{id})
  update: async (id: number, payload: BloodSampleRequest) => {
    const response = await api.put(`/blood-samples/${id}`, payload);
    return response.data;
  },

  // Memperbarui status blood sample (PATCH /blood-samples/{id}/status)
  updateStatus: async (id: number, payload: BloodSampleStatusUpdateRequest) => {
    const response = await api.patch(`/blood-samples/${id}/status`, payload);
    return response.data;
  },

  // Menghapus data blood sample (DELETE /blood-samples/{id})
  delete: async (id: number) => {
    const response = await api.delete(`/blood-samples/${id}`);
    return response.data;
  },

  // Pencarian data blood sample
  search: async (keyword: string, pageNumber = 1, pageSize = 10) => {
    const response = await api.get("/blood-samples/search", {
      params: { keyword, pageNumber, pageSize },
    });
    return response.data;
  },
};