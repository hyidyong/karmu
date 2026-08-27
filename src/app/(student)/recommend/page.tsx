import type { Metadata } from "next";

import { PageFrame } from "@/components/app-shell/page-frame";
import { SubpageHeader } from "@/components/app-shell/subpage-header";
import { DestinationForm } from "@/components/recommendation/destination-form";
import { RecommendationList } from "@/components/recommendation/recommendation-list";
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
  const hasQuery = query.buildingId !== undefined || query.arrivalAt !== undefined;
  const parsedQuery = parseRecommendationQuery(
    query,
    buildings.map((building) => building.buildingId),
  );
  const recommendations = parsedQuery
    ? await recommendationRepository.recommend(DEFAULT_TENANT, parsedQuery)
    : [];

  return (
    <>
      <SubpageHeader eyebrow="도착 전에 결정하는 주차" title="주차 추천" />
      <PageFrame>
        <section aria-labelledby="destination-heading" className="flex flex-col gap-5">
          <div>
            <h1 id="destination-heading" className="text-[2rem] font-bold leading-[1.2] tracking-[-0.04em]">
              목적지와 도착 시간을<br />알려주세요
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              도착할 때 남아 있을 주차면을 예측해 가까운 순서로 추천해요.
            </p>
          </div>
          <DestinationForm
            arrivalAt={typeof query.arrivalAt === "string" ? query.arrivalAt : undefined}
            buildingId={typeof query.buildingId === "string" ? query.buildingId : undefined}
            buildings={buildings}
            isInvalid={hasQuery && !parsedQuery}
          />
        </section>

        {parsedQuery ? (
          <RecommendationList arrivalAt={parsedQuery.arrivalAt} recommendations={recommendations} />
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
