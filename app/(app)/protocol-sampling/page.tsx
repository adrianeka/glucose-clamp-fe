"use client";

import { useState } from "react";

import ProtocolSamplingHeader from "@/features/protocol-sampling/components/ProtocolSamplingHeader";
import ProtocolSamplingTable from "@/features/protocol-sampling/components/ProtocolSamplingTable";
import ModalAddProtocol from "@/features/protocol-sampling/components/ModalAddProtocol";
import ModalViewProtocol from "@/features/protocol-sampling/components/ModalViewProtocol";
import ModalEditProtocol from "@/features/protocol-sampling/components/ModalEditProtocol";
import ModalDeleteProtocol from "@/features/protocol-sampling/components/ModalDeleteProtocol";
import ModalSamplingSchedule from "@/features/protocol-sampling/components/ModalSamplingScheduleRegistry";
import { TablePagination } from "@/components/ui/table-pagination";

import {
  useProtocols,
  useAddProtocol,
  useDeleteProtocol,
  useEditProtocol
} from "@/features/protocol-sampling/hooks/ProtocolSamplingHook";
import { Protocol, UpdateProtocolRequest, AddProtocolRequest } from "@/features/protocol-sampling/types/Protocol";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "use-debounce";
export default function ProtocolSamplingPage() {
  const { showToast } =useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSamplingScheduleModalOpen, setIsSamplingScheduleModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const addProtocolMutation = useAddProtocol();
  const deleteProtocolMutation = useDeleteProtocol();

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { data, isLoading } =
    useProtocols({
      search: debouncedSearch,
      pageNumber: page,
      pageSize: size,
    });
  const handleAddProtocol = async (
    payload: AddProtocolRequest
  ) => {
    try {
      await addProtocolMutation.mutateAsync(
        payload
      );


      setIsAddModalOpen(false);
      showToast("Add Protocol Successfully")
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add protocol",
        "error"
      );

      console.error(
        "Failed to add protocol:",
        error
      );
    }
  };

  const handleSamplingSchedule = (
    protocol: Protocol
  ) => {
    setSelectedProtocol(protocol);
    setIsSamplingScheduleModalOpen(true);
  };

  const handleDeleteProtocol =
  async () => {
    if (!selectedProtocol) return;

    try {
      await deleteProtocolMutation.mutateAsync(
        selectedProtocol.protocol_id
      );

      setIsDeleteModalOpen(false);
      setSelectedProtocol(null);
      showToast("Delete Protocol Successfully")
    } catch (error:any) {
        showToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to add protocol",
          "error"
        );

        console.error(
          "Failed to add protocol:",
          error
        );
    }
  };

  const updateProtocolMutation =
  useEditProtocol();

const handleEditProtocol =
  async (protocolId : number, payload: UpdateProtocolRequest) => {
    try {
      await updateProtocolMutation.mutateAsync({
        protocolId: protocolId,
        data: payload,
      });

      setIsEditModalOpen(false);
      setSelectedProtocol(null);
      showToast("Update Protocol Successfully")
    } catch (error:any) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add protocol",
        "error"
      );

      console.error(
        "Failed to add protocol:",
        error
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 space-y-6">
        <ProtocolSamplingHeader
            search={search}
            setSearch={(value) => {
              setSearch(value);
              setPage(0);
            }}
            onAddProtocol={openAddModal}
          />

        <ProtocolSamplingTable
          data={data?.data?? []}
          isLoading={isLoading}
          onView={(protocol) => {
            setSelectedProtocol(protocol);
            setIsViewModalOpen(true);
          }}
          onEdit={(protocol) => {
            setSelectedProtocol(protocol);
            setIsEditModalOpen(true);
          }}
          onDelete={(protocol) => {
            setSelectedProtocol(protocol);
            setIsDeleteModalOpen(true);
          }}
          onSamplingSchedule={handleSamplingSchedule}
        />

        <TablePagination
          currentPage={(data?.data?.page ?? 0) + 1}
          totalPages={data?.data?.totalPages ?? 0}
          totalElements={
            data?.data?.totalElements ?? 0
          }
          pageSize={size}
          onPageChange={(page) =>
            setPage(page - 1)
          }
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
          disabled={isLoading}
        />
      </div>

      {isAddModalOpen && (
        <ModalAddProtocol
          onOpenChange={
            setIsAddModalOpen
          }
          onSubmit={
            handleAddProtocol
          }
          open={isAddModalOpen}
        />
      )}

      <ModalViewProtocol
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        data={selectedProtocol}
      />
      <ModalEditProtocol
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        data={selectedProtocol}
        onSubmit={handleEditProtocol}
      />
      <ModalDeleteProtocol
        open={isDeleteModalOpen}
        onOpenChange={
          setIsDeleteModalOpen
        }
        protocolName={
          selectedProtocol?.protocol_name
        }
        onConfirm={
          handleDeleteProtocol
        }
        loading={
          deleteProtocolMutation.isPending
        }
      />

      <ModalSamplingSchedule
        open = {isSamplingScheduleModalOpen}
        onOpenChange={setIsSamplingScheduleModalOpen}
        protocol={selectedProtocol}
      />
    </>
  );
}