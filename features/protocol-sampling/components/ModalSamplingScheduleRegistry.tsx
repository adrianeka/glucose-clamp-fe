"use client";
import { useState } from "react";
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
  useAddSamplingSchedule, useDeleteSamplingSchedule
} from "@/features/protocol-sampling/hooks/SamplingScheduleHook";
import { useToast } from "@/components/ui/toast";
import ModalLoadingSkeleton from "@/components/ui/modal-loading-skeleton";

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
    const isFormValid =
        phaseConfig.trim() !== "" &&
        phaseDuration !== "" &&
        interval.trim() !== "" &&
        labelPrefix.trim() !== "";

    const [showDeletePhase, setShowDeletePhase] = useState(false);
    const [selectedPhaseId, setSelectedPhaseId] = useState("");
    const addSamplingScheduleMutation = useAddSamplingSchedule();
    const deleteSamplingScheduleMutation = useDeleteSamplingSchedule();
    const {
      data: schedulesData,
      isLoading,
    } = useSamplingSchedules(
      protocol?.protocol_id,
      open
    );
    const { showToast } = useToast();

    const handleAddSchedule =
        async () => {
            if (!protocol) return;

            try {
            await addSamplingScheduleMutation.mutateAsync(
                {
                protocol_id:
                    protocol.protocol_id,

                phase_code:
                    phaseConfig,

                phase_name:
                    phaseConfig,

                phase_type:
                    phaseConfig,

                time_interval:
                    Number(interval),

                blood_raw: false,

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
      if (!selectedPhaseId) return;

      try {
        await deleteSamplingScheduleMutation.mutateAsync(
          Number(selectedPhaseId)
        );

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


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
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
                        <SelectItem value="prep1">
                          PREP 1 -
                          Preparation
                        </SelectItem>

                        <SelectItem value="prep2">
                          PREP 2 -
                          Preparation
                        </SelectItem>

                        <SelectItem value="base">
                          BASE -
                          Pre-Insulin
                        </SelectItem>

                        <SelectItem value="ph1">
                          PH1 -
                          Post-Insulin
                        </SelectItem>

                        <SelectItem value="ph2">
                          PH2 -
                          Post-Insulin
                        </SelectItem>

                        <SelectItem value="ph3">
                          PH3 -
                          Post-Insulin
                        </SelectItem>

                        <SelectItem value="final">
                          FINAL -
                          Finalization
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-[#707784]">
                      Phase Duration
                      (minutes) *
                    </label>

                    <input
                        type="number"
                        value={phaseDuration}
                        onChange={(e) =>
                            setPhaseDuration(e.target.value)
                        }
                        className="w-full h-10 rounded-md border border-[#E2E4E6] px-3 bg-[#FAFAFA]"
                    />
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
                        <SelectItem value="gd">
                          GD
                        </SelectItem>

                        <SelectItem value="t">
                          T
                        </SelectItem>
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
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setShowDeletePhase(
                            !showDeletePhase
                            )
                        }
                        >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Phase
                        </Button>

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
                                                {schedulesData?.map(
                                                  (schedule) => (
                                                    <SelectItem
                                                      key={schedule.sampling_schedule_id}
                                                      value={String(schedule.sampling_schedule_id)}
                                                    >
                                                      {`${schedule.phase_code}-${schedule.sampling_schedule_id}`}
                                                    </SelectItem>
                                                  )
                                                )}
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
                      {schedulesData?.length ? (
                        schedulesData.map(
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
                                  {schedule.phase_code}
                              </td>

                              <td className="px-4 py-3 text-[#212121]">
                                  {schedule.sampling_schedule_id}
                              </td>

                              <td className="px-4 py-3 text-[#212121]">
                                  {schedule.relative_minute}
                              </td>

                              <td className="px-4 py-3 text-center">
                                  <input
                                  type="checkbox"
                                  checked={schedule.blood_raw}
                                  readOnly
                                  />
                              </td>

                              <td className="px-4 py-3 text-center">
                                  <input
                                  type="checkbox"
                                  checked={schedule.insulin_inject}
                                  readOnly
                                  />
                              </td>

                              <td className="px-4 py-3 text-center">
                                  <input
                                  type="checkbox"
                                  checked={schedule.pk_sample_collection}
                                  readOnly
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
    </Dialog>
  );
}