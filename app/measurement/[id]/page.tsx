import { TopNavigation } from "@/features/measurement-list/components/TopNavigation";
import { PatientSidebar } from "@/features/measurement-detail/components/PatientSidebar";
import { MeasurementDashboard } from "@/features/measurement-detail/components/MeasurementDashboard";

export default function MeasurementDetailPage() {
  return (
    <main className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      <div className="shrink-0 z-50 relative">
        <TopNavigation />
      </div>
      
      <div className="flex w-full flex-1 overflow-hidden">
        <div className="shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <PatientSidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 py-7">
          <MeasurementDashboard />
        </div>
      </div>
    </main>
  );
}