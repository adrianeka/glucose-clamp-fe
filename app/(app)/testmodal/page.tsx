"use client";

import { useState } from "react";
import { BloodSampleDialog } from "@/features/session-running/components/modalStepActivity/ModalBloodDraw";
import { ConfirmBloodDrawDialog } from "@/features/session-running/components/modalStepActivity/ConfirmBloodDrawDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivityDetail, activityService } from "@/features/session-running/services/ActivityService";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [activityIdInput, setActivityIdInput] = useState("");
  const [activeActivity, setActiveActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // State sementara untuk menampung inputan form sebelum dikonfirmasi secara final
  const [tempFormData, setTempFormData] = useState<any>(null);

  const handleFetchAndOpen = async () => {
    const id = parseInt(activityIdInput);
    if (isNaN(id)) {
      alert("Masukkan angka ID aktivitas yang valid.");
      return;
    }

    setLoading(true);
    try {
      const data = await activityService.getById(id);
      
      if (data.activityType !== "BLOOD_DRAW" && data.activityType !== "INSULIN_CHECK") {
        alert(`Aktivitas ke-${id} adalah "${data.activityType}". Hanya jenis BLOOD_DRAW atau INSULIN_CHECK yang bisa menginput sampel.`);
        setLoading(false);
        return;
      }

      setActiveActivity(data);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
      alert("Aktivitas tidak ditemukan atau terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  // Tahap 1: Ketika tombol "Submit" di ModalBloodDraw ditekan
  const handleFormSubmit = (formData: any) => {
    setTempFormData(formData); // Simpan ke state sementara
    setIsOpen(false);          // Tutup modal input utama Anda
    setIsConfirmOpen(true);    // Buka modal konfirmasi kedua
  };

  // Tahap Opsional: Tombol "Cancel" di modal konfirmasi ditekan (kembali ke modal input dengan data utuh)
  const handleBackToInput = () => {
    setIsConfirmOpen(false);   // Tutup modal konfirmasi
    setIsOpen(true);           // Nyalakan kembali modal input
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Uji Coba Input Aktivitas Dinamis</h1>
      
      <div className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
        <label className="text-sm font-semibold text-slate-600">Masukkan ID Aktivitas</label>
        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Contoh: 3 atau 4" 
            value={activityIdInput}
            onChange={(e) => setActivityIdInput(e.target.value)}
            className="bg-white"
          />
          <Button 
            onClick={handleFetchAndOpen} 
            disabled={loading}
            className="bg-[#0070C0] hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Memuat..." : "Buka Modal"}
          </Button>
        </div>
      </div>

      {/* Modal 1: Input Data (Sekarang mendukung properti defaultValues) */}
      <BloodSampleDialog 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        activity={activeActivity}
        onSubmit={handleFormSubmit}
        defaultValues={tempFormData} // Mengirim kembali data ketikan terakhir agar tetap utuh saat kembali
      />

      {/* Modal 2: Konfirmasi Data Hasil Input (Ditambahkan properti onCancel) */}
      <ConfirmBloodDrawDialog 
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        activity={activeActivity}
        data={tempFormData}
        onCancel={handleBackToInput} // Arahkan kembali ke modal input saat di-cancel
      />
    </div>
  );
}