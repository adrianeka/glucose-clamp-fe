import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createActivity,
  CreateActivityRequest,
  deleteActivity,
  updateActivity
} from "../services/ActivityService";

export const useCreateActivity = (
  sessionId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateActivityRequest
    ) => createActivity(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "session-detail",
          sessionId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "activities",
          sessionId,
        ],
      });
    },
  });
};

// Tambahkan ke file hook Anda

export const useDeleteActivity = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: number) => deleteActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["session-detail", sessionId] });
    },
  });
};

export const useUpdateActivity = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateActivityRequest }) =>
      updateActivity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["session-detail", sessionId] });
    },
  });
};