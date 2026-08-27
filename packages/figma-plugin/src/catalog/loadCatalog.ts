import type { CatalogEntry, CatalogManifest } from "../schema/schema.js";
import {
  parseCatalogEntry,
  parseCatalogManifest,
  parseCatalogPack,
} from "../schema/schema.js";
import { buildIndex, type CatalogIndex } from "../core/match.js";

export type CatalogSource =
  | { type: "bundled"; systemId: "canary" }
  | { type: "url"; manifestUrl: string };

export type CatalogLoadErrorCode = "CATALOG_NETWORK" | "CATALOG_INVALID";

export class CatalogLoadError extends Error {
  code: CatalogLoadErrorCode;
  constructor(code: CatalogLoadErrorCode, message: string) {
    super(message);
    this.name = "CatalogLoadError";
    this.code = code;
  }
}

export type CatalogCachePayload = {
  fetchedAt: string;
  source: CatalogSource;
  manifest: CatalogManifest;
  entries: CatalogEntry[];
};

export type CatalogLoadProgress = {
  phase: "pack" | "manifest" | "entries";
  loaded: number;
  total: number;
};

export type LoadCatalogFromUrlOptions = {
  fetchImpl?: typeof fetch;
  concurrency?: number;
  onProgress?: (progress: CatalogLoadProgress) => void;
  /** Skip trying `{systemId}.catalog.pack.json` next to a manifest URL. */
  skipPackSibling?: boolean;
};

const DEFAULT_CONCURRENCY = 8;

/** Resolve a component path relative to a manifest URL. */
export function resolveCatalogUrl(manifestUrl: string, relativePath: string): string {
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  try {
    return new URL(relativePath, manifestUrl).href;
  } catch {
    const base = manifestUrl.replace(/\/[^/]*$/, "/");
    return `${base}${relativePath.replace(/^\.\//, "")}`;
  }
}

export function isCatalogPack(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    o.formatVersion === 1 &&
    typeof o.manifest === "object" &&
    o.manifest !== null &&
    Array.isArray(o.entries)
  );
}

export function indexFromPack(
  manifestRaw: unknown,
  entryRaws: unknown[],
): CatalogIndex {
  let manifest: CatalogManifest;
  try {
    manifest = parseCatalogManifest(manifestRaw);
  } catch (err) {
    throw new CatalogLoadError(
      "CATALOG_INVALID",
      err instanceof Error ? err.message : "Invalid catalog manifest",
    );
  }

  const entries: CatalogEntry[] = [];
  for (const raw of entryRaws) {
    try {
      entries.push(parseCatalogEntry(raw));
    } catch (err) {
      throw new CatalogLoadError(
        "CATALOG_INVALID",
        err instanceof Error ? err.message : "Invalid catalog entry",
      );
    }
  }

  for (const c of manifest.components) {
    if (!entries.some((e) => e.id === c.id)) {
      throw new CatalogLoadError(
        "CATALOG_INVALID",
        `Manifest lists ${c.id} but no matching entry was loaded`,
      );
    }
  }

  return buildIndex(manifest, entries);
}

/** Build an index from a formatVersion:1 pack object. */
export function indexFromCatalogPack(raw: unknown): CatalogIndex {
  let pack: ReturnType<typeof parseCatalogPack>;
  try {
    pack = parseCatalogPack(raw);
  } catch (err) {
    throw new CatalogLoadError(
      "CATALOG_INVALID",
      err instanceof Error ? err.message : "Invalid catalog pack",
    );
  }
  return indexFromPack(pack.manifest, pack.entries);
}

export function indexFromCache(cache: CatalogCachePayload): CatalogIndex {
  return indexFromPack(cache.manifest, cache.entries);
}

export function cachePayloadFromIndex(
  source: CatalogSource,
  index: CatalogIndex,
  fetchedAt = new Date().toISOString(),
): CatalogCachePayload {
  return {
    fetchedAt,
    source,
    manifest: index.manifest,
    entries: index.entries,
  };
}

export function cacheMatchesUrl(
  cache: CatalogCachePayload | null | undefined,
  manifestUrl: string,
): boolean {
  if (!cache || cache.source.type !== "url") return false;
  return cache.source.manifestUrl === manifestUrl;
}

export async function fetchWithTimeout(
  url: string,
  ms = 10_000,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetchImpl(url, { signal: controller.signal });
  } catch (err) {
    throw new CatalogLoadError(
      "CATALOG_NETWORK",
      err instanceof Error ? err.message : `Failed to fetch ${url}`,
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Bounded parallel map (stable result order). */
export async function mapPool<T, R>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
  onItemDone?: (done: number, total: number) => void,
): Promise<R[]> {
  const total = items.length;
  if (total === 0) return [];
  const results = new Array<R>(total);
  let next = 0;
  let done = 0;

  const worker = async () => {
    while (true) {
      const i = next;
      next += 1;
      if (i >= total) return;
      results[i] = await fn(items[i]!, i);
      done += 1;
      onItemDone?.(done, total);
    }
  };

  const n = Math.max(1, Math.min(concurrency, total));
  await Promise.all(Array.from({ length: n }, () => worker()));
  return results;
}

async function fetchJson(
  url: string,
  fetchImpl: typeof fetch,
): Promise<unknown> {
  const res = await fetchWithTimeout(url, 10_000, fetchImpl);
  if (!res.ok) {
    throw new CatalogLoadError("CATALOG_NETWORK", `HTTP ${res.status} for ${url}`);
  }
  try {
    return await res.json();
  } catch {
    throw new CatalogLoadError("CATALOG_INVALID", `Not valid JSON: ${url}`);
  }
}

async function loadEntriesFromManifest(
  manifestUrl: string,
  manifest: CatalogManifest,
  fetchImpl: typeof fetch,
  concurrency: number,
  onProgress?: (progress: CatalogLoadProgress) => void,
): Promise<unknown[]> {
  const total = manifest.components.length;
  onProgress?.({ phase: "entries", loaded: 0, total });
  return mapPool(
    manifest.components,
    concurrency,
    async (component) => {
      const url = resolveCatalogUrl(manifestUrl, component.path);
      return fetchJson(url, fetchImpl);
    },
    (loaded, t) => onProgress?.({ phase: "entries", loaded, total: t }),
  );
}

/**
 * Load a remote catalog: prefers a single pack JSON; falls back to manifest +
 * bounded-parallel component fetches. If the URL is a manifest, also tries
 * `{systemId}.catalog.pack.json` beside it before N+1.
 */
export async function loadCatalogFromUrl(
  url: string,
  fetchImplOrOpts: typeof fetch | LoadCatalogFromUrlOptions = fetch,
  maybeOpts?: LoadCatalogFromUrlOptions,
): Promise<CatalogIndex> {
  // Back-compat: loadCatalogFromUrl(url, fetchImpl)
  const opts: LoadCatalogFromUrlOptions =
    typeof fetchImplOrOpts === "function"
      ? { ...maybeOpts, fetchImpl: fetchImplOrOpts }
      : fetchImplOrOpts;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const concurrency = opts.concurrency ?? DEFAULT_CONCURRENCY;
  const onProgress = opts.onProgress;

  onProgress?.({ phase: "pack", loaded: 0, total: 1 });
  const raw = await fetchJson(url, fetchImpl);

  if (isCatalogPack(raw)) {
    onProgress?.({ phase: "pack", loaded: 1, total: 1 });
    return indexFromCatalogPack(raw);
  }

  let manifest: CatalogManifest;
  try {
    manifest = parseCatalogManifest(raw);
  } catch (err) {
    throw new CatalogLoadError(
      "CATALOG_INVALID",
      err instanceof Error
        ? err.message
        : "URL is neither a catalog pack nor a valid manifest",
    );
  }

  onProgress?.({ phase: "manifest", loaded: 1, total: 1 });

  if (!opts.skipPackSibling) {
    const packUrl = resolveCatalogUrl(
      url,
      `${manifest.system.id}.catalog.pack.json`,
    );
    if (packUrl !== url) {
      try {
        onProgress?.({ phase: "pack", loaded: 0, total: 1 });
        const packRaw = await fetchJson(packUrl, fetchImpl);
        if (isCatalogPack(packRaw)) {
          onProgress?.({ phase: "pack", loaded: 1, total: 1 });
          return indexFromCatalogPack(packRaw);
        }
      } catch {
        // Fall through to per-component fetch.
      }
    }
  }

  const entries = await loadEntriesFromManifest(
    url,
    manifest,
    fetchImpl,
    concurrency,
    onProgress,
  );
  return indexFromPack(raw, entries);
}
