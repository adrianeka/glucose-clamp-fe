"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-[346px]", className)}>
      <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2F35]" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-base placeholder:text-[#707784] h-10 focus-visible:ring-[#0076D2]"
      />
    </div>
  );
}