import { z } from "zod";

const PropKindSchema = z.enum(["shared", "designOnly", "codeOnly"]);

export const CatalogPropSchema = z.object({
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

export const SupportMatrixRuleSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["supported", "deprecated", "unsupported"]),
  surfaces: z.array(z.enum(["figma", "code"])).min(1),
  conditions: z.record(z.string().min(1), z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])).min(1)),
  description: z.string().min(1),
  migration: z.string().min(1).optional(),
});

export const CatalogEntrySchema = z.object({
  id: z.string().min(1),
  status: z.enum(["draft", "piloting", "stable", "deprecated"]),
  source: z
    .object({
      contractPath: z.string().min(1),
      schemaVersion: z.string().min(1),
      contractVersion: z.string().min(1),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .optional(),
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
  supportMatrix: z.array(SupportMatrixRuleSchema).min(1).optional(),
  bindings: z.record(z.string(), z.string()).optional(),
  tokens: z.record(z.string(), z.string()).optional(),
  approximation: z.string().optional(),
  patterns: z.array(z.string()).optional(),
});

export const CatalogManifestSchema = z.object({
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

/** One-file runtime/CDN artifact: manifest + all entries. */
export const CatalogPackSchema = z.object({
  formatVersion: z.literal(1),
  packedAt: z.string().min(1),
  manifest: CatalogManifestSchema,
  entries: z.array(CatalogEntrySchema),
});

export type CatalogProp = z.infer<typeof CatalogPropSchema>;
export type SupportMatrixRule = z.infer<typeof SupportMatrixRuleSchema>;
export type CatalogEntry = z.infer<typeof CatalogEntrySchema>;
export type CatalogManifest = z.infer<typeof CatalogManifestSchema>;
export type CatalogPack = z.infer<typeof CatalogPackSchema>;
export type PropKind = z.infer<typeof PropKindSchema>;

export function parseCatalogEntry(input: unknown): CatalogEntry {
  return CatalogEntrySchema.parse(input);
}

export function parseCatalogManifest(input: unknown): CatalogManifest {
  return CatalogManifestSchema.parse(input);
}

export function parseCatalogPack(input: unknown): CatalogPack {
  return CatalogPackSchema.parse(input);
}
