import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

import { ToastProvider } from "@/components/ui/toast";
import { SidebarProvider } from "@/components/sidebar-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              {children}
            </ToastProvider>
          </main>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}