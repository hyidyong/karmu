"use client";

import type { EtaResponse } from "@/domain/eta/types";
import { buildRecommendationSearchParams } from "@/lib/recommendation/search-params";

export type DeparturePhase = "idle" | "locating" | "calculating" | "fallback" | "error";

type GeolocationLike = {
  getCurrentPosition: (
    success: (position: { coords: { latitude: number; longitude: number } }) => void,
    failure?: () => void,
    options?: PositionOptions,
  ) => void;
};

type RequestDepartureEtaOptions = {
  fetchImpl?: typeof fetch;
  geolocation?: GeolocationLike | null;
  onPhase?: (phase: DeparturePhase) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEtaResponse(value: unknown): value is EtaResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.buildingId === "string" &&
    typeof value.departureAt === "string" &&
    typeof value.arrivalAt === "string" &&
    typeof value.travelMinutes === "number" &&
    Number.isFinite(value.travelMinutes) &&
    value.travelMinutes > 0 &&
    typeof value.distanceMeters === "number" &&
    Number.isFinite(value.distanceMeters) &&
    value.distanceMeters >= 0 &&
    (value.source === "google-routes" || value.source === "demo-estimate")
  );
}

function getDefaultGeolocation(): GeolocationLike | null {
  return typeof navigator === "undefined" ? null : navigator.geolocation;
}

function locate(geolocation: GeolocationLike | null): Promise<{ lat: number; lng: number }> {
  if (!geolocation) {
    return Promise.reject(new Error("geolocation-unavailable"));
  }

  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => reject(new Error("geolocation-denied")),
      { enableHighAccuracy: true, timeout: 7_000, maximumAge: 60_000 },
    );
  });
}

async function postEta(
  buildingId: string,
  body: Record<string, unknown>,
  fetchImpl: typeof fetch,
): Promise<EtaResponse> {
  const response = await fetchImpl("/api/eta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buildingId, ...body }),
  });

  if (!response.ok) {
    throw new Error("eta-request-failed");
  }

  const payload: unknown = await response.json();
  if (!isEtaResponse(payload) || payload.buildingId !== buildingId) {
    throw new Error("eta-response-invalid");
  }

  return payload;
}

export async function requestDepartureEta(
  buildingId: string,
  options: RequestDepartureEtaOptions = {},
): Promise<EtaResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const geolocation = options.geolocation === undefined
    ? getDefaultGeolocation()
    : options.geolocation;

  options.onPhase?.("locating");

  try {
    const origin = await locate(geolocation);
    options.onPhase?.("calculating");
    return await postEta(buildingId, { origin }, fetchImpl);
  } catch {
    options.onPhase?.("fallback");
    try {
      return await postEta(buildingId, { useDemoOrigin: true }, fetchImpl);
    } catch {
      options.onPhase?.("error");
      throw new Error("현재 경로를 계산하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }
}

export function buildRecommendationUrl(response: EtaResponse): string {
  const query = buildRecommendationSearchParams({
    buildingId: response.buildingId,
    arrivalAt: response.arrivalAt,
    trip: {
      departureAt: response.departureAt,
      travelMinutes: response.travelMinutes,
      distanceMeters: response.distanceMeters,
      source: response.source,
    },
  });

  return `/recommend?${query}`;
}
