import type { ParkingLot } from "@/domain/parking/types";

export type RecommendationInput = {
  buildingId: string;
  arrivalAt: string;
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
