"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { ParkingLot } from "@/domain/parking/types";

import { ParkingMapList } from "./parking-map-list";

const CampusMap = dynamic(() => import("./campus-map").then((module) => module.CampusMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

type CampusMapLoaderProps = {
  apiKey: string;
  mapId?: string;
  parkingLots: ParkingLot[];
  selectedParkingLotId?: string;
};

function MapSkeleton() {
  return (
    <div
      aria-label="캠퍼스 지도 불러오는 중"
      className="flex min-h-80 animate-pulse items-center justify-center rounded-[var(--radius)] bg-muted text-sm font-semibold text-muted-foreground motion-reduce:animate-none"
      role="status"
    >
      지도를 불러오고 있어요
    </div>
  );
}

export function CampusMapLoader({
  apiKey,
  mapId,
  parkingLots,
  selectedParkingLotId,
}: CampusMapLoaderProps) {
  const [selectedId, setSelectedId] = useState(
    selectedParkingLotId ?? parkingLots[0]?.parkingLotId,
  );

  return (
    <div className="flex flex-col gap-6">
      <CampusMap
        apiKey={apiKey}
        mapId={mapId}
        onSelectParkingLot={setSelectedId}
        parkingLots={parkingLots}
        selectedParkingLotId={selectedId}
      />
      <ParkingMapList parkingLots={parkingLots} selectedParkingLotId={selectedId} />
    </div>
  );
}
