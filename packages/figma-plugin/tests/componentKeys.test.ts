import { describe, it, expect } from "vitest";
import { matchComponent } from "../src/core/match";
import { badge, button, manifest, pilotIndex } from "./helpers/pilotCatalog";

/**
 * componentKeys were captured 2026-08-06 from HDS | Components 3.0
 * (fileKey AIgjIyUzcuZzuVnuoOyhQE) via Figma MCP
 * `list_file_components_for_code_connect` → `assetKey` (published library key).
 * Desktop Bridge was offline; REST/MCP list still returned published keys.
 *
 * Re-verified 2026-08-06: every key resolves to a COMPONENT_SET in that file
 * (❖Button/Md/Text = 188019ff…, ❖StatusBadge = b115d5f8…). They are therefore
 * *set* keys — an instance reports its variant's own key at runtime, so
 * matching must also try `componentSetKey`.
 */
describe("Canary pilot componentKeys", () => {
  it("pins non-empty Button componentKeys", () => {
    const keys = button.figma.componentKeys ?? [];
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.every((k) => /^[a-f0-9]{40}$/i.test(k))).toBe(true);
    expect(manifest.components.find((c) => c.id === "canary.button")?.componentKeys?.length).toBeGreaterThan(0);
  });

  it("pins non-empty Badge/StatusBadge/Tag componentKeys", () => {
    const keys = badge.figma.componentKeys ?? [];
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain("b115d5f844f94a65ee1ab379e75cd382baea256c"); // ❖StatusBadge
  });

  it("matches ❖Button/Sm/Text by componentKey", () => {
    const result = matchComponent(
      {
        nodeId: "1:1",
        nodeName: "Button",
        mainComponentName: "❖Button/Sm/Text",
        componentKey: "0a05a53168a6327345bd183cd29238b2db657579",
        isFromLibrary: true,
        properties: {},
      },
      pilotIndex(),
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("componentKey");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("matches a variant instance by the ❖Button/Md/Text set key", () => {
    const result = matchComponent(
      {
        nodeId: "1:544",
        nodeName: "❖Button/Md/Text",
        nodeType: "INSTANCE",
        mainComponentName: "variant=primary, state=default",
        componentKey: "the-variant-key-figma-reports-at-runtime",
        componentSetKey: "188019ff5a5c45f3009b963213c98e95dc1c780f",
        componentSetName: "❖Button/Md/Text",
        isFromLibrary: true,
        properties: {},
      },
      pilotIndex(),
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.via).toBe("componentSetKey");
      expect(result.entry.id).toBe("canary.button");
    }
  });

  it("matches path-style Button name without key", () => {
    const result = matchComponent(
      {
        nodeId: "1:1",
        nodeName: "Button",
        mainComponentName: "❖Button/Md/Text",
        componentKey: null,
        isFromLibrary: true,
        properties: {},
      },
      pilotIndex(),
    );
    expect(result.status).toBe("matched");
    if (result.status === "matched") {
      expect(result.entry.id).toBe("canary.button");
    }
  });
});
