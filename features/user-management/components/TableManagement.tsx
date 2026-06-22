"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";

import UserManagementHeader from "./UserManagementHeader";
import UserManagementTable from "./UserManagementTable";
import { TablePagination } from "@/components/ui/table-pagination";

import ModalAddUser from "./ModalAddUser";
import ModalEditUser from "./ModalEditUser";
import ModalViewUser from "./ModalViewUser";
import ModalDeleteUser from "./ModalDeleteUser";

import { toast } from "sonner";

import { useUsers } from "@/features/user-management/hooks/UserManagementHook";
import { UserManagementResponse } from "../types/user";
import { deleteUserById } from "@/features/user-management/services/UserManagementService";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

export default function TableManagement() {
  const [search, setSearch] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [keyword] = useDebounce(search, 500);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementResponse | null>(null);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

    const openDeleteUser = (
        user: UserManagementResponse
    ) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

  const handleEditUser = (user: UserManagementResponse) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleViewUser = (user: UserManagementResponse) => {
    setSelectedUser(user);
    setIsViewUserModalOpen(true);
  };

  const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            await deleteUserById(selectedUser.userId);

            toast.success(
            "User deleted successfully"
            );

            setIsDeleteOpen(false);
        } catch {
            toast.error(
            "Failed to delete user"
            );
        }
    };

  const { data, isLoading, isError } = useUsers({
    keyword,
    pageNumber,
    pageSize,
  });

  const totalElements = data?.data?.totalElements ?? 0;

  const users = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;


  if (isLoading) {
    return (
      <TableSkeleton
        rows={6}
        columns={6}
      />
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-3xl p-6 text-red-500">
        Failed to load users
      </div>
    );
  }

  return (
    <>
        <div className="bg-white rounded-3xl p-6 space-y-6">
          <UserManagementHeader 
              search={search}
              setSearch={(value) => {
                  setSearch(value);
                  setPageNumber(1);
              }} 
              onAddUser={() => setIsAddUserModalOpen(true)}
          />

          <div className="border rounded-lg">
              <UserManagementTable
                  users={users}
                  onEdit={handleEditUser}
                  onView={handleViewUser}
                  onDelete={openDeleteUser}
              />
          </div>

          <TablePagination
            currentPage={pageNumber + 1}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={(page) => {
              setPageNumber(page - 1);
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(0);
            }}
            disabled={isLoading}
          />
        </div>
        <ModalAddUser
            open={isAddUserModalOpen}
            onOpenChange={setIsAddUserModalOpen}
        />

        {selectedUser && (
            <ModalEditUser
                open={isEditUserModalOpen}
                onOpenChange={setIsEditUserModalOpen}
                data={selectedUser}
            />
        )}

        {selectedUser && (
            <ModalViewUser
                open={isViewUserModalOpen}
                onOpenChange={setIsViewUserModalOpen}
                data={selectedUser}
            />
        )}

        <ModalDeleteUser
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            userName={selectedUser?.name ?? ""}
            onConfirm={handleDeleteUser}
        />
    </>
  );
}