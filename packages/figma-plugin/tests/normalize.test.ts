import { describe, it, expect } from "vitest";
import {
  stripFigmaDecorators,
  normalizeFigmaValue,
  normalizePropName,
} from "../src/core/normalize";
import fixtures from "./fixtures/figma-button-props.json";
import type { CatalogProp } from "../src/schema/schema";

describe("stripFigmaDecorators", () => {
  it("strips leading emoji from theme values", () => {
    expect(stripFigmaDecorators("⚫ default")).toBe("default");
    expect(stripFigmaDecorators("⚫ success")).toBe("success");
  });

  it("leaves plain values alone", () => {
    expect(stripFigmaDecorators("primary")).toBe("primary");
  });

  it("trims whitespace", () => {
    expect(stripFigmaDecorators("  ghost  ")).toBe("ghost");
  });

  it("covers fixture decorations", () => {
    for (const row of fixtures.enumDecorations) {
      expect(stripFigmaDecorators(row.raw)).toBe(row.canonical);
    }
  });
});

describe("normalizeFigmaValue", () => {
  const themeProp: CatalogProp = {
    name: "theme",
    type: "enum",
    values: ["default", "success", "danger"],
  };

  it("normalizes emoji-prefixed enums", () => {
    expect(normalizeFigmaValue("⚫ success", themeProp)).toBe("success");
  });

  it("maps Figma-only enum values to their canonical contract value", () => {
    const prop = {
      ...themeProp,
      figmaValueAliases: { "-": "default" },
    } as CatalogProp;

    expect(normalizeFigmaValue("-", prop)).toBe("default");
  });

  it("returns booleans as booleans", () => {
    const disabled: CatalogProp = { name: "disabled", type: "boolean" };
    expect(normalizeFigmaValue(true, disabled)).toBe(true);
    expect(normalizeFigmaValue("true", disabled)).toBe(true);
    expect(normalizeFigmaValue("false", disabled)).toBe(false);
    expect(normalizeFigmaValue(false, disabled)).toBe(false);
  });

  it("case-folds only when catalog opts in", () => {
    const prop: CatalogProp = {
      name: "variant",
      type: "enum",
      values: ["primary"],
      figmaCaseInsensitive: true,
    };
    expect(normalizeFigmaValue("Primary", prop)).toBe("primary");
    const strict: CatalogProp = {
      name: "variant",
      type: "enum",
      values: ["primary"],
    };
    expect(normalizeFigmaValue("Primary", strict)).toBe("Primary");
  });

  it("passes through numbers and plain strings", () => {
    const size: CatalogProp = {
      name: "size",
      type: "enum",
      values: ["sm", "md"],
    };
    expect(normalizeFigmaValue("sm", size)).toBe("sm");
    expect(normalizeFigmaValue(2, { name: "n", type: "number" })).toBe(2);
  });
});

describe("normalizePropName", () => {
  it("strips Figma #id suffixes", () => {
    expect(normalizePropName("icon#1567:1")).toBe("icon");
    expect(normalizePropName("suffix icon#1687:61")).toBe("suffix icon");
    expect(normalizePropName("button text#1567:0")).toBe("button text");
  });

  it("strips leading eye emoji from disabled-style names", () => {
    expect(normalizePropName("👁️ disabled")).toBe("disabled");
  });

  it("is case-insensitive for matching", () => {
    expect(normalizePropName("Variant")).toBe("variant");
  });
});
