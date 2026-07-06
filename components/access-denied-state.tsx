import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AccessDeniedState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto my-12">
      {/* Icon Bulat Merah Lembut */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>

      {/* Teks Penjelasan */}
      <h3 className="text-2xl font-bold text-[#2D2F35] mb-2">
        Akses Terbatas
      </h3>
      <p className="text-[#707784] text-base leading-relaxed max-w-md mb-8">
        Akun Anda tidak memiliki wewenang untuk mengakses halaman ini. 
        Silakan hubungi Administrator jika Anda memerlukan akses ini.
      </p>

      {/* Tombol Kembali */}
      <Button
        onClick={() => router.push("/participant-management")}
        className="flex items-center gap-2 rounded-full bg-[#0076D2] hover:bg-[#005ea8] text-white px-6 h-12 text-base font-medium shadow-none transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Beranda
      </Button>
    </div>
  );
}