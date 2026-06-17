"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { login } from "../services";
import { ChevronDown, User, Lock, Mail, AlertCircle, CheckCircle2, X } from "lucide-react";
import { TopNavigation } from "@/components/ui/TopNavigation"; 
import api from "@/lib/axios";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  // Auto-close alert error setelah 5 detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login({ username, password });

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("is_logged_in", "true");
      localStorage.setItem("operator_username", result.data.username);
      localStorage.setItem("operator_name", result.data.username);

      router.push("/participant-management");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsLoading(false);
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Kita catat waktu mulai request untuk menghitung durasi proses
    const startTime = Date.now();

    try {
      const response = await api.post("/user-management/users/sign-in", {
        username,
        password,
      });
      console.log("ini responsenya", response);

      // Ambil data yang dikembalikan oleh database (API)
      const userRole = response.data.data.role; // Misalnya: "Pump Operator" atau "Analyzer Operator"
      const token = response.data.data.token;
      const userId = response.data.data.id;
      const userNameRes = response.data.data.username;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("role", userRole);
      localStorage.setItem("username", userNameRes);
      localStorage.setItem("is_logged_in", "true");

      setSuccess("Login berhasil! Membuka sistem...");

      setTimeout(() => {
        if (userRole === "Pump Operator") {
          router.push("/infusion");
        } else {
          router.push("/measurement");
        }
      }, 1500);

    } catch (err: any) {
      const elapsedTime = Date.now() - startTime;
      const minimumDelay = 800;
      const remainingDelay = Math.max(0, minimumDelay - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        const serverMessage = err.response?.data?.message || err.response?.data?.error;
        setError(serverMessage || "Gagal masuk. Periksa kembali username dan password Anda.");
      }, remainingDelay);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col bg-white font-sans overflow-hidden">

      <TopNavigation
        subtitle="Monitoring Dashboard"
        showLanguageSelector={true}
      />

      {/* --- FLOATING SNACKBAR / TOAST NOTIFICATION --- */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 md:px-0">
        {/* Toast Sukses */}
        {success && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-800">{success}</p>
            </div>
          </div>
        )}

        {/* Toast Gagal */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button 
              type="button"
              onClick={() => setError(null)}
              className="rounded-lg p-1 text-red-600 hover:bg-red-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full flex-1 overflow-hidden">

        <div
        
        {/* Kolom Kiri: Ilustrasi */}
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

            <div className="relative z-10 flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white whitespace-nowrap">Get Started</span>
                <div className="h-px flex-1 bg-white/40" />
              </div>
            </div>
            <div className="relative z-10 flex flex-col gap-4 w-[65%] mt-4">
              <h2 className="text-[42px] font-bold leading-tight text-white">Welcome!</h2>
              <p className="text-base font-medium leading-relaxed text-white/90">
                Precision monitoring starts here. <br />
                Login to access your clinical dashboard.
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

              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-[#43474F]">Username</label>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E84E2C]" />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D2F35]" />
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 w-full rounded-xl border-[#E2E4E6] bg-[#FAFAFA] pl-12 pr-4 text-lg text-[#2D2F35]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-[52px] w-full rounded-full bg-[#0076D2] px-6 text-lg font-medium text-white shadow-none hover:bg-[#005ea8]"
              >
                {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Login to System
              </Button>
            </form>

          </div>
        </div>
      </div>
    </main>
  );
}