import { useQuery } from "@tanstack/react-query";
import { phaseService } from "./services";

export const usePhaseConfigs = () => {
  return useQuery({
    queryKey: ["phase-configurations"],
    queryFn: phaseService.getPhases,
    staleTime: 5 * 60 * 1000,
  });
};