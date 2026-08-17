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

const propertyValueGuidanceSchema = z
  .object({
    value: scalar,
    useWhen: z.array(nonEmptyString).min(1),
    avoidWhen: z.array(nonEmptyString).min(1)
  })
  .strict()

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
    matches: z
      .array(
        z
          .object({
            contains: nonEmptyString,
            value: scalar
          })
          .strict()
      )
      .min(1),
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

const canonicalPropertySchema = z
  .object({
    id: idString,
    name: nonEmptyString,
    description: nonEmptyString,
    type: z.enum(['boolean', 'enum', 'number', 'string', 'node', 'function', 'object']),
    values: z.array(scalar).min(1).optional(),
    valueGuidance: z.array(propertyValueGuidanceSchema).min(1).optional(),
    default: scalar.optional(),
    required: z.boolean().optional(),
    bindings: z
      .object({
        figma: figmaPropertySurfaceBindingSchema.optional(),
        react: reactPropertySurfaceBindingSchema.optional()
      })
      .strict()
      .refine(value => Boolean(value.figma || value.react), 'at least one surface binding is required')
  })
  .strict()
  .superRefine((property, context) => {
    if (property.type === 'enum' && !property.values) {
      context.addIssue({ code: 'custom', path: ['values'], message: 'enum properties must declare allowed values' })
    }
    if (property.values && property.default !== undefined && !property.values.includes(property.default)) {
      context.addIssue({ code: 'custom', path: ['default'], message: 'default must be one of the allowed values' })
    }
    if (property.valueGuidance) {
      if (property.type !== 'enum' || !property.values) {
        context.addIssue({
          code: 'custom',
          path: ['valueGuidance'],
          message: 'value guidance is supported only for enum properties'
        })
        return
      }

      const guidedValues = property.valueGuidance.map(guidance => guidance.value)
      if (new Set(guidedValues).size !== guidedValues.length) {
        context.addIssue({ code: 'custom', path: ['valueGuidance'], message: 'value guidance values must be unique' })
      }
      if (guidedValues.some(value => !property.values.includes(value))) {
        context.addIssue({
          code: 'custom',
          path: ['valueGuidance'],
          message: 'value guidance must reference allowed enum values'
        })
      }
      if (property.values.some(value => !guidedValues.includes(value))) {
        context.addIssue({
          code: 'custom',
          path: ['valueGuidance'],
          message: 'value guidance must cover every allowed enum value'
        })
      }
    }
  })

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
      .object({
        figma: anatomyBindingSchema.optional(),
        react: anatomyBindingSchema.optional()
      })
      .strict()
      .optional()
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
      .object({
        figma: stateSurfaceBindingSchema.optional(),
        react: stateSurfaceBindingSchema.optional()
      })
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
    requirementId: idString.optional()
  })
  .strict()

const tokenBindingSchema = z
  .object({
    id: idString,
    partId: idString,
    channel: nonEmptyString,
    token: nonEmptyString,
    stateId: idString.optional(),
    conditions: z.record(nonEmptyString, z.array(scalar).min(1)).optional(),
    bindings: z
      .object({
        figma: nonEmptyString.optional(),
        react: nonEmptyString.optional()
      })
      .strict()
      .optional()
  })
  .strict()

const accessibilityRuleSchema = z
  .object({
    id: idString,
    statement: nonEmptyString,
    requirementId: idString.optional()
  })
  .strict()

const usageRuleSchema = z
  .object({
    id: idString,
    statement: nonEmptyString
  })
  .strict()

const requirementSchema = z
  .object({
    id: idString,
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

const verificationSchema = z
  .object({
    id: idString,
    requirementId: idString,
    result: z.enum(['pass', 'fail', 'unavailable']),
    verifiedAt: isoDate,
    sourceIds: z.array(idString).min(1),
    notes: nonEmptyString.optional()
  })
  .strict()

const figmaSurfaceSchema = z
  .object({
    library: nonEmptyString,
    fileKey: nonEmptyString,
    names: z.array(nonEmptyString).min(1),
    exampleNodeId: nonEmptyString,
    mappingStatus: z.enum(['unverified', 'verified']),
    componentKeys: z.array(nonEmptyString),
    candidateComponentKeys: z.array(nonEmptyString),
    codeConnect: z.array(nonEmptyString)
  })
  .strict()

const reactSurfaceSchema = z
  .object({
    package: nonEmptyString,
    export: nonEmptyString,
    import: nonEmptyString,
    path: nonEmptyString
  })
  .strict()

export const componentContractSchemaV04 = z
  .object({
    schemaVersion: z.literal('0.4.0'),
    contractVersion: nonEmptyString,
    identity: z
      .object({
        id: contractId,
        name: nonEmptyString,
        summary: nonEmptyString,
        aliases: z.array(nonEmptyString)
      })
      .strict(),
    semantics: z
      .object({
        purpose: nonEmptyString,
        useWhen: z.array(nonEmptyString).min(1),
        avoidWhen: z.array(nonEmptyString).min(1),
        roles: z.array(nonEmptyString).min(1)
      })
      .strict(),
    lifecycle: z
      .object({
        status: z.enum(['draft', 'piloting', 'stable', 'deprecated']),
        publishedAt: isoDate.optional(),
        replacementId: contractId.optional()
      })
      .strict(),
    ownership: z
      .object({
        team: nonEmptyString,
        contacts: z.array(nonEmptyString).min(1)
      })
      .strict(),
    surfaces: z
      .object({
        figma: figmaSurfaceSchema.optional(),
        react: reactSurfaceSchema.optional()
      })
      .strict()
      .refine(value => Boolean(value.figma || value.react), 'at least one governed surface is required'),
    anatomy: z.array(anatomyPartSchema).min(1),
    properties: z.array(canonicalPropertySchema).min(1),
    states: z.array(stateSchema).min(1),
    constraints: z
      .object({
        exhaustive: z.boolean(),
        dimensions: z.array(idString).min(1),
        rules: z.array(constraintRuleSchema).min(1)
      })
      .strict(),
    tokens: z.array(tokenBindingSchema),
    accessibility: z.array(accessibilityRuleSchema).min(1),
    usage: z
      .object({
        do: z.array(usageRuleSchema).min(1),
        dont: z.array(usageRuleSchema).min(1),
        relatedComponents: z.array(nonEmptyString)
      })
      .strict(),
    requirements: z.array(requirementSchema).min(1),
    migrations: z.array(migrationSchema),
    evidence: z
      .object({
        sources: z.array(evidenceSourceSchema).min(1),
        verifications: z.array(verificationSchema)
      })
      .strict()
  })
  .strict()

export const evaluationProfileSchema = z
  .object({
    version: nonEmptyString,
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
