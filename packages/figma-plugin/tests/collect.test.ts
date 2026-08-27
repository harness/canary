import { describe, it, expect } from "vitest";
import {
  componentPropertyToPrimitive,
  toInstanceSnapshot,
  PAGE_INSTANCE_CAP,
} from "../src/main/collect-pure";

describe("componentPropertyToPrimitive", () => {
  it("passes through primitives", () => {
    expect(componentPropertyToPrimitive("primary")).toBe("primary");
    expect(componentPropertyToPrimitive(true)).toBe(true);
    expect(componentPropertyToPrimitive(3)).toBe(3);
  });

  it("unwraps { value } objects", () => {
    expect(componentPropertyToPrimitive({ value: "sm" })).toBe("sm");
  });

  it("returns null for nullish", () => {
    expect(componentPropertyToPrimitive(null)).toBeNull();
    expect(componentPropertyToPrimitive(undefined)).toBeNull();
  });
});

describe("toInstanceSnapshot", () => {
  it("maps component properties into a snapshot", () => {
    const snap = toInstanceSnapshot({
      nodeId: "1:2",
      nodeName: "Button",
      mainComponentName: "❖Button",
      componentKey: "KEY",
      isFromLibrary: true,
      componentProperties: {
        variant: "primary",
        "icon#1:1": true,
        nested: { value: "md" },
      },
      propertyDefinitions: [{ name: "variant", type: "VARIANT" }],
    });
    expect(snap.properties).toEqual({
      variant: "primary",
      "icon#1:1": true,
      nested: "md",
    });
    expect(snap.mainComponentName).toBe("❖Button");
    expect(snap.isFromLibrary).toBe(true);
  });
});

describe("PAGE_INSTANCE_CAP", () => {
  it("is 2000", () => {
    expect(PAGE_INSTANCE_CAP).toBe(2000);
  });
});
