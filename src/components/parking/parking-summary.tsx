import { CarFront, Gauge, Sparkles } from "lucide-react";

import type { ParkingLot } from "@/domain/parking/types";

type ParkingSummaryProps = {
  lots: ParkingLot[];
  recommendedName: string;
};

export function ParkingSummary({ lots, recommendedName }: ParkingSummaryProps) {
  const totalCapacity = lots.reduce((sum, lot) => sum + lot.capacity, 0);
  const totalAvailable = lots.reduce((sum, lot) => sum + lot.currentAvailable, 0);
  const occupancy = totalCapacity
    ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100)
    : 0;

  return (
    <section aria-labelledby="campus-parking-heading" className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-primary">실시간 캠퍼스</p>
          <h2 id="campus-parking-heading" className="text-xl font-bold tracking-[-0.02em]">
            지금 캠퍼스 주차
          </h2>
        </div>
        <span className="rounded-[var(--radius)] bg-accent px-3 py-1.5 text-xs font-bold text-primary">
          보통
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-[var(--radius)] bg-muted p-3">
        <div className="flex min-w-0 flex-col gap-2 rounded-[var(--radius)] bg-white p-3">
          <Gauge aria-hidden="true" className="size-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">혼잡도</p>
            <p className="mt-0.5 text-lg font-bold">{occupancy}%</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-[var(--radius)] bg-white p-3">
          <CarFront aria-hidden="true" className="size-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">잔여면</p>
            <p className="mt-0.5 text-lg font-bold">{totalAvailable}면</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-[var(--radius)] bg-white p-3">
          <Sparkles aria-hidden="true" className="size-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">추천</p>
            <p className="mt-0.5 truncate text-sm font-bold">{recommendedName}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
