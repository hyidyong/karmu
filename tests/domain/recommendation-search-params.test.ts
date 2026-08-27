import { describe, expect, it } from "vitest";

import { parseRecommendationQuery } from "@/lib/recommendation/search-params";

describe("parseRecommendationQuery", () => {
  it("accepts a known building and valid 24-hour time", () => {
    expect(
      parseRecommendationQuery({ buildingId: "b2", arrivalAt: "10:30" }, ["b1", "b2"]),
    ).toEqual({
      buildingId: "b2",
      arrivalAt: "10:30",
    });
  });

  it("rejects unknown buildings and malformed times", () => {
    expect(
      parseRecommendationQuery({ buildingId: "x", arrivalAt: "29:80" }, ["b1", "b2"]),
    ).toBeNull();
  });

  it("rejects array values from duplicate query keys", () => {
    expect(
      parseRecommendationQuery({ buildingId: ["b1", "b2"], arrivalAt: "10:30" }, ["b1", "b2"]),
    ).toBeNull();
  });
});
