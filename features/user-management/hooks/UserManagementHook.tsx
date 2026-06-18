"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers, getRole, addUser, editUser  } from "@/features/user-management/services/UserManagementService";
import { Pagination, AddUserRequest, EditUserRequest } from "@/features/user-management/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Params {
  keyword: string;
  pageNumber: number;
  pageSize: number;
}

export const useUsers = ({
  keyword,
  pageNumber,
  pageSize,
}: Params) => {
  return useQuery({
    queryKey: [
      "users",
      keyword,
      pageNumber,
      pageSize,
    ],

    queryFn: () =>
      getUsers({
        keyword,
        pageNumber,
        pageSize,
      }),

    placeholderData: keepPreviousData,
  });
};

export const useRoles = (
  params: Pagination = {
    pageNumber: 1,
    pageSize: 100,
  }
) => {
  return useQuery({
    queryKey: [
      "roles",
      params.pageNumber,
      params.pageSize,
    ],

    queryFn: () => getRole(params),

    staleTime: 1000 * 60 * 10, // 10 menit
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: AddUserRequest
    ) => addUser(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: { id: number; data: EditUserRequest }
    ) => editUser(payload.id, payload.data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};