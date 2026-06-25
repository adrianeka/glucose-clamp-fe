import api from "@/lib/axios";
import { AddSamplingScheduleRequest, SamplingShcedule, BulkUpdateSamplingScheduleRequest } from "../types/SamplingSchedule";

export const addSamplingSchedule =
  async (
    data: AddSamplingScheduleRequest
  ) => {
    const response = await api.post(
      "/protocol-management/sampling-schedules",
      data
    );

    return response.data;
  };


export const getSamplingSchedules = async (
  protocolId: number
) : Promise<SamplingShcedule[]> => {
  const response = await api.get(
    `/protocol-management/sampling-schedules/protocol/${protocolId}`,
    {
      params: {
        protocolId,
      },
    }
  );

  return response.data.data;
};

interface DeleteSamplingScheduleParams {
  protocolId: number;
  phaseCode: string;
}

export const deleteSamplingSchedule = async ({
  protocolId,
  phaseCode
}: DeleteSamplingScheduleParams) => {
  const response = await api.delete(`/protocol-management/sampling-schedules/${protocolId}/${phaseCode}`,
    {
      params: {
        protocolId,
        phaseCode
      },
    }
  );
  return response.data;
}

export const bulkUpdateSamplingSchedules = async (
  data: BulkUpdateSamplingScheduleRequest
) => {
  const response = await api.put(
    "/protocol-management/sampling-schedules/bulk",
    data
  );

  return response.data;
};