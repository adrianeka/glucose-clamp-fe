import { TopNavigation } from "@/components/ui/TopNavigation";
import { PatientSidebar } from "@/features/infusion-detail/components/PatientSidebar";
import { InfusionDashboard } from "@/features/infusion-detail/components/InfusionDashboard";
import { mockPatients } from "@/features/infusion-list/data";

export default async function InfusionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = {
    role: "Pump Operator",
    name: "Alex Choi"
  };  

  const patient = mockPatients.find(p => p.id === id) || mockPatients[0];

  return (
    <main className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      <div className="shrink-0 z-50 relative">
        <TopNavigation operatorRole={currentUser.role} operatorName={currentUser.name} />
      </div>
      
      <div className="flex w-full flex-1 overflow-hidden">
        <div className="shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <PatientSidebar patient={patient} />
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 py-7">
          <InfusionDashboard patientId={patient.patientId} />
        </div>
      </div>
    </main>
  );
}
