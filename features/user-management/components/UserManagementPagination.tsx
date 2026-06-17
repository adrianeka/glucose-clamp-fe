"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserManagementPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (
    size: number
  ) => void;
}

export default function UserManagementPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UserManagementPaginationProps) {
  const page = currentPage + 1;

  const start =
    totalElements === 0
      ? 0
      : currentPage * pageSize + 1;

  const end = Math.min(
    (currentPage + 1) * pageSize,
    totalElements
  );

  return (
    <div className="flex items-center justify-between border-t pt-4">
      {/* LEFT */}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>

        <Select
          value={String(pageSize)}
          onValueChange={(value) =>
            onPageSizeChange(
              Number(value)
            )
          }
        >
          <SelectTrigger className="w-[80px] h-9">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="10">
              10
            </SelectItem>

            <SelectItem value="25">
              25
            </SelectItem>

            <SelectItem value="50">
              50
            </SelectItem>

          </SelectContent>
        </Select>

        <span>
          entries ({start}-{end} of{" "}
          {totalElements})
        </span>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-1">
        <button
          className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          disabled={currentPage === 0}
          onClick={() => onPageChange(0)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          disabled={currentPage === 0}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="px-4 text-sm font-medium">
          Page {page} of {totalPages}
        </div>

        <button
          className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          disabled={
            currentPage >=
            totalPages - 1
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          disabled={
            currentPage >=
            totalPages - 1
          }
          onClick={() =>
            onPageChange(totalPages - 1)
          }
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}