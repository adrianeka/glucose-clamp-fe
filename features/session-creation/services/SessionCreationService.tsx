import axiosInstance from "@/lib/axios";
import { CreateSessionRequest } from "../types/Session";

export const getSessions = async (
  pageNumber = 0,
  pageSize = 10
) => {
  const response = await axiosInstance.get(
    `/session?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  return response.data.data;
};

export const getSessionDetail = async (
  sessionId: number
) => {
  const response =
    await axiosInstance.get(
      `/session/${sessionId}`
    );

  return response.data.data;
};

export const createSession = async (
  payload: CreateSessionRequest
) => {
  const response = await axiosInstance.post(
    "/session",
    payload
  );

  return response.data;
};

export const sessionStart = async (
  sessionId:number
) => {
  const response = await axiosInstance.post(
      `/session/${sessionId}/start`
    );

  return response.data;
};

