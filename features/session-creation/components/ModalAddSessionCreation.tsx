"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParticipants } from "@/features/participant-management/hook";
import { useProtocolsDropdown } from "@/features/protocol-sampling/hooks/ProtocolSamplingHook";

interface ModalAddSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean; // Tambahkan prop isLoading
}

export default function ModalAddSession({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ModalAddSessionProps) {
  const { data: participants } = useParticipants();
  const { data: protocolsData, isLoading: isLoadingProtocols } = useProtocolsDropdown();
  
  const [form, setForm] = useState({
    participantId: "",
    protocolId: "",
    visitDate: "",
    startTime: "",
    fastingHour: "",
  });

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      startTime: `${hour}:${minute}`,
    }));
  }, [hour, minute]);

  const isFormReady =
    form.participantId &&
    form.protocolId &&
    form.visitDate &&
    form.startTime &&
    form.fastingHour && 
    !isLoading;

  const handleSubmit = () => {
    const payload = {
      participantId: form.participantId,
      protocolId: Number(form.protocolId),
      visitDate: form.visitDate,
      startTime: `${form.visitDate}T${form.startTime}:00`,
      fastingHour: Number(form.fastingHour),
    };

    console.log("Payload yang dikirim:", payload);

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[32px] font-semibold text-[#212121]">
            Add Session
          </DialogTitle>
          <DialogDescription className="text-[#707784]">
            Follow the guided steps to complete the session data.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t mt-4" />

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Participant Select */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Participant <span className="text-[#FF5B5B]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.participantId}
                  onChange={(e) => setForm({ ...form, participantId: e.target.value })}
                  className="w-full h-11 rounded-lg border border-[#E2E4E6] px-3 appearance-none bg-white"
                >
                  <option value="">Select Participant</option>
                  {participants?.data?.content?.map((participant: any) => (
                    <option key={participant.participantId} value={participant.participantId}>
                      {participant.participantId} - {participant.name || "No Name"}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707784] pointer-events-none" />
              </div>
            </div>

            {/* Protocol Select */}
            <div>
              <label className="text-sm font-medium text-[#707784]">
                Protocol <span className="text-[#FF5B5B]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.protocolId}
                  onChange={(e) => setForm({ ...form, protocolId: e.target.value })}
                  className="w-full h-11 rounded-lg border border-[#E2E4E6] px-3 appearance-none bg-white text-sm"
                  disabled={isLoadingProtocols}
                >
                  <option value="">
                    {isLoadingProtocols ? "Loading..." : "Select Protocol"}
                  </option>
                  
                  {/* Perhatikan: protocolsData.content karena hasil dari useProtocols biasanya paginated object */}
                  {protocolsData?.map((protocol: any) => (
                    <option key={protocol.protocolId} value={protocol.protocolId}>
                      {protocol.protocolCode} | {protocol.protocolName}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707784] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#43474F]">
                Visit Date <span className="text-[#FF5B5B]">*</span>
              </label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707784]" />
                <Input
                  type="date"
                  className="pl-10"
                  value={form.visitDate}
                  onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#707784]">
                Start Time <span className="text-[#FF5B5B]">*</span>
              </label>

              <div className="relative">
                <Clock3
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707784] pointer-events-none"
                />

                <Input
                  type="time"
                  lang="en-GB"
                  step="60"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startTime: e.target.value,
                    })
                  }
                  className="
                    h-11
                    pl-10
                    text-sm
                    border-[#E2E4E6]
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                  "
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#43474F]">
              Fasting Hour <span className="text-[#FF5B5B]">*</span>
            </label>
            <Input
              type="number"
              min={0}
              placeholder="8"
              value={form.fastingHour}
              onChange={(e) => setForm({ ...form, fastingHour: e.target.value })}
            />
          </div>
        </div>

        <div className="border-t px-6 py-5 flex justify-end gap-3">
          <Button
            variant="outline"
            className="bg-[#DBF2F3] border-none text-[#0076D2] hover:bg-[#D0EEF0]"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            className="bg-[#0076D2] hover:bg-[#0067B8] text-white min-w-[90px] disabled:bg-[#A9ADB5]"
            disabled={!isFormReady}
            onClick={handleSubmit}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}