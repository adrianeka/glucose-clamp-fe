import { Navbar } from "@/features/participant-management/components/navbar";
import { Sidebar } from "@/features/participant-management/components/sidebar";
import { Footer } from "@/features/participant-management/components/footer";
import { PhaseManagementContent } from "@/features/phase-management/components/phase-management-content";

export default function PhaseManagementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 bg-[#F5F5F5] overflow-auto">
          <PhaseManagementContent />
        </main>
      </div>

      <Footer />
    </div>
  );
}
