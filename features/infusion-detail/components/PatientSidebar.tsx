import { Button } from "@/components/ui/button";
import { ArrowLeft, UserSquare2 } from "lucide-react";
import Link from "next/link";
import { Patient } from "../../infusion-list/types";

interface PatientSidebarProps {
  patient: Patient;
}

export function PatientSidebar({ patient }: PatientSidebarProps) {
  return (
    <div className="flex w-[483px] flex-col gap-8 bg-white px-10 py-8 border-r border-gray-100 min-h-[calc(100vh-93px)]">
      <Button variant="ghost" asChild className="w-fit text-[#707784] hover:bg-gray-100">
        <Link href="/infusion">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Link>
      </Button>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <UserSquare2 className="h-5 w-5 text-[#0076D2]" />
          <h3 className="text-base font-bold text-[#707784]">PATIENT PROFILE</h3>
          <div className="flex-1 h-px bg-[#A9ADB5]" />
        </div>

        <div className="flex flex-col gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)]">
          <div>
            <h2 className="text-lg font-bold text-[#0076D2]">{patient.patientId}</h2>
            <p className="text-lg font-medium text-[#8C929D]">{patient.name}</p>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-base text-[#8C929D]">Age</span>
            <span className="text-base font-medium text-[#707784]">{patient.age}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-base text-[#8C929D]">Weight</span>
            <span className="text-base font-medium text-[#707784]">{patient.weight} kg</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base text-[#8C929D]">Medical History</span>
            <span className="text-base font-medium text-[#707784]">{patient.medicalHistory}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
