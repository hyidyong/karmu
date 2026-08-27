import type { ReactNode } from "react";

import { BottomNav } from "@/components/app-shell/bottom-nav";

export default function StudentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-white shadow-[0_0_48px_rgb(35_31_32/0.08)]">
      {children}
      <BottomNav />
    </div>
  );
}
