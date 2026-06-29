import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getSessions, getSessionDetail, createSession, sessionStart, nextProgressActivity } from "../services/SessionCreationService";

export const useSessions = (
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["sessions", pageNumber, pageSize],
    queryFn: () => getSessions(pageNumber, pageSize),
  });
};

export const useSessionDetail = (
  sessionId: number
) => {
  return useQuery({
    queryKey: ["session-detail", sessionId],
    queryFn: () =>
      getSessionDetail(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateSession = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });
};

export const useSessionStart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionStart(sessionId),

    onSuccess: (_, sessionId) => {
      // Refresh list session
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      // Refresh detail session yang baru dijalankan
      queryClient.invalidateQueries({
        queryKey: ["session-detail", sessionId],
      });
    },
  });
};

export const useNextProgressActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) =>
      nextProgressActivity(sessionId),

    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: ["session-tracking", sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["session-detail", sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });
};