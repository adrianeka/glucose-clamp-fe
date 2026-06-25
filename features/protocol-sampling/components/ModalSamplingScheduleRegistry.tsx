"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useSamplingSchedules,
} from "@/features/protocol-sampling/hooks/SamplingScheduleHook";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Protocol } from "../types/Protocol";
import {
  useAddSamplingSchedule, useDeleteSamplingSchedule, useBulkUpdateSamplingSchedules
} from "@/features/protocol-sampling/hooks/SamplingScheduleHook";
import { useToast } from "@/components/ui/toast";
import ModalLoadingSkeleton from "@/components/ui/modal-loading-skeleton";
import { usePhaseConfigs } from "@/features/phase-management/hooks";

interface ModalSamplingScheduleProps {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
  protocol: Protocol | null;
}

export default function ModalSamplingSchedule({
  open,
  onOpenChange,
  protocol,
}: ModalSamplingScheduleProps) {
    const [phaseConfig, setPhaseConfig] =
    useState("");
    const [phaseDuration, setPhaseDuration] =
    useState("");
    const [interval, setInterval] =
    useState("");
    const [labelPrefix, setLabelPrefix] =
    useState("");

    const [showDiscardWarning, setShowDiscardWarning] = useState(false);
    const [showDeletePhase, setShowDeletePhase] = useState(false);
    const [selectedPhaseId, setSelectedPhaseId] = useState("");
    const addSamplingScheduleMutation = useAddSamplingSchedule();
    const deleteSamplingScheduleMutation = useDeleteSamplingSchedule();
    const bulkUpdateSamplingSchedulesMutation = useBulkUpdateSamplingSchedules();
    const [localSchedules, setLocalSchedules] = useState<any[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const {
      data: schedulesData,
      isLoading,
    } = useSamplingSchedules(
      protocol?.protocol_id,
      open
    );
    const {
      data: phaseConfigs = [],
      isLoading: phaseConfigLoading,
    } = usePhaseConfigs();

    const selectedPhase = useMemo(
      () =>
        phaseConfigs.find(
          (phase) => phase.code.toLowerCase() === phaseConfig.toLowerCase()
        ),
      [phaseConfig, phaseConfigs]
    );
    const { showToast } = useToast();

    const phaseDurationNumber = Number(phaseDuration);
    const intervalNumber = Number(interval);

    const isPhaseDurationValid = phaseDurationNumber >= intervalNumber;

    const isFormValid =
      phaseConfig.trim() !== "" &&
      phaseDuration !== "" &&
      interval.trim() !== "" &&
      labelPrefix.trim() !== "" &&
      isPhaseDurationValid;

    // Mendapatkan list object phase yang unik untuk ditampilkan di dropdown delete
    const uniquePhases = useMemo(() => {
      if (!schedulesData) return [];
      
      const seen = new Set();
      return schedulesData.filter((item) => {
        const duplicate = seen.has(item.phase_code);
        seen.add(item.phase_code);
        return !duplicate; // Hanya ambil yang belum pernah muncul
      });
    }, [schedulesData]);

    const handleAddSchedule =
        async () => {
            if (!protocol) return;
            const isBloodDraw = phaseConfig.toLowerCase() === "base" || phaseConfig.toLowerCase().startsWith("ph");

            try {
            await addSamplingScheduleMutation.mutateAsync(
                {
                protocol_id:protocol.protocol_id,
                phase_code: selectedPhase?.code ?? "",
                phase_name: selectedPhase?.name ?? "",
                phase_type: selectedPhase?.type ?? "",
                phase_duration: Number(phaseDuration),
                time_interval:Number(interval),
                label_prefix : labelPrefix,
                blood_raw: isBloodDraw,
                insulin_inject: false,
                pk_sample_collection:
                    false,
                }
            );

            setPhaseConfig("");
            setPhaseDuration("");
            setInterval("");
            setLabelPrefix("");
            showToast( "Add Sampling Schedule Successfully" );
            } catch (error:any) {
              showToast( error.message,"error" );
              console.error(error);
            }
        };


    const handleDeleteSchedule = async () => {
      if (!selectedPhaseId || !protocol) return;

      try {
        await deleteSamplingScheduleMutation.mutateAsync({
          protocolId: protocol.protocol_id,
          phaseCode: selectedPhaseId,
        });

        setSelectedPhaseId("");
        setShowDeletePhase(false);

        showToast(
          "Delete Sampling Schedule Successfully"
        );
      } catch (error: any) {
        showToast(
          error?.message ||
            "Failed to delete sampling schedule",
          "error"
        );

        console.error(error);
      }
    };

    const handleCheckboxLocalChange = (id: number, field: string, value: boolean) => {
        setLocalSchedules(prev => 
            prev.map(item => 
                item.sampling_schedule_id === id ? { ...item, [field]: value } : item
            )
        );
        setIsDirty(true);
    };

    const handleSaveAll = async () => {
      try {
        const payload = {
          items: localSchedules.map((s) => ({
            id: s.sampling_schedule_id,
            bloodRaw: s.blood_raw,
            insulinInject: s.insulin_inject,
            pkSampleCollection:
              s.pk_sample_collection,
          })),
        };

        await bulkUpdateSamplingSchedulesMutation.mutateAsync(
          payload
        );

        showToast(
          "Sampling schedule updated successfully"
        );

        setIsDirty(false);
      } catch (error: any) {
        showToast(
          error?.message || "Failed to update",
          "error"
        );
      }
    };

    const handleRequestClose = (open: boolean) => {
        // Jika mencoba menutup (open === false) dan ada perubahan (isDirty)
        if (!open && isDirty) {
          setShowDiscardWarning(true);
        } else {
          // Jika tidak ada perubahan atau sedang mencoba membuka, jalankan fungsi normal
          onOpenChange(open);
        }
      };

      const handleConfirmDiscard = () => {
        setIsDirty(false);
        setShowDiscardWarning(false);
        onOpenChange(false); // Tutup modal utama
      };

    // Tambahkan logic ini di bawah deklarasi state
    useEffect(() => {
      if (
        selectedPhase?.code?.toLowerCase() === "base"
      ) {
        setLabelPrefix("T");
      }
    }, [selectedPhase]);

    useEffect(() => {
      if (schedulesData) {
        setLocalSchedules(schedulesData);
      }
    }, [schedulesData]);

  return (
    <Dialog open={open} onOpenChange={handleRequestClose}>
      <DialogContent
        className="!w-[1450px] !max-w-[1450px] p-0 overflow-hidden bg-[#FAFAFA]"
    >
        <DialogTitle className="sr-only">
          Sampling Schedule
        </DialogTitle>

        <div className="flex flex-col max-h-[85vh]">
          {/* HEADER */}
          <div className="px-6 py-5 border-b shrink-0">
            <h2 className="text-xl font-semibold text-[#212121]">
              {protocol?.protocol_code} -{" "}
              {protocol?.protocol_name}
            </h2>

            <p className="text-xs text-[#707784] mt-1">
              Sampling Schedule Registry
            </p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
              {/* LEFT PANEL */}
              <div className="rounded-xl border bg-[#FFFFFF] p-4 h-fit">
                <h3 className="font-medium text-sm mb-4">
                  Input Sampling Schedule
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#707784]">
                      Phase Config *
                    </label>

                    <Select
                        value={phaseConfig}
                        onValueChange={setPhaseConfig}
                    >
                      <SelectTrigger className="w-full min-h-10 bg-[#FAFAFA]">
                        <SelectValue placeholder="Choose Phase" />
                      </SelectTrigger>

                      <SelectContent>
                        {phaseConfigs.map((phase) => (
                          <SelectItem
                            key={phase.id}
                            value={phase.code.toLowerCase()}
                          >
                            {phase.code} - {phase.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-[#707784]">
                      Phase Duration (minutes) *
                    </label>

                    <input
                      type="number"
                      value={phaseDuration}
                      onChange={(e) =>
                        setPhaseDuration(e.target.value)
                      }
                      className={`
                        w-full h-10 rounded-md px-3 bg-[#FAFAFA]
                        ${
                          phaseDuration &&
                          interval &&
                          Number(phaseDuration) < Number(interval)
                            ? "border border-red-500"
                            : "border border-[#E2E4E6]"
                        }
                      `}
                    />

                    {phaseDuration &&
                      interval &&
                      Number(phaseDuration) < Number(interval) && (
                        <p className="text-xs text-red-500 mt-1">
                            Phase Duration cannot be less than Interval.
                        </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-[#707784]">
                      Interval
                      (minutes) *
                    </label>

                    <Select
                        value={interval}
                        onValueChange={setInterval}
                    >
                      <SelectTrigger className="w-full min-h-10 bg-[#FAFAFA]" >
                        <SelectValue placeholder="Choose Interval" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="5">
                          5
                        </SelectItem>

                        <SelectItem value="10">
                          10
                        </SelectItem>

                        <SelectItem value="15">
                          15
                        </SelectItem>

                        <SelectItem value="20">
                          20
                        </SelectItem>

                        <SelectItem value="25">
                          25
                        </SelectItem>

                        <SelectItem value="30">
                          30
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-[#707784]">
                      Label Prefix *
                    </label>

                    <Select
                        value={labelPrefix}
                        onValueChange={setLabelPrefix}
                    >
                      <SelectTrigger className="w-full min-h-10 bg-[#FAFAFA]">
                        <SelectValue placeholder="Choose Prefix" />
                      </SelectTrigger>

                      <SelectContent>
                        {/* Jika phaseConfig adalah 'base', hanya tampilkan 'T' */}
                        {phaseConfig === "base" ? (
                          <SelectItem value="T">
                            T
                          </SelectItem>
                        ) : (
                          <>
                            <SelectItem value="GD">
                              GD
                            </SelectItem>

                            <SelectItem value="T">
                              T
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    disabled={
                        !isFormValid ||
                        addSamplingScheduleMutation.isPending
                    }
                    onClick={handleAddSchedule}
                    className={`
                        w-full min-h-10
                        ${
                        isFormValid
                            ? "bg-[#0076D2] hover:bg-[#0066B8]"
                            : "bg-[#D1D5DB]"
                        }
                    `}
                    >
                    <Plus className="w-4 h-4 mr-2" />

                    {addSamplingScheduleMutation.isPending
                        ? "Adding Schedule Row..."
                        : "Add Schedule Row"}
                    </Button>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="rounded-xl border bg-[#FFFFFF] p-4 min-w-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-medium text-sm">
                            Sampling Schedule Registry
                        </h3>

                        <p className="text-xs text-[#707784] mt-1">
                        Stakeholders can see the direct
                        relationship between the
                        schedule and the activities.
                        </p>
                    </div>

                    {/* DELETE BUTTON + POPUP */}
                    <div className="relative flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setShowDeletePhase(!showDeletePhase)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Phase
                          </Button>

                          <Button
                            disabled={
                              !isDirty ||
                              bulkUpdateSamplingSchedulesMutation.isPending
                            }
                            onClick={handleSaveAll}
                            className="bg-[#0076D2]"
                          >
                            {bulkUpdateSamplingSchedulesMutation.isPending
                              ? "Saving..."
                              : "Save"}
                          </Button>
                        </div>

                        {showDeletePhase && (
                        <div
                            className="
                            absolute
                            top-full
                            right-0
                            mt-2
                            z-50
                            w-[280px] max-w-[90vw]
                            rounded-xl
                            bg-white
                            border
                            shadow-lg
                            p-4
                            "
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[#707784]">
                                        Select Phase *
                                    </label>

                                    <Select
                                        value={selectedPhaseId}
                                        onValueChange={
                                            setSelectedPhaseId
                                        }
                                    >
                                        <SelectTrigger className="w-full mt-1 bg-[#FAFAFA]">
                                            <SelectValue placeholder="Select Phase" />
                                        </SelectTrigger>

                                        <SelectContent
                                            position="popper"
                                            side="bottom"
                                            align="start"
                                            sideOffset={4}
                                        >
                                            <div className="max-h-[220px] overflow-y-auto">
                                                {uniquePhases.map((phase) => (
                                                  <SelectItem
                                                    key={phase.phase_code}
                                                    value={String(phase.phase_code)}
                                                  >
                                                    {/* Sekarang phase adalah object, jadi .phase_code bisa diakses */}
                                                    {phase.phase_code}
                                                  </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                  disabled={
                                    !selectedPhaseId ||
                                    deleteSamplingScheduleMutation.isPending
                                  }
                                  onClick={handleDeleteSchedule}
                                  className={`
                                    w-full
                                    ${
                                      selectedPhaseId
                                        ? "bg-[#FF5A36] hover:bg-[#E64A28]"
                                        : "bg-[#D1D5DB]"
                                    }
                                  `}
                                >
                                  {deleteSamplingScheduleMutation.isPending
                                    ? "Deleting..."
                                    : "Delete Phase"}
                                </Button>
                              </div>
                            </div>
                            )}
                        </div>
                    </div>

                {isLoading ? (
                  <ModalLoadingSkeleton rows={10} />
                ) : (
                  <div className="border rounded-lg overflow-auto max-h-[60vh] bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                      <thead className="bg-[#F1F9FA] sticky top-0 z-10">
                        <tr className="text-[#0076D2]">
                          <th className="text-left px-4 py-3">
                            Phase
                          </th>

                          <th className="text-left px-4 py-3">
                            Code
                          </th>

                          <th className="text-left px-4 py-3">
                            Minute
                          </th>

                          <th className="text-center px-4 py-3">
                            Blood Draw
                          </th>

                          <th className="text-center px-4 py-3">
                            Insulin Inject
                          </th>

                          <th className="text-center px-4 py-3">
                            Insulin Check
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-[#FAFAFA] ">
                      {localSchedules?.length ? (
                        localSchedules.map(
                          (schedule) => (
                              <tr
                              key={schedule.sampling_schedule_id}
                              className="
                                  border-t border-[#E2E4E6]
                                  hover:bg-white
                                  hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                                  transition-all
                                  duration-200
                                  cursor-pointer
                              "
                              >
                              <td className="px-4 py-3 text-[#212121]">
                                  {schedule.phase_name}
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    px-2.5
                                    py-0.5
                                    rounded-full
                                    text-xs
                                    font-medium
                                    bg-[#E8F7EF]
                                    text-[#3BA272]
                                    border
                                    border-[#BFE6D0]
                                  "
                                >
                                  {schedule.schedule_code}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-[#212121]">
                                  {schedule.relative_minute}
                              </td>
                            <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={schedule.blood_raw}
                                  onChange={(e) =>
                                    handleCheckboxLocalChange(
                                      schedule.sampling_schedule_id,
                                      "blood_raw",
                                      e.target.checked
                                    )
                                  }
                                />
                            </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={schedule.insulin_inject}
                                  onChange={(e) =>
                                    handleCheckboxLocalChange(
                                      schedule.sampling_schedule_id,
                                      "insulin_inject",
                                      e.target.checked
                                    )
                                  }
                                />
                            </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={schedule.pk_sample_collection}
                                    onChange={(e) =>
                                      handleCheckboxLocalChange(
                                        schedule.sampling_schedule_id,
                                        "pk_sample_collection",
                                        e.target.checked
                                      )
                                    }
                                  />
                            </td>
                          </tr>
                          )
                          )
                      ) : (
                          <tr>
                              <td
                                  colSpan={6}
                                  className="
                                      h-[200px]
                                      text-center
                                      align-middle
                                      text-[#707784]
                                  "
                                  >
                                  No sampling schedule created yet
                              </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* MODAL PERINGATAN DISCARD CHANGES */}
      <Dialog open={showDiscardWarning} onOpenChange={setShowDiscardWarning}>
        <DialogContent className="max-w-[400px] p-8 text-center rounded-2xl">
          <DialogTitle className="sr-only">
            Waarning pop up change
          </DialogTitle>
          <div className="flex flex-col items-center justify-center">
            {/* Icon Warning Kuning */}
            <div className="mb-4">
              <div className="rounded-full bg-amber-50 p-3">
                <svg
                  className="w-12 h-12 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Unsaved Changes</h2>
            <p className="text-sm text-gray-500 mb-8">
              You have unsaved changes. If you leave now, your changes will be lost.
            </p>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-cyan-50 border-none text-cyan-700 hover:bg-cyan-100 font-semibold h-12"
                onClick={() => setShowDiscardWarning(false)}
              >
                Continue Editing
              </Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold h-12"
                onClick={handleConfirmDiscard}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}