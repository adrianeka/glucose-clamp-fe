"use client";

import { Plus, Search } from "lucide-react";

interface SessionCreationHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  canAdd: boolean;
}

export default function SessionCreationHeader({
  search,
  onSearchChange,
  onAdd,
  canAdd
}: SessionCreationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between w-full">
      <div>
        <h1 className="text-2xl md:text-[32px] font-semibold text-[#212121] leading-tight">
          Session Creation
        </h1>

        <p className="mt-1 text-xs md:text-sm text-[#707784]">
          Create, run, and monitor a glucose clamp session.
        </p>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        
        <div className="relative flex-1 md:flex-initial">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9ADB5]"
          />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="h-11 w-full md:w-[280px] rounded-lg border border-[#E2E4E6] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#0076D2] transition-all"
          />
        </div>

        {canAdd && (
          <button
            onClick={onAdd}
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#0076D2] px-4 md:px-5 text-sm font-medium text-white hover:bg-[#0067B8] transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}