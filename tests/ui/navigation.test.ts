import { describe, expect, it } from "vitest";

import { getActiveNavHref } from "@/components/app-shell/nav-items";

describe("getActiveNavHref", () => {
  it.each([
    ["/", "/"],
    ["/map", "/map"],
    ["/parking/east-gate", "/map"],
    ["/recommend?buildingId=b1", "/recommend"],
    ["/profile", "/profile"],
  ])("maps %s to the %s navigation item", (pathname, expected) => {
    expect(getActiveNavHref(pathname)).toBe(expected);
  });
});
