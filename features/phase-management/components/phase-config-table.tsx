"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseConfig {
  id: string;
  priority: number;
  code: string;
  name: string;
  type: string;
}

const MOCK_DATA: PhaseConfig[] = [
  { id: "1", priority: 1, code: "PREP1", name: "Pemeriksaan Awal", type: "Preparation" },
  { id: "2", priority: 2, code: "PREP2", name: "Pra - Tindakan", type: "Preparation" },
  { id: "3", priority: 3, code: "BASE", name: "Baseline", type: "Pre-insulin" },
  { id: "4", priority: 4, code: "PH1", name: "Phase 1", type: "Post-insulin" },
  { id: "5", priority: 5, code: "PH2", name: "Phase 2", type: "Post-insulin" },
  { id: "6", priority: 6, code: "PH3", name: "Phase 3", type: "Post-insulin" },
  { id: "7", priority: 7, code: "FINAL", name: "Pemeriksaan Akhir", type: "Finalization" },
];

function CodeBadge({ code }: { code: string }) {
  return (
    <div className="px-2 py-0.5 bg-[#F1F9FA] rounded-full border border-[#C4EAEE] inline-flex items-center justify-center">
      <span className="text-[#0076D2] text-[11px] font-semibold tracking-wide">{code}</span>
    </div>
  );
}

export function PhaseConfigTable() {
  const [data, setData] = useState<PhaseConfig[]>(MOCK_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<PhaseConfig | null>(null);

  const startEdit = (item: PhaseConfig) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (editData) {
      setData((prev) => prev.map((p) => (p.id === editData.id ? editData : p)));
    }
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[#2D2F35] text-lg font-semibold leading-5">
          Active Phase Configurations
        </h2>
        <p className="text-[#707784] text-sm font-normal leading-5">
          The sequence of these phases determines the flow of automatic time calculation accumulation. Values can be edited directly in the table.
        </p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center w-full bg-[#F1F9FA] rounded-t-lg overflow-hidden border-b border-[#E2E4E6]">
          <div className="w-[80px] flex-shrink-0 h-14 px-4 py-2 flex items-center">
            <span className="text-[#0076D2] text-base font-semibold leading-[18px]">Priority</span>
          </div>
          <div className="w-[100px] flex-shrink-0 h-14 px-4 py-2 flex items-center">
            <span className="text-[#0076D2] text-base font-semibold leading-[18px]">Code</span>
          </div>
          <div className="flex-1 h-14 px-4 py-2 flex items-center">
            <span className="text-[#0076D2] text-base font-semibold leading-[18px]">Name</span>
          </div>
          <div className="w-[160px] flex-shrink-0 h-14 px-4 py-2 flex items-center">
            <span className="text-[#0076D2] text-base font-semibold leading-[18px]">Type</span>
          </div>
          <div className="w-[80px] flex-shrink-0 h-14 px-4 py-2 flex items-center justify-center">
            <span className="text-[#0076D2] text-base font-semibold leading-[18px]">Action</span>
          </div>
        </div>

        <div className="flex flex-col bg-[#FAFAFA] rounded-b-lg">
          {data.map((item, index) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center w-full min-h-[60px] py-1",
                  index !== data.length - 1 ? "border-b border-[#E2E4E6]" : ""
                )}
              >
                <div className="w-[80px] flex-shrink-0 px-4 py-2 flex items-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData?.priority ?? ""}
                      onChange={(e) => setEditData({ ...editData!, priority: Number(e.target.value) })}
                      className="w-[46px] h-8 px-2 bg-white border border-[#E2E4E6] rounded flex items-center justify-center text-[#2D2F35] text-sm focus:outline-none focus:ring-1 focus:ring-[#0076D2] text-center"
                    />
                  ) : (
                    <span className="text-[#43474F] text-sm font-normal leading-5">{item.priority}</span>
                  )}
                </div>
                
                <div className="w-[100px] flex-shrink-0 px-4 py-2 flex items-center">
                  <CodeBadge code={item.code} />
                </div>
                
                <div className="flex-1 px-4 py-2 flex items-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData?.name ?? ""}
                      onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                      className="w-full h-8 px-3 bg-white border border-[#E2E4E6] rounded flex items-center text-[#2D2F35] text-sm focus:outline-none focus:ring-1 focus:ring-[#0076D2]"
                    />
                  ) : (
                    <span className="text-[#43474F] text-sm font-normal leading-5">{item.name}</span>
                  )}
                </div>
                
                <div className="w-[160px] flex-shrink-0 px-4 py-2 flex items-center">
                  {isEditing ? (
                    <div className="relative w-full">
                      <select
                        value={editData?.type ?? ""}
                        onChange={(e) => setEditData({ ...editData!, type: e.target.value })}
                        className="w-full h-8 px-3 pr-8 bg-white border border-[#E2E4E6] rounded flex items-center text-[#2D2F35] text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#0076D2]"
                      >
                        <option value="Preparation">Preparation</option>
                        <option value="Pre-insulin">Pre-insulin</option>
                        <option value="Post-insulin">Post-insulin</option>
                        <option value="Finalization">Finalization</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707784] pointer-events-none" />
                    </div>
                  ) : (
                    <span className="text-[#43474F] text-sm font-normal leading-5">{item.type}</span>
                  )}
                </div>
                
                <div className="w-[80px] flex-shrink-0 px-4 py-2 flex items-center justify-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Save"
                      >
                        <Check size={18} className="text-[#52BD94]" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Cancel"
                      >
                        <X size={18} className="text-[#707784]" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Edit"
                      >
                        <Pencil size={18} className="text-[#FABA00]" />
                      </button>
                      <button
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Delete"
                      >
                        <Trash2 size={18} className="text-[#FF5630]" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
