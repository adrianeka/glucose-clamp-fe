import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-[72px] px-16 flex items-center justify-between bg-[#FAFAFA] shadow-[0px_1px_0px_#E2E4E6_inset] flex-shrink-0 flex-wrap">
      <div className="flex items-center gap-2">
        <Image
          src="/LogoNavbar.png"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span
          className="text-[#667085] text-sm font-normal leading-5"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          © 2026 Glucose Clamp • Built by Mini Padepokan 79 | All rights
          reserved.
        </span>
      </div>
    </footer>
  );
}
