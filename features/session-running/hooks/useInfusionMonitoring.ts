import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { infusionService } from "../services/InfusionMonitoringService";

export const useInfusion = (
  sessionId: number
) => {
  const queryClient = useQueryClient();

  const useGetInfusionsBySession = (
    page = 1,
    size = 10
  ) => {
    return useQuery({
      queryKey: [
        "infusions",
        sessionId,
        page,
      ],

      queryFn: () =>
        infusionService.getBySessionId(
          sessionId,
          page,
          size
        ),

      enabled: !!sessionId,

      placeholderData:
        keepPreviousData,
    });
  };

  const useGetRecommendationGir = () => {
    return useQuery({
      queryKey: [
        "recommendation-gir",
        sessionId,
      ],

      queryFn: () =>
        infusionService.getRecommendationGir(
          sessionId
        ),

      enabled: !!sessionId,
    });
  };

  const useAddInfusion = () => {
    return useMutation({
      mutationFn: (
        newInfusion: any
      ) =>
        infusionService.addInfusion(
          newInfusion
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "infusions",
            sessionId,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "recommendation-gir",
            sessionId,
          ],
        });

        console.log(
          "Data infusion berhasil ditambahkan"
        );
      },

      onError: (error) => {
        console.error(
          "Gagal menambah data infusion:",
          error
        );
      },
    });
  };

  return {
    useGetInfusionsBySession,
    useGetRecommendationGir,
    useAddInfusion,
  };
};