import { AxiosError } from "axios";
import api from "@/lib/axios"; // sesuaikan path sesuai struktur project kamu
import { ApiErrorResponse, ApiResponse, LoginRequest, LoginResponseData } from "@/features/auth/types";

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
      axiosError.response?.data?.message ?? "Terjadi kesalahan, coba lagi";
    throw new Error(message);
  }
};