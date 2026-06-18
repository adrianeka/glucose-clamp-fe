"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { PatientSidebar } from "@/features/measurement-detail/components/PatientSidebar";
import { MeasurementDashboard } from "@/features/measurement-detail/components/MeasurementDashboard";

export default function MeasurementDetailPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [operatorName, setOperatorName] = useState("");
  const [operatorRole, setOperatorRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logged = localStorage.getItem("is_logged_in") === "true";
    
    if (logged) {
      setIsLoggedIn(true);
      setOperatorName(localStorage.getItem("operator_name") || "Maghfira Whatley");
      setOperatorRole(localStorage.getItem("operator_role") || "Admin");
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("operator_role");
    localStorage.removeItem("operator_name");
    localStorage.removeItem("operator_email");
    
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (loading) {
    return <div className="p-8">Loading state...</div>;
  }

  return (
    <main className="h-screen w-full bg-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      <div className="shrink-0 z-50 relative">
        <TopNavigation 
          isLoggedIn={isLoggedIn}
          operatorName={operatorName}
          operatorRole={operatorRole}
          onLogout={handleLogout}
        />
      </div>
      
      <div className="flex w-full flex-1 overflow-hidden">
        <div className="shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <PatientSidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 py-7">
          <MeasurementDashboard operatorName={operatorName} />
        </div>
      </div>
    </main>
  );
}