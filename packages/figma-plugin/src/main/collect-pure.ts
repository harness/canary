import { normalizeComponentName } from "../core/match.js";
import type { InstanceSnapshot } from "../core/types.js";

/** Max instances for a full-page scan before truncation. */
export const PAGE_INSTANCE_CAP = 2_000;

/**
 * Node types that can hold a detached or locally re-made copy of a library
 * component. Instances are collected on their own path.
 */
const DETACHABLE_NODE_TYPES = new Set([
  "COMPONENT",
  "COMPONENT_SET",
  "FRAME",
  "GROUP",
]);

export function isDetachableNodeType(nodeType: string): boolean {
  return DETACHABLE_NODE_TYPES.has(nodeType);
}

export type CollectResult = {
  snapshots: InstanceSnapshot[];
  truncated: boolean;
  scanned: number;
};

/** Map a Figma componentProperties value to a JSON-safe primitive. */
export function componentPropertyToPrimitive(
  value: string | boolean | number | symbol | object | undefined | null,
): string | boolean | number | null {
  if (value === null || value === undefined) return null;
  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return value;
  }
  if (typeof value === "object" && value !== null && "value" in value) {
    const inner = (value as { value: unknown }).value;
    if (
      typeof inner === "string" ||
      typeof inner === "boolean" ||
      typeof inner === "number"
    ) {
      return inner;
    }
  }
  return String(value);
}

/**
 * Pure mapper: build an InstanceSnapshot from already-extracted Figma fields.
 */
export function toInstanceSnapshot(input: {
  nodeId: string;
  nodeName: string;
  mainComponentName: string | null;
  componentKey: string | null;
  componentSetName?: string | null;
  componentSetKey?: string | null;
  isFromLibrary: boolean | null;
  componentProperties: Record<string, unknown>;
  propertyDefinitions?: Array<{ name: string; type: string }>;
  nodeType?: string;
  parentNodeId?: string | null;
}): InstanceSnapshot {
  const properties: Record<string, string | boolean | number> = {};
  for (const [name, raw] of Object.entries(input.componentProperties)) {
    const prim = componentPropertyToPrimitive(
      raw as string | boolean | number | object | null | undefined,
    );
    if (prim !== null) properties[name] = prim;
  }
  return {
    nodeId: input.nodeId,
    nodeName: input.nodeName,
    mainComponentName: input.mainComponentName,
    componentKey: input.componentKey,
    componentSetName: input.componentSetName ?? null,
    componentSetKey: input.componentSetKey ?? null,
    isFromLibrary: input.isFromLibrary,
    properties,
    propertyDefinitions: input.propertyDefinitions,
    nodeType: input.nodeType ?? "INSTANCE",
    parentNodeId: input.parentNodeId ?? null,
  };
}

/** Pre-normalize catalog Figma names once per scan (Set for O(1) lookups). */
export function normalizeCatalogNames(
  names: readonly string[],
): ReadonlySet<string> {
  const set = new Set<string>();
  for (const name of names) {
    const norm = normalizeComponentName(name);
    if (norm) set.add(norm);
  }
  return set;
}

function asNameSet(
  names: ReadonlySet<string> | readonly string[],
): ReadonlySet<string> {
  return names instanceof Set ? names : new Set(names);
}

/**
 * A non-instance node whose name still matches a catalog component — the shape
 * a Button takes after "Detach instance", with or without "Create component".
 *
 * Match = exact name, or any path-prefix of the node name that is in the set
 * (e.g. node `❖Button/Md/Text` matches catalog root `❖Button`).
 */
export function looksLikeCatalogComponent(
  nodeName: string,
  normalizedCatalogNames: ReadonlySet<string> | readonly string[],
): boolean {
  const set = asNameSet(normalizedCatalogNames);
  if (set.size === 0) return false;
  const norm = normalizeComponentName(nodeName);
  if (!norm) return false;
  if (set.has(norm)) return true;
  let idx = norm.length;
  while (true) {
    idx = norm.lastIndexOf("/", idx - 1);
    if (idx <= 0) break;
    if (set.has(norm.slice(0, idx))) return true;
  }
  return false;
}

/** Snapshot for a detached / local copy: no main component, so no library. */
export function toDetachedSnapshot(input: {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  parentNodeId: string | null;
}): InstanceSnapshot {
  return toInstanceSnapshot({
    ...input,
    mainComponentName: null,
    componentKey: null,
    componentSetName: null,
    componentSetKey: null,
    isFromLibrary: false,
    componentProperties: {},
  });
}
