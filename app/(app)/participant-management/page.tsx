"use client";

import { useState } from "react";

import { Navbar } from "@/features/participant-management/components/navbar";
import { Sidebar } from "@/features/participant-management/components/sidebar";
import { ParticipantTable } from "@/features/participant-management/components/participant-table";
import { Footer } from "@/features/participant-management/components/footer";
import { AddParticipantModal } from "@/features/participant-management/components/add-participant-modal";

export default function ParticipantManagementPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 bg-[#F5F5F5] overflow-auto">
          <ParticipantTable
            refreshKey={refreshKey}
            onAddParticipant={() => setOpenAddModal(true)}
          />
        </main>
      </div>

      <AddParticipantModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          setOpenAddModal(false);
          setRefreshKey(prev => prev + 1);
        }}
      />

      <Footer />
    </div>
  );
}