import { z } from 'zod'

export const HEALTH_DIMENSIONS = [
  'contractDefinition',
  'figmaImplementation',
  'codeImplementation',
  'designCodeParity',
  'governanceEvidence'
]

export const REQUIREMENT_SEVERITIES = ['critical', 'major', 'minor', 'informational']
export const ENFORCEMENT_MODES = ['automated', 'manual', 'advisory']

const nonEmptyString = z.string().trim().min(1)
const idString = z.string().regex(/^[A-Za-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*$/)
const contractId = z.string().regex(/^canary\.[a-z0-9-]+$/)
const isoDate = z.string().date()
const scalar = z.union([z.string(), z.number(), z.boolean(), z.null()])
const surfaceName = z.enum(['figma', 'react'])
const propertyType = z.enum(['boolean', 'enum', 'number', 'string', 'slot', 'function', 'object'])

const figmaPropertyBinding = z
  .object({
    kind: z.literal('property'),
    property: nonEmptyString,
    aliases: z.array(nonEmptyString).optional(),
    valueAliases: z.record(nonEmptyString, nonEmptyString).optional()
  })
  .strict()

const figmaComponentNameBinding = z
  .object({
    kind: z.literal('componentName'),
    source: z.enum(['componentSetName', 'mainComponentName']),
    matches: z.array(z.object({ contains: nonEmptyString, value: scalar }).strict()).min(1),
    fallback: scalar.optional()
  })
  .strict()

export const figmaPropertySurfaceBindingSchema = z.discriminatedUnion('kind', [
  figmaPropertyBinding,
  figmaComponentNameBinding
])

export const reactPropertySurfaceBindingSchema = z
  .object({
    kind: z.enum(['prop', 'slot', 'composition', 'pseudoClass', 'behavior']),
    name: nonEmptyString.optional(),
    type: nonEmptyString.optional(),
    target: nonEmptyString.optional(),
    transform: nonEmptyString.optional()
  })
  .strict()
  .superRefine((binding, context) => {
    if (binding.kind === 'prop' && !binding.name) {
      context.addIssue({ code: 'custom', path: ['name'], message: 'prop bindings require a name' })
    }
    if (binding.kind !== 'prop' && !binding.target) {
      context.addIssue({ code: 'custom', path: ['target'], message: `${binding.kind} bindings require a target` })
    }
  })

const propertyFields = {
  id: idString,
  name: nonEmptyString,
  description: nonEmptyString,
  type: propertyType,
  values: z.array(scalar).min(1).optional(),
  default: scalar.optional(),
  required: z.boolean().optional()
}

function validateProperty(property, context) {
  if (property.type === 'enum' && !property.values) {
    context.addIssue({ code: 'custom', path: ['values'], message: 'enum properties must declare allowed values' })
  }
  if (property.values && property.default !== undefined && !property.values.includes(property.default)) {
    context.addIssue({ code: 'custom', path: ['default'], message: 'default must be one of the allowed values' })
  }
}

const canonicalPropertySchema = z
  .object({
    ...propertyFields,
    bindings: z
      .object({
        figma: figmaPropertySurfaceBindingSchema.optional(),
        react: reactPropertySurfaceBindingSchema.optional()
      })
      .strict()
      .refine(value => Boolean(value.figma || value.react), 'at least one surface binding is required')
  })
  .strict()
  .superRefine(validateProperty)

const surfaceExtensionSchema = z
  .object({ ...propertyFields, binding: reactPropertySurfaceBindingSchema })
  .strict()
  .superRefine(validateProperty)

const anatomyBindingSchema = z
  .object({
    kind: z.enum(['root', 'layer', 'property', 'slot', 'composition']),
    target: nonEmptyString.optional(),
    names: z.array(nonEmptyString).min(1).optional(),
    property: nonEmptyString.optional(),
    aliases: z.array(nonEmptyString).min(1).optional(),
    visibleWhen: z.record(nonEmptyString, scalar).optional()
  })
  .strict()

const anatomyPartSchema = z
  .object({
    id: idString,
    name: nonEmptyString,
    description: nonEmptyString,
    presence: z.enum(['required', 'optional', 'conditional', 'repeatable']),
    role: nonEmptyString.optional(),
    parentId: idString.optional(),
    content: z.array(nonEmptyString).min(1).optional(),
    bindings: z
      .object({ figma: anatomyBindingSchema.optional(), react: anatomyBindingSchema.optional() })
      .strict()
      .optional()
  })
  .strict()

const slotSchema = z
  .object({
    id: idString,
    name: nonEmptyString,
    description: nonEmptyString,
    partId: idString,
    presence: z.enum(['required', 'optional', 'conditional', 'repeatable']),
    minItems: z.number().int().nonnegative(),
    maxItems: z.number().int().positive().optional(),
    allowedContent: z.array(nonEmptyString).min(1),
    defaultExampleId: idString.optional(),
    bindings: z.object({ figma: anatomyBindingSchema.optional(), react: anatomyBindingSchema.optional() }).strict()
  })
  .strict()

const stateSurfaceBindingSchema = z
  .object({
    kind: z.enum(['property', 'pseudoClass', 'behavior', 'specification', 'unavailable']),
    property: nonEmptyString.optional(),
    value: scalar.optional(),
    target: nonEmptyString.optional(),
    reference: nonEmptyString.optional()
  })
  .strict()

const stateSchema = z
  .object({
    id: idString,
    name: nonEmptyString,
    description: nonEmptyString,
    required: z.boolean(),
    bindings: z
      .object({ figma: stateSurfaceBindingSchema.optional(), react: stateSurfaceBindingSchema.optional() })
      .strict(),
    fidelity: z
      .object({
        figma: z.enum(['exact', 'approximate', 'specification', 'unsupported']).optional(),
        react: z.enum(['exact', 'approximate', 'specification', 'unsupported']).optional()
      })
      .strict()
  })
  .strict()

const constraintRuleSchema = z
  .object({
    id: idString,
    status: z.enum(['supported', 'deprecated', 'unsupported']),
    surfaces: z.array(surfaceName).min(1),
    conditions: z.record(nonEmptyString, z.array(scalar).min(1)),
    description: nonEmptyString,
    migrationId: idString.optional(),
    ruleId: idString.optional()
  })
  .strict()

const tokenBindingSchema = z
  .object({
    id: idString,
    partId: idString,
    channel: nonEmptyString,
    tokenId: idString,
    stateId: idString.optional(),
    conditions: z.record(nonEmptyString, z.array(scalar).min(1)).optional(),
    bindings: z.object({ figma: nonEmptyString.optional(), react: nonEmptyString.optional() }).strict().optional()
  })
  .strict()

const presentationPartSchema = z
  .object({
    partId: idString,
    layout: z
      .object({
        direction: z.enum(['block', 'inline', 'block-reverse', 'inline-reverse']).optional(),
        align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
        justify: z.enum(['start', 'center', 'end', 'between']).optional()
      })
      .strict()
      .optional(),
    tokens: z.record(nonEmptyString, idString).optional()
  })
  .strict()

const ruleSchema = z
  .object({
    id: idString,
    category: z.enum(['semantics', 'structure', 'accessibility', 'api', 'parity', 'governance']),
    dimension: z.enum(HEALTH_DIMENSIONS),
    severity: z.enum(REQUIREMENT_SEVERITIES),
    enforcement: z.enum(ENFORCEMENT_MODES),
    statement: nonEmptyString,
    remediation: nonEmptyString.optional(),
    evaluator: z
      .enum([
        'schema',
        'libraryIdentity',
        'propertyValues',
        'constraint',
        'anatomy',
        'source',
        'parity',
        'evidence',
        'manual'
      ])
      .optional(),
    maxAgeDays: z.number().int().positive().optional()
  })
  .strict()

const usageRuleSchema = z.object({ id: idString, statement: nonEmptyString }).strict()
const migrationSchema = z
  .object({
    id: idString,
    from: nonEmptyString,
    to: nonEmptyString,
    instructions: nonEmptyString,
    owner: nonEmptyString.optional(),
    target: nonEmptyString.optional()
  })
  .strict()

const evidenceSourceSchema = z
  .object({
    id: idString,
    type: z.enum(['source', 'docs', 'tests', 'code-connect', 'plugin', 'figma', 'decision']),
    path: nonEmptyString
  })
  .strict()

const exampleSchema = z
  .object({
    id: idString,
    name: nonEmptyString,
    purpose: nonEmptyString,
    status: z.enum(['recommended', 'illustrative']),
    properties: z.record(idString, scalar),
    slots: z.record(idString, z.array(nonEmptyString)),
    references: z
      .object({
        figmaNodeId: nonEmptyString.optional(),
        code: nonEmptyString.optional(),
        docs: nonEmptyString.optional()
      })
      .strict()
      .optional()
  })
  .strict()

const figmaSurfaceSchema = z
  .object({
    library: nonEmptyString,
    fileKey: nonEmptyString,
    names: z.array(nonEmptyString).min(1),
    exampleNodeId: nonEmptyString,
    mappingStatus: z.enum(['unverified', 'verified']),
    componentKeys: z.array(nonEmptyString).default([]),
    codeConnect: z.array(nonEmptyString).default([])
  })
  .strict()

const reactSurfaceSchema = z
  .object({
    package: nonEmptyString,
    export: nonEmptyString,
    import: nonEmptyString,
    path: nonEmptyString,
    extensions: z.array(surfaceExtensionSchema).default([])
  })
  .strict()

export const componentContractSchemaV05 = z
  .object({
    schemaVersion: z.literal('0.5.0'),
    contractVersion: nonEmptyString,
    identity: z
      .object({
        id: contractId,
        name: nonEmptyString,
        summary: nonEmptyString,
        aliases: z.array(nonEmptyString).default([])
      })
      .strict(),
    semantics: z
      .object({
        useWhen: z.array(nonEmptyString).min(1),
        avoidWhen: z.array(nonEmptyString).min(1),
        roles: z.array(nonEmptyString).min(1)
      })
      .strict(),
    lifecycle: z
      .object({ status: z.enum(['draft', 'piloting', 'stable', 'deprecated']), replacementId: contractId.optional() })
      .strict(),
    ownership: z.object({ team: nonEmptyString, contacts: z.array(nonEmptyString).min(1) }).strict(),
    surfaces: z
      .object({ figma: figmaSurfaceSchema.optional(), react: reactSurfaceSchema.optional() })
      .strict()
      .refine(value => Boolean(value.figma || value.react), 'at least one governed surface is required'),
    anatomy: z.array(anatomyPartSchema).min(1),
    properties: z.array(canonicalPropertySchema).min(1),
    slots: z.array(slotSchema).min(1),
    states: z.array(stateSchema).min(1),
    constraints: z
      .object({
        exhaustive: z.boolean(),
        dimensions: z.array(idString).min(1),
        combinations: z.array(constraintRuleSchema).default([])
      })
      .strict(),
    presentation: z
      .object({
        parts: z.array(presentationPartSchema).min(1),
        variants: z
          .array(
            z
              .object({
                id: idString,
                stateId: idString.optional(),
                conditions: z.record(idString, z.array(scalar).min(1)).optional(),
                parts: z.array(presentationPartSchema).min(1)
              })
              .strict()
          )
          .default([])
      })
      .strict(),
    tokens: z.array(tokenBindingSchema).default([]),
    usage: z
      .object({
        do: z.array(usageRuleSchema).min(1),
        dont: z.array(usageRuleSchema).min(1),
        relatedComponents: z.array(nonEmptyString).default([])
      })
      .strict(),
    examples: z.array(exampleSchema).default([]),
    evaluations: z.array(ruleSchema).default([]),
    migrations: z.array(migrationSchema).default([]),
    evidenceReferences: z.object({ sources: z.array(evidenceSourceSchema).default([]) }).strict()
  })
  .strict()

const verificationSchema = z
  .object({
    id: idString,
    ruleId: idString,
    result: z.enum(['pass', 'fail', 'unavailable']),
    verifiedAt: isoDate,
    sourceIds: z.array(idString).min(1),
    notes: nonEmptyString.optional()
  })
  .strict()

export const componentVerificationSchema = z
  .object({
    formatVersion: z.literal('1.0.0'),
    componentId: contractId,
    contractVersion: nonEmptyString,
    publishedAt: isoDate.optional(),
    verifications: z.array(verificationSchema)
  })
  .strict()

export const tokenRegistrySchema = z
  .object({
    version: nonEmptyString,
    tokens: z
      .array(
        z
          .object({
            id: idString,
            kind: z.enum(['component', 'semantic']),
            description: nonEmptyString,
            source: nonEmptyString
          })
          .strict()
      )
      .min(1)
  })
  .strict()

export const evaluationProfileSchema = z
  .object({
    version: nonEmptyString,
    displayName: nonEmptyString.optional(),
    status: z.enum(['pilot', 'stable']).optional(),
    dimensions: z.record(z.enum(HEALTH_DIMENSIONS), z.number().positive()),
    severityWeights: z
      .object({
        critical: z.number().nonnegative(),
        major: z.number().nonnegative(),
        minor: z.number().nonnegative(),
        informational: z.number().nonnegative()
      })
      .strict(),
    thresholds: z
      .object({
        healthy: z.number().min(0).max(100),
        needsAttention: z.number().min(0).max(100),
        atRisk: z.number().min(0).max(100)
      })
      .strict(),
    blockedOnCritical: z.boolean(),
    defaultEvidenceMaxAgeDays: z.number().int().positive()
  })
  .strict()
