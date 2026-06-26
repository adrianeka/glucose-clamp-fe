import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/features/session-running/services/ActivityService";
import { bloodSampleService } from "@/features/session-running/services/BloodSampleService";
import { BloodSampleRequest } from "@/features/session-running/types/BloodSample";

// Hook untuk menyelesaikan tindakan medis (seperti Suntik Insulin)
export const useCompleteActivity = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: number) => activityService.completeActivity(activityId),
    onSuccess: () => {
      // Refresh daftar aktivitas dan detail sesi secara otomatis
      queryClient.invalidateQueries({
        queryKey: ["session-detail", sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["activities", sessionId],
      });
    },
  });
};

// Hook untuk mengirim data sampel darah hasil lab (seperti Glucose & Insulin Check)
export const useCreateBloodSample = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BloodSampleRequest) => bloodSampleService.add(payload),
    onSuccess: () => {
      // Refresh agar status INQUEUE berubah menjadi COMPLETED di tabel induk
      queryClient.invalidateQueries({
        queryKey: ["session-detail", sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["activities", sessionId],
      });
    },
  });
};