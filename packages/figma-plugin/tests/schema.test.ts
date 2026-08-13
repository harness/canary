import { describe, it, expect } from "vitest";
import { parseCatalogEntry, parseCatalogManifest } from "../src/schema/schema";
import { badge, button, manifest } from "./helpers/pilotCatalog";
import { validateCanaryPack } from "../src/schema/validate";
import { fileURLToPath } from "node:url";
import path from "node:path";

const canaryDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../catalogs/canary",
);

describe("parseCatalogEntry", () => {
  it("parses canary button", () => {
    const entry = parseCatalogEntry(button);
    expect(entry.id).toBe("canary.button");
    expect(entry.shared.find((p) => p.name === "variant")?.values).toContain(
      "primary",
    );
    expect(entry.supportMatrix?.find((rule) => rule.id === "legacy-micro-sizes")?.status).toBe(
      "unsupported",
    );
  });

  it("parses the Badge engine fixture", () => {
    const entry = parseCatalogEntry(badge);
    expect(entry.id).toBe("canary.badge");
    expect(entry.code.export).toBe("StatusBadge");
  });

  it("rejects missing shared", () => {
    expect(() => parseCatalogEntry({ id: "x", status: "draft" })).toThrow();
  });
});

describe("parseCatalogManifest", () => {
  it("parses canary manifest", () => {
    const m = parseCatalogManifest(manifest);
    expect(m.system.id).toBe("canary");
    expect(m.components.map((c) => c.id)).toContain("canary.button");
  });
});

describe("validateCanaryPack", () => {
  it("validates bundled canary pack", () => {
    const result = validateCanaryPack(canaryDir);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
