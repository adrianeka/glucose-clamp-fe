"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProtocolSamplingHeaderProps {
  search: string;
  setSearch: (search: string) => void;
  onAddProtocol: () => void;
}

export default function ProtocolSamplingHeader({
    search,
    setSearch,
    onAddProtocol
}: ProtocolSamplingHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[24px] font-bold text-[#212121]">
          Protocol & Sampling
        </h1>

        <p className="text-[#707784] mt-1">
          Manage, add, and update general participant information.
        </p>
      </div>

      <div className=" flex relative w-[320px] gap-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="pl-10 bg-[#FAFAFA] border-[#E2E4E6] focus:ring-0 focus:border-[#0076D2] h-10 rounded-lg"
        />
        <Button
            onClick={onAddProtocol}
            className="bg-[#0076D2] hover:bg-[#0076D2]/90 text-white gap-1 px-4 py-2 h-auto rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add
        </Button>
      </div>

    </div>
  );
}