import { describe, expect, it } from "vitest";

import { getMapAvailability } from "@/components/map/map-availability";

describe("getMapAvailability", () => {
  it("requires a non-empty API key", () => {
    expect(getMapAvailability(undefined)).toBe("missing-key");
    expect(getMapAvailability("   ")).toBe("missing-key");
    expect(getMapAvailability("browser-key")).toBe("ready");
  });
});
