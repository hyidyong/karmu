import { describe, expect, it } from "vitest";

import { vehicleRepository } from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

describe("vehicleRepository", () => {
  it("returns the KMU vehicle only inside the matching tenant", async () => {
    const kmuOverview = await vehicleRepository.getOverview(DEFAULT_TENANT);
    const otherOverview = await vehicleRepository.getOverview({
      universityId: "hanbit",
      campusId: "hanbit-main",
    });

    expect(kmuOverview.vehicles[0]?.plateNumber).toBe("12가 3456");
    expect(otherOverview).toEqual({ vehicles: [], pass: null, applicationSteps: [] });
  });

  it("returns a defensive copy so one request cannot change another", async () => {
    const firstOverview = await vehicleRepository.getOverview(DEFAULT_TENANT);
    firstOverview.vehicles[0].plateNumber = "변경됨";

    const nextOverview = await vehicleRepository.getOverview(DEFAULT_TENANT);
    expect(nextOverview.vehicles[0]?.plateNumber).toBe("12가 3456");
  });
});
