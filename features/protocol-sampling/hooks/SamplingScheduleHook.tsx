import {
  useMutation,
  useQueryClient,
  useQuery
} from "@tanstack/react-query";

import { addSamplingSchedule, getSamplingSchedules, deleteSamplingSchedule } from "../services/SamplingScheduleService";
import { SamplingShcedule } from "../types/SamplingSchedule";

export const useAddSamplingSchedule =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: addSamplingSchedule,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["protocols"],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "sampling-schedules",
          ],
        });
      },
    });
  };

export const useDeleteSamplingSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSamplingSchedule,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sampling-schedules"],
      });
    },
  });
};

export const useSamplingSchedules = (
  protocolId?: number,
  enabled = true
) => {
  return useQuery<SamplingShcedule[]>({
    queryKey: [
      "sampling-schedules",
      protocolId,
    ],
    queryFn: () =>
      getSamplingSchedules(protocolId!),
    enabled:
      enabled && !!protocolId,
  });
};