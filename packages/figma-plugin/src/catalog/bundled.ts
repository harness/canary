import canaryPack from "../../catalogs/canary/canary.catalog.pack.json";
import { indexFromCatalogPack } from "./loadCatalog.js";
import type { CatalogIndex } from "../core/match.js";
import type { CatalogSource } from "./loadCatalog.js";

/** Zero-config bundled Canary pack (no network) — single generated pack JSON. */
export function loadBundledCatalog(systemId: "canary" = "canary"): CatalogIndex {
  if (systemId !== "canary") {
    throw new Error(`Unknown bundled system: ${systemId}`);
  }
  return indexFromCatalogPack(canaryPack);
}

export function loadCatalogPackSync(source: CatalogSource): CatalogIndex {
  if (source.type === "bundled") {
    return loadBundledCatalog(source.systemId);
  }
  throw new Error(
    "Remote catalog sources must be loaded asynchronously via loadCatalogFromUrl",
  );
}

export { canaryPack };
