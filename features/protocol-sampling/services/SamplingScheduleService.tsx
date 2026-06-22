import api from "@/lib/axios";
import { AddSamplingScheduleRequest, SamplingShcedule } from "../types/SamplingSchedule";

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

export const deleteSamplingSchedule = async (
  samplingScheduleId : number
) => {
  const response = await api.delete(`/protocol-management/sampling-schedules/${samplingScheduleId}`,
    {
      params: {
        samplingScheduleId,
      },
    }
  );
  return response.data;
}