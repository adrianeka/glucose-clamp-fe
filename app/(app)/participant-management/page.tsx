"use client";

import { useState } from "react";
import { ParticipantTable } from "@/features/participant-management/components/participant-table";
import { AddParticipantModal } from "@/features/participant-management/components/add-participant-modal";

export default function ParticipantManagementPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <ParticipantTable
        refreshKey={refreshKey}
        onAddParticipant={() => setOpenAddModal(true)}
      />

      <AddParticipantModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </>
  );
}