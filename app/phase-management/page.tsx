"use client";

import { useState } from "react";

import { Navbar } from "@/features/participant-management/components/navbar";
import { Sidebar } from "@/features/participant-management/components/sidebar";
import { Footer } from "@/features/participant-management/components/footer";
import { PhaseTable } from "@/features/phase-management/components/phase-table";
import { AddPhaseModal } from "@/features/phase-management/components/add-phase-modal";

export default function PhaseManagementPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-8 bg-[#FAFBFC] overflow-auto">
          <PhaseTable
            refreshKey={refreshKey}
            onAddPhase={() => setOpenAddModal(true)}
          />
        </main>
      </div>

      <AddPhaseModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />

      <Footer />
    </div>
  );
}