import { Navbar } from "@/features/participant-management/components/navbar";
import { Sidebar } from "@/features/participant-management/components/sidebar";
import { ParticipantTable } from "@/features/participant-management/components/participant-table";
import { Footer } from "@/features/participant-management/components/footer";

export default function ParticipantManagementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 bg-[#F5F5F5] overflow-auto">
          <div className="flex h-full gap-4">
            <ParticipantTable />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
