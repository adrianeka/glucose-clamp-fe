import api from "@/lib/axios";
import { ApiResponse, PageResponse, Participant } from "./types";

export const getAllParticipants = async (pageNumber: number, pageSize: number) => {
  const { data } = await api.get<ApiResponse<PageResponse<Participant>>>(
    "/participants",
    { params: { pageNumber, pageSize } }
  );
  return data;
};

export const searchParticipants = async (
  keyword: string,
  pageNumber: number,
  pageSize: number
) => {
  const { data } = await api.get<ApiResponse<PageResponse<Participant>>>(
    "/participants/search",
    { params: { keyword, pageNumber, pageSize } }
  );
  return data;
};

export interface CreateParticipantPayload {
  medicalRecordNo: string;
  name: string;
  gender: string;
  dob: string;
  numberPhone: string;
}

export const createParticipant = async (payload: CreateParticipantPayload) => {
  const { data } = await api.post<ApiResponse<Participant>>(
    "/participants",
    payload
  );
  return data;
};

export const deleteParticipant = async (participantId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/participants/${participantId}`
  );
  return data;
};

export interface UpdateParticipantPayload {
  medicalRecordNo: string;
  name: string;
  gender: string;
  dob: string;
  numberPhone: string;
}

export const updateParticipant = async (
  participantId: string,
  payload: UpdateParticipantPayload
) => {
  const { data } = await api.put<ApiResponse<Participant>>(
    `/participants/${participantId}`,
    payload
  );
  return data;
}