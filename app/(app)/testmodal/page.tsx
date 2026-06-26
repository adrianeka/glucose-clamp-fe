"use client";
import { useState } from "react";
import { BloodSampleDialog } from "@/features/session-running/components/modalStepActivity/ModalBloodDraw";
import { ConfirmBloodDrawDialog } from "@/features/session-running/components/modalStepActivity/ConfirmBloodDrawDialog"; // Import modal konfirmasi Anda
import { bloodSampleService } from "@/features/session-running/services/BloodSampleService";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivityDetail, activityService } from "@/features/session-running/services/ActivityService";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State untuk mengontrol modal konfirmasi
  
  const [activityIdInput, setActivityIdInput] = useState("");
  const [activeActivity, setActiveActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // State sementara untuk menampung inputan form sebelum dikonfirmasi secara final
  const [tempFormData, setTempFormData] = useState<any>(null);

  // Fungsi get data activity berdasarkan ID inputan user (tetap utuh seperti kode Anda)
  const handleFetchAndOpen = async () => {
    const id = parseInt(activityIdInput);
    if (isNaN(id)) {
      alert("Masukkan angka ID aktivitas yang valid.");
      return;
    }

    setLoading(true);
    try {
      const data = await activityService.getById(id);
      
      // Validasi apakah aktivitas ini membutuhkan input sampel darah
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
    setTempFormData(formData); // Simpan data ke state sementara
    setIsOpen(false);          // Tutup modal input utama Anda
    setIsConfirmOpen(true);    // Buka modal konfirmasi kedua
  };

  // Tahap 2: Ketika tombol "Confirm" di ConfirmBloodDrawDialog ditekan (melakukan HIT ke API)
  const handleFinalConfirm = async () => {
    if (!activeActivity || !tempFormData) return;

    const isGlucose = activeActivity.activityType === "BLOOD_DRAW";

    // Strukturkan payload data yang akan dikirim ke POST /blood-samples berdasarkan tempFormData
    const payload = {
      activityId: activeActivity.activityId,
      collectedBy: 1, // Contoh ID user pembuat
      sampleTime: new Date().toISOString(),
      sampleType: isGlucose ? "Glucose" : "Insulin",
      tubeType: tempFormData.tubeType,
      volumeMl: Math.round(parseFloat(tempFormData.volume)) || 0,
      labResults: isGlucose
        ? [
            {
              parameterName: "PK",
              value: parseFloat(tempFormData.resultPk) || 0,
              unit: tempFormData.unitPk,
            },
          ]
        : [
            {
              parameterName: "PK",
              value: parseFloat(tempFormData.resultPk) || 0,
              unit: tempFormData.unitPk,
            },
            {
              parameterName: "C-Peptide",
              value: parseFloat(tempFormData.resultCPeptide) || 0,
              unit: tempFormData.unitCPeptide,
            },
          ],
    };

    try {
      await bloodSampleService.add(payload);
      alert("Data Blood Sample berhasil disimpan!");
      setIsConfirmOpen(false); // Tutup modal konfirmasi setelah sukses
      setTempFormData(null);   // Bersihkan data sementara
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data Blood Sample.");
    }
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
        <p className="text-xs text-slate-400">
          * ID 3 (BLOOD_DRAW) akan memunculkan form Glucose, sedangkan ID 4 (INSULIN_CHECK) akan memunculkan form Insulin.
        </p>
      </div>

      {/* Modal 1: Input Data (Dumb Modal) */}
      <BloodSampleDialog 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        activity={activeActivity}
        onSubmit={handleFormSubmit}
      />

      {/* Modal 2: Konfirmasi Data Hasil Input */}
      <ConfirmBloodDrawDialog 
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        activity={activeActivity}
        data={tempFormData}
        onConfirm={handleFinalConfirm}
      />
    </div>
  );
}