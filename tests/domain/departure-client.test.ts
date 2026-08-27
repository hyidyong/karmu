import { describe, expect, it } from "vitest";

import {
  buildRecommendationUrl,
  requestDepartureEta,
  type DeparturePhase,
} from "@/components/recommendation/departure-client";

describe("automatic departure client", () => {
  it("posts current coordinates and reports location-to-route phases", async () => {
    const phases: DeparturePhase[] = [];
    let postedBody: unknown;
    const fetchImpl: typeof fetch = async (_input, init) => {
      postedBody = JSON.parse(String(init?.body));
      return Response.json({
        buildingId: "b1",
        departureAt: "10:12",
        arrivalAt: "10:30",
        travelMinutes: 18,
        distanceMeters: 6400,
        source: "google-routes",
      });
    };
    const geolocation = {
      getCurrentPosition(success: (position: { coords: { latitude: number; longitude: number } }) => void) {
        success({ coords: { latitude: 35.82, longitude: 128.53 } });
      },
    };

    const result = await requestDepartureEta("b1", {
      fetchImpl,
      geolocation,
      onPhase: (phase) => phases.push(phase),
    });

    expect(postedBody).toEqual({ buildingId: "b1", origin: { lat: 35.82, lng: 128.53 } });
    expect(phases).toEqual(["locating", "calculating"]);
    expect(result.source).toBe("google-routes");
  });

  it("requests the deterministic demo origin when location is denied", async () => {
    let postedBody: unknown;
    const fetchImpl: typeof fetch = async (_input, init) => {
      postedBody = JSON.parse(String(init?.body));
      return Response.json({
        buildingId: "b6",
        departureAt: "10:12",
        arrivalAt: "10:20",
        travelMinutes: 8,
        distanceMeters: 1200,
        source: "demo-estimate",
      });
    };
    const geolocation = {
      getCurrentPosition(
        _success: (position: { coords: { latitude: number; longitude: number } }) => void,
        failure?: () => void,
      ) {
        failure?.();
      },
    };

    const result = await requestDepartureEta("b6", { fetchImpl, geolocation });

    expect(postedBody).toEqual({ buildingId: "b6", useDemoOrigin: true });
    expect(result.source).toBe("demo-estimate");
  });

  it("builds the recommendation URL from a normalized ETA response", () => {
    expect(
      buildRecommendationUrl({
        buildingId: "b2",
        departureAt: "10:12",
        arrivalAt: "10:30",
        travelMinutes: 18,
        distanceMeters: 6400,
        source: "google-routes",
      }),
    ).toBe(
      "/recommend?buildingId=b2&arrivalAt=10%3A30&departureAt=10%3A12&travelMinutes=18&distanceMeters=6400&etaSource=google-routes",
    );
  });
});
