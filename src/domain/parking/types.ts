import type { Coordinates } from "@/domain/university/types";

export type ParkingStatus = "available" | "moderate" | "busy" | "full";
export type ParkingAccessType = "student" | "staff" | "shared";

export type ParkingTrendPoint = {
  hour: string;
  available: number;
};

export type ParkingLot = {
  parkingLotId: string;
  universityId: string;
  campusId: string;
  name: string;
  capacity: number;
  currentAvailable: number;
  predictedAvailable: number;
  confidence: number;
  walkMinutes: number;
  distanceMeters: number;
  status: ParkingStatus;
  coordinates: Coordinates;
  operatingHours: string;
  feeText: string;
  eligibility: string;
  accessType: ParkingAccessType;
  trend: ParkingTrendPoint[];
};

export type RankableParkingLot = Pick<
  ParkingLot,
  "parkingLotId" | "predictedAvailable" | "capacity" | "walkMinutes" | "confidence" | "status"
>;
