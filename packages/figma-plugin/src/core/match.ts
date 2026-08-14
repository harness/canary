import type { CatalogEntry, CatalogManifest } from "../schema/schema.js";
import type { InstanceSnapshot } from "./types.js";

export type CatalogIndex = {
  byComponentKey: Map<string, CatalogEntry>;
  byFigmaName: Map<string, CatalogEntry>;
  byNormalizedName: Map<string, CatalogEntry>;
  entries: CatalogEntry[];
  manifest: CatalogManifest;
};

export type MatchResult =
  | {
      status: "matched";
      entry: CatalogEntry;
      via: "componentKey" | "componentSetKey" | "name";
    }
  | { status: "unmapped" };

/** Strip ❖ and similar leading symbols for name matching. */
export function normalizeComponentName(name: string): string {
  return name
    .trim()
    .replace(/^[❖◇◆●■□]\s*/u, "")
    .replace(/\s*\/\s*/gu, "/")
    .trim()
    .toLowerCase();
}

/**
 * Figma names a variant's main component after its property combination —
 * `variant=primary, 👁 disabled=off, state=default`. That string is a property
 * list, not a component name: never match it and never show it to a designer.
 */
export function isVariantComboName(name: string): boolean {
  const parts = name
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return false;
  return parts.every((part) => /^[^=]+=[^=]*$/.test(part));
}

/** The human-readable component name behind a snapshot. */
export function componentDisplayName(snapshot: InstanceSnapshot): string {
  if (snapshot.componentSetName) return snapshot.componentSetName;
  const main = snapshot.mainComponentName;
  if (main && !isVariantComboName(main)) return main;
  return snapshot.nodeName;
}

export function buildIndex(
  manifest: CatalogManifest,
  entries: CatalogEntry[],
): CatalogIndex {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const byComponentKey = new Map<string, CatalogEntry>();
  const byFigmaName = new Map<string, CatalogEntry>();
  const byNormalizedName = new Map<string, CatalogEntry>();

  for (const component of manifest.components) {
    const entry = byId.get(component.id);
    if (!entry) continue;

    const keys = [
      ...(component.componentKeys ?? []),
      ...(entry.figma.componentKeys ?? []),
      ...(entry.figma.componentKey ? [entry.figma.componentKey] : []),
    ];
    for (const key of keys) {
      if (key) byComponentKey.set(key, entry);
    }

    const names = [
      ...(component.figmaNames ?? []),
      entry.figma.name,
    ];
    for (const name of names) {
      if (!name) continue;
      byFigmaName.set(name, entry);
      byNormalizedName.set(normalizeComponentName(name), entry);
    }
  }

  return {
    byComponentKey,
    byFigmaName,
    byNormalizedName,
    entries,
    manifest,
  };
}

function matchByName(
  name: string,
  index: CatalogIndex,
): CatalogEntry | undefined {
  const exact = index.byFigmaName.get(name);
  if (exact) return exact;

  const normalized = normalizeComponentName(name);
  const byNorm = index.byNormalizedName.get(normalized);
  if (byNorm) return byNorm;

  // Published HDS sets use paths like ❖Button/Sm/Text — match catalog root name
  for (const [norm, entry] of index.byNormalizedName) {
    if (normalized.startsWith(`${norm}/`)) return entry;
  }
  return undefined;
}

/**
 * The layer name is the weakest signal, because designers rename instances.
 * Trust it only when the main component offers nothing better: a detached or
 * local copy has no main component at all, and a variant instance on a runtime
 * that cannot reach the component set reports only `size=md, …` as its name.
 */
function canTrustLayerName(snapshot: InstanceSnapshot): boolean {
  if (snapshot.nodeType && snapshot.nodeType !== "INSTANCE") return true;
  if (snapshot.componentSetName) return false;
  const main = snapshot.mainComponentName;
  return !main || isVariantComboName(main);
}

export function matchComponent(
  snapshot: InstanceSnapshot,
  index: CatalogIndex,
): MatchResult {
  if (snapshot.componentKey) {
    const byKey = index.byComponentKey.get(snapshot.componentKey);
    if (byKey) {
      return { status: "matched", entry: byKey, via: "componentKey" };
    }
  }

  // An instance reports the *variant* component's key, while a catalog records
  // the published key of the component set that owns the variants.
  if (snapshot.componentSetKey) {
    const bySetKey = index.byComponentKey.get(snapshot.componentSetKey);
    if (bySetKey) {
      return { status: "matched", entry: bySetKey, via: "componentSetKey" };
    }
  }

  for (const name of [snapshot.componentSetName, snapshot.mainComponentName]) {
    if (!name || isVariantComboName(name)) continue;
    const byName = matchByName(name, index);
    if (byName) return { status: "matched", entry: byName, via: "name" };
  }

  if (canTrustLayerName(snapshot)) {
    const byLayerName = matchByName(snapshot.nodeName, index);
    if (byLayerName) {
      return { status: "matched", entry: byLayerName, via: "name" };
    }
  }

  return { status: "unmapped" };
}

/** Every Figma name the catalog knows, for detached-copy detection. */
export function catalogFigmaNames(index: CatalogIndex): string[] {
  return [...index.byFigmaName.keys()];
}
