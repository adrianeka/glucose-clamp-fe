"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  participantId: string;
  medicalRecord: string;
  fullName: string;
  gender: "Male" | "Female" | "";
  dob: string;
  phone: string;
}

type StepState = "active" | "done" | "idle";

function StepIndicator({
  number,
  label,
  sublabel,
  state,
}: {
  number: number;
  label: string;
  sublabel: string;
  state: StepState;
}) {
  const circleClass =
    state === "active"
      ? "bg-[#0076D2] text-[#FAFAFA]"
      : state === "done"
      ? "bg-[#52BD94] text-[#FAFAFA]"
      : "border-[1.5px] border-[#C6C8CE] text-[#C6C8CE]";

  const labelColor =
    state === "active"
      ? "text-[#0076D2]"
      : state === "done"
      ? "text-[#52BD94]"
      : "text-[#707784]";

  const sublabelColor =
    state === "active"
      ? "text-[#19A5F2]"
      : state === "done"
      ? "text-[#75CAA9]"
      : "text-[#8C929D]";

  return (
    <div className="w-[153px] flex flex-col items-center gap-1">
      <div
        className={cn(
          "w-[45px] h-[45px] rounded-full flex items-center justify-center text-base font-semibold leading-[18px]",
          circleClass
        )}
      >
        {number}
      </div>
      <span className={cn("text-base font-medium leading-[18px]", labelColor)}>
        {label}
      </span>
      <span className={cn("text-sm text-center font-normal leading-5", sublabelColor)}>
        {sublabel}
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-0.5">
      <Label className="text-[#707784] text-sm font-medium leading-4">
        {children}
      </Label>
      <span className="w-[5.51px] h-[5.73px] bg-[#E84E2C] mt-0.5 shrink-0" />
    </div>
  );
}

// Step 1: Demographics Form

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (d: Partial<FormData>) => void;
}) {
  return (
    <div className="self-stretch px-8 py-6 bg-white shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[#2D2F35] text-lg font-semibold leading-5">
          Personal Data
        </h2>
        <p className="text-[#707784] text-sm font-normal leading-5">
          Enter the participant's personal information.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-[11px]">
          <FieldLabel>ID Participant</FieldLabel>
          <Input
            value={data.participantId}
            onChange={(e) => onChange({ participantId: e.target.value })}
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="e.g. PAT007"
          />
        </div>
        <div className="flex-1 flex flex-col gap-[11px]">
          <FieldLabel>Medical Record</FieldLabel>
          <Input
            value={data.medicalRecord}
            onChange={(e) => onChange({ medicalRecord: e.target.value })}
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="e.g. MR889106"
          />
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 flex flex-col gap-[11px]">
          <FieldLabel>Full Name</FieldLabel>
          <Input
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] focus-visible:ring-[#0076D2]"
            placeholder="e.g. Adrian Saputra"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between gap-[11px]">
          <FieldLabel>Gender</FieldLabel>
          <div className="flex gap-6">
            {(["Male", "Female"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ gender: g })}
                className={cn(
                  "flex-1 h-12 px-3 bg-[#FAFAFA] rounded-md border flex items-center gap-4 transition-colors",
                  data.gender === g
                    ? "border-[#0076D2]"
                    : "border-[#E2E4E6] hover:border-[#A9ADB5]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                    data.gender === g
                      ? "border-[#0076D2]"
                      : "border-[#C6C8CE]"
                  )}
                >
                  {data.gender === g && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0076D2]" />
                  )}
                </div>
                <span className="text-[#2D2F35] text-base font-medium leading-[18px]">
                  {g}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-[11px]">
          <FieldLabel>Date of Birth</FieldLabel>
          <div className="relative">
            <CalendarDays
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2F35] pointer-events-none"
            />
            <Input
              type="date"
              value={data.dob}
              onChange={(e) => onChange({ dob: e.target.value })}
              className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] pl-11 focus-visible:ring-[#0076D2]"
              placeholder="yyyy-mm-dd"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[11px]">
          <FieldLabel>Phone Number</FieldLabel>
          <div className="relative">
            <Phone
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2F35] pointer-events-none"
            />
            <Input
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="bg-[#FAFAFA] border-[#E2E4E6] rounded-md text-[#2D2F35] text-base font-normal leading-6 h-[42px] pl-11 focus-visible:ring-[#0076D2]"
              placeholder="e.g. 081234567890"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Review

function ReviewRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="self-stretch flex justify-between items-center">
      <span className="text-[#595F6A] text-sm font-normal leading-4">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium leading-5",
          valueClass ?? "text-[#2D2F35]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Step2({ data }: { data: FormData }) {
  return (
    <div className="self-stretch px-8 py-6 bg-white shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[#2D2F35] text-lg font-semibold leading-5">
          Review &amp; Confirm
        </h2>
        <p className="text-[#707784] text-sm font-normal leading-5">
          Please review all information before registering the participant.
        </p>
      </div>

      <div className="flex gap-[14px]">
        <div className="flex-1 p-5 bg-[#FAFAFA] rounded-xl flex flex-col gap-3">
          <span className="text-[#43474F] text-base font-medium leading-[18px]">
            Medical Identity
          </span>
          <ReviewRow
            label="Participant ID"
            value={data.participantId}
            valueClass="text-[#0076D2]"
          />
          <ReviewRow label="Medical Record No." value={data.medicalRecord} />
        </div>

        <div className="flex-1 p-5 bg-[#FAFAFA] rounded-xl flex flex-col gap-3">
          <span className="text-[#43474F] text-base font-medium leading-[18px]">
            Personal Data
          </span>
          <ReviewRow label="Full Name" value={data.fullName} />
          <ReviewRow label="Gender" value={data.gender} />
          <ReviewRow label="Date of Birth" value={data.dob} />
          <ReviewRow label="Phone Number" value={data.phone} />
        </div>
      </div>
    </div>
  );
}

// Main Component

export function AddParticipantForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormData>({
    participantId: "",
    medicalRecord: "",
    fullName: "",
    gender: "",
    dob: "",
    phone: "",
  });

  const isComplete =
    form.participantId.trim() !== "" &&
    form.medicalRecord.trim() !== "" &&
    form.fullName.trim() !== "" &&
    form.gender !== "" &&
    form.dob.trim() !== "" &&
    form.phone.trim() !== "";

  const handleChange = (partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleCancel = () => router.push("/participant-management");
  const handleBack = () => setStep(1);
  const handleContinue = () => {
    if (step === 1 && isComplete) setStep(2);
  };
  const handleSave = () => {
    // TODO: persist participant
    router.push("/participant-management");
  };

  return (
    <div className="min-h-screen p-6 bg-[#F5F5F5] flex flex-col gap-6">
      <div className="self-stretch bg-white rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-center px-8 pt-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[#2D2F35] text-[28px] font-bold leading-[38px]">
              Participant Management
            </h1>
            <p className="text-[#707784] text-sm font-normal leading-5">
              Follow the guided steps to complete the participant data.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="h-9 px-3 py-2 rounded-lg border border-[#707784] text-[#707784] text-xs font-medium leading-[14px] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="px-60 py-6 bg-white flex justify-center items-center gap-6">
          <StepIndicator
            number={1}
            label="Demographics"
            sublabel="Identity & personal info"
            state={step === 1 ? "active" : "done"}
          />
          <div
            className={cn(
              "flex-1 max-w-[160px] h-[1.5px] mb-7 transition-colors duration-300",
              step === 2 ? "bg-[#0076D2]" : "bg-[#C6C8CE]"
            )}
          />
          <StepIndicator
            number={2}
            label="Review & Save"
            sublabel="Confirm before registering"
            state={step === 2 ? "active" : "idle"}
          />
        </div>
      </div>

      {step === 1 ? (
        <Step1 data={form} onChange={handleChange} />
      ) : (
        <Step2 data={form} />
      )}

      <div className="flex justify-between items-center">
        <Button
          onClick={step === 2 ? handleBack : undefined}
          disabled={step === 1}
          variant={step === 2 ? "outline" : "default"}
          className={cn(
            "px-6 py-3 h-auto rounded-lg text-lg font-medium leading-5 gap-2",
            step === 2
              ? "border-[#0076D2] text-[#0076D2] hover:bg-blue-50"
              : "bg-[#A9ADB5] text-[#FAFAFA] border-0 cursor-not-allowed opacity-100"
          )}
        >
          <ArrowLeft size={20} />
          Back
        </Button>

        {step === 1 ? (
          <Button
            onClick={handleContinue}
            disabled={!isComplete}
            className={cn(
              "px-6 py-3 h-auto rounded-lg text-lg font-medium leading-5 gap-2 text-[#FAFAFA] border-0",
              isComplete
                ? "bg-[#0076D2] hover:bg-[#005fa3]"
                : "bg-[#A9ADB5] cursor-not-allowed"
            )}
          >
            Continue
            <ArrowRight size={20} />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="px-6 py-3 h-auto rounded-lg text-lg font-medium leading-5 gap-2 bg-[#0076D2] hover:bg-[#005fa3] text-[#FAFAFA] border-0"
          >
            Save Participant
            <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
