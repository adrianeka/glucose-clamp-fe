"use client";

import { useState } from "react";
import SessionCreationTable from "@/features/session-creation/components/sessionCreationTable";
import SessionCreationHeader from "@/features/session-creation/components/SessionCreationHeader";
import { TablePagination } from "@/components/ui/table-pagination";
import ModalAddSession from "@/features/session-creation/components/ModalAddSessionCreation";
import { useRouter } from "next/navigation";
import { useSessions } from "@/features/session-creation/hooks/SessionCreationHook";
import { Session } from "@/features/session-creation/types/Session";
import { useCreateSession } from "@/features/session-creation/hooks/SessionCreationHook";

export default function SessionCreationPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAddModal, setOpenAddModal] = useState(false);

  const router = useRouter();

  // Query untuk mengambil data
  const { data, isLoading } = useSessions(currentPage, pageSize);

  // Mutation untuk membuat session baru
  const { mutate: createSession, isPending: isCreating } = useCreateSession();

  const handleViewActivities = (session: Session) => {
    router.push(`/session-creation/${session.sessionId}/session-activities`);
  };

  const handleAddSessionSubmit = (formData: any) => {
    // Memanggil mutation dari hook
    createSession(formData, {
      onSuccess: () => {
        setOpenAddModal(false);
      },
      onError: (error) => {
        console.error("Failed to create session:", error);
      }
    });
  };

  return (
    <div className="rounded-3xl bg-white p-6 space-y-6">
      <SessionCreationHeader
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onAdd={() => setOpenAddModal(true)}
      />

      <SessionCreationTable
        data={data?.content ?? []}
        isLoading={isLoading}
        onViewActivities={handleViewActivities}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        totalElements={data?.totalElements ?? 0}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <ModalAddSession
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        onSubmit={handleAddSessionSubmit}
        isLoading={isCreating} // Kirim status loading ke modal
      />
    </div>
  );
}