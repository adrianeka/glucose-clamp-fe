"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, AlignJustify } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "./sidebar-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);
  
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="h-15 px-4 md:px-12 flex items-center justify-between bg-[#FAFAFA] shadow-[0px_-1px_0px_#E2E4E6_inset] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden shrink-0"
          type="button"
          aria-label="Toggle Menu"
        >
          <AlignJustify size={20} className="text-[#A9ADB5]" />
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/LogoNavbar.png"
            alt="Glucose Clamp Logo"
            width={38}
            height={38}
            className="rounded-[112px] shrink-0"
          />
          <span className="hidden sm:inline-block text-[#0076D2] text-xl md:text-[28px] font-bold leading-normal md:leading-[38px] whitespace-nowrap">
            Glucose Clamp
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 md:gap-3 outline-none cursor-pointer">
              <Image
                src="/Profile.png"
                alt="User avatar"
                width={36}
                height={36}
                className="rounded-full ring-1 ring-[#E2E4E6] shrink-0"
              />
              <div className="hidden sm:flex flex-col gap-0.5 md:gap-1">
                <span className="text-[#212121] text-xs md:text-sm font-medium leading-[14px] md:leading-[18px] max-w-[80px] md:w-[100px] text-left truncate">
                  {name}
                </span>
                <Badge
                  variant="outline"
                  className="bg-[#F1F9FA] border-[#C4EAEE] text-[#0076D2] text-[10px] md:text-xs font-normal rounded-full px-1.5 py-0.5 w-fit"
                >
                  {role}
                </Badge>
              </div>
              <ChevronDown size={16} className="text-[#707784] shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-[#E84E2C] gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}