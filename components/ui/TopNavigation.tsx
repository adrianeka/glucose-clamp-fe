import { Button } from "@/components/ui/button";
import { AlertOctagon, LogOut, User } from "lucide-react";
import Image from "next/image";

interface TopNavigationProps {
  operatorName?: string;
  operatorRole?: string;
}

export function TopNavigation({
  operatorName = "Maghfira Whatley",
  operatorRole = "Admin",
}: TopNavigationProps) {
  return (
    <header className="flex w-full items-center justify-between bg-white px-16 py-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative h-11 w-11 overflow-hidden rounded-md bg-white">
          <Image 
            src="/LogoNavbar.png" 
            alt="Glucose Clamp Logo" 
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-[28px] font-bold text-[#0076D2]">Glucose Clamp</h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <span className="text-base text-[#212121]">{operatorName}</span>
            <div className="flex items-center justify-center rounded-full border border-[#C4EAEE] bg-[#F1F9FA] px-2 py-1">
              <span className="text-sm font-medium text-[#0076D2]">
                {operatorRole}
              </span>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
             <User className="h-6 w-6 text-gray-500" />
          </div>
        </div>

        <Button
          variant="destructive"
          className="h-11 rounded-full px-6 text-lg font-medium shadow-none bg-[#F02102] hover:bg-red-700 text-white"
        >
          <AlertOctagon className="mr-2 h-5 w-5" />
          Emergency Stop
        </Button>

        <Button
          variant="outline"
          className="h-11 rounded-full border-[#F24138] px-6 text-lg font-medium text-[#F24138] hover:bg-red-50 hover:text-[#F24138]"
        >
          Logout
          <LogOut className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}