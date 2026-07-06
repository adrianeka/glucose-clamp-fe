"use client"; // Pastikan ini berjalan di sisi client

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

import { ToastProvider } from "@/components/ui/toast";
import { SidebarProvider } from "@/components/sidebar-provider";

import { getMyPermissions } from "@/features/auth/services"; 
import { AccessDeniedState } from "@/components/access-denied-state";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    setIsForbidden(false);
  }, [pathname]);

  useEffect(() => {
    const syncPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const latestPermissions = await getMyPermissions();
          localStorage.setItem("permissions", JSON.stringify(latestPermissions));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi permission terbaru:", err);
      }
    };

    syncPermissions();
  }, []);

  useEffect(() => {
    const handleForbidden = () => {
      setIsForbidden(true);
    };

    window.addEventListener("api-forbidden", handleForbidden);
    return () => {
      window.removeEventListener("api-forbidden", handleForbidden);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main
            className="flex-1 p-6"
            style={{ backgroundColor: "#FAFAFA" }}
          >
            <ToastProvider>
              {/* {children} */}
              {isForbidden ? <AccessDeniedState /> : children}
            </ToastProvider>
          </main>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}