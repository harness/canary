import { readdirSync, readFileSync } from 'node:fs'
import { isAbsolute, join, relative, sep } from 'node:path'

import { z } from 'zod'

const nonEmptyString = z.string().trim().min(1)
const surfaceSchema = z.enum(['figma', 'code'])
const propertyValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const scalarPropertyValueTypes = {
  boolean: 'boolean',
  number: 'number',
  string: 'string'
}

const overviewSchema = z
  .object({
    name: nonEmptyString,
    description: nonEmptyString,
    useWhen: z.array(nonEmptyString).min(1),
    avoidWhen: z.array(nonEmptyString).min(1)
  })
  .strict()

const codeSchema = z
  .object({
    package: nonEmptyString,
    export: nonEmptyString,
    import: nonEmptyString,
    path: nonEmptyString
  })
  .strict()

const figmaSchema = z
  .object({
    library: nonEmptyString,
    fileKey: nonEmptyString,
    name: nonEmptyString,
    exampleNodeId: nonEmptyString,
    mappingStatus: z.enum(['unverified', 'verified']),
    componentKeys: z.array(nonEmptyString),
    candidateComponentKeys: z.array(nonEmptyString),
    codeConnect: z.array(nonEmptyString)
  })
  .strict()

const anatomyItemSchema = z
  .object({
    id: nonEmptyString,
    name: nonEmptyString,
    required: z.boolean(),
    description: nonEmptyString
  })
  .strict()

const propertySchema = z
  .object({
    name: nonEmptyString,
    type: z.enum(['boolean', 'enum', 'number', 'react-node', 'string', 'function', 'object']),
    values: z.array(propertyValueSchema).min(1).optional(),
    default: propertyValueSchema.optional(),
    required: z.boolean().optional(),
    description: nonEmptyString,
    figmaProperty: nonEmptyString.optional(),
    figmaPropertyAliases: z.array(nonEmptyString).min(1).optional(),
    figmaValueAliases: z.record(nonEmptyString, nonEmptyString).optional(),
    mapsTo: nonEmptyString.optional(),
    when: nonEmptyString.optional()
  })
  .strict()
  .superRefine((property, context) => {
    if (property.type === 'enum' && !property.values) {
      context.addIssue({
        code: 'custom',
        path: ['values'],
        message: 'enum properties must declare their allowed values'
      })
    }

    if (property.values && property.default !== undefined && !property.values.includes(property.default)) {
      context.addIssue({
        code: 'custom',
        path: ['default'],
        message: 'default must be one of the allowed values'
      })
    }
  })

const stateSchema = z
  .object({
    name: nonEmptyString,
    required: z.boolean(),
    surfaces: z.array(surfaceSchema).min(1),
    description: nonEmptyString
  })
  .strict()

const behaviorSchema = z
  .object({
    id: nonEmptyString,
    description: nonEmptyString
  })
  .strict()

const bindingSchema = z
  .object({
    designProperty: nonEmptyString,
    codeProperty: nonEmptyString,
    transform: nonEmptyString.optional()
  })
  .strict()

const tokenRuleSchema = z
  .object({
    category: nonEmptyString,
    rule: nonEmptyString
  })
  .strict()

const patternSchema = z
  .object({
    id: nonEmptyString,
    description: nonEmptyString,
    rule: nonEmptyString
  })
  .strict()

const evidenceSourceSchema = z
  .object({
    type: z.enum(['source', 'docs', 'tests', 'code-connect', 'plugin', 'figma']),
    path: nonEmptyString
  })
  .strict()

const supportMatrixRuleSchema = z
  .object({
    id: nonEmptyString,
    status: z.enum(['supported', 'deprecated', 'unsupported']),
    surfaces: z.array(surfaceSchema).min(1),
    conditions: z
      .record(nonEmptyString, z.array(propertyValueSchema).min(1))
      .refine(conditions => Object.keys(conditions).length > 0, 'at least one condition is required'),
    description: nonEmptyString,
    migration: nonEmptyString.optional()
  })
  .strict()

export const componentContractSchema = z
  .object({
    schemaVersion: z.literal('0.3.0'),
    contractVersion: nonEmptyString,
    id: z.string().regex(/^canary\.[a-z0-9-]+$/),
    status: z.enum(['draft', 'piloting', 'stable', 'deprecated']),
    surfaces: z.array(surfaceSchema).min(1),
    overview: overviewSchema,
    code: codeSchema.optional(),
    figma: figmaSchema.optional(),
    anatomy: z.array(anatomyItemSchema).min(1),
    properties: z
      .object({
        shared: z.array(propertySchema),
        designOnly: z.array(propertySchema),
        codeOnly: z.array(propertySchema)
      })
      .strict(),
    states: z.array(stateSchema).min(1),
    behavior: z.array(behaviorSchema).min(1),
    accessibility: z
      .object({
        requirements: z.array(nonEmptyString).min(1)
      })
      .strict(),
    supportMatrix: z.array(supportMatrixRuleSchema).min(1).optional(),
    bindings: z.array(bindingSchema).optional(),
    tokens: z
      .object({
        rootClass: nonEmptyString.optional(),
        rules: z.array(tokenRuleSchema).min(1)
      })
      .strict()
      .optional(),
    usage: z
      .object({
        do: z.array(nonEmptyString).min(1),
        dont: z.array(nonEmptyString).min(1),
        relatedComponents: z.array(nonEmptyString)
      })
      .strict(),
    readiness: z
      .object({
        structure: z
          .object({
            autoLayoutRequired: z.boolean(),
            requiredSlots: z.array(nonEmptyString).min(1),
            optionalSlots: z.array(nonEmptyString)
          })
          .strict(),
        states: z
          .object({
            required: z.array(nonEmptyString).min(1)
          })
          .strict(),
        documentation: z
          .object({
            descriptionRequired: z.boolean(),
            codeConnectRequired: z.boolean()
          })
          .strict(),
        accessibility: z
          .object({
            iconOnlyRequiresAccessibleName: z.boolean()
          })
          .strict()
      })
      .strict(),
    patterns: z.array(patternSchema).optional(),
    evidence: z
      .object({
        sources: z.array(evidenceSourceSchema).min(1),
        provisionalFields: z.array(nonEmptyString),
        openQuestions: z.array(nonEmptyString)
      })
      .strict()
  })
  .strict()
  .superRefine((contract, context) => {
    const surfaceSet = new Set(contract.surfaces)
    if (surfaceSet.size !== contract.surfaces.length) {
      context.addIssue({
        code: 'custom',
        path: ['surfaces'],
        message: 'surface names must be unique'
      })
    }

    if (surfaceSet.has('code') && !contract.code) {
      context.addIssue({
        code: 'custom',
        path: ['code'],
        message: 'code metadata is required when the contract governs code'
      })
    }

    if (surfaceSet.has('figma') && !contract.figma) {
      context.addIssue({
        code: 'custom',
        path: ['figma'],
        message: 'Figma metadata is required when the contract governs Figma'
      })
    }

    const allProperties = [
      ...contract.properties.shared,
      ...contract.properties.designOnly,
      ...contract.properties.codeOnly
    ]
    const propertyNames = allProperties.map(property => property.name)
    if (new Set(propertyNames).size !== propertyNames.length) {
      context.addIssue({
        code: 'custom',
        path: ['properties'],
        message: 'property names must be unique across shared, designOnly, and codeOnly'
      })
    }

    const propertiesByName = new Map(allProperties.map(property => [property.name, property]))
    const matrixRuleIds = contract.supportMatrix?.map(rule => rule.id) ?? []
    if (new Set(matrixRuleIds).size !== matrixRuleIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['supportMatrix'],
        message: 'rule ids must be unique'
      })
    }

    for (const [ruleIndex, rule] of (contract.supportMatrix ?? []).entries()) {
      const ruleSurfaces = new Set(rule.surfaces)
      if (ruleSurfaces.size !== rule.surfaces.length) {
        context.addIssue({
          code: 'custom',
          path: ['supportMatrix', ruleIndex, 'surfaces'],
          message: 'surface names must be unique'
        })
      }

      for (const ruleSurface of ruleSurfaces) {
        if (!surfaceSet.has(ruleSurface)) {
          context.addIssue({
            code: 'custom',
            path: ['supportMatrix', ruleIndex, 'surfaces'],
            message: `surface ${ruleSurface} is not governed by this contract`
          })
        }
      }

      for (const [propertyName, values] of Object.entries(rule.conditions)) {
        const property = propertiesByName.get(propertyName)
        if (!property) {
          context.addIssue({
            code: 'custom',
            path: ['supportMatrix', ruleIndex, 'conditions', propertyName],
            message: `unknown property ${propertyName}`
          })
          continue
        }

        if (new Set(values).size !== values.length) {
          context.addIssue({
            code: 'custom',
            path: ['supportMatrix', ruleIndex, 'conditions', propertyName],
            message: 'condition values must be unique'
          })
        }

        const expectedValueType = scalarPropertyValueTypes[property.type]
        if (expectedValueType && values.some(value => typeof value !== expectedValueType)) {
          context.addIssue({
            code: 'custom',
            path: ['supportMatrix', ruleIndex, 'conditions', propertyName],
            message: `values must match the ${property.type} property type`
          })
        }

        if (!['boolean', 'enum', 'number', 'string'].includes(property.type)) {
          context.addIssue({
            code: 'custom',
            path: ['supportMatrix', ruleIndex, 'conditions', propertyName],
            message: `property type ${property.type} cannot be used as a support-matrix condition`
          })
        }

        if (property.values) {
          const unknownValues = values.filter(value => !property.values.includes(value))
          if (unknownValues.length > 0) {
            context.addIssue({
              code: 'custom',
              path: ['supportMatrix', ruleIndex, 'conditions', propertyName],
              message: `values are not declared by ${propertyName}: ${unknownValues.join(', ')}`
            })
          }
        }
      }
    }

    const anatomyIds = new Set(contract.anatomy.map(item => item.id))
    const missingRequiredSlots = contract.readiness.structure.requiredSlots.filter(slot => !anatomyIds.has(slot))
    if (missingRequiredSlots.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['readiness', 'structure', 'requiredSlots'],
        message: `unknown anatomy slots: ${missingRequiredSlots.join(', ')}`
      })
    }

    const stateNames = new Set(contract.states.map(state => state.name))
    const missingRequiredStates = contract.readiness.states.required.filter(state => !stateNames.has(state))
    if (missingRequiredStates.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['readiness', 'states', 'required'],
        message: `undeclared states: ${missingRequiredStates.join(', ')}`
      })
    }

    if (contract.status === 'stable' && contract.figma) {
      if (contract.figma.mappingStatus !== 'verified') {
        context.addIssue({
          code: 'custom',
          path: ['figma', 'mappingStatus'],
          message: 'stable contracts must use verified Figma mappings'
        })
      }

      if (contract.figma.componentKeys.length === 0) {
        context.addIssue({
          code: 'custom',
          path: ['figma', 'componentKeys'],
          message: 'stable contracts must include at least one confirmed component key'
        })
      }
    }
  })

function formatIssue(issue) {
  const path = issue.path.join('.')
  return path ? `${path}: ${issue.message}` : issue.message
}

export function validateComponentContract(contract) {
  const result = componentContractSchema.safeParse(contract)
  if (result.success) {
    return { success: true, errors: [] }
  }

  return {
    success: false,
    errors: result.error.issues.map(formatIssue)
  }
}

function collectContractFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      return collectContractFiles(entryPath)
    }

    return entry.isFile() && entry.name.endsWith('.contract.json') ? [entryPath] : []
  })
}

function packageRelativePath(packageRoot, filePath) {
  return relative(packageRoot, filePath).split(sep).join('/')
}

function resolvePackagePath(packageRoot, filePath) {
  return isAbsolute(filePath) ? filePath : join(packageRoot, filePath)
}

export function validateContractCatalog({
  packageRoot,
  inventoryPath = 'catalog/component-inventory.json',
  contractsRoot = 'catalog/contracts'
}) {
  const resolvedInventoryPath = resolvePackagePath(packageRoot, inventoryPath)
  const resolvedContractsRoot = resolvePackagePath(packageRoot, contractsRoot)
  const errors = []
  const contracts = []

  let inventory
  try {
    inventory = JSON.parse(readFileSync(resolvedInventoryPath, 'utf8'))
  } catch (error) {
    return {
      success: false,
      errors: [`${packageRelativePath(packageRoot, resolvedInventoryPath)}: ${error.message}`],
      contracts
    }
  }

  const inventoryComponents = Array.isArray(inventory.components) ? inventory.components : []
  const seenIds = new Set()

  let contractFiles
  try {
    contractFiles = collectContractFiles(resolvedContractsRoot).sort()
  } catch (error) {
    return {
      success: false,
      errors: [`${packageRelativePath(packageRoot, resolvedContractsRoot)}: ${error.message}`],
      contracts
    }
  }

  for (const contractFile of contractFiles) {
    const contractPath = packageRelativePath(packageRoot, contractFile)
    let contract
    try {
      contract = JSON.parse(readFileSync(contractFile, 'utf8'))
    } catch (error) {
      errors.push(`${contractPath}: ${error.message}`)
      continue
    }

    const validation = validateComponentContract(contract)
    if (!validation.success) {
      errors.push(...validation.errors.map(error => `${contractPath}: ${error}`))
      continue
    }

    if (seenIds.has(contract.id)) {
      errors.push(`${contractPath}: duplicate contract id ${contract.id}`)
      continue
    }
    seenIds.add(contract.id)

    const inventoryEntry = inventoryComponents.find(component => component.id === contract.id)
    if (!inventoryEntry) {
      errors.push(`${contractPath}: no component inventory entry for ${contract.id}`)
    } else if (inventoryEntry.contractPath !== contractPath) {
      errors.push(`${contractPath}: inventory contractPath is ${inventoryEntry.contractPath ?? 'missing'}`)
    }

    contracts.push({
      id: contract.id,
      path: contractPath,
      status: contract.status
    })
  }

  return {
    success: errors.length === 0,
    errors,
    contracts
  }
}
