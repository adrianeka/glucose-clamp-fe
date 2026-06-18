"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { User, UserManagementResponse } from "../types/user";

interface Props {
  users: UserManagementResponse[];
  onEdit: (user: UserManagementResponse) => void;
  onView: (user: UserManagementResponse) => void;
  onDelete: (user: UserManagementResponse) => void;
}

export default function UserManagementTable({
  users,
  onEdit,
  onView,
  onDelete,
}: Props) {
  return (
    <Table>
      <TableHeader className="bg-[#ebf4ff] border-b border-[#E2E4E6]">
        <TableRow>
          <TableHead className="text-blue-500">Full Name</TableHead>
          <TableHead className="text-blue-500">Position</TableHead>
          <TableHead className="text-blue-500">Email</TableHead>
          <TableHead className="text-blue-500">Role</TableHead>
          <TableHead className="text-blue-500">Status</TableHead>
          <TableHead className="text-blue-500">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-[#FAFAFA]">
        {users.map((user) => (
          <TableRow key={user.userId} className="hover:bg-[#F5F5F5]">
            {/* <TableCell className="text-blue-500 font-medium">{user.userId}</TableCell> */}

            <TableCell className = "p-5">{user.name}</TableCell>

            <TableCell>{user.positionName}</TableCell>

            <TableCell>{user.email}</TableCell>

            <TableCell><Badge className="bg-blue-100 text-blue-800 border-blue-300">{user.roleName}</Badge></TableCell>

            <TableCell>
              <Badge
                variant="outline"
                className={
                  user.status === "ACTIVE"
                    ? "text-green-600 border-green-300"
                    : "text-red-600 border-red-300"
                }
              >
                {user.status}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex gap-3">
                <Eye className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => onView(user)} />

                <Pencil className="w-4 h-4 cursor-pointer text-amber-500" onClick={() => onEdit(user)}/>

                <Trash2 className="w-4 h-4 cursor-pointer text-red-500" onClick={() => onDelete(user)}/>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}