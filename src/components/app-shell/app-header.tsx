import { Bell, ChevronDown, ParkingCircle } from "lucide-react";
import Link from "next/link";

type AppHeaderProps = {
  campusName: string;
  universityName: string;
};

export function AppHeader({ campusName, universityName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/92 px-5 py-3 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground shadow-[0_8px_20px_rgb(3_78_162/0.2)]">
          <ParkingCircle aria-hidden="true" className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold tracking-[-0.02em]">Karmu</p>
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <span className="truncate">{universityName} {campusName}</span>
            <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
          </div>
        </div>
      </div>
      <Link
        aria-label="알림 보기"
        className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-foreground transition-colors hover:bg-muted"
        href="/profile#notifications"
      >
        <Bell aria-hidden="true" className="size-5" />
      </Link>
    </header>
  );
}
