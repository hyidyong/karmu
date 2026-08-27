import { describe, expect, it } from "vitest";

import { parkingRepository } from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

describe("parkingRepository", () => {
  it("keeps identical parking lot IDs isolated by university and campus", async () => {
    const sharedParkingLotId = "east-gate";
    const otherTenant = { universityId: "hanbit", campusId: "hanbit-main" };

    const [kmuLot, otherLot] = await Promise.all([
      parkingRepository.getById(DEFAULT_TENANT, sharedParkingLotId),
      parkingRepository.getById(otherTenant, sharedParkingLotId),
    ]);

    expect(kmuLot?.universityId).toBe("kmu");
    expect(kmuLot?.campusId).toBe("kmu-seongseo");
    expect(otherLot?.universityId).toBe("hanbit");
    expect(otherLot?.campusId).toBe("hanbit-main");
  });

  it("returns only lots inside the requested tenant", async () => {
    const lots = await parkingRepository.listByCampus(DEFAULT_TENANT);

    expect(lots).toHaveLength(4);
    expect(lots.every((lot) => lot.universityId === "kmu" && lot.campusId === "kmu-seongseo")).toBe(true);
  });
});
