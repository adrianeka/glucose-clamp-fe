"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import ActivitiesHeader from "@/features/session-creation/components/ActivitiesHeader";
import ActivitiesTable from "@/features/session-creation/components/ActvitiesTable";
import ModalAddActivity from "@/features/session-creation/components/ModalAddActivity";

import { useSessionDetail } from "@/features/session-creation/hooks/SessionCreationHook";
import { useCreateActivity } from "@/features/session-creation/hooks/ActvityHook";
import ModalEditActivity from "@/features/session-creation/components/ModalEditActivity";
import ModalDeleteConfirm from "@/features/session-creation/components/ModalDeleteConfirmActivity";
import { useUpdateActivity, useDeleteActivity } from "@/features/session-creation/hooks/ActvityHook";
import { formatMinutesToHHMMSS } from "@/lib/time";

import { useToast } from "@/components/ui/toast";
interface SessionActivitiesPageProps{
    sessionId: number;
    sessionData: any;
}

export default function SessionActivitiesPage({sessionId, sessionData}:SessionActivitiesPageProps) {
  const { showToast } = useToast();

  const [
    openAddActivity,
    setOpenAddActivity,
  ] = useState(false);

  const createActivityMutation = useCreateActivity(sessionId);

  const updateMutation = useUpdateActivity(sessionId);
  const deleteMutation = useDeleteActivity(sessionId);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

  const lastActivity = sessionData?.activities?.[sessionData.activities.length - 1];
  const totalDurationMinutes = lastActivity?.minute || 0;

  const displayTime = formatMinutesToHHMMSS(totalDurationMinutes);

  // Handle Action dari Table
  const onEditTrigger = (activity: any) => {
    setSelectedActivity(activity);
    setOpenEdit(true);
  };

  const onDeleteTrigger = (id: number) => {
    setTargetDeleteId(id);
    setOpenDelete(true);
  };

  const handleUpdate = async (formData: any) => {
    try {
      await updateMutation.mutateAsync({
        id: selectedActivity.activityId,
        payload: { sessionId, ...formData }
      });
      setOpenEdit(false);
      showToast("Activity updated successfully");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleDelete = async () => {
    if (!targetDeleteId) return;
    try {
      await deleteMutation.mutateAsync(targetDeleteId);
      setOpenDelete(false);
      showToast("Activity deleted successfully");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleAddActivity = async (
    formData: any
  ) => {
    try {
      await createActivityMutation.mutateAsync({
        sessionId,
        phaseCode: formData.phaseCode,
        phaseName: formData.phaseName,
        startTime: formData.startTime,
        activityType:
          formData.activityType,
        activityDesc:
          formData.activityDesc,
        activityStatus: "INQUEUE"
      });

      setOpenAddActivity(false);
      showToast("added activity successfully");
    } catch (error:any) {
      showToast(error.message, "error");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-screen overflow-hidden">
      <ActivitiesHeader
        sessionId={sessionData?.sessionId}
        participant={sessionData?.participantName}
        protocol={sessionData?.protocolName}
        visitDate={sessionData?.visitDate}
        statusSession = {sessionData?.sessionStatus}
        displayTime={displayTime}
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E2E4E6] flex flex-col overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#212121]">Session Activities</h2>
            <p className="text-sm text-[#707784]">Activities based on the selected protocol.</p>
          </div>

          {sessionData?.sessionStatus !== "COMPLETED" && (
            <button
              onClick={() => setOpenAddActivity(true)}
              className="rounded-lg bg-white border border-[#0076D2] px-4 py-2 text-[#0076D2] hover:bg-[#F1F9FA] font-medium transition-colors"
            >
              Add Custom Activity
            </button>
          )}
        </div>

        {/* Tabel tanpa pagination, scroll internal */}
        <ActivitiesTable
          data={sessionData?.activities ?? []}
          onEdit={onEditTrigger}
          onDelete={onDeleteTrigger}
        />
      </div>

      <ModalAddActivity
        open={openAddActivity}
        onOpenChange={setOpenAddActivity}
        sessionId={sessionId}
        onSubmit={handleAddActivity}
      />

      <ModalEditActivity
        open={openEdit}
        onOpenChange={setOpenEdit}
        activity={selectedActivity}
        onSubmit={handleUpdate}
        isLoadingSubmit={updateMutation.isPending}
      />

      <ModalDeleteConfirm
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}