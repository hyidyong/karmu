import { describe, expect, it } from "vitest";

import type { Building } from "@/domain/university/types";
import { computeEta, estimateDemoEta, parseEtaRequest } from "@/lib/eta/compute-eta";

const building: Building = {
  buildingId: "b1",
  universityId: "kmu",
  campusId: "kmu-seongseo",
  name: "동산도서관",
  coordinates: { lat: 35.8546, lng: 128.4873 },
};

const now = new Date("2026-08-27T03:00:00.000Z");

describe("ETA computation", () => {
  it("rejects an out-of-range coordinate", () => {
    expect(parseEtaRequest({ buildingId: "b1", origin: { lat: 91, lng: 128 } })).toBeNull();
  });

  it("returns a stable demo ETA with a minimum driving time", () => {
    const result = estimateDemoEta({
      building,
      origin: { lat: 35.846, lng: 128.491 },
      departureAt: now,
    });

    expect(result.source).toBe("demo-estimate");
    expect(result.travelMinutes).toBe(8);
    expect(result.departureAt).toBe("12:00");
    expect(result.arrivalAt).toBe("12:08");
  });

  it("normalizes a successful Google Routes response", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ routes: [{ duration: "924s", distanceMeters: 6400 }] }), {
        status: 200,
      });

    const result = await computeEta({
      apiKey: "server-key",
      building,
      departureAt: now,
      fetchImpl,
      origin: { lat: 35.82, lng: 128.53 },
    });

    expect(result).toMatchObject({
      source: "google-routes",
      travelMinutes: 16,
      distanceMeters: 6400,
    });
    expect(result.arrivalAt).toBe("12:16");
  });

  it("falls back when Google Routes rejects the request", async () => {
    const fetchImpl: typeof fetch = async () => new Response("denied", { status: 403 });

    const result = await computeEta({
      apiKey: "restricted-key",
      building,
      departureAt: now,
      fetchImpl,
      origin: { lat: 35.82, lng: 128.53 },
    });

    expect(result.source).toBe("demo-estimate");
  });

  it("falls back when Google Routes returns malformed route data", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ routes: [{ duration: "unknown" }] }), { status: 200 });

    const result = await computeEta({
      apiKey: "server-key",
      building,
      departureAt: now,
      fetchImpl,
      origin: { lat: 35.82, lng: 128.53 },
    });

    expect(result.source).toBe("demo-estimate");
  });
});
