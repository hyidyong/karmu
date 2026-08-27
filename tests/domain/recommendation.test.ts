import { describe, expect, it } from "vitest";

import { recommendationRepository } from "@/data/mock/repositories";
import { parkingLots } from "@/data/mock/fixtures";
import { predictParkingAt } from "@/lib/recommendation/predict-parking-at";
import { rankParkingLots } from "@/lib/recommendation/rank-parking-lots";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

describe("rankParkingLots", () => {
  it("excludes full lots and ranks the remaining three by the documented score", () => {
    const results = rankParkingLots([
      {
        parkingLotId: "far",
        predictedAvailable: 42,
        capacity: 100,
        walkMinutes: 14,
        confidence: 90,
        status: "available",
      },
      {
        parkingLotId: "best",
        predictedAvailable: 34,
        capacity: 80,
        walkMinutes: 4,
        confidence: 88,
        status: "available",
      },
      {
        parkingLotId: "full",
        predictedAvailable: 0,
        capacity: 60,
        walkMinutes: 2,
        confidence: 95,
        status: "full",
      },
      {
        parkingLotId: "middle",
        predictedAvailable: 18,
        capacity: 70,
        walkMinutes: 7,
        confidence: 80,
        status: "moderate",
      },
    ]);

    expect(results.map((result) => result.parkingLotId)).toEqual(["best", "middle", "far"]);
    expect(results[0]).toEqual({
      parkingLotId: "best",
      score: 62.9,
      reasons: ["도착 시 34면 예상", "목적지까지 도보 4분", "예측 신뢰도 88%"],
    });
  });

  it("breaks equal scores by shorter walking time", () => {
    const results = rankParkingLots([
      {
        parkingLotId: "long-walk",
        predictedAvailable: 20,
        capacity: 40,
        walkMinutes: 10,
        confidence: 80,
        status: "moderate",
      },
      {
        parkingLotId: "short-walk",
        predictedAvailable: 20,
        capacity: 40,
        walkMinutes: 6,
        confidence: 50,
        status: "moderate",
      },
    ]);

    expect(results.map((result) => result.parkingLotId)).toEqual(["short-walk", "long-walk"]);
  });

  it("interpolates arrival availability between adjacent trend points", () => {
    const eastGate = parkingLots.find(
      (lot) => lot.universityId === "kmu" && lot.parkingLotId === "east-gate",
    );

    expect(eastGate).toBeDefined();
    expect(predictParkingAt(eastGate!, "10:30").predictedAvailable).toBe(31);
  });

  it("returns only student-accessible lots and changes first place by destination", async () => {
    const library = await recommendationRepository.recommend(DEFAULT_TENANT, {
      buildingId: "b1",
      arrivalAt: "10:30",
    });
    const engineering = await recommendationRepository.recommend(DEFAULT_TENANT, {
      buildingId: "b6",
      arrivalAt: "10:30",
    });

    expect(library).toHaveLength(3);
    expect(engineering).toHaveLength(3);
    expect(library[0].parkingLot.parkingLotId).toBe("east-gate");
    expect(engineering[0].parkingLot.parkingLotId).toBe("south-gate");
    expect(library.every((item) => item.parkingLot.accessType !== "staff")).toBe(true);
  });
});
