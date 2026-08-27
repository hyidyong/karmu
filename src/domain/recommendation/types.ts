import type { ParkingLot } from "@/domain/parking/types";
import type { EtaSource } from "@/domain/eta/types";

export type RecommendationInput = {
  buildingId: string;
  arrivalAt: string;
};

export type RecommendationTrip = {
  departureAt: string;
  travelMinutes: number;
  distanceMeters: number;
  source: EtaSource;
};

export type ParsedRecommendationQuery = RecommendationInput & {
  trip?: RecommendationTrip;
};

export type ParkingRank = {
  parkingLotId: string;
  score: number;
  reasons: string[];
};

export type ParkingRecommendation = {
  parkingLot: ParkingLot;
  score: number;
  reasons: string[];
};
