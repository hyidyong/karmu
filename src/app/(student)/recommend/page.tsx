import type { Metadata } from "next";

import { PageFrame } from "@/components/app-shell/page-frame";
import { SubpageHeader } from "@/components/app-shell/subpage-header";
import { DepartureForm } from "@/components/recommendation/departure-form";
import { RecommendationList } from "@/components/recommendation/recommendation-list";
import { TripSummary } from "@/components/recommendation/trip-summary";
import { recommendationRepository, universityRepository } from "@/data/mock/repositories";
import {
  parseRecommendationQuery,
  type RecommendationSearchParams,
} from "@/lib/recommendation/search-params";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

export const metadata: Metadata = {
  title: "주차 추천",
};

type RecommendationPageProps = {
  searchParams: Promise<RecommendationSearchParams>;
};

export default async function RecommendationPage({ searchParams }: RecommendationPageProps) {
  const [query, buildings] = await Promise.all([
    searchParams,
    universityRepository.listBuildings(DEFAULT_TENANT),
  ]);
  const hasQuery = Object.values(query).some((value) => value !== undefined);
  const parsedQuery = parseRecommendationQuery(
    query,
    buildings.map((building) => building.buildingId),
  );
  const recommendations = parsedQuery?.trip
    ? await recommendationRepository.recommend(DEFAULT_TENANT, parsedQuery)
    : [];
  const selectedBuilding = parsedQuery
    ? buildings.find((building) => building.buildingId === parsedQuery.buildingId)
    : undefined;
  const requestedBuildingId =
    typeof query.buildingId === "string" &&
    buildings.some((building) => building.buildingId === query.buildingId)
      ? query.buildingId
      : "b1";

  return (
    <>
      <SubpageHeader eyebrow="출발 전에 결정하는 주차" title="주차 추천" />
      <PageFrame>
        <section aria-labelledby="destination-heading" className="flex flex-col gap-5">
          <div>
            <h1 id="destination-heading" className="text-[2rem] font-bold leading-[1.2] tracking-[-0.04em]">
              어디로 출발할까요?
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              현재 위치에서 걸리는 시간과 도착 시점의 주차 혼잡도를 한 번에 계산해요.
            </p>
          </div>
          <DepartureForm
            initialBuildingId={requestedBuildingId}
            buildings={buildings}
            isInvalid={hasQuery && !parsedQuery}
          />
        </section>

        {parsedQuery?.trip && selectedBuilding ? (
          <>
            <TripSummary
              arrivalAt={parsedQuery.arrivalAt}
              destinationName={selectedBuilding.name}
              trip={parsedQuery.trip}
            />
            <RecommendationList
              query={{ ...parsedQuery, trip: parsedQuery.trip }}
              recommendations={recommendations}
            />
          </>
        ) : (
          <aside className="rounded-[var(--radius)] bg-accent p-5">
            <p className="font-bold text-primary">Karmu가 함께 보는 기준</p>
            <p className="mt-2 text-sm leading-6 text-accent-foreground">
              실시간 잔여면, 도착 시점의 예상 혼잡도, 목적지까지의 도보 거리를 함께 비교해요.
            </p>
          </aside>
        )}
      </PageFrame>
    </>
  );
}
