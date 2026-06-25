"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, HelpCircle, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("operator_email");
    localStorage.removeItem("operator_name");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <header className="h-15 px-12 flex items-center justify-between bg-[#FAFAFA] shadow-[0px_-1px_0px_#E2E4E6_inset] flex-shrink-0">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 outline-none">
              <Image
                src="/Profile.png"
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full ring-1 ring-[#E2E4E6]"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[#212121] text-base font-medium leading-[18px] w-[100px] text-left">
                  {name}
                </span>
                <Badge
                  variant="outline"
                  className="bg-[#F1F9FA] border-[#C4EAEE] text-[#0076D2] text-xs font-normal leading-[14px] rounded-full px-2 py-1 w-fit"
                >
                  {role}
                </Badge>
              </div>
              <ChevronDown size={20} className="text-[#707784]" />
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