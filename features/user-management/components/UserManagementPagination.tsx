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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const current = currentPage + 1;

    pages.push(1, 2);

    if (current > 4) {
      pages.push("...");
    }

    const start = Math.max(3, current - 1);
    const end = Math.min(totalPages - 2, current + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (current < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages - 1, totalPages);

    return [...new Set(pages)];
  };

  return (
    <div className="flex items-center justify-between border-t pt-4">
      {/* LEFT */}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">

        <Select
          value={String(pageSize)}
          onValueChange={(value) =>
            onPageSizeChange(
              Number(value)
            )
          }
        >
          <SelectTrigger className="w-[120px] h-9 font-bold">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="10">
              10 Entries
            </SelectItem>

            <SelectItem value="25">
              25 Entries
            </SelectItem>

            <SelectItem value="50">
              50 Entries
            </SelectItem>

          </SelectContent>
        </Select>

        <span>
           of{" "}
          {totalElements} Entries
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

        <div className="flex items-center gap-1">
          {getPageNumbers().map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="w-9 text-center text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(Number(item) - 1)}
                className={`h-9 w-9 rounded-md text-sm transition-colors ${
                  currentPage + 1 === item
                    ? "bg-cyan-100 text-cyan-700 font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {item}
              </button>
            )
          )}
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