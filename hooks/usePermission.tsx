"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getMyPermissions } from "@/features/auth/services";

interface Permission {
  menuName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface PermissionContextType {
  permissions: Permission[];
  getMenuPermission: (menuName: string) => {
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const syncLatestPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const latestPermissions = await getMyPermissions();
        localStorage.setItem("permissions", JSON.stringify(latestPermissions));
        setPermissions(latestPermissions);
      }
    } catch (e) {
      console.error("Gagal sinkronisasi permission terbaru di provider:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rawPermissions = localStorage.getItem("permissions");
    if (rawPermissions) {
      try {
        setPermissions(JSON.parse(rawPermissions));
      } catch (e) {
        console.error("Gagal membaca permissions lokal:", e);
      }
    }

    syncLatestPermissions();
  }, [pathname]);

  const getMenuPermission = (menuName: string) => {
    const target = menuName.toUpperCase().trim();
    const perm = permissions.find((p) => p.menuName?.toUpperCase().trim() === target);
    
    return {
      canView: !!perm?.canView,
      canAdd: !!perm?.canAdd,
      canEdit: !!perm?.canEdit,
      canDelete: !!perm?.canDelete,
    };
  };

  return (
    <PermissionContext.Provider value={{ permissions, getMenuPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
}

// Overload Tipe Data Hook
export function usePermission(menuName: string): {
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
};
export function usePermission(): {
  getMenuPermission: (menuName: string) => {
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  isLoading: boolean;
};

export function usePermission(menuName?: string) {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission harus digunakan di dalam PermissionProvider");
  }

  if (menuName) {
    return context.getMenuPermission(menuName);
  }

  return {
    getMenuPermission: context.getMenuPermission,
    isLoading: context.isLoading,
  };
}