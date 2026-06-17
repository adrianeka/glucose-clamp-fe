import { AxiosError } from "axios";
import api from "@/lib/axios";
import {
  ApiErrorResponse,
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RoleOption,
} from "./types";

export const login = async (payload: LoginRequest) => {
  try {
    const { data } = await api.post<ApiResponse<LoginResponseData>>(
      "/user-management/users/sign-in",
      payload
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message =
      axiosError.response?.data?.message ?? "Username atau password salah";
    throw new Error(message);
  }
};

export const getRoleOptions = async () => {
  const { data } = await api.get<ApiResponse<RoleOption[]>>("/roles/options");
  return data;
};