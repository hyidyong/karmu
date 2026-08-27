import { describe, expect, it } from "vitest";

import {
  buildRecommendationSearchParams,
  parseRecommendationQuery,
} from "@/lib/recommendation/search-params";

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

  it("parses automatic trip metadata", () => {
    expect(
      parseRecommendationQuery(
        {
          buildingId: "b2",
          arrivalAt: "10:30",
          departureAt: "10:12",
          travelMinutes: "18",
          distanceMeters: "6400",
          etaSource: "google-routes",
        },
        ["b1", "b2"],
      ),
    ).toMatchObject({
      buildingId: "b2",
      arrivalAt: "10:30",
      trip: {
        departureAt: "10:12",
        travelMinutes: 18,
        distanceMeters: 6400,
        source: "google-routes",
      },
    });
  });

  it("rejects non-numeric or unsupported trip metadata", () => {
    expect(
      parseRecommendationQuery(
        {
          buildingId: "b1",
          arrivalAt: "10:30",
          travelMinutes: "NaN",
          etaSource: "other",
        },
        ["b1"],
      ),
    ).toBeNull();
  });

  it("builds a stable query string for detail and back links", () => {
    expect(
      buildRecommendationSearchParams({
        buildingId: "b2",
        arrivalAt: "10:30",
        trip: {
          departureAt: "10:12",
          travelMinutes: 18,
          distanceMeters: 6400,
          source: "demo-estimate",
        },
      }),
    ).toBe(
      "buildingId=b2&arrivalAt=10%3A30&departureAt=10%3A12&travelMinutes=18&distanceMeters=6400&etaSource=demo-estimate",
    );
  });
});
