"use client";

import { RoleAccessTable } from "@/features/role-access/components/role-access-table";

export default function RoleAccessPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-stretch">
      <RoleAccessTable />
    </div>
  );
}