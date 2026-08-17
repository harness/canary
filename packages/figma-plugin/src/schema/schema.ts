import { z } from 'zod'

const PropKindSchema = z.enum(['shared', 'designOnly', 'codeOnly'])

export const CatalogPropSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['enum', 'boolean', 'string', 'number', 'function']).optional(),
  values: z.array(z.string()).optional(),
  valueGuidance: z
    .array(
      z.object({
        value: z.string().min(1),
        useWhen: z.array(z.string().min(1)).min(1),
        avoidWhen: z.array(z.string().min(1)).min(1)
      })
    )
    .optional(),
  default: z.union([z.string(), z.boolean(), z.number()]).optional(),
  mapsTo: z.string().optional(),
  when: z.string().optional(),
  figmaNote: z.string().optional(),
  figmaProperty: z.string().optional(),
  figmaPropertyAliases: z.array(z.string().min(1)).optional(),
  figmaValueAliases: z.record(z.string().min(1), z.string().min(1)).optional(),
  figmaCaseInsensitive: z.boolean().optional(),
  figmaBinding: z
    .discriminatedUnion('kind', [
      z.object({
        kind: z.literal('property'),
        property: z.string().min(1),
        aliases: z.array(z.string().min(1)).optional(),
        valueAliases: z.record(z.string().min(1), z.string().min(1)).optional()
      }),
      z.object({
        kind: z.literal('componentName'),
        source: z.enum(['componentSetName', 'mainComponentName']),
        matches: z.array(
          z.object({
            contains: z.string().min(1),
            value: z.union([z.string(), z.number(), z.boolean(), z.null()])
          })
        ),
        fallback: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional()
      })
    ])
    .optional()
})

export const ConstraintRuleSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['supported', 'deprecated', 'unsupported']),
  surfaces: z.array(z.enum(['figma', 'react'])).min(1),
  conditions: z.record(z.string().min(1), z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])).min(1)),
  description: z.string().min(1),
  migrationId: z.string().min(1).optional(),
  requirementId: z.string().min(1).optional()
})

export const CatalogEntrySchema = z.object({
  id: z.string().min(1),
  status: z.enum(['draft', 'piloting', 'stable', 'deprecated']),
  source: z
    .object({
      contractPath: z.string().min(1),
      schemaVersion: z.string().min(1),
      contractVersion: z.string().min(1),
      sha256: z.string().regex(/^[a-f0-9]{64}$/)
    })
    .optional(),
  code: z.object({
    package: z.string(),
    export: z.string(),
    path: z.string().optional(),
    import: z.string().optional()
  }),
  figma: z.object({
    library: z.string().optional(),
    fileKey: z.string().optional(),
    name: z.string(),
    componentKey: z.string().optional(),
    componentKeys: z.array(z.string()).optional(),
    exampleNodeId: z.string().optional(),
    codeConnect: z.string().optional()
  }),
  shared: z.array(CatalogPropSchema),
  designOnly: z.array(CatalogPropSchema),
  codeOnly: z.array(CatalogPropSchema),
  anatomy: z.array(z.record(z.string(), z.unknown())).optional(),
  slots: z.array(z.record(z.string(), z.unknown())).optional(),
  states: z.array(z.record(z.string(), z.unknown())).optional(),
  constraints: z
    .object({
      exhaustive: z.boolean(),
      dimensions: z.array(z.string().min(1)).min(1),
      combinations: z.array(ConstraintRuleSchema).min(1)
    })
    .optional(),
  evaluations: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
  tokenBindings: z.array(z.record(z.string(), z.unknown())).optional(),
  accessibility: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
  presentation: z.record(z.string(), z.unknown()).optional(),
  examples: z.array(z.record(z.string(), z.unknown())).optional(),
  usage: z.record(z.string(), z.unknown()).optional(),
  semantics: z.record(z.string(), z.unknown()).optional(),
  migrations: z.array(z.record(z.string(), z.unknown())).optional(),
  evidenceReferences: z.record(z.string(), z.unknown()).optional(),
  evaluationProfile: z.record(z.string(), z.unknown()).optional(),
  baselineReceipt: z.record(z.string(), z.unknown()).optional(),
  bindings: z.record(z.string(), z.string()).optional(),
  tokens: z.record(z.string(), z.string()).optional(),
  approximation: z.string().optional(),
  patterns: z.array(z.string()).optional()
})

export const CatalogManifestSchema = z.object({
  version: z.string().min(1),
  system: z.object({
    id: z.string().min(1),
    displayName: z.string().min(1)
  }),
  updatedAt: z.string().min(1),
  components: z.array(
    z.object({
      id: z.string().min(1),
      path: z.string().min(1),
      figmaNames: z.array(z.string()).optional(),
      componentKeys: z.array(z.string()).optional()
    })
  )
})

/** One-file runtime/CDN artifact: manifest + all entries. */
export const CatalogPackSchema = z.object({
  formatVersion: z.literal(1),
  packedAt: z.string().min(1),
  manifest: CatalogManifestSchema,
  entries: z.array(CatalogEntrySchema)
})

export type CatalogProp = z.infer<typeof CatalogPropSchema>
export type ConstraintRule = z.infer<typeof ConstraintRuleSchema>
export type CatalogEntry = z.infer<typeof CatalogEntrySchema>
export type CatalogManifest = z.infer<typeof CatalogManifestSchema>
export type CatalogPack = z.infer<typeof CatalogPackSchema>
export type PropKind = z.infer<typeof PropKindSchema>

export function parseCatalogEntry(input: unknown): CatalogEntry {
  return CatalogEntrySchema.parse(input)
}

export function parseCatalogManifest(input: unknown): CatalogManifest {
  return CatalogManifestSchema.parse(input)
}

export function parseCatalogPack(input: unknown): CatalogPack {
  return CatalogPackSchema.parse(input)
}
