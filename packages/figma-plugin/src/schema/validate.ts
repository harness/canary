import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  parseCatalogEntry,
  parseCatalogManifest,
  type CatalogEntry,
  type CatalogManifest,
} from "./schema.js";

export type ValidatePackResult = {
  ok: boolean;
  errors: string[];
  manifest?: CatalogManifest;
  entries?: CatalogEntry[];
};

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function validateCanaryPack(dir: string): ValidatePackResult {
  const errors: string[] = [];
  const entries: CatalogEntry[] = [];

  const manifestPath = path.join(dir, "manifest.json");
  let manifest: CatalogManifest | undefined;

  try {
    manifest = parseCatalogManifest(readJson(manifestPath));
  } catch (err) {
    errors.push(`manifest.json: ${formatErr(err)}`);
    return { ok: false, errors };
  }

  for (const component of manifest.components) {
    const entryPath = path.join(dir, component.path);
    try {
      const entry = parseCatalogEntry(readJson(entryPath));
      if (entry.id !== component.id) {
        errors.push(
          `${component.path}: id "${entry.id}" does not match manifest id "${component.id}"`,
        );
      }
      entries.push(entry);
    } catch (err) {
      errors.push(`${component.path}: ${formatErr(err)}`);
    }
  }

  // Flag orphan *.catalog.json files not listed in the manifest
  const listed = new Set(manifest.components.map((c) => c.path));
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".catalog.json")) continue;
    if (!listed.has(file)) {
      errors.push(`${file}: present on disk but not listed in manifest.json`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    manifest,
    entries: errors.length === 0 ? entries : undefined,
  };
}

function formatErr(err: unknown): string {
  if (err && typeof err === "object" && "issues" in err) {
    const issues = (err as { issues: Array<{ path: (string | number)[]; message: string }> })
      .issues;
    return issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
  }
  return err instanceof Error ? err.message : String(err);
}
