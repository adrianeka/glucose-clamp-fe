import { Users, Activity, CheckCircle2 } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="flex w-full items-center gap-8 px-16 py-8">
      <div className="flex flex-1 items-center gap-6">
        <div className="flex flex-1 flex-col gap-2 rounded-3xl border border-[#C6C8CE] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E4E6] bg-[#FAFAFA]">
              <Users className="h-5 w-5 text-[#595F6A]" />
            </div>
            <span className="text-lg font-medium text-[#43474F]">Total Patients</span>
          </div>
          <div>
            <h2 className="text-[42px] font-bold leading-tight text-[#43474F]">4</h2>
            <p className="text-base text-[#707784]">Total patients assigned for glucose analysis</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 rounded-3xl border border-[#91D9E9] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C4EAEE] bg-[#F1F9FA]">
              <Activity className="h-5 w-5 text-[#0076D2]" />
            </div>
            <span className="text-lg font-medium text-[#43474F]">Ready for Analysis</span>
          </div>
          <div>
            <h2 className="text-[42px] font-bold leading-tight text-[#0076D2]">1</h2>
            <p className="text-base text-[#707784]">Patients awaiting blood glucose reading</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 rounded-3xl border border-[#AFE1CE] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9EBDE] bg-[#EEF8F4]">
              <CheckCircle2 className="h-5 w-5 text-[#4BAC87]" />
            </div>
            <span className="text-lg font-medium text-[#43474F]">Analysis Completed</span>
          </div>
          <div>
            <h2 className="text-[42px] font-bold leading-tight text-[#4BAC87]">2</h2>
            <p className="text-base text-[#707784]">Analyzed samples recorded in the system</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1">
        <span className="text-base font-medium text-[#8C929D]">System Time</span>
        <span className="text-[42px] font-bold text-[#43474F]">10:06:06 AM</span>
      </div>
    </div>
  );
}