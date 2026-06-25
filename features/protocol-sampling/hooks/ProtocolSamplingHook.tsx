import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProtocols,
  getProtocolById,
  addProtocol,
  editProtocol,
  deleteProtocol,
  updateProtocolStatus,
  getProtocolsDropdown
} from "../services/ProtocolSamplingService";

export const useProtocols = ({
  search,
  pageNumber,
  pageSize,
}: {
  search: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: [
      "protocols",
      search,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      getProtocols({
        search,
        pageNumber,
        pageSize,
      }),
  });
};

export const useProtocolsDropdown = () => {
  return useQuery({
    queryKey: ["protocols-dropdown"],
    queryFn: getProtocolsDropdown,
    // Opsional: tambahkan staleTime jika data dropdown jarang berubah
    staleTime: 5 * 60 * 1000, 
  });
};
export const useProtocolDetail = (
  protocolId: number
) => {
  return useQuery({
    queryKey: [
      "protocol-detail",
      protocolId,
    ],
    queryFn: () =>
      getProtocolById(protocolId),
    enabled: !!protocolId,
  });
};

export const useAddProtocol = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: addProtocol,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["protocols"],
      });
    },
  });
};

export const useEditProtocol = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: editProtocol,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["protocols"],
      });
    },
  });
};

export const useDeleteProtocol =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: deleteProtocol,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["protocols"],
        });
      },
    });
  };

  export const useUpdateProtocolStatus =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        protocolId,
        status,
      }: {
        protocolId: number;
        status: string;
      }) =>
        updateProtocolStatus(
          protocolId,
          status
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["protocols"],
        });
      },
    });
  };