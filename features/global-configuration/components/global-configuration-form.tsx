"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { globalConfigurationService } from "../services";
import { GlobalConfiguration } from "../types";

export function GlobalConfigurationForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [originalConfig, setOriginalConfig] = useState<GlobalConfiguration | null>(null);
  const [timerValue, setTimerValue] = useState("");

  const fetchConfiguration = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await globalConfigurationService.getConfigurations();
      
      // Pencarian berdasarkan key atau name hasil mapping standar dari service
      const timerConfig = data.find((c) => {
        const title = (c.name || "").toLowerCase();
        const code = (c.key || "").toLowerCase();
        return title.includes("timer") || code.includes("timer");
      }) || data[0];

      if (timerConfig) {
        setOriginalConfig(timerConfig);
        setTimerValue(timerConfig.value || "");
      } else {
        setError("Configuration data not found on the server.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch configuration data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const handleSaveChanges = async () => {
    if (!originalConfig) return;

    const configId = originalConfig.id;
    
    // Pengecekan ketat untuk mencegah terkirimnya ID kosong atau "undefined"
    if (!configId || configId === "undefined") {
      setError("Gagal menyimpan: ID konfigurasi tidak valid atau bernilai undefined.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Kirim payload dengan key DTO gconf yang sesuai dengan Java backend
    const payload = {
      gconfCode: originalConfig.key || "detik_peringatan_sebelum_act",
      gconfTitle: originalConfig.name || "Activity Confirmation Timer",
      gconfValue: timerValue,
      gconfDescription: originalConfig.description || "",
    };

    try {
      await globalConfigurationService.updateConfiguration(configId, payload);

      setSuccessMessage("Configuration updated successfully.");
      
      setOriginalConfig({
        ...originalConfig,
        value: timerValue,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = originalConfig !== null && timerValue !== originalConfig.value;

  if (loading) {
    return (
      <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center min-h-[400px]">
        <p className="text-[#707784] text-sm">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
            Global Configuration
          </h1>
          <p className="text-[#707784] text-sm font-normal leading-5">
            Configure system-wide settings for session workflow
          </p>
        </div>
        
        <div>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || saving}
            className={`text-base font-semibold px-6 py-2.5 h-11 rounded-lg transition-colors ${
              hasChanges 
                ? "bg-[#0076D2] hover:bg-[#005fa3] text-[#FAFAFA]" 
                : "bg-[#B2BBC6] text-white cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Alerts / Feedback */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Setting Item Card */}
      {originalConfig && (
        <div className="border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-[70%]">
            <h3 className="text-[#2D2F35] text-base font-semibold">
              {originalConfig.name}
            </h3>
            <p className="text-[#707784] text-sm font-normal leading-relaxed">
              {originalConfig.description}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Input
              type="number"
              value={timerValue}
              onChange={(e) => setTimerValue(e.target.value)}
              className="w-24 text-center text-base bg-white border-[#E2E8F0] rounded-lg h-11 focus-visible:ring-[#0076D2]"
            />
          </div>
        </div>
      )}
    </div>
  );
}