import type { Coordinates } from "@/domain/university/types";

export type EtaSource = "google-routes" | "demo-estimate";

export type EtaRequest = {
  buildingId: string;
  origin?: Coordinates;
  useDemoOrigin?: boolean;
};

export type EtaResponse = {
  buildingId: string;
  departureAt: string;
  arrivalAt: string;
  travelMinutes: number;
  distanceMeters: number;
  source: EtaSource;
};
