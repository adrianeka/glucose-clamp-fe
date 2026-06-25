"use client";

import { useEffect, useState } from "react";
import { Check, X, Search, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

interface RoleAccessResponse {
  roleAccessId: number;
  roleId: number;
  roleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface AccessMenuResponse {
  menuId: number;
  menuName: string;
  status: string;
  permissions?: RoleAccessResponse[];
}

const TARGET_ROLES = [
  { id: 2, label: "Admin" },
  { id: 3, label: "Spv" },
  { id: 5, label: "Analyzer Ops" },
  { id: 6, label: "Pump Ops" },
  { id: 1, label: "SuperUser" },
];

const ACTIONS = ["View", "Add", "Edit", "Delete"];

// 1. Definisikan urutan prioritas 8 menu teratas di FE
const SCREEN_ORDER = [
  "PARTICIPANT",
  "PHASECONFIGURATION",
  "USER",
  "PROTOCOL",
  "SAMPLINGSCHEDULE",
  "SESSION",
  "ACTIVITY",
  "INFUSIONMONITORING"
];

const formatScreenName = (name: string): string => {
  const mapping: Record<string, string> = {
    USER: "User",
    PARTICIPANT: "Partisipan",
    PROTOCOL: "Protocol",
    PHASECONFIGURATION: "Phase",
    SAMPLINGSCHEDULE: "Schedule Sampling",
    SESSION: "Session",
    INFUSIONMONITORING: "Infusion Monitoring",
    ACTIVITY: "Activity",
  };
  return mapping[name.toUpperCase()] || name;
};

export default function CheckRoleAccessPage() {
  const [menus, setMenus] = useState<AccessMenuResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMenus = async (keyword: string = "") => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (keyword.trim()) {
        response = await api.get("/access-menus/search", {
          params: { keyword, pageNumber: 1, pageSize: 100 },
        });
      } else {
        response = await api.get("/access-menus", {
          params: { pageNumber: 1, pageSize: 100 },
        });
      }

      const pageData = response.data?.data || {};
      const content: AccessMenuResponse[] = pageData.content || [];

      // 2. Terapkan Logika Pengurutan Prioritas di FE
      const sortedContent = [...content].sort((a, b) => {
        const indexA = SCREEN_ORDER.indexOf(a.menuName.toUpperCase());
        const indexB = SCREEN_ORDER.indexOf(b.menuName.toUpperCase());

        // Jika kedua menu ada dalam daftar urutan prioritas, urutkan berdasarkan index di daftar
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        // Dahulukan menu yang ada dalam daftar prioritas
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Jika menu tidak ada di daftar prioritas, urutkan secara alfabetis biasa
        return a.menuName.localeCompare(b.menuName);
      });

      setMenus(sortedContent);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data menu akses dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMenus(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getPermissionValue = (menu: AccessMenuResponse, action: string, roleId: number): boolean => {
    if (!menu.permissions) return false;

    const access = menu.permissions.find((ra) => Number(ra.roleId) === Number(roleId));
    if (!access) return false;

    switch (action) {
      case "View":
        return access.canView ?? false;
      case "Add":
        return access.canAdd ?? false;
      case "Edit":
        return access.canEdit ?? false;
      case "Delete":
        return access.canDelete ?? false;
      default:
        return false;
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[#2D2F35] text-3xl font-bold tracking-tight">
          Role Access Matrix
        </h1>
        <p className="text-[#707784] text-sm">
          Menampilkan matriks hak akses secara dinamis langsung dari database dengan urutan prioritas menu.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Cari layar atau menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-slate-200 focus-visible:ring-[#0076D2] h-11 text-base rounded-lg shadow-sm"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20 flex-col gap-3">
            <div className="w-8 h-8 border-4 border-t-transparent border-[#0076D2] rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Memuat matriks akses...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3 text-center">
            <ShieldAlert className="w-12 h-12 text-rose-500" />
            <p className="text-rose-600 font-semibold">{error}</p>
          </div>
        ) : menus.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            Tidak ada menu akses yang ditemukan.
          </div>
        ) : (
          /* Menggunakan overflow-auto dan membatasi tinggi maksimal agar scrollbar berada di dalam tabel card */
          <div className="overflow-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-left border-collapse">
              {/* Header tabel dibuat sticky dengan background solid */}
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-[inset_0_-1px_0_rgba(226,232,240,1)]">
                <tr className="border-b border-slate-200">   
                  <th className="px-6 py-4 text-sm font-semibold text-[#2D2F35] w-[20%]">Screen</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[#2D2F35] w-[15%]">Action</th>
                  {TARGET_ROLES.map((role) => (
                    <th key={role.id} className="px-6 py-4 text-sm font-semibold text-[#2D2F35] text-center">
                      {role.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menus.map((menu) => (
                  ACTIONS.map((action, actionIndex) => {
                    const isFirstAction = actionIndex === 0;

                    return (
                      <tr key={`${menu.menuId}-${action}`} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Kolom nama menu digabung vertikal dengan rowSpan=4 */}
                        {isFirstAction && (
                          <td
                            rowSpan={4}
                            className="px-6 py-4 text-base font-semibold text-[#2D2F35] bg-white border-r border-slate-100 align-top"
                          >
                            {/* Diubah menjadi top-16 agar posisinya pas di bawah header saat melayang */}
                            <span className="sticky top-16 block">
                              {menu.menuId}. {formatScreenName(menu.menuName)}
                            </span>
                          </td>
                        )}

                        {/* Nama Aksi */}
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                          {action}
                        </td>

                        {/* Rendering status nilai boolean dari database */}
                        {TARGET_ROLES.map((role) => {
                          const hasAccess = getPermissionValue(menu, action, role.id);

                          return (
                            <td key={role.id} className="px-6 py-3.5 text-center">
                              <div className="flex justify-center">
                                {hasAccess ? (
                                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    TRUE
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-100">
                                    <X className="w-3.5 h-3.5 stroke-[3]" />
                                    FALSE
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}