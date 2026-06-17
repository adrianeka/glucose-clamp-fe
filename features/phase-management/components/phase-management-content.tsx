"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  Plus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

// Import komponen Dialog berbasis Radix UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interface sesuai dengan data Phase Configuration
interface PhaseConfig {
  id?: string | number;
  priority: number;
  code: string;
  name: string;
  type: "Preparation" | "Pre-insulin" | "Post-insulin" | "Finalization" | string;
}

const formatTypeToFrontend = (type: string): string => {
  if (!type) return "Preparation";
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

// Opsi tipe fase untuk dropdown select
const PHASE_TYPES = ["Preparation", "Pre-insulin", "Post-insulin", "Finalization"];

export function PhaseManagementContent() {
  // State Utama
  const [phases, setPhases] = useState<PhaseConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // State baru untuk mencegah double submit
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // State Modal (Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseConfig | null>(null);
  
  // State form penampung draft input
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Preparation",
    priority: "",
  });

  // State Modal Konfirmasi Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<PhaseConfig | null>(null);

  // State Toast Notification (Snackbar)
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Fungsi dinamis mencari priority berikutnya (Mencegah duplikasi nilai priority)
  const getNextPriority = useCallback((items: PhaseConfig[]): number => {
    if (items.length === 0) return 1;
    const priorities = items.map((p) => Number(p.priority)).filter((p) => !isNaN(p));
    return priorities.length > 0 ? Math.max(...priorities) + 1 : 1;
  }, []);

  // Fetch Data dari API
  const fetchPhases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/phase-configuration");
      
      const rawContent = response.data?.data?.content || [];

      // Mapping data API ke format interface frontend
      const mappedData: PhaseConfig[] = rawContent.map((item: any) => ({
        id: item.phaseConfId,
        priority: Number(item.phaseConfPriority),
        code: item.phaseConfCode,
        name: item.phaseConfName,
        type: formatTypeToFrontend(item.phaseConfType),
      }));

      const sortedData = mappedData.sort((a, b) => a.priority - b.priority);
      setPhases(sortedData);
    } catch (error: any) {
      console.error("Error fetching phases:", error);
      showToast(error?.response?.data?.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  // Fungsi untuk menampilkan Snackbar/Toast
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Handler Buka Form (Add) - Mempertahankan draf jika sebelumnya juga dalam mode Add
  const handleAddClick = () => {
    if (selectedPhase !== null) {
      // Jika sebelumnya sedang Edit, bersihkan form untuk membuat data Add baru
      setSelectedPhase(null);
      setFormData({
        code: "",
        name: "",
        type: "Preparation",
        priority: String(getNextPriority(phases)),
      });
    } else {
      // Jika sebelumnya memang mode Add (berupa draf), pertahankan inputan draf tersebut
      if (!formData.priority) {
        setFormData((prev) => ({
          ...prev,
          priority: String(getNextPriority(phases)),
        }));
      }
    }
    setIsFormOpen(true);
  };

  // Handler Buka Form (Edit) - Selalu memuat data baris yang dipilih
  const handleEditClick = (phase: PhaseConfig) => {
    setSelectedPhase(phase);
    setFormData({
      code: phase.code,
      name: phase.name,
      type: phase.type,
      priority: String(phase.priority),
    });
    setIsFormOpen(true);
  };

  // Handler Reset & Tutup Form (Dipanggil saat klik Cancel atau penutupan modal Edit)
  const handleCancelForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "Preparation",
      priority: String(getNextPriority(phases)),
    });
    setSelectedPhase(null);
    setIsFormOpen(false);
  };

  // Handler interaksi penutupan dialog (Backdrop, Escape, atau Tombol Kanan Atas)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (selectedPhase !== null) {
        // Jika sedang EDIT, otomatis RESET data saat ditutup (Menampilkan logo X)
        handleCancelForm();
      } else {
        // Jika sedang ADD, CUKUP TUTUP tanpa reset data draf (Menampilkan logo -)
        setIsFormOpen(false);
      }
    } else {
      setIsFormOpen(true);
    }
  };

  const handleDeleteClick = (phase: PhaseConfig) => {
    setPhaseToDelete(phase);
    setIsDeleteOpen(true);
  };

  // Submit Form (Save / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.priority) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Set status submitting aktif sebelum menembak API
    setSubmitting(true);

    // FIX: Selaraskan properti payload agar sesuai 100% dengan ekspektasi backend Spring Boot Anda
    const payload = {
      phaseConfCode: formData.code,
      phaseConfName: formData.name,
      phaseConfType: formData.type.toLowerCase(), // Kirim format lowercase (e.g., "finalization")
      phaseConfPriority: Number(formData.priority), // Menggunakan penamaan "phaseConfPriority"
    };

    try {
      if (selectedPhase) {
        await api.put(`/phase-configuration/${selectedPhase.id}`, payload);
        showToast("Edit phase config successfully", "success");
      } else {
        await api.post("/phase-configuration", payload);
        showToast("Add phase config successfully", "success");
      }
      
      // Reset form ke default hanya jika proses submit berhasil
      setFormData({
        code: "",
        name: "",
        type: "Preparation",
        priority: String(getNextPriority(phases)),
      });
      setSelectedPhase(null);
      setIsFormOpen(false);
      fetchPhases();
    } catch (error: any) {
      console.error("Submit error details:", error);
      showToast(error?.response?.data?.details || error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false); // Nonaktifkan status loading setelah request selesai
    }
  };

  // Eksekusi Delete
  const handleConfirmDelete = async () => {
    if (!phaseToDelete) return;
    try {
      await api.delete(`/phase-configuration/${phaseToDelete.id}`);
      showToast("Delete phase config successfully", "success");
      setIsDeleteOpen(false);
      setPhaseToDelete(null);
      fetchPhases();
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to delete item", "error");
    }
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(phases.length / itemsPerPage));
  const paginatedPhases = phases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative flex-1 self-stretch px-8 py-6 bg-[#FAFBFC] min-h-screen flex flex-col gap-6">
      
      {/* Toast Notification (Snackbar) */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md border text-sm font-medium animate-in fade-in slide-in-from-top-4",
            toast.type === "success" 
              ? "bg-[#10B981] border-[#10B981] text-white" 
              : "bg-red-500 border-red-500 text-white"
          )}>
            <div className="flex items-center justify-center bg-white/20 rounded-full p-1">
              <Check size={14} className="text-white" />
            </div>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-4 hover:opacity-85"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
            Phase Management
          </h1>
          <p className="text-[#707784] text-sm font-normal leading-5">
            Configure sequential clinical workflow phases
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-[#0076D2] hover:bg-[#005FA3] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Phase Config
        </button>
      </div>

      {/* Tabel Utama */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1">
        
        {/* Header Table */}
        <div className="flex items-center w-full bg-[#F8FAFC] border-b border-gray-100">
          {[
            { label: "Priority", width: "w-[120px]" },
            { label: "Code", width: "w-[180px]" },
            { label: "Name", width: "flex-1" },
            { label: "Type", width: "w-[220px]" },
            { label: "Actions", width: "w-[150px] justify-end" },
          ].map(({ label, width }) => (
            <div
              key={label}
              className={cn("flex-shrink-0 h-12 px-6 py-3 flex items-center text-[#0076D2] text-sm font-semibold", width)}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Body Table */}
        <div className="flex flex-col flex-1 divide-y divide-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">Loading phases...</span>
            </div>
          ) : paginatedPhases.length > 0 ? (
            paginatedPhases.map((phase) => (
              <div 
                key={phase.id} 
                className="flex items-center w-full bg-white hover:bg-[#F9FBFC] transition-colors py-3"
              >
                {/* Priority */}
                <div className="w-[120px] flex-shrink-0 px-6 py-2 text-sm text-[#2D2F35] font-medium">
                  {phase.priority}
                </div>

                {/* Code Badge */}
                <div className="w-[180px] flex-shrink-0 px-6 py-2">
                  <span className="px-3 py-1 bg-[#EBF3FC] text-[#0076D2] rounded-full border border-[#C4DDF6] text-xs font-semibold">
                    {phase.code}
                  </span>
                </div>

                {/* Name */}
                <div className="flex-1 px-6 py-2 text-sm text-[#2D2F35] font-medium">
                  {phase.name}
                </div>

                {/* Type */}
                <div className="w-[220px] flex-shrink-0 px-6 py-2 text-sm text-[#43474F] font-normal">
                  {phase.type}
                </div>

                {/* Actions */}
                <div className="w-[150px] flex-shrink-0 px-6 py-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleEditClick(phase)}
                    className="p-1.5 hover:bg-amber-50 text-[#F5A623] rounded-md transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(phase)}
                    className="p-1.5 hover:bg-rose-50 text-[#EF4444] rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center text-[#707784] text-sm bg-white">
              No phase configurations found. Please add a new configuration.
            </div>
          )}
        </div>

        {/* Footer & Pagination */}
        {!loading && phases.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-[#707784]">
              Showing {Math.min(phases.length, (currentPage - 1) * itemsPerPage + 1)}-
              {Math.min(phases.length, currentPage * itemsPerPage)} of {phases.length} items
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={16} className="text-[#707784]" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      currentPage === pageNum
                        ? "bg-[#EBF3FC] text-[#0076D2]"
                        : "text-[#707784] hover:bg-gray-100"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={16} className="text-[#707784]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DIALOG FORM (ADD / EDIT) */}
      <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="sm:max-w-md p-6 bg-white gap-0 border-0 shadow-xl rounded-2xl"
          closeIconType={selectedPhase ? "close" : "minimize"}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-[#2D2F35]">
              {selectedPhase ? "Edit Phase Config" : "Add Phase Config"}
            </DialogTitle>
            {selectedPhase && (
              <DialogDescription className="text-xs text-gray-500 mt-1">
                Phase Code: {selectedPhase.code}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {/* Phase Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Phase Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PREP1"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#0076D2] focus:border-[#0076D2]"
                disabled={submitting}
              />
            </div>

            {/* Phase Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Phase Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pemeriksaan Awal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#0076D2] focus:border-[#0076D2]"
                disabled={submitting}
              />
            </div>

            {/* Type Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#0076D2] focus:border-[#0076D2] appearance-none cursor-pointer"
                disabled={submitting}
              >
                {PHASE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Priority <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#0076D2] focus:border-[#0076D2]"
                disabled={submitting}
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="mt-4 pt-4 border-t border-gray-100 bg-transparent flex flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#EBF3FC] text-[#0076D2] hover:bg-[#D4E8FC] transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0076D2] hover:bg-[#005FA3] text-white transition-colors flex items-center justify-center gap-1.5 min-w-[130px]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : selectedPhase ? (
                  "Save Changes"
                ) : (
                  "Add Phase Config"
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG CONFIRM DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm p-6 bg-white gap-0 border-0 shadow-xl rounded-2xl" showCloseButton={false}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-[#2D2F35]">
              Delete Phase Configuration
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete <strong className="text-gray-700">{phaseToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 pt-4 border-t border-gray-100 bg-transparent flex flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}