/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified for Karmu: the supplied Google Maps Platform 101 React sample's
 * provider, advanced-marker, and pin patterns are adapted
 * to render tenant-scoped university parking data.
 */

"use client";

import { AdvancedMarker, APIProvider, Map, Pin, useMap } from "@vis.gl/react-google-maps";

import type { ParkingLot, ParkingStatus } from "@/domain/parking/types";

type CampusMapProps = {
  apiKey: string;
  mapId?: string;
  parkingLots: ParkingLot[];
  selectedParkingLotId?: string;
  onSelectParkingLot: (parkingLotId: string) => void;
};

type ParkingMarkersProps = Pick<
  CampusMapProps,
  "parkingLots" | "selectedParkingLotId" | "onSelectParkingLot"
>;

const markerColors: Record<ParkingStatus, string> = {
  available: "#034EA2",
  moderate: "#4D78AD",
  busy: "#68717D",
  full: "#E23D3F",
};

function ParkingMarkers({
  parkingLots,
  selectedParkingLotId,
  onSelectParkingLot,
}: ParkingMarkersProps) {
  const map = useMap();

  return parkingLots.map((parkingLot) => {
    const isSelected = parkingLot.parkingLotId === selectedParkingLotId;

    return (
      <AdvancedMarker
        clickable
        key={parkingLot.parkingLotId}
        onClick={() => {
          map?.panTo(parkingLot.coordinates);
          onSelectParkingLot(parkingLot.parkingLotId);
        }}
        position={parkingLot.coordinates}
        title={`${parkingLot.name}, ${parkingLot.currentAvailable}면 남음`}
        zIndex={isSelected ? 10 : 1}
      >
        <Pin
          background={markerColors[parkingLot.status]}
          borderColor="#FFFFFF"
          glyphColor="#FFFFFF"
          scale={isSelected ? 1.25 : 1}
        />
      </AdvancedMarker>
    );
  });
}

export function CampusMap({
  apiKey,
  mapId,
  parkingLots,
  selectedParkingLotId,
  onSelectParkingLot,
}: CampusMapProps) {
  const selected =
    parkingLots.find((parkingLot) => parkingLot.parkingLotId === selectedParkingLotId) ??
    parkingLots[0];
  const center = selected?.coordinates ?? { lat: 35.8546, lng: 128.4873 };

  return (
    <section aria-label="계명대학교 성서캠퍼스 주차 지도" className="overflow-hidden rounded-[var(--radius)] bg-muted">
      <APIProvider apiKey={apiKey}>
        <Map
          className="h-80 w-full"
          defaultCenter={center}
          defaultZoom={16}
          disableDefaultUI
          gestureHandling="greedy"
          mapId={mapId?.trim() || "DEMO_MAP_ID"}
          reuseMaps
        >
          <ParkingMarkers
            onSelectParkingLot={onSelectParkingLot}
            parkingLots={parkingLots}
            selectedParkingLotId={selectedParkingLotId}
          />
        </Map>
      </APIProvider>
    </section>
  );
}
