// features/session-running/hooks/usePreparationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VitalSignRequest, AnamnesisRequest, AnthropometryRequest, PreparationCheckRequest } from "../types/Preparation";
import { activityService } from "../services/ActivityService";
import { preparationService } from "../services/PreparationService";

interface SubmitPreparationPayload {
  activityId: number;
  vitalSign: VitalSignRequest;
  anamnesis: AnamnesisRequest;
  anthropometry: AnthropometryRequest;
}

export const useSubmitPreparationData = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PreparationCheckRequest) => {
      await Promise.all([
        preparationService.submitPreparation(
             payload
         ),
      ]);

      await activityService.completeActivity(payload.activityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-detail", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["activities", sessionId] });
    }
  });
};