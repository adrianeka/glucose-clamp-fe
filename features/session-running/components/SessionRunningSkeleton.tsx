"use client";

export default function SessionRunningSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="mb-4 rounded-xl bg-white border border-[#E2E4E6] p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-56 rounded bg-slate-200 animate-pulse" />
              <div className="mt-3 h-4 w-80 rounded bg-slate-200 animate-pulse" />
            </div>

            <div className="flex gap-3">
              <div className="h-10 w-36 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-10 w-36 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-xl border border-[#E2E4E6] bg-white p-4">
          <div className="h-16 rounded-lg bg-slate-200 animate-pulse" />

          <div className="mt-6 flex gap-2">

            {/* Main */}
            <div className="flex-1">

              <div className="h-[360px] rounded-xl bg-slate-200 animate-pulse" />

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="h-[180px] rounded-xl bg-slate-200 animate-pulse" />
                <div className="h-[180px] rounded-xl bg-slate-200 animate-pulse" />
              </div>

            </div>

            {/* Sidebar */}
            <div
              style={{
                width: 450,
                flexShrink: 0,
              }}
            >
              <div className="h-[560px] rounded-xl bg-slate-200 animate-pulse" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}