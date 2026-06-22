"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings,
  Layers,
  FileText,
  CalendarDays,
  AlignJustify,
  ChevronDown,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: (active: boolean) => React.ReactNode;
  hasChevron?: boolean;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    label: "Participant Management",
    href: "/participant-management",
    icon: (active) => (
      <Users
        size={20}
        className={active ? "text-[#0076D2]" : "text-[#707784]"}
      />
    ),
  },
  {
    label: "Global Configuration",
    href: "/global-configuration",
    icon: (active) => (
      <Settings
        size={20}
        className={active ? "text-[#0076D2]" : "text-[#707784]"}
      />
    ),
  },
  {
    label: "Config Phase",
    icon: (active) => (
      <Wrench
        size={20}
        className={active ? "text-[#0076D2]" : "text-[#707784]"}
      />
    ),
    hasChevron: true,
    children: [
      {
        label: "Phase Management",
        href: "/phase-management",
      },
      {
        label: "Protocol & Sampling",
        href: "/protocol-sampling",
      },
    ],
  },
  {
    label: "Session Creation",
    href: "/session-creation",
    icon: (active) => (
      <CalendarDays
        size={20}
        className={active ? "text-[#0076D2]" : "text-[#707784]"}
      />
    ),
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: (active) => (
      <Users
        size={20}
        className={active ? "text-[#0076D2]" : "text-[#707784]"}
      />
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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
        {navItems.map((item) => {
          const isActive = item.href
            ? pathname.startsWith(item.href)
            : item.children?.some((child) =>
                pathname.startsWith(child.href)
              );

          const MenuContent = (
            <>
              {isActive && (
                <div className="absolute left-[-20px] top-0 bottom-0 w-1 bg-[#0076D2] rounded-r-md" />
              )}

              <div className="flex items-center gap-1 flex-1">
                <div className="p-2.5 rounded-lg flex items-center">
                  {item.icon(Boolean(isActive))}
                </div>

                <span
                  className={cn(
                    "text-base font-normal leading-[18px]",
                    isActive
                      ? "text-[#0076D2] font-medium"
                      : "text-[#707784]"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {item.hasChevron && (
                <div className="p-2.5 rounded-lg">
                  <ChevronDown size={20} className="text-[#A9ADB5]" />
                </div>
              )}
            </>
          );

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 pl-1 rounded-sm relative",
                    isActive && "bg-[#F1F9FA]"
                  )}
                >
                  {MenuContent}
                </Link>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-1 pl-1 rounded-sm relative",
                    isActive && "bg-[#F1F9FA]"
                  )}
                >
                  {MenuContent}
                </div>
              )}

              {item.children && (
                <div className="ml-[52px] flex flex-col gap-6 pt-2 pb-2">
                  {item.children.map((child) => {
                    const childActive = pathname.startsWith(child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "text-base leading-[18px] transition-colors",
                          childActive
                            ? "text-[#0076D2] font-medium"
                            : "text-[#707784] hover:text-[#0076D2]"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}