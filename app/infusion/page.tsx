import { TopNavigation } from "@/components/ui/TopNavigation";
import { DashboardStats } from "@/features/infusion-list/components/DashboardStats";
import { PatientTable } from "@/features/infusion-list/components/PatientTable";

export default function InfusionListPage() {
  const currentUser = {
    role: "Pump Operator"
  };  
  return (
    <main className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      <div className="shrink-0 z-50 relative">
        <TopNavigation operatorRole={currentUser.role} />
      </div>
      
      <div className="flex-1 w-full max-w-[1728px] mx-auto flex flex-col overflow-y-auto">
        <DashboardStats />
        <PatientTable />
      </div>
    </main>
  );
}
