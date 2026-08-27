import type {
  ParkingRepository,
  RecommendationRepository,
  UniversityRepository,
  VehicleRepository,
} from "@/data/contracts/repositories";
import type { VehicleOverview } from "@/domain/vehicle/types";
import { buildings, kmuVehicleOverview, parkingLots, universityBrands } from "@/data/mock/fixtures";
import { rankParkingLots } from "@/lib/recommendation/rank-parking-lots";

const EMPTY_VEHICLE_OVERVIEW: VehicleOverview = {
  vehicles: [],
  pass: null,
  applicationSteps: [],
};

function copyVehicleOverview(overview: VehicleOverview): VehicleOverview {
  return {
    vehicles: overview.vehicles.map((vehicle) => ({ ...vehicle })),
    pass: overview.pass ? { ...overview.pass } : null,
    applicationSteps: overview.applicationSteps.map((step) => ({ ...step })),
  };
}

export const universityRepository: UniversityRepository = {
  async getBrand(tenant) {
    const brand = universityBrands.find((item) => item.universityId === tenant.universityId);
    if (!brand) {
      throw new Error(`Unknown university: ${tenant.universityId}`);
    }
    return brand;
  },
  async listBuildings(tenant) {
    return buildings.filter(
      (building) =>
        building.universityId === tenant.universityId && building.campusId === tenant.campusId,
    );
  },
};

export const parkingRepository: ParkingRepository = {
  async listByCampus(tenant) {
    return parkingLots.filter(
      (parkingLot) =>
        parkingLot.universityId === tenant.universityId && parkingLot.campusId === tenant.campusId,
    );
  },
  async getById(tenant, parkingLotId) {
    return parkingLots.find(
      (parkingLot) =>
        parkingLot.universityId === tenant.universityId &&
        parkingLot.campusId === tenant.campusId &&
        parkingLot.parkingLotId === parkingLotId,
    );
  },
};

export const recommendationRepository: RecommendationRepository = {
  async recommend(tenant, input) {
    void input;
    const lots = await parkingRepository.listByCampus(tenant);
    const ranks = rankParkingLots(lots);

    return ranks.flatMap((rank) => {
      const parkingLot = lots.find((lot) => lot.parkingLotId === rank.parkingLotId);
      return parkingLot ? [{ parkingLot, score: rank.score, reasons: rank.reasons }] : [];
    });
  },
};

export const vehicleRepository: VehicleRepository = {
  async getOverview(tenant) {
    const overview =
      tenant.universityId === "kmu" && tenant.campusId === "kmu-seongseo"
        ? kmuVehicleOverview
        : EMPTY_VEHICLE_OVERVIEW;

    return copyVehicleOverview(overview);
  },
};
