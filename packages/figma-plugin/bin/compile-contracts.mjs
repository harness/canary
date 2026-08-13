#!/usr/bin/env node
/**
 * Compiles Canary component contracts into the Figma plugin catalog pack.
 * Contracts in packages/ui/catalog/contracts remain the source of truth;
 * catalogs/ is generated and must not be authored by hand.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contractsDir = path.resolve(pluginRoot, "../ui/catalog/contracts");
const catalogsRoot = path.join(pluginRoot, "catalogs");
const publicRoot = path.join(pluginRoot, "public", "catalogs");
const SYSTEM_ID = "canary";
const DISPLAY_NAME = "Canary (Harness)";
const CATALOG_PROP_TYPES = new Set(["enum", "boolean", "string", "number", "function"]);

const CatalogPropSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["enum", "boolean", "string", "number", "function"]).optional(),
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

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function catalogType(type) {
  if (type === "react-node") return "string";
  if (CATALOG_PROP_TYPES.has(type)) return type;
  return undefined;
}

function catalogValues(values) {
  if (!Array.isArray(values)) return undefined;
  const strings = values
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value));
  return strings.length > 0 ? strings : undefined;
}

function compileProp(property) {
  const compiled = { name: property.name };
  const type = catalogType(property.type);
  if (type) compiled.type = type;
  const values = catalogValues(property.values);
  if (values) compiled.values = values;
  if (property.default !== undefined && property.default !== null) {
    compiled.default = property.default;
  }
  if (property.mapsTo) compiled.mapsTo = property.mapsTo;
  if (property.when) compiled.when = property.when;
  if (property.figmaProperty) compiled.figmaProperty = property.figmaProperty;
  if (property.description) compiled.figmaNote = property.description;
  return compiled;
}

function figmaDisplayName(contract) {
  const exportName = contract.code?.export;
  if (exportName) return `❖${exportName}`;
  const raw = String(contract.figma?.name ?? "").split(";")[0]?.trim() ?? "";
  const root = raw.replace(/^❌\s*/, "").split("/")[0].trim();
  return root || contract.id;
}

function figmaNamesFromContract(contract) {
  const names = new Set();
  const exportName = contract.code?.export;
  if (exportName) {
    names.add(exportName);
    names.add(`❖${exportName}`);
  }
  for (const part of String(contract.figma?.name ?? "").split(";")) {
    const token = part.trim().replace(/^❌\s*/, "");
    const root = token.split("/")[0].replace(/\{[^}]*\}/g, "").trim();
    if (root) {
      names.add(root);
      names.add(`❖${root}`);
    }
  }
  return [...names];
}

function compileBindings(bindings) {
  if (!Array.isArray(bindings) || bindings.length === 0) return undefined;
  const record = {};
  for (const binding of bindings) {
    if (!binding?.designProperty || !binding?.codeProperty) continue;
    record[binding.designProperty] = binding.transform
      ? `${binding.codeProperty} (${binding.transform})`
      : binding.codeProperty;
  }
  return Object.keys(record).length > 0 ? record : undefined;
}

function compileTokens(tokens) {
  if (!tokens) return undefined;
  const record = {};
  if (tokens.rootClass) record.rootClass = tokens.rootClass;
  for (const rule of tokens.rules ?? []) {
    if (rule?.category && rule?.rule) record[rule.category] = rule.rule;
  }
  return Object.keys(record).length > 0 ? record : undefined;
}

function compilePatterns(patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) return undefined;
  return patterns.map((pattern) => pattern.id).filter(Boolean);
}

export function compileContract(contract) {
  if (!contract?.figma || !contract.code) {
    throw new Error(`${contract?.id ?? "unknown"}: Figma-governed contracts must include code and figma metadata`);
  }

  const codeConnect = Array.isArray(contract.figma.codeConnect)
    ? contract.figma.codeConnect.join(", ")
    : contract.figma.codeConnect;

  const entry = {
    id: contract.id,
    status: contract.status,
    code: {
      package: contract.code.package,
      export: contract.code.export,
      path: contract.code.path,
      import: contract.code.import,
    },
    figma: {
      library: contract.figma.library,
      fileKey: contract.figma.fileKey,
      name: figmaDisplayName(contract),
      exampleNodeId: contract.figma.exampleNodeId,
      componentKeys: contract.figma.componentKeys,
      codeConnect,
    },
    shared: (contract.properties?.shared ?? []).map(compileProp),
    designOnly: (contract.properties?.designOnly ?? []).map(compileProp),
    codeOnly: (contract.properties?.codeOnly ?? []).map(compileProp),
  };

  const bindings = compileBindings(contract.bindings);
  if (bindings) entry.bindings = bindings;
  const tokens = compileTokens(contract.tokens);
  if (tokens) entry.tokens = tokens;
  const patterns = compilePatterns(contract.patterns);
  if (patterns) entry.patterns = patterns;

  return CatalogEntrySchema.parse(entry);
}

function loadFigmaContracts() {
  if (!existsSync(contractsDir)) {
    throw new Error(`Contracts directory missing: ${contractsDir}`);
  }

  const files = readdirSync(contractsDir)
    .filter((file) => file.endsWith(".contract.json"))
    .sort();

  const contracts = [];
  for (const file of files) {
    const contract = readJson(path.join(contractsDir, file));
    if (!Array.isArray(contract.surfaces) || !contract.surfaces.includes("figma")) {
      continue;
    }
    contracts.push(contract);
  }

  if (contracts.length === 0) {
    throw new Error(`No Figma-governed contracts found in ${contractsDir}`);
  }

  return contracts;
}

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function compileCanaryPack({ packedAt = new Date().toISOString() } = {}) {
  const pluginPackage = readJson(path.join(pluginRoot, "package.json"));
  const contracts = loadFigmaContracts();
  const entries = contracts.map(compileContract);
  const components = entries.map((entry, index) => {
    const contract = contracts[index];
    const slug = entry.id.replace(/^canary\./, "");
    return {
      id: entry.id,
      path: `${slug}.catalog.json`,
      figmaNames: figmaNamesFromContract(contract),
      componentKeys: entry.figma.componentKeys ?? [],
    };
  });

  const manifest = {
    version: pluginPackage.version,
    system: { id: SYSTEM_ID, displayName: DISPLAY_NAME },
    updatedAt: packedAt,
    components,
  };

  return {
    formatVersion: 1,
    packedAt,
    manifest,
    entries,
  };
}

function mirrorPublic(systemDir, pack, fileName) {
  mkdirSync(publicRoot, { recursive: true });
  const publicDir = path.join(publicRoot, SYSTEM_ID);
  mkdirSync(publicDir, { recursive: true });
  writeJson(path.join(publicDir, fileName), pack);
  writeJson(path.join(publicDir, "manifest.json"), pack.manifest);
  for (const component of pack.manifest.components) {
    const src = path.join(systemDir, component.path);
    writeFileSync(path.join(publicDir, component.path), readFileSync(src, "utf8"));
  }
}

function main() {
  const pack = compileCanaryPack();
  const systemDir = path.join(catalogsRoot, SYSTEM_ID);
  rmSync(systemDir, { recursive: true, force: true });
  mkdirSync(systemDir, { recursive: true });

  writeJson(path.join(systemDir, "manifest.json"), pack.manifest);
  for (const [index, entry] of pack.entries.entries()) {
    writeJson(path.join(systemDir, pack.manifest.components[index].path), entry);
  }

  const fileName = `${SYSTEM_ID}.catalog.pack.json`;
  writeJson(path.join(systemDir, fileName), pack);
  mirrorPublic(systemDir, pack, fileName);

  console.log(
    `PACKED: ${pack.manifest.system.displayName} v${pack.manifest.version} (${pack.entries.length} components) → ${SYSTEM_ID}/${fileName}`,
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
