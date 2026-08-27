export type MapAvailability = "ready" | "missing-key";

export function getMapAvailability(apiKey?: string): MapAvailability {
  return apiKey?.trim() ? "ready" : "missing-key";
}
