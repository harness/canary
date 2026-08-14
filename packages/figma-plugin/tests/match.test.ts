import { describe, it, expect } from "vitest";
import {
  buildIndex,
  componentDisplayName,
  isVariantComboName,
  matchComponent,
} from "../src/core/match";
import { badgeEntry, buttonEntry as entry, pilotManifest } from "./helpers/pilotCatalog";
import type { InstanceSnapshot } from "../src/core/types";

// Inject a known component key for key-match tests
const buttonWithKey = {
  ...entry,
  figma: { ...entry.figma, componentKeys: ["KEY_BUTTON_ABC"] },
};

const index = buildIndex(pilotManifest, [buttonWithKey, badgeEntry]);

function snap(partial: Partial<InstanceSnapshot>): InstanceSnapshot {
  return {
    nodeId: "1:1",
    nodeName: "Button",
    mainComponentName: null,
    componentKey: null,
    isFromLibrary: true,
    properties: {},
    ...partial,
  };
}

describe("matchComponent", () => {
  it("matches by componentKey", () => {
    const result = matchComponent(
      snap({ componentKey: "KEY_BUTTON_ABC" }),
      index,
    );
    expect(result).toEqual({
      status: "matched",
      entry: buttonWithKey,
      via: "componentKey",
    });
  });

  it("matches by exact figma name including ❖", () => {
    const result = matchComponent(
      snap({ mainComponentName: "❖Button" }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("name");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("matches by normalized name without ❖", () => {
    const result = matchComponent(
      snap({ mainComponentName: "Button" }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("returns unmapped for local frame named Button-ish", () => {
    const result = matchComponent(
      snap({
        mainComponentName: "Button-ish",
        nodeName: "Button-ish",
        isFromLibrary: false,
      }),
      index,
    );
    expect(result).toEqual({ status: "unmapped" });
  });

  it("matches Badge by name", () => {
    const result = matchComponent(
      snap({ mainComponentName: "❖Badge" }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.entry.id).toBe("canary.badge");
    }
  });
});

/**
 * A ❖Button in HDS is a COMPONENT_SET: the instance's main component is a
 * variant whose name is the property combination and whose key is not the
 * published key a catalog records.
 */
const VARIANT_COMBO =
  "variant=primary, 👁 disabled=off, state=default, theme=⚫ default";
/** Published key of the ❖Button/Md/Text component set. */
const BUTTON_SET_KEY = "188019ff5a5c45f3009b963213c98e95dc1c780f";

function variantInstance(
  partial: Partial<InstanceSnapshot> = {},
): InstanceSnapshot {
  return snap({
    nodeName: "❖Button/Md/Text",
    nodeType: "INSTANCE",
    mainComponentName: VARIANT_COMBO,
    componentKey: "variant-key-not-in-catalog",
    componentSetName: "❖Button/Md/Text",
    componentSetKey: BUTTON_SET_KEY,
    ...partial,
  });
}

describe("isVariantComboName", () => {
  it("recognizes a property combination", () => {
    expect(isVariantComboName(VARIANT_COMBO)).toBe(true);
    expect(isVariantComboName("size=md")).toBe(true);
  });

  it("leaves real component names alone", () => {
    expect(isVariantComboName("❖Button/Md/Text")).toBe(false);
    expect(isVariantComboName("Button")).toBe(false);
  });
});

describe("componentDisplayName", () => {
  it("prefers the component set over the variant combination", () => {
    expect(componentDisplayName(variantInstance())).toBe("❖Button/Md/Text");
  });

  it("falls back to the layer name when the main name is a combination", () => {
    expect(
      componentDisplayName(
        variantInstance({ nodeName: "Save", componentSetName: null }),
      ),
    ).toBe("Save");
  });
});

describe("variant-set library instances", () => {
  it("matches by the published component-set key", () => {
    const result = matchComponent(
      variantInstance({ componentSetName: "Renamed In Library" }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("componentSetKey");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("matches by the component-set name when the key is unknown", () => {
    const result = matchComponent(
      variantInstance({ componentSetKey: "unpublished-key" }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("name");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("matches Figma hierarchy names with spaces around separators", () => {
    const result = matchComponent(
      variantInstance({
        componentSetKey: "unpublished-key",
        componentSetName: "❖ button / sm / text",
      }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("name");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("falls back to the layer name when the set is unreachable", () => {
    const result = matchComponent(
      variantInstance({ componentSetKey: null, componentSetName: null }),
      index,
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("never matches the variant combination itself", () => {
    const result = matchComponent(
      variantInstance({
        nodeName: "Save",
        componentSetKey: null,
        componentSetName: null,
        mainComponentName: "button=primary",
      }),
      index,
    );
    expect(result).toEqual({ status: "unmapped" });
  });

  it("does not fall back to a renamed layer when the set is known", () => {
    const result = matchComponent(
      variantInstance({
        nodeName: "Button",
        componentSetKey: "unpublished-key",
        componentSetName: "❖Mystery",
      }),
      index,
    );
    expect(result).toEqual({ status: "unmapped" });
  });
});
