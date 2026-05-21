"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe, User, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState("Analyzer Operator");
  const [email, setEmail] = useState("Crystinlee.op@gmail.com");
  const [password, setPassword] = useState("password123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <main className="flex h-screen w-full flex-col bg-white font-sans overflow-hidden">
      
      <header className="flex w-full items-center justify-between bg-white px-16 py-6 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md bg-gray-200">
            <span className="text-xs text-gray-500">Logo</span>
          </div>
          <div className="flex items-center gap-6">
            <h1 className="text-[28px] font-bold text-[#0076D2] leading-tight">Glucose Clamp</h1>
            <span className="text-lg font-medium text-[#707784]">Monitoring Dashboard</span>
          </div>
        </div>

        <Button variant="ghost" className="h-11 rounded-full px-6 text-[#0076D2] hover:bg-blue-50">
          <Globe className="mr-2 h-5 w-5" />
          <span className="text-lg font-medium">English</span>
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      </header>

      <div className="flex w-full flex-1 overflow-hidden">
        
        <div 
          className="relative hidden lg:flex flex-1 flex-col items-center justify-center p-12 bg-cover bg-center"
          style={{ backgroundImage: "url('/Frame 114 - background.png')" }}
        >
          
          <div className="relative z-10 flex w-full max-w-[500px] min-h-[480px] flex-col rounded-[24px] bg-white/20 p-10 backdrop-blur-md border border-white/30 shadow-2xl">
            
            <div className="absolute -left-16 top-3/4 -translate-y-1/2 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl z-30">
              <img 
                src="/image 7.png" 
                alt="Syringe" 
                className="h-32 w-32 object-contain" 
              />
            </div>

            <img 
              src="/female doctor with stethoscope.png" 
              alt="Doctor" 
              className="absolute -bottom-0 -right-8 h-[80%] object-contain object-bottom pointer-events-none z-20 drop-shadow-2xl" 
            />

            <div className="relative z-10 flex flex-col gap-4 w-[65%] w-full">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white whitespace-nowrap">Get Started</span>
                <div className="h-px flex-1 bg-white/40" />
              </div>
            </div>  
            <div className="relative z-10 flex flex-col gap-4 w-[65%]">                        
              <h2 className="text-[42px] font-bold leading-tight text-white">Welcome!</h2>
              <p className="text-base font-medium leading-relaxed text-white/90">
                Precision monitoring starts here. <br />
                Choose your role to access the dashboard.
              </p>
            </div>
            
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto bg-white px-8 py-12">
          
          <div className="m-auto flex w-full max-w-[398px] flex-col gap-10">
            
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-[34px] font-bold leading-tight text-[#2D2F35]">
                Glucose Clamp
              </h2>
              <p className="text-lg text-[#707784]">
                Clinical Monitoring System
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-[#43474F]">Role Selection</label>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E84E2C]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex h-14 w-full items-center justify-between rounded-xl border-[#E2E4E6] bg-[#FAFAFA] px-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-[#2D2F35]" />
                        <span className="text-lg font-normal text-[#2D2F35]">{role}</span>
                      </div>
                      <ChevronDown className="h-5 w-5 text-[#2D2F35]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[398px]">
                    <DropdownMenuItem onClick={() => setRole("Analyzer Operator")} className="text-lg cursor-pointer">
                      Analyzer Operator
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRole("Clinical Supervisor")} className="text-lg cursor-pointer">
                      Clinical Supervisor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-[#43474F]">Username/Email</label>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E84E2C]" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D2F35]" />
                  <Input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-xl border-[#E2E4E6] bg-[#FAFAFA] pl-12 pr-4 text-lg text-[#2D2F35]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-[#43474F]">Password</label>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E84E2C]" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D2F35]" />
                  <Input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-xl border-[#E2E4E6] bg-[#FAFAFA] pl-12 pr-4 text-lg text-[#2D2F35]"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="mt-2 h-[52px] w-full rounded-full bg-[#0076D2] px-6 text-lg font-medium text-white shadow-none hover:bg-[#005ea8]"
              >
                Login to System
              </Button>
            </form>

          </div>
        </div>
      </div>
    </main>
  );
}