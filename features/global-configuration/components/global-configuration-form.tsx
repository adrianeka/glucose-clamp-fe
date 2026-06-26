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

  // Menyimpan semua konfigurasi dari API
  const [configs, setConfigs] = useState<GlobalConfiguration[]>([]);
  // Menyimpan nilai input dinamis berdasarkan ID konfigurasi { [id]: value }
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const fetchConfigurations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await globalConfigurationService.getConfigurations();
      setConfigs(data);

      // Inisialisasi nilai input dari data yang didapatkan
      const initialValues: Record<string, string> = {};
      data.forEach((config) => {
        if (config.id) {
          initialValues[config.id] = config.value || "";
        }
      });
      setEditedValues(initialValues);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch configuration data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Filter konfigurasi mana saja yang nilainya berubah
    const changedConfigs = configs.filter((config) => {
      if (!config.id) return false;
      return editedValues[config.id] !== config.value;
    });

    if (changedConfigs.length === 0) {
      setSaving(false);
      return;
    }

    try {
      // Mengirimkan pembaruan untuk semua konfigurasi yang berubah secara paralel
      await Promise.all(
        changedConfigs.map((config) => {
          const payload = {
            gconfCode: config.key || "",
            gconfTitle: config.name || "",
            gconfValue: editedValues[config.id!],
            gconfDescription: config.description || "",
          };
          return globalConfigurationService.updateConfiguration(config.id!, payload);
        })
      );

      setSuccessMessage("Configurations updated successfully.");

      // Perbarui data asli (configs) agar sinkron dengan nilai yang baru disimpan
      setConfigs((prev) =>
        prev.map((config) => {
          if (config.id && editedValues[config.id] !== undefined) {
            return { ...config, value: editedValues[config.id] };
          }
          return config;
        })
      );
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Cek apakah ada salah satu konfigurasi yang nilainya berubah dari nilai asli
  const hasChanges = configs.some((config) => {
    if (!config.id) return false;
    return editedValues[config.id] !== config.value;
  });

  if (loading) {
    return (
      <div className="flex-1 self-stretch px-8 py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center min-h-[400px]">
        <p className="text-[#707784] text-sm">Loading configurations...</p>
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

      {/* List of Setting Items */}
      <div className="flex flex-col gap-4">
        {configs.map((config) => {
          if (!config.id) return null;

          return (
            <div 
              key={config.id} 
              className="border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-1 max-w-[70%]">
                <h3 className="text-[#2D2F35] text-base font-semibold">
                  {config.name}
                </h3>
                <p className="text-[#707784] text-sm font-normal leading-relaxed">
                  {config.description}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Input
                  type="number"
                  value={editedValues[config.id] ?? ""}
                  onChange={(e) => handleInputChange(config.id!, e.target.value)}
                  className="w-24 text-center text-base bg-white border-[#E2E8F0] rounded-lg h-11 focus-visible:ring-[#0076D2]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}