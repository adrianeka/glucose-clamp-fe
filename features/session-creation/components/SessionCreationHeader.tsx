"use client";

import { Plus, Search } from "lucide-react";

interface SessionCreationHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export default function SessionCreationHeader({
  search,
  onSearchChange,
  onAdd,
}: SessionCreationHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[32px] font-semibold text-[#212121]">
          Session Creation
        </h1>

        <p className="mt-1 text-sm text-[#707784]">
          Create, run, and monitor a glucose clamp session.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9ADB5]"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search"
            className="h-11 w-[280px] rounded-lg border border-[#E2E4E6] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#0076D2]"
          />
        </div>

        <button
          onClick={onAdd}
          className="flex h-11 items-center gap-2 rounded-lg bg-[#0076D2] px-5 text-sm font-medium text-white hover:bg-[#0067B8]"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}