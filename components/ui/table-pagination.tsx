"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  disabled = false,
}: TablePaginationProps) {
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown ketika pengguna mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSizeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page: number) => {
    if (disabled) return;
    onPageChange(page);
  };

  // Logika Render Halaman dengan Ellipsis (...)
  const renderPageButtons = () => {
    const pages: React.ReactNode[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const isActive = currentPage === pageNum;

      // Aturan penampilan nomor halaman:
      // Tampilkan halaman jika total halaman <= 5, atau merupakan halaman pertama/terakhir,
      // atau jaraknya dekat dengan halaman aktif saat ini (+/- 1)
      if (
        totalPages <= 5 ||
        pageNum === 1 ||
        pageNum === totalPages ||
        Math.abs(currentPage - pageNum) <= 1
      ) {
        pages.push(
          <button
            key={pageNum}
            disabled={disabled}
            onClick={() => handlePageChange(pageNum)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors",
              isActive
                ? "bg-[#DBF2F3] text-[#0076D2]" // Menggunakan warna highlight participant
                : "text-[#707784] hover:bg-gray-100 disabled:opacity-40"
            )}
          >
            {pageNum}
          </button>
        );
      } else if (pageNum === 2 || pageNum === totalPages - 1) {
        // Render ellipsis (...) sebagai placeholder jeda halaman
        pages.push(
          <span
            key={`ellipsis-${pageNum}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-[#707784] select-none"
          >
            ...
          </span>
        );
      }
    }

    return pages;
  };

  if (totalElements === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white py-2">
      {/* Kiri: Pilihan Page Size (Desain Participant Figma) */}
      <div className="flex items-center gap-2 relative" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setSizeDropdownOpen((prev) => !prev)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 border border-[#E2E4E6] rounded-lg text-[#43474F] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          )}
        >
          {pageSize} Entries
          <ChevronDown size={14} className="text-[#707784]" />
        </button>

        {sizeDropdownOpen && !disabled && (
          <div className="absolute bottom-full mb-1 left-0 bg-white border border-[#E2E4E6] rounded-lg shadow-lg py-1 w-32 z-10">
            {pageSizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  onPageSizeChange(size);
                  setSizeDropdownOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm text-[#43474F] hover:bg-gray-50 transition-colors",
                  pageSize === size && "bg-gray-50 font-semibold text-[#0076D2]"
                )}
              >
                {size} Entries
              </button>
            ))}
          </div>
        )}
        <span className="text-[#707784] text-sm">of {totalElements} entries</span>
      </div>

      {/* Kanan: Navigasi Nomor Halaman */}
      <div className="flex items-center gap-1">
        {/* Tombol Sebelumnya (Prev) */}
        <button
          type="button"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || disabled}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
          aria-label="Previous Page"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path
              d="M5 9L1 5L5 1"
              stroke="#707784"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Daftar Nomor Halaman */}
        {renderPageButtons()}

        {/* Tombol Selanjutnya (Next) */}
        <button
          type="button"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || disabled}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
          aria-label="Next Page"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path
              d="M1 9L5 5L1 1"
              stroke="#707784"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}