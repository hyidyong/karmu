import { describe, expect, it } from "vitest";

import { rankParkingLots } from "@/lib/recommendation/rank-parking-lots";

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
});
