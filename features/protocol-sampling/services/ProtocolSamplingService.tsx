import api from "@/lib/axios";

import {
  AddProtocolRequest,
  UpdateProtocolRequest,
  ProtocolDropdown
} from "../types/Protocol";

export const getProtocols = async ({
  search,
  pageNumber,
  pageSize,
  startDate,
  endDate,
}: {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get(
    "/protocol-management/protocols",
    {
      params: {
        search,
        startDate,
        endDate,
        pageNumber,
        pageSize,
      },
    }
  );

  return response.data;
};

export const getProtocolById = async (
  protocolId: number
) => {
  const response = await api.get(
    `/protocol-management/protocols/${protocolId}`
  );

  return response.data;
};

export const addProtocol = async (
  data: AddProtocolRequest
) => {
  const response = await api.post(
    "/protocol-management/protocols",
    data
  );

  return response.data;
};

export const editProtocol = async ({
  protocolId,
  data,
}: {
  protocolId: number;
  data: UpdateProtocolRequest;
}) => {
  const response = await api.put(
    `/protocol-management/protocols/${protocolId}`,
    data
  );

  return response.data;
};

export const deleteProtocol = async (
  protocolId: number
) => {
  const response = await api.delete(
    `/protocol-management/protocols/${protocolId}`
  );

  return response.data;
};

export const updateProtocolStatus =
  async (
    protocolId: number,
    status: string
  ) => {
    const response = await api.patch(
      `/protocol-management/protocols/${protocolId}/status`,
      {
        status,
      }
    );

    return response.data;
  };

  export const getProtocolsDropdown = async (): Promise<ProtocolDropdown[]> => {
    const response = await api.get(
      "/protocol-management/protocols/dropdown"
    );
    // Mengambil field 'data' sesuai struktur ApiDataResponseBuilder
    return response.data.data;
  };