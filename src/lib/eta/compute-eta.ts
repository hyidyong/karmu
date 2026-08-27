import type { EtaRequest, EtaResponse } from "@/domain/eta/types";
import type { Building, Coordinates } from "@/domain/university/types";

const GOOGLE_ROUTES_ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";
const SEOUL_TIME_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  timeZone: "Asia/Seoul",
});
const GOOGLE_DURATION_PATTERN = /^(\d+(?:\.\d+)?)s$/;
const EARTH_RADIUS_METERS = 6_371_000;
const ROAD_DISTANCE_FACTOR = 1.35;
const DEMO_SPEED_KMH = 28;
const MINIMUM_TRAVEL_MINUTES = 8;

type EstimateDemoEtaOptions = {
  building: Building;
  departureAt: Date;
  origin: Coordinates;
};

type ComputeEtaOptions = EstimateDemoEtaOptions & {
  apiKey?: string;
  fetchImpl?: typeof fetch;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidCoordinate(value: unknown): value is Coordinates {
  if (!isRecord(value)) {
    return false;
  }

  const { lat, lng } = value;
  return (
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lng === "number" &&
    Number.isFinite(lng) &&
    lng >= -180 &&
    lng <= 180
  );
}

function formatSeoulTime(value: Date): string {
  return SEOUL_TIME_FORMATTER.format(value);
}

function addMinutes(value: Date, minutes: number): Date {
  return new Date(value.getTime() + minutes * 60_000);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateStraightLineDistance(origin: Coordinates, destination: Coordinates): number {
  const latitudeDistance = toRadians(destination.lat - origin.lat);
  const longitudeDistance = toRadians(destination.lng - origin.lng);
  const originLatitude = toRadians(origin.lat);
  const destinationLatitude = toRadians(destination.lat);

  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDistance / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

function parseGoogleDuration(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = GOOGLE_DURATION_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  const seconds = Number(match[1]);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function parseEtaRequest(value: unknown): EtaRequest | null {
  if (!isRecord(value) || typeof value.buildingId !== "string" || !value.buildingId.trim()) {
    return null;
  }

  if (value.origin !== undefined && !isValidCoordinate(value.origin)) {
    return null;
  }

  const useDemoOrigin = value.useDemoOrigin === true;
  if (value.origin === undefined && !useDemoOrigin) {
    return null;
  }

  return {
    buildingId: value.buildingId.trim(),
    ...(value.origin === undefined ? {} : { origin: value.origin }),
    ...(useDemoOrigin ? { useDemoOrigin: true } : {}),
  };
}

export function estimateDemoEta({
  building,
  departureAt,
  origin,
}: EstimateDemoEtaOptions): EtaResponse {
  const distanceMeters = Math.round(
    calculateStraightLineDistance(origin, building.coordinates) * ROAD_DISTANCE_FACTOR,
  );
  const rawTravelMinutes = (distanceMeters / 1_000 / DEMO_SPEED_KMH) * 60;
  const travelMinutes = Math.max(MINIMUM_TRAVEL_MINUTES, Math.ceil(rawTravelMinutes));

  return {
    buildingId: building.buildingId,
    departureAt: formatSeoulTime(departureAt),
    arrivalAt: formatSeoulTime(addMinutes(departureAt, travelMinutes)),
    travelMinutes,
    distanceMeters,
    source: "demo-estimate",
  };
}

export async function computeEta({
  apiKey,
  building,
  departureAt,
  fetchImpl = fetch,
  origin,
}: ComputeEtaOptions): Promise<EtaResponse> {
  const fallback = () => estimateDemoEta({ building, departureAt, origin });

  if (!apiKey?.trim()) {
    return fallback();
  }

  try {
    const response = await fetchImpl(GOOGLE_ROUTES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: {
          location: {
            latLng: {
              latitude: building.coordinates.lat,
              longitude: building.coordinates.lng,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        departureTime: departureAt.toISOString(),
        languageCode: "ko-KR",
        units: "METRIC",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return fallback();
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.routes) || !isRecord(payload.routes[0])) {
      return fallback();
    }

    const route = payload.routes[0];
    const seconds = parseGoogleDuration(route.duration);
    const distanceMeters = route.distanceMeters;
    if (
      seconds === null ||
      typeof distanceMeters !== "number" ||
      !Number.isFinite(distanceMeters) ||
      distanceMeters < 0
    ) {
      return fallback();
    }

    const travelMinutes = Math.ceil(seconds / 60);
    return {
      buildingId: building.buildingId,
      departureAt: formatSeoulTime(departureAt),
      arrivalAt: formatSeoulTime(addMinutes(departureAt, travelMinutes)),
      travelMinutes,
      distanceMeters: Math.round(distanceMeters),
      source: "google-routes",
    };
  } catch {
    return fallback();
  }
}
