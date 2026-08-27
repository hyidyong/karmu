import type { ParkingLot } from "@/domain/parking/types";
import type { ParkingRecommendation, RecommendationInput } from "@/domain/recommendation/types";
import type { Building, TenantContext, UniversityBrand } from "@/domain/university/types";
import type { VehicleOverview } from "@/domain/vehicle/types";

export interface UniversityRepository {
  getBrand(tenant: TenantContext): Promise<UniversityBrand>;
  listBuildings(tenant: TenantContext): Promise<Building[]>;
}

export interface ParkingRepository {
  listByCampus(tenant: TenantContext): Promise<ParkingLot[]>;
  getById(tenant: TenantContext, parkingLotId: string): Promise<ParkingLot | undefined>;
}

export interface RecommendationRepository {
  recommend(tenant: TenantContext, input: RecommendationInput): Promise<ParkingRecommendation[]>;
}

export interface VehicleRepository {
  getOverview(tenant: TenantContext): Promise<VehicleOverview>;
}
