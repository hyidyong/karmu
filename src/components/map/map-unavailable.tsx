import { KeyRound, MapPinned } from "lucide-react";

import type { ParkingLot } from "@/domain/parking/types";

import { ParkingMapList } from "./parking-map-list";

type MapUnavailableProps = {
  parkingLots: ParkingLot[];
  selectedParkingLotId?: string;
};

export function MapUnavailable({ parkingLots, selectedParkingLotId }: MapUnavailableProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="relative flex min-h-72 flex-col justify-end overflow-hidden rounded-[var(--radius)] bg-muted p-5">
        <MapPinned aria-hidden="true" className="absolute right-5 top-5 size-16 text-primary/15" />
        <div className="relative rounded-[var(--radius)] bg-white/95 p-4 shadow-[var(--shadow-card)]">
          <span className="mb-3 flex size-10 items-center justify-center rounded-[var(--radius)] bg-accent text-primary">
            <KeyRound aria-hidden="true" className="size-5" />
          </span>
          <h2 className="font-bold">지도를 연결하려면 Google Maps API 키가 필요해요.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            키를 설정하기 전에도 아래 목록에서 실시간 주차 정보를 확인할 수 있어요.
          </p>
        </div>
      </section>
      <ParkingMapList parkingLots={parkingLots} selectedParkingLotId={selectedParkingLotId} />
    </div>
  );
}
