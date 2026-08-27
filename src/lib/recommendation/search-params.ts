import type { RecommendationInput } from "@/domain/recommendation/types";

export type RecommendationSearchParams = Record<string, string | string[] | undefined>;

const TIME_24_HOUR_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function parseRecommendationQuery(
  query: RecommendationSearchParams,
  buildingIds: string[],
): RecommendationInput | null {
  const { buildingId, arrivalAt } = query;

  if (
    typeof buildingId !== "string" ||
    typeof arrivalAt !== "string" ||
    !buildingIds.includes(buildingId) ||
    !TIME_24_HOUR_PATTERN.test(arrivalAt)
  ) {
    return null;
  }

  return { buildingId, arrivalAt };
}
