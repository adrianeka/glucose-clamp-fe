"use client";

import { usePermission } from "@/hooks/usePermission";
import { ReactNode } from "react";

interface PermissionGateProps {
  menu: string;
  action: "canAdd" | "canEdit" | "canDelete" | "canView";
  children: ReactNode;
  fallback?: ReactNode; // Tampilan alternatif jika tidak punya akses (opsional)
}

export function PermissionGate({ menu, action, children, fallback = null }: PermissionGateProps) {
  const permissions = usePermission(menu);
  const hasAccess = permissions[action];

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}