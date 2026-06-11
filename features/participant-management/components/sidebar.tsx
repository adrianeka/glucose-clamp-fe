"use client";

import Link from "next/link";
import {
  Users,
  Settings,
  Layers,
  FileText,
  CalendarDays,
  AlignJustify,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon: React.ReactNode;
  hasChevron?: boolean;
  children?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Participant Management",
    href: "/participant-management",
    active: true,
    icon: <Users size={20} className="text-[#0076D2]" />,
  },
  {
    label: "Global Configuration",
    href: "/global-configuration",
    active: false,
    icon: <Settings size={20} className="text-[#707784]" />,
  },
  {
    label: "Phase Management",
    href: "/phase-management",
    active: false,
    icon: <Layers size={20} className="text-[#707784]" />,
  },
  {
    label: "Protocol & Sampling",
    href: "/protocol-sampling",
    active: false,
    icon: <FileText size={20} className="text-[#707784]" />,
    hasChevron: true,
    children: ["Protocol Setup", "Sampling Schedule Mapper"],
  },
  {
    label: "Session Creation",
    href: "/session-creation",
    active: false,
    icon: <CalendarDays size={20} className="text-[#707784]" />,
  },
];

export function Sidebar() {
  return (
    <aside className="w-[304px] flex-shrink-0 h-full bg-white shadow-[-1px_0px_0px_rgba(0,0,0,0.05)_inset] flex flex-col gap-8 p-5">
      <div className="flex items-center gap-1.5">
        <div className="p-2.5 rounded-lg">
          <AlignJustify size={20} className="text-[#A9ADB5]" />
        </div>
        <span className="text-[#595F6A] text-base font-medium leading-[18px]">
          Menu
        </span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-1 pl-1 rounded-sm",
                item.active ? "bg-[#F1F9FA]" : ""
              )}
            >
              <div className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-1">
                  <div className="p-2.5 rounded-lg flex items-center">
                    {item.icon}
                  </div>
                  <span className="text-[#707784] text-base font-normal leading-[18px]">
                    {item.label}
                  </span>
                </div>
              </div>
              {item.hasChevron && (
                <div className="p-2.5 rounded-lg">
                  <ChevronDown size={20} className="text-[#A9ADB5]" />
                </div>
              )}
            </Link>

            {item.children && (
              <div className="ml-3 flex flex-col border-l-2 border-[#C6C8CE] pl-4 py-3 gap-4 mt-0.5">
                {item.children.map((child) => (
                  <span
                    key={child}
                    className="text-[#707784] text-base font-normal leading-[18px] cursor-pointer hover:text-[#0076D2] transition-colors"
                  >
                    {child}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
