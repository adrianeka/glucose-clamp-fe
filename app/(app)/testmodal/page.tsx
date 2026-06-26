// "use client";

// import { useState } from "react";
// import { BloodSampleDialog } from "@/features/session-running/components/modalStepActivity/ModalBloodDraw";
// import { ConfirmBloodDrawDialog } from "@/features/session-running/components/modalStepActivity/ConfirmBloodDrawDialog";
// import InsulinDialog  from "@/features/session-running/components/modalStepActivity/ModalInsulinInjection"; // Import modal suntik baru
// import { ConfirmInsulinDialog } from "@/features/session-running/components/modalStepActivity/ConfirmInsulinDialog"; // Import modal konfirmasi suntik baru

// // Import Tambahan untuk Flow 3: Preparation Data
// import { PreparationDialog } from "@/features/session-running/components/modalStepActivity/ModalPreparationData";
// import { ConfirmPreparationDialog } from "@/features/session-running/components/modalStepActivity/ConfirmPreparationDialog";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ActivityDetail, activityService } from "@/features/session-running/services/ActivityService";

// export default function TestPage() {
//   // ==========================================
//   // STATE MANAGEMENT MODAL
//   // ==========================================

//   // State untuk modal Blood Draw (Glucose & Insulin Check)
//   const [isOpen, setIsOpen] = useState(false);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
//   // State untuk modal Insulin Injection (Suntik)
//   const [isOpenInjection, setIsOpenInjection] = useState(false);
//   const [isConfirmInjectionOpen, setIsConfirmInjectionOpen] = useState(false);

//   // State baru untuk modal Preparation Data (Pemeriksaan Fisik Awal)
//   const [isOpenPrep, setIsOpenPrep] = useState(false);
//   const [isConfirmPrepOpen, setIsConfirmPrepOpen] = useState(false);

//   // ==========================================
//   // STATE DATA & STATUS
//   // ==========================================
//   const [activityIdInput, setActivityIdInput] = useState("");
//   const [activeActivity, setActiveActivity] = useState<ActivityDetail | null>(null);
//   const [loading, setLoading] = useState(false);

//   // State penampung data sementara (digunakan bergantian untuk transisi modal)
//   const [tempFormData, setTempFormData] = useState<any>(null);
//   const [tempPrepData, setTempPrepData] = useState<any>(null); // Khusus data fisik preparation

//   const handleFetchAndOpen = async () => {
//     const id = parseInt(activityIdInput);
//     if (isNaN(id)) {
//       alert("Masukkan angka ID aktivitas yang valid.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = await activityService.getById(id);
//       setActiveActivity(data);

//       // --- PERCABANGAN LOGIKA TAMPILAN AWAL MODAL ---
//       if (data.activityType === "BLOOD_DRAW" || data.activityType === "INSULIN_CHECK") {
//         setIsOpen(true); // Buka modal input lab utama
//       } 
//       else if (data.activityType === "INSULIN_INJECTION") {
//         setIsOpenInjection(true); // Langsung buka modal konfirmasi suntik insulin
//       } 
//       else if (data.activityType === "PREPARATION_CHECK") {
//         setIsOpenPrep(true); // Buka modal input data tanda vital & antropometri
//       }
//       else {
//         alert(`Aktivitas ke-${id} adalah "${data.activityType}".`);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Aktivitas tidak ditemukan atau terjadi kesalahan koneksi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // EVENT HANDLER TRANSISI MODAL
//   // ==========================================

//   // Tahap 1 untuk BLOOD_DRAW & INSULIN_CHECK
//   const handleBloodDrawSubmit = (formData: any) => {
//     setTempFormData(formData);
//     setIsOpen(false);
//     setIsConfirmOpen(true);
//   };

//   // Tahap 1 untuk INSULIN_INJECTION (Tindakan)
//   const handleInjectionSubmit = (formData: any) => {
//     setTempFormData(formData); // Simpan data dosis
//     setIsOpenInjection(false); // Tutup modal input dosis
//     setIsConfirmInjectionOpen(true); // Buka modal konfirmasi tindakan
//   };

//   // Tahap 1 untuk PREPARATION_CHECK (Data Fisik)
//   const handlePrepSubmit = (formData: any) => {
//     setTempPrepData(formData); // Simpan data tanda vital & anamnesis ke state sementara
//     setIsOpenPrep(false);      // Tutup modal input
//     setIsConfirmPrepOpen(true); // Buka modal konfirmasi akhir
//   };

//   // Tombol Cancel/Back dari modal konfirmasi lab
//   const handleBackToBloodDraw = () => {
//     setIsConfirmOpen(false);
//     setIsOpen(true);
//   };

//   // Tombol Cancel/Back dari modal konfirmasi suntik
//   const handleBackToInjection = () => {
//     setIsConfirmInjectionOpen(false);
//     setIsOpenInjection(true);
//   };

//   // Tombol Cancel/Back dari modal konfirmasi pemeriksaan fisik
//   const handleBackToPrep = () => {
//     setIsConfirmPrepOpen(false);
//     setIsOpenPrep(true);
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto space-y-6">
//       <h1 className="text-xl font-bold text-slate-800">Uji Coba Input Aktivitas Dinamis</h1>
      
//       <div className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
//         <label className="text-sm font-semibold text-slate-600">Masukkan ID Aktivitas</label>
//         <div className="flex gap-2">
//           <Input 
//             type="number" 
//             placeholder="Contoh: 1, 3, atau 8" 
//             value={activityIdInput}
//             onChange={(e) => setActivityIdInput(e.target.value)}
//             className="bg-white"
//           />
//           <Button 
//             onClick={handleFetchAndOpen} 
//             disabled={loading}
//             className="bg-[#0070C0] hover:bg-blue-700 text-white font-medium"
//           >
//             {loading ? "Memuat..." : "Buka Modal"}
//           </Button>
//         </div>
//         <p className="text-xs text-slate-400 leading-relaxed">
//           * ID 1 (PREPARATION_CHECK) memunculkan form pemeriksaan awal, ID 3 (BLOOD_DRAW)/ID 4 (INSULIN_CHECK) memunculkan form input lab, sedangkan ID 8 (INSULIN_INJECTION) memunculkan form suntik insulin.
//         </p>
//       </div>

//       {/* ================================================= */}
//       {/* FLOW 1: BLOOD DRAW / INSULIN CHECK (LAB DATA)    */}
//       {/* ================================================= */}
//       <BloodSampleDialog 
//         isOpen={isOpen}
//         onOpenChange={setIsOpen}
//         activity={activeActivity}
//         onSubmit={handleBloodDrawSubmit}
//         defaultValues={tempFormData}
//       />

//       <ConfirmBloodDrawDialog 
//         isOpen={isConfirmOpen}
//         onOpenChange={setIsConfirmOpen}
//         activity={activeActivity}
//         data={tempFormData}
//         onCancel={handleBackToBloodDraw}
//       />

//       {/* ================================================= */}
//       {/* FLOW 2: INSULIN INJECTION (TINDAKAN SUNTIK)      */}
//       {/* ================================================= */}
//       <InsulinDialog 
//         isOpen={isOpenInjection}
//         onOpenChange={setIsOpenInjection}
//         onSubmit={handleInjectionSubmit}
//         activityData={activeActivity}
//       />

//       <ConfirmInsulinDialog 
//         isOpen={isConfirmInjectionOpen}
//         onOpenChange={setIsConfirmInjectionOpen}
//         activity={activeActivity}
//         data={tempFormData}
//         onCancel={handleBackToInjection}
//       />

//       {/* ================================================= */}
//       {/* FLOW 3: PREPARATION CHECK (TANDA VITAL & ANAMNESIS) */}
//       {/* ================================================= */}
//       <PreparationDialog 
//         isOpen={isOpenPrep}
//         onOpenChange={setIsOpenPrep}
//         activity={activeActivity}
//         onSubmit={handlePrepSubmit}
//         defaultValues={tempPrepData}
//       />

//       <ConfirmPreparationDialog 
//         isOpen={isConfirmPrepOpen}
//         onOpenChange={setIsConfirmPrepOpen}
//         activity={activeActivity}
//         data={tempPrepData}
//         onCancel={handleBackToPrep}
//       />
//     </div>
//   );
// }