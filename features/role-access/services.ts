import api from "@/lib/axios";
import { RoleAccess } from "./types";

export const roleAccessService = {
  async getAllRoleAccess(): Promise<RoleAccess[]> {
    const response = await api.get("/role-access");
    return response.data?.data || [];
  },

  async createRoleAccess(payload: Omit<RoleAccess, "roleAccessId">): Promise<RoleAccess> {
    const response = await api.post("/role-access", payload);
    return response.data?.data;
  },

  async updateRoleAccess(id: number, payload: Partial<RoleAccess>): Promise<RoleAccess> {
    const response = await api.put(`/role-access/${id}`, payload);
    return response.data?.data;
  },

  async deleteRoleAccess(id: number): Promise<void> {
    await api.delete(`/role-access/${id}`);
  }
};