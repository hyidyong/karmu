import type { ParkingRecommendation } from "@/domain/recommendation/types";
import type { ParsedRecommendationQuery } from "@/domain/recommendation/types";
import { buildRecommendationSearchParams } from "@/lib/recommendation/search-params";

import { RecommendationCard } from "./recommendation-card";

type RecommendationListProps = {
  recommendations: ParkingRecommendation[];
  query: ParsedRecommendationQuery & { trip: NonNullable<ParsedRecommendationQuery["trip"]> };
};

export function RecommendationList({ recommendations, query }: RecommendationListProps) {
  const detailQuery = buildRecommendationSearchParams(query);

  return (
    <section aria-labelledby="recommendation-results-heading" className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-primary">도착 시점 예측 결과</p>
        <h2 id="recommendation-results-heading" className="mt-1 text-2xl font-bold tracking-[-0.03em]">
          지금 가장 좋은 선택이에요
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          잔여면, 도보 거리, 예측 신뢰도를 함께 비교했어요.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            detailQuery={detailQuery}
            key={recommendation.parkingLot.parkingLotId}
            rank={index + 1}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}
