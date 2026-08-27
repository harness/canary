import { describe, it, expect, vi } from "vitest";
import {
  resolveCatalogUrl,
  indexFromPack,
  indexFromCatalogPack,
  isCatalogPack,
  loadCatalogFromUrl,
  mapPool,
  CatalogLoadError,
  cachePayloadFromIndex,
  cacheMatchesUrl,
  indexFromCache,
} from "../src/catalog/loadCatalog";
import { loadBundledCatalog } from "../src/catalog/bundled";
import { badge, button, manifest, pilotManifest } from "./helpers/pilotCatalog";

const samplePack = {
  formatVersion: 1 as const,
  packedAt: "2026-08-07T00:00:00.000Z",
  manifest: pilotManifest,
  entries: [button, badge],
};

describe("resolveCatalogUrl", () => {
  it("joins relative paths against the manifest URL", () => {
    expect(
      resolveCatalogUrl(
        "https://cdn.example.com/canary/manifest.json",
        "button.catalog.json",
      ),
    ).toBe("https://cdn.example.com/canary/button.catalog.json");
  });

  it("keeps absolute https URLs", () => {
    expect(
      resolveCatalogUrl(
        "https://cdn.example.com/canary/manifest.json",
        "https://other.example.com/x.json",
      ),
    ).toBe("https://other.example.com/x.json");
  });
});

describe("indexFromPack / bundled", () => {
  it("builds an index from bundled canary pack JSON", () => {
    const index = loadBundledCatalog("canary");
    expect(index.manifest.system.id).toBe("canary");
    expect(index.entries.map((e) => e.id)).toContain("canary.button");
    expect(index.byFigmaName.get("❖Button")?.id).toBe("canary.button");
  });

  it("rejects invalid packs", () => {
    expect(() => indexFromPack({ version: "1" }, [])).toThrow(CatalogLoadError);
  });

  it("parses explicit pack arrays", () => {
    const index = indexFromPack(pilotManifest, [button, badge]);
    expect(index.entries).toHaveLength(2);
  });

  it("detects and indexes formatVersion 1 packs", () => {
    expect(isCatalogPack(samplePack)).toBe(true);
    expect(isCatalogPack(manifest)).toBe(false);
    const index = indexFromCatalogPack(samplePack);
    expect(index.entries).toHaveLength(2);
  });
});

describe("mapPool", () => {
  it("preserves order under concurrency", async () => {
    const out = await mapPool([1, 2, 3, 4, 5], 2, async (n) => {
      await new Promise((r) => setTimeout(r, 5 - n));
      return n * 10;
    });
    expect(out).toEqual([10, 20, 30, 40, 50]);
  });
});

describe("loadCatalogFromUrl", () => {
  it("loads a single pack JSON in one fetch", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => samplePack,
    })) as unknown as typeof fetch;

    const index = await loadCatalogFromUrl(
      "https://cdn.example.com/canary/canary.catalog.pack.json",
      fetchImpl,
    );
    expect(index.entries).toHaveLength(2);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("prefers sibling pack when URL is a manifest", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("manifest.json")) {
        return { ok: true, json: async () => manifest } as Response;
      }
      if (url.endsWith("canary.catalog.pack.json")) {
        return { ok: true, json: async () => samplePack } as Response;
      }
      return { ok: false, status: 404 } as Response;
    });

    const index = await loadCatalogFromUrl(
      "https://cdn.example.com/canary/manifest.json",
      fetchImpl as unknown as typeof fetch,
    );
    expect(index.entries).toHaveLength(2);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("falls back to parallel component fetches", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("manifest.json")) {
        return { ok: true, json: async () => pilotManifest } as Response;
      }
      if (url.endsWith("canary.catalog.pack.json")) {
        return { ok: false, status: 404 } as Response;
      }
      if (url.endsWith("button.catalog.json")) {
        return { ok: true, json: async () => button } as Response;
      }
      if (url.endsWith("badge.catalog.json")) {
        return { ok: true, json: async () => badge } as Response;
      }
      return { ok: false, status: 404 } as Response;
    });

    const progress: Array<{ phase: string; loaded: number; total: number }> = [];
    const index = await loadCatalogFromUrl(
      "https://cdn.example.com/canary/manifest.json",
      {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        concurrency: 8,
        onProgress: (p) => progress.push({ ...p }),
      },
    );
    expect(index.entries).toHaveLength(2);
    expect(progress.some((p) => p.phase === "entries" && p.total === 2)).toBe(
      true,
    );
  });

  it("maps network failures", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    await expect(
      loadCatalogFromUrl(
        "https://cdn.example.com/manifest.json",
        fetchImpl as unknown as typeof fetch,
      ),
    ).rejects.toMatchObject({ code: "CATALOG_NETWORK" });
  });
});

describe("catalog cache helpers", () => {
  it("round-trips index through cache payload", () => {
    const index = loadBundledCatalog();
    const payload = cachePayloadFromIndex(
      { type: "url", manifestUrl: "https://cdn.example.com/canary.catalog.pack.json" },
      index,
      "2026-08-07T12:00:00.000Z",
    );
    expect(
      cacheMatchesUrl(
        payload,
        "https://cdn.example.com/canary.catalog.pack.json",
      ),
    ).toBe(true);
    expect(cacheMatchesUrl(payload, "https://other.example.com/x.json")).toBe(
      false,
    );
    const restored = indexFromCache(payload);
    expect(restored.entries.map((e) => e.id).sort()).toEqual(
      index.entries.map((e) => e.id).sort(),
    );
  });
});
