import { Button } from "@/components/ui/button";
import { AlertOctagon, LogIn, LogOut, User, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  isLoggedIn?: boolean;
  operatorName?: string;
  operatorRole?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  subtitle?: string;
  showLanguageSelector?: boolean;
  className?: string;
}

export function TopNavigation({
  isLoggedIn = false,
  operatorName = "Maghfira Whatley",
  operatorRole = "Admin",
  onLogin,
  onLogout,
  subtitle,
  showLanguageSelector = false,
  className,
}: TopNavigationProps) {
  return (
    <header 
      className={cn(
        "flex w-full items-center justify-between bg-white px-16 py-6 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] z-50 shrink-0", 
        className
      )}
    >
      <div className="flex items-center gap-6">
        <div className="relative h-11 w-11 overflow-hidden rounded-md bg-white">
          <Image 
            src="/LogoNavbar.png" 
            alt="Glucose Clamp Logo" 
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-6">
          <h1 className="text-[28px] font-bold text-[#0076D2] leading-tight">Glucose Clamp</h1>
          {subtitle && (
            <span className="text-lg font-medium text-[#707784] leading-none">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {showLanguageSelector ? (
          <Button variant="ghost" className="h-11 rounded-full px-6 text-[#0076D2] hover:bg-blue-50">
            <Globe className="mr-2 h-5 w-5" />
            <span className="text-lg font-medium">English</span>
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        ) : isLoggedIn ? (
          <>
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
              onClick={onLogout}
              variant="outline"
              className="h-11 rounded-full border-[#F24138] px-6 text-lg font-medium text-[#F24138] hover:bg-red-50 hover:text-[#F24138]"
            >
              Logout
              <LogOut className="ml-2 h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button
            onClick={onLogin}
            variant="outline"
            className="h-11 rounded-full border-[#0076D2] px-6 text-lg font-medium text-[#0076D2] hover:bg-blue-50"
          >
            Log In
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}