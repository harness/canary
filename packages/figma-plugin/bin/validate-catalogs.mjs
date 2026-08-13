#!/usr/bin/env node
/**
 * Validates all catalog packs under catalogs/.
 * Self-contained (plain Node + zod) so `pnpm catalogs:validate` needs no TS loader.
 * Programmatic API lives in src/schema/ (used by tests and the plugin).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const CatalogPropSchema = z.object({
  name: z.string().min(1),
  type: z
    .enum(["enum", "boolean", "string", "number", "function"])
    .optional(),
  values: z.array(z.string()).optional(),
  default: z.union([z.string(), z.boolean(), z.number()]).optional(),
  mapsTo: z.string().optional(),
  when: z.string().optional(),
  figmaNote: z.string().optional(),
  figmaProperty: z.string().optional(),
  figmaCaseInsensitive: z.boolean().optional(),
});

const CatalogEntrySchema = z.object({
  id: z.string().min(1),
  status: z.enum(["draft", "piloting", "stable", "deprecated"]),
  code: z.object({
    package: z.string(),
    export: z.string(),
    path: z.string().optional(),
    import: z.string().optional(),
  }),
  figma: z.object({
    library: z.string().optional(),
    fileKey: z.string().optional(),
    name: z.string(),
    componentKey: z.string().optional(),
    componentKeys: z.array(z.string()).optional(),
    exampleNodeId: z.string().optional(),
    codeConnect: z.string().optional(),
  }),
  shared: z.array(CatalogPropSchema),
  designOnly: z.array(CatalogPropSchema),
  codeOnly: z.array(CatalogPropSchema),
  bindings: z.record(z.string(), z.string()).optional(),
  tokens: z.record(z.string(), z.string()).optional(),
  approximation: z.string().optional(),
  patterns: z.array(z.string()).optional(),
});

const CatalogManifestSchema = z.object({
  version: z.string().min(1),
  system: z.object({
    id: z.string().min(1),
    displayName: z.string().min(1),
  }),
  updatedAt: z.string().min(1),
  components: z.array(
    z.object({
      id: z.string().min(1),
      path: z.string().min(1),
      figmaNames: z.array(z.string()).optional(),
      componentKeys: z.array(z.string()).optional(),
    }),
  ),
});

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogsRoot = path.join(root, "catalogs");

function formatZod(err) {
  if (err instanceof z.ZodError) {
    return err.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
  }
  return err instanceof Error ? err.message : String(err);
}

function validatePack(dir) {
  const errors = [];
  const manifestPath = path.join(dir, "manifest.json");
  if (!existsSync(manifestPath)) {
    return { ok: false, errors: ["manifest.json missing"], count: 0 };
  }

  let manifest;
  try {
    manifest = CatalogManifestSchema.parse(
      JSON.parse(readFileSync(manifestPath, "utf8")),
    );
  } catch (err) {
    return { ok: false, errors: [`manifest.json: ${formatZod(err)}`], count: 0 };
  }

  for (const component of manifest.components) {
    const entryPath = path.join(dir, component.path);
    try {
      const entry = CatalogEntrySchema.parse(
        JSON.parse(readFileSync(entryPath, "utf8")),
      );
      if (entry.id !== component.id) {
        errors.push(
          `${component.path}: id "${entry.id}" ≠ manifest "${component.id}"`,
        );
      }
    } catch (err) {
      errors.push(`${component.path}: ${formatZod(err)}`);
    }
  }

  const listed = new Set(manifest.components.map((c) => c.path));
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".catalog.json") && !listed.has(file)) {
      errors.push(`${file}: on disk but not in manifest.json`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    count: manifest.components.length,
    label: `${manifest.system.displayName} v${manifest.version}`,
  };
}

let failed = false;
const packs = readdirSync(catalogsRoot, { withFileTypes: true }).filter((d) =>
  d.isDirectory(),
);

if (packs.length === 0) {
  console.error("No catalog packs found under catalogs/");
  process.exit(1);
}

for (const pack of packs) {
  const result = validatePack(path.join(catalogsRoot, pack.name));
  if (!result.ok) {
    failed = true;
    console.error(`FAIL ${pack.name}:`);
    for (const e of result.errors) console.error(`  - ${e}`);
  } else {
    console.log(`OK: ${result.label} (${result.count} components) [${pack.name}]`);
  }
}

process.exit(failed ? 1 : 0);
