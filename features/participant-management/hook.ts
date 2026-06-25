import { useQuery } from "@tanstack/react-query";
import { getAllParticipants } from "./services";

export const useParticipants = () => {
  return useQuery({
    queryKey: ["participants"],
    queryFn: () =>
      getAllParticipants(1, 100),
  });
};