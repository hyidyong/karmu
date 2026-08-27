import type { Metadata } from "next";

import { PageFrame } from "@/components/app-shell/page-frame";
import { SubpageHeader } from "@/components/app-shell/subpage-header";
import { CampusMapLoader } from "@/components/map/campus-map-loader";
import { getMapAvailability } from "@/components/map/map-availability";
import { MapUnavailable } from "@/components/map/map-unavailable";
import { parkingRepository } from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

export const metadata: Metadata = {
  title: "캠퍼스 주차 지도",
};

type MapPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const [query, parkingLots] = await Promise.all([
    searchParams,
    parkingRepository.listByCampus(DEFAULT_TENANT),
  ]);
  const requestedId = typeof query.parkingLotId === "string" ? query.parkingLotId : undefined;
  const selectedParkingLotId = parkingLots.some((lot) => lot.parkingLotId === requestedId)
    ? requestedId
    : parkingLots[0]?.parkingLotId;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const availability = getMapAvailability(apiKey);

  return (
    <>
      <SubpageHeader eyebrow="성서캠퍼스" title="주차 지도" />
      <PageFrame>
        <div>
          <h1 className="text-[2rem] font-bold leading-[1.2] tracking-[-0.04em]">
            가까운 주차장을<br />한눈에 확인하세요
          </h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            지도 마커와 목록의 잔여면 정보가 같은 데이터를 사용해요.
          </p>
        </div>

        {availability === "ready" && apiKey ? (
          <CampusMapLoader
            apiKey={apiKey}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
            parkingLots={parkingLots}
            selectedParkingLotId={selectedParkingLotId}
          />
        ) : (
          <MapUnavailable
            parkingLots={parkingLots}
            selectedParkingLotId={selectedParkingLotId}
          />
        )}
      </PageFrame>
    </>
  );
}
