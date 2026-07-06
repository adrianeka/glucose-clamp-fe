import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleAccessService } from "./services";
import { RoleAccess } from "./types";

export const useRoleAccessList = () => {
  return useQuery({
    queryKey: ["role-access"],
    queryFn: roleAccessService.getAllRoleAccess,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useSaveRoleAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: any }) => {
      if (id) {
        return roleAccessService.updateRoleAccess(id, payload as Partial<RoleAccess>);
      } else {
        return roleAccessService.createRoleAccess(payload as Omit<RoleAccess, "roleAccessId">);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-access"] });
    },
  });
};