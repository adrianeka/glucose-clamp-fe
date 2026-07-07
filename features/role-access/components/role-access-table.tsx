"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useRoleAccessList, useSaveRoleAccess } from "../hooks";
import { MatrixRow, ActionType } from "../types";
import { cn } from "@/lib/utils";
import { formatMenuName, formatRoleName, ROLE_SORT_ORDER } from "../constant";
import { usePermission } from "@/hooks/usePermission";

// Menggunakan Reusable Component Table yang tersedia di components/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RoleAccessTable() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");

  const { data: rawAccessList = [], isLoading, isError } = useRoleAccessList();
  const saveMutation = useSaveRoleAccess();

  const [updatingKeys, setUpdatingKeys] = useState<string[]>([]);
  const { canEdit: userCanEdit, canAdd: userCanAdd } = usePermission("ROLEACCESS");

  const rolesList = useMemo(() => {
    const uniqueRolesMap = new Map<string, number>();
    rawAccessList.forEach((item) => {
      if (
        item.roleName && 
        item.roleName.toLowerCase().replace(/\s/g, "") !== "superadmin"
      ) {
        uniqueRolesMap.set(item.roleName, item.roleId);
      }
    });

    return Array.from(uniqueRolesMap.entries())
      .map(([name, id]) => ({
        id,
        name,
        displayName: formatRoleName(name),
      }))
      .sort((a, b) => {
        const orderA = ROLE_SORT_ORDER[a.name.toLowerCase()] ?? 99;
        const orderB = ROLE_SORT_ORDER[b.name.toLowerCase()] ?? 99;
        return orderA - orderB;
      });
  }, [rawAccessList]);

  const matrixData = useMemo((): MatrixRow[] => {
    const menusMap = new Map<string, { id: number; name: string }>();
    rawAccessList.forEach((item) => {
      if (item.menuName) {
        menusMap.set(item.menuName, { id: item.menuId, name: item.menuName });
      }
    });

    const rows: MatrixRow[] = [];
    const actions: { key: ActionType; label: "View" | "Add" | "Edit" | "Delete" }[] = [
      { key: "canView", label: "View" },
      { key: "canAdd", label: "Add" },
      { key: "canEdit", label: "Edit" },
      { key: "canDelete", label: "Delete" },
    ];

    Array.from(menusMap.values()).forEach((menu) => {
      actions.forEach((act) => {
        const rowRoles: { [roleName: string]: { roleId: number; roleAccessId?: number; allowed: boolean } } = {};

        rolesList.forEach((role) => {
          const match = rawAccessList.find(
            (item) => item.menuId === menu.id && item.roleId === role.id
          );

          rowRoles[role.name] = {
            roleId: role.id,
            roleAccessId: match?.roleAccessId,
            allowed: match ? !!match[act.key] : false,
          };
        });

        rows.push({
          menuId: menu.id,
          menuName: menu.name,
          action: act.key,
          actionLabel: act.label,
          roles: rowRoles,
        });
      });
    });

    return rows;
  }, [rawAccessList, rolesList]);

  const filteredMatrix = useMemo(() => {
    return matrixData.filter((row) =>
      row.menuName.toLowerCase().includes(search.toLowerCase())
    );
  }, [matrixData, search]);

  const groupedScreens = useMemo(() => {
    const grouped: { [screenName: string]: MatrixRow[] } = {};
    filteredMatrix.forEach((row) => {
      if (!grouped[row.menuName]) {
        grouped[row.menuName] = [];
      }
      grouped[row.menuName].push(row);
    });
    return grouped;
  }, [filteredMatrix]);

  const handleToggle = async (
    menuId: number,
    roleId: number,
    action: ActionType,
    currentValue: boolean,
    roleAccessId?: number
  ) => {
    const stateKey = `${menuId}-${roleId}-${action}`;
    setUpdatingKeys((prev) => [...prev, stateKey]);

    const nextValue = !currentValue;

    let payload: any;
    if (roleAccessId) {
      payload = { [action]: nextValue };
    } else {
      payload = {
        roleId,
        menuId,
        canView: action === "canView" ? nextValue : false,
        canAdd: action === "canAdd" ? nextValue : false,
        canEdit: action === "canEdit" ? nextValue : false,
        canDelete: action === "canDelete" ? nextValue : false,
      };
    }

    saveMutation.mutate(
      {
        id: roleAccessId,
        payload,
      },
      {
        onSuccess: () => {
          showToast("Akses berhasil diperbarui");
        },
        onError: () => {
          showToast("Gagal memperbarui akses konfigurasi", "error");
        },
        onSettled: () => {
          setUpdatingKeys((prev) => prev.filter((k) => k !== stateKey));
        },
      }
    );
  };

  return (
    <div className="flex-1 self-stretch px-4 py-4 md:px-8 md:py-6 bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-4 md:gap-6 min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[#2D2F35] text-2xl md:text-[28px] font-bold leading-normal md:leading-[38px]">
          Role Access Matrix
        </h1>
        <p className="text-[#707784] text-xs md:text-sm font-normal leading-relaxed">
          Menampilkan matriks hak akses secara dinamis langsung dari database dengan urutan prioritas menu.
        </p>
      </div>

      <div className="relative w-full sm:w-[340px]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Cari layar atau menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#FAFAFA] border-gray-200 rounded-lg text-sm md:text-base placeholder:text-[#707784] h-10 md:h-11 focus-visible:ring-[#0076D2]"
        />
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto w-full scrollbar-thin">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC]">
                <TableHead className="px-4 py-3 md:px-6 md:py-4 text-[#0076D2] text-xs md:text-sm font-semibold w-[180px] md:w-[220px]">
                  Screen
                </TableHead>
                <TableHead className="px-4 py-3 md:px-6 md:py-4 text-[#0076D2] text-xs md:text-sm font-semibold w-[120px] md:w-[180px]">
                  Action
                </TableHead>
                {rolesList.map((role) => (
                  <TableHead
                    key={role.id}
                    className="px-4 py-3 md:px-6 md:py-4 text-[#0076D2] text-xs md:text-sm font-semibold text-center"
                  >
                    {role.displayName}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={rolesList.length + 2}
                    className="py-12 md:py-20 text-center text-[#707784] text-xs md:text-sm"
                  >
                    Memuat data matriks...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={rolesList.length + 2}
                    className="py-12 md:py-20 text-center text-red-500 text-xs md:text-sm"
                  >
                    Gagal memuat data matriks hak akses. Silakan coba lagi atau masuk kembali.
                  </TableCell>
                </TableRow>
              ) : Object.keys(groupedScreens).length > 0 ? (
                Object.entries(groupedScreens).map(([screenName, rows]) =>
                  rows.map((row, index) => (
                    <TableRow
                      key={`${screenName}-${row.action}`}
                      className="border-b border-gray-100 hover:bg-[#F9FBFC] transition-colors"
                    >
                      {index === 0 && (
                        <TableCell
                          rowSpan={rows.length}
                          className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-[#2D2F35] font-semibold align-top border-r border-gray-100"
                        >
                          {formatMenuName(screenName)}
                        </TableCell>
                      )}

                      {/* Action Name Column */}
                      <TableCell className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-[#43474F] font-medium border-r border-gray-100">
                        {row.actionLabel}
                      </TableCell>

                      {/* Roles Column */}
                      {rolesList.map((role) => {
                        const roleAccessData = row.roles[role.name];
                        const isAllowed = roleAccessData?.allowed ?? false;
                        const roleAccessId = roleAccessData?.roleAccessId;
                        
                        const stateKey = `${row.menuId}-${role.id}-${row.action}`;
                        const isUpdating = updatingKeys.includes(stateKey);

                        let isPermissionLocked = false;

                        if (!userCanEdit) {
                          isPermissionLocked = true;
                        } else if (!roleAccessId && !userCanAdd) {
                          isPermissionLocked = true;
                        }
                        
                        const isDisabled = isUpdating || saveMutation.isPending || isPermissionLocked;

                        return (
                          <TableCell key={role.id} className="px-4 py-3 md:px-6 md:py-4 text-center">
                            <div className="flex justify-center items-center">
                              <button
                                onClick={() => {
                                  handleToggle(
                                    row.menuId,
                                    role.id,
                                    row.action,
                                    isAllowed,
                                    roleAccessId
                                  );
                                }}
                                disabled={isDisabled}
                                className={cn(
                                  "relative inline-flex h-5 w-9 md:h-6 md:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                  isAllowed ? "bg-[#0076D2]" : "bg-[#E2E4E6]",
                                  isDisabled && "opacity-40 cursor-not-allowed"
                                )}
                              >
                                <span
                                  className={cn(
                                    "pointer-events-none inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                    isAllowed 
                                      ? "translate-x-4 md:translate-x-5" 
                                      : "translate-x-0"
                                  )}
                                />
                              </button>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={rolesList.length + 2}
                    className="py-12 md:py-20 text-center text-[#707784] text-xs md:text-sm"
                  >
                    Tidak ada data hak akses yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}