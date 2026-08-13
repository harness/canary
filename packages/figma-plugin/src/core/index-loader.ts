import type { CatalogEntry, CatalogManifest } from "../schema/schema.js";
import { buildIndex, type CatalogIndex } from "./match.js";
import { parseCatalogEntry, parseCatalogManifest } from "../schema/schema.js";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Load a catalog pack directory into a CatalogIndex.
 * Pack dir must contain manifest.json + referenced *.catalog.json files.
 */
export function loadCatalogIndex(packDir: string): CatalogIndex {
  const manifest = parseCatalogManifest(
    JSON.parse(readFileSync(path.join(packDir, "manifest.json"), "utf8")),
  ) as CatalogManifest;

  const entries: CatalogEntry[] = [];
  for (const component of manifest.components) {
    const raw = JSON.parse(
      readFileSync(path.join(packDir, component.path), "utf8"),
    );
    entries.push(parseCatalogEntry(raw));
  }

  return buildIndex(manifest, entries);
}
