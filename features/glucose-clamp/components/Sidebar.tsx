"use client";

const steps = [
  { step: "Step 1", desc: "Input protokol: durasi, dosis insulin, target glukosa, versi, dan nama protokol." },
  { step: "Step 2", desc: "Tambahkan sampling schedule per fase. Sistem akan generate daftar activity berdasarkan jadwal tersebut." },
  { step: "Step 3", desc: "Buat session clamp dengan memilih protokol yang sudah dibuat." },
  { step: "Step 4", desc: "Jalankan session step-by-step. Activity diproses satu per satu, status glukosa dan infusion rate ikut berubah." },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col gap-3 p-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <h1 className="text-base font-bold">Glucose Clamp Demo</h1>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Storyboard: Protocol → Sampling Schedule → Generated Activities → Session Clamp → Run Session
        </p>
      </div>

      {steps.map(({ step, desc }) => (
        <div key={step} className="rounded-xl border border-white/10 bg-blue-950 p-3">
          <strong className="block text-xs font-bold mb-1">{step}</strong>
          <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
        </div>
      ))}

      <div className="text-xs text-slate-400 leading-relaxed px-1">
        Versi ini menambahkan <strong className="text-white">runtime chart</strong> agar stakeholder bisa melihat pola perubahan glukosa dan infusion rate selama run session.
      </div>
    </aside>
  );
}
