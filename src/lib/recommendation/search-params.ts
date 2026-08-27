import type {
  ParsedRecommendationQuery,
  RecommendationInput,
  RecommendationTrip,
} from "@/domain/recommendation/types";

export type RecommendationSearchParams = Record<string, string | string[] | undefined>;

const TIME_24_HOUR_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function parseRecommendationQuery(
  query: RecommendationSearchParams,
  buildingIds: string[],
): ParsedRecommendationQuery | null {
  const { buildingId, arrivalAt, departureAt, travelMinutes, distanceMeters, etaSource } = query;

  if (
    typeof buildingId !== "string" ||
    typeof arrivalAt !== "string" ||
    !buildingIds.includes(buildingId) ||
    !TIME_24_HOUR_PATTERN.test(arrivalAt)
  ) {
    return null;
  }

  const tripFields = [departureAt, travelMinutes, distanceMeters, etaSource];
  if (tripFields.every((value) => value === undefined)) {
    return { buildingId, arrivalAt };
  }

  if (
    typeof departureAt !== "string" ||
    typeof travelMinutes !== "string" ||
    typeof distanceMeters !== "string" ||
    typeof etaSource !== "string" ||
    !TIME_24_HOUR_PATTERN.test(departureAt) ||
    !/^\d+$/.test(travelMinutes) ||
    !/^\d+$/.test(distanceMeters) ||
    (etaSource !== "google-routes" && etaSource !== "demo-estimate")
  ) {
    return null;
  }

  const numericTravelMinutes = Number(travelMinutes);
  const numericDistanceMeters = Number(distanceMeters);
  if (
    !Number.isSafeInteger(numericTravelMinutes) ||
    numericTravelMinutes < 1 ||
    numericTravelMinutes > 1_440 ||
    !Number.isSafeInteger(numericDistanceMeters) ||
    numericDistanceMeters < 0
  ) {
    return null;
  }

  return {
    buildingId,
    arrivalAt,
    trip: {
      departureAt,
      travelMinutes: numericTravelMinutes,
      distanceMeters: numericDistanceMeters,
      source: etaSource,
    },
  };
}

export function buildRecommendationSearchParams(
  input: RecommendationInput & { trip: RecommendationTrip },
): string {
  return new URLSearchParams({
    buildingId: input.buildingId,
    arrivalAt: input.arrivalAt,
    departureAt: input.trip.departureAt,
    travelMinutes: String(input.trip.travelMinutes),
    distanceMeters: String(input.trip.distanceMeters),
    etaSource: input.trip.source,
  }).toString();
}
