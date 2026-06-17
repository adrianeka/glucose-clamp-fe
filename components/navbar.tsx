import Image from "next/image";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="h-20 px-12 flex items-center justify-between bg-[#FAFAFA] shadow-[0px_-1px_0px_#E2E4E6_inset] flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/LogoNavbar.png"
            alt="Glucose Clamp Logo"
            width={45}
            height={45}
            className="rounded-[112px]"
          />
          <span className="text-[#0076D2] text-[28px] font-bold leading-[38px]">
            Glucose Clamp
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <Image
            src="/Profile.png"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full ring-1 ring-[#E2E4E6]"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[#212121] text-base font-medium leading-[18px] w-[93px]">
              Arya Moe
            </span>
            <Badge
              variant="outline"
              className="bg-[#F1F9FA] border-[#C4EAEE] text-[#0076D2] text-xs font-normal leading-[14px] rounded-full px-2 py-1 w-fit"
            >
              Admin
            </Badge>
          </div>
          <ChevronDown size={20} className="text-[#707784]" />
        </div>

        <Button
          variant="outline"
          className="border-[#707784] text-[#707784] hover:bg-gray-50 gap-2 px-4 py-3 h-auto rounded-lg"
        >
          <HelpCircle size={20} className="text-[#707784]" />
          <span className="text-base font-medium leading-[18px]">Help</span>
        </Button>
      </div>
    </header>
  );
}
