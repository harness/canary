import { describe, it, expect } from "vitest";
import {
  looksLikeCatalogComponent,
  normalizeCatalogNames,
} from "../src/main/collect-pure";

describe("looksLikeCatalogComponent (Set matching)", () => {
  const names = normalizeCatalogNames([
    "❖Button",
    "Button",
    "❖Button/Md/Text",
    "❖Badge",
  ]);

  it("matches exact and path-prefix names", () => {
    expect(looksLikeCatalogComponent("❖Button", names)).toBe(true);
    expect(looksLikeCatalogComponent("Button", names)).toBe(true);
    expect(looksLikeCatalogComponent("❖Button/Md/Text", names)).toBe(true);
    expect(looksLikeCatalogComponent("❖Button/Sm/Text", names)).toBe(true);
    expect(looksLikeCatalogComponent("❖Badge/Default", names)).toBe(true);
  });

  it("rejects unrelated names", () => {
    expect(looksLikeCatalogComponent("Frame 12", names)).toBe(false);
    expect(looksLikeCatalogComponent("prefix", names)).toBe(false);
  });

  it("returns false for an empty catalog set", () => {
    expect(looksLikeCatalogComponent("Button", new Set())).toBe(false);
  });
});
