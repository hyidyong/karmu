import { ArrowRight, Footprints } from "lucide-react";
import Link from "next/link";

import { StatusLabel } from "@/components/parking/status-label";
import type { ParkingLot } from "@/domain/parking/types";
import { cn } from "@/lib/utils";

type ParkingMapListProps = {
  parkingLots: ParkingLot[];
  selectedParkingLotId?: string;
};

export function ParkingMapList({ parkingLots, selectedParkingLotId }: ParkingMapListProps) {
  return (
    <section aria-labelledby="map-list-heading" className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">실시간 잔여면</p>
          <h2 id="map-list-heading" className="mt-1 text-xl font-bold tracking-[-0.02em]">
            캠퍼스 주차장
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">{parkingLots.length}곳</p>
      </div>
      <ul className="flex flex-col gap-2">
        {parkingLots.map((parkingLot) => {
          const isSelected = parkingLot.parkingLotId === selectedParkingLotId;

          return (
            <li key={parkingLot.parkingLotId}>
              <Link
                aria-current={isSelected ? "location" : undefined}
                className={cn(
                  "flex min-h-20 items-center justify-between gap-3 rounded-[var(--radius)] px-4 py-3 transition-colors",
                  isSelected ? "bg-accent" : "bg-muted hover:bg-muted/75",
                )}
                href={`/parking/${parkingLot.parkingLotId}`}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-bold">{parkingLot.name}</span>
                    <StatusLabel status={parkingLot.status} />
                  </span>
                  <span className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{parkingLot.currentAvailable}면 남음</span>
                    <span className="flex items-center gap-1">
                      <Footprints aria-hidden="true" className="size-3.5" />
                      도보 {parkingLot.walkMinutes}분
                    </span>
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
