import type { ParkingStatus } from "@/domain/parking/types";
import { cn } from "@/lib/utils";

const statusCopy: Record<ParkingStatus, string> = {
  available: "여유",
  moderate: "보통",
  busy: "혼잡",
  full: "만차",
};

type StatusLabelProps = {
  status: ParkingStatus;
};

export function StatusLabel({ status }: StatusLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-[var(--radius)] px-2.5 text-xs font-bold",
        status === "full" ? "bg-destructive/10 text-destructive" : "bg-accent text-primary",
      )}
    >
      {statusCopy[status]}
    </span>
  );
}
