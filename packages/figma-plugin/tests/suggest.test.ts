import { describe, it, expect } from "vitest";
import { suggestClosestValue, levenshtein } from "../src/core/suggest";

describe("levenshtein", () => {
  it("computes edit distance", () => {
    expect(levenshtein("primary", "primry")).toBe(1);
    expect(levenshtein("ghost", "ghost")).toBe(0);
  });
});

describe("suggestClosestValue", () => {
  const variants = [
    "primary",
    "secondary",
    "outline",
    "ai",
    "ghost",
    "link",
    "transparent",
  ];

  it("suggests primary for typo primry", () => {
    expect(suggestClosestValue("primry", variants)).toBe("primary");
  });

  it("returns null when no candidate within threshold (subtle)", () => {
    // subtle is distance > 2 from all Button variants
    expect(suggestClosestValue("subtle", variants)).toBeNull();
  });

  it("returns null for exact match (not a typo)", () => {
    expect(suggestClosestValue("ghost", variants)).toBeNull();
  });

  it("respects custom threshold", () => {
    expect(suggestClosestValue("subtly", ["subtle"], 2)).toBe("subtle");
    expect(suggestClosestValue("zzzzzz", variants, 2)).toBeNull();
  });
});
