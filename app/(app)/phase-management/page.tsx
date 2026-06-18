"use client";

import { useState } from "react";
import { PhaseTable } from "@/features/phase-management/components/phase-table";
import { AddPhaseModal } from "@/features/phase-management/components/add-phase-modal";

export default function PhaseManagementPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <PhaseTable
        refreshKey={refreshKey}
        onAddPhase={() => setOpenAddModal(true)}
      />

      <AddPhaseModal
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