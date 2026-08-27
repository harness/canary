import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative, sep } from 'node:path'

import {
  componentContractSchemaV05,
  componentVerificationSchema,
  HEALTH_DIMENSIONS,
  tokenRegistrySchema
} from './component-contract-schema.mjs'

export const componentContractSchema = componentContractSchemaV05

export function classifyPropertySurface(property) {
  const hasFigma = Boolean(property?.bindings?.figma)
  const hasReact = Boolean(property?.bindings?.react)
  if (hasFigma && hasReact) return 'shared'
  if (hasFigma) return 'designOnly'
  return 'codeOnly'
}

function duplicateIds(items) {
  const seen = new Set()
  const duplicates = new Set()
  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id)
    seen.add(item.id)
  }
  return [...duplicates]
}

function scalarDomain(property) {
  if (property.values) return property.values
  if (property.type === 'boolean') return [false, true]
  return undefined
}

function cartesianCombinations(entries) {
  return entries.reduce(
    (rows, [propertyId, values]) => rows.flatMap(row => values.map(value => ({ ...row, [propertyId]: value }))),
    [{}]
  )
}

function ruleMatchesCombination(rule, combination) {
  return Object.entries(rule.conditions).every(([propertyId, values]) => values.includes(combination[propertyId]))
}

function formatIssue(issue) {
  const path = issue.path.join('.')
  return path ? `${path}: ${issue.message}` : issue.message
}

function validateContractSemantics(contract) {
  const errors = []
  const reactExtensions = contract.surfaces.react?.extensions ?? []
  const collections = [
    ['properties', contract.properties],
    ['surfaces.react.extensions', reactExtensions],
    ['anatomy', contract.anatomy],
    ['slots', contract.slots],
    ['states', contract.states],
    ['constraints.combinations', contract.constraints.combinations],
    ['evaluations', contract.evaluations],
    ['examples', contract.examples],
    ['migrations', contract.migrations],
    ['evidenceReferences.sources', contract.evidenceReferences.sources]
  ]

  for (const [path, items] of collections) {
    const duplicates = duplicateIds(items)
    if (duplicates.length > 0) errors.push(`${path}: duplicate ids: ${duplicates.join(', ')}`)
  }

  const canonicalIds = new Set(contract.properties.map(property => property.id))
  const extensionDuplicates = reactExtensions
    .filter(extension => canonicalIds.has(extension.id))
    .map(extension => extension.id)
  if (extensionDuplicates.length > 0) {
    errors.push(
      `surfaces.react.extensions: ids must not duplicate canonical properties: ${extensionDuplicates.join(', ')}`
    )
  }

  const propertiesById = new Map(contract.properties.map(property => [property.id, property]))
  const anatomyIds = new Set(contract.anatomy.map(part => part.id))
  const slotIds = new Set(contract.slots.map(slot => slot.id))
  const stateIds = new Set(contract.states.map(state => state.id))
  const evaluationIds = new Set(contract.evaluations.map(evaluation => evaluation.id))
  const migrationIds = new Set(contract.migrations.map(migration => migration.id))
  const exampleIds = new Set(contract.examples.map(example => example.id))
  const governedSurfaces = new Set(Object.keys(contract.surfaces))

  for (const [index, part] of contract.anatomy.entries()) {
    if (part.parentId && !anatomyIds.has(part.parentId)) {
      errors.push(`anatomy.${index}.parentId: unknown anatomy part ${part.parentId}`)
    }
  }

  for (const [index, slot] of contract.slots.entries()) {
    if (!anatomyIds.has(slot.partId)) errors.push(`slots.${index}.partId: unknown anatomy part ${slot.partId}`)
    if (slot.maxItems !== undefined && slot.maxItems < slot.minItems) {
      errors.push(`slots.${index}.maxItems: must be greater than or equal to minItems`)
    }
    if (slot.defaultExampleId && !exampleIds.has(slot.defaultExampleId)) {
      errors.push(`slots.${index}.defaultExampleId: unknown example ${slot.defaultExampleId}`)
    }
  }

  for (const [index, dimension] of contract.constraints.dimensions.entries()) {
    if (!propertiesById.has(dimension)) errors.push(`constraints.dimensions.${index}: unknown property ${dimension}`)
  }

  for (const [combinationIndex, combination] of contract.constraints.combinations.entries()) {
    for (const surface of combination.surfaces) {
      if (!governedSurfaces.has(surface)) {
        errors.push(
          `constraints.combinations.${combinationIndex}.surfaces: surface ${surface} is not governed by this contract`
        )
      }
    }
    for (const [propertyId, values] of Object.entries(combination.conditions)) {
      const property = propertiesById.get(propertyId)
      if (!property) {
        errors.push(
          `constraints.combinations.${combinationIndex}.conditions.${propertyId}: unknown property ${propertyId}`
        )
        continue
      }
      const domain = scalarDomain(property)
      const unknownValues = domain ? values.filter(value => !domain.includes(value)) : []
      if (unknownValues.length > 0) {
        errors.push(
          `constraints.combinations.${combinationIndex}.conditions.${propertyId}: undeclared values ${unknownValues.join(', ')}`
        )
      }
    }
    if (combination.ruleId && !evaluationIds.has(combination.ruleId)) {
      errors.push(`constraints.combinations.${combinationIndex}.ruleId: unknown evaluation ${combination.ruleId}`)
    }
    if (combination.migrationId && !migrationIds.has(combination.migrationId)) {
      errors.push(
        `constraints.combinations.${combinationIndex}.migrationId: unknown migration ${combination.migrationId}`
      )
    }
  }

  for (const [index, token] of contract.tokens.entries()) {
    if (!anatomyIds.has(token.partId)) errors.push(`tokens.${index}.partId: unknown anatomy part ${token.partId}`)
    if (token.stateId && !stateIds.has(token.stateId))
      errors.push(`tokens.${index}.stateId: unknown state ${token.stateId}`)
    for (const propertyId of Object.keys(token.conditions ?? {})) {
      if (!propertiesById.has(propertyId))
        errors.push(`tokens.${index}.conditions.${propertyId}: unknown property ${propertyId}`)
    }
  }

  const presentationGroups = [
    contract.presentation.parts,
    ...(contract.presentation.variants ?? []).map(item => item.parts)
  ]
  for (const parts of presentationGroups) {
    for (const part of parts) {
      if (!anatomyIds.has(part.partId)) errors.push(`presentation.parts: unknown anatomy part ${part.partId}`)
    }
  }

  for (const [variantIndex, variant] of (contract.presentation.variants ?? []).entries()) {
    if (variant.stateId && !stateIds.has(variant.stateId)) {
      errors.push(`presentation.variants.${variantIndex}.stateId: unknown state ${variant.stateId}`)
    }
    for (const propertyId of Object.keys(variant.conditions ?? {})) {
      if (!propertiesById.has(propertyId)) {
        errors.push(`presentation.variants.${variantIndex}.conditions.${propertyId}: unknown property ${propertyId}`)
      }
    }
  }

  for (const [exampleIndex, example] of contract.examples.entries()) {
    for (const propertyId of Object.keys(example.properties)) {
      if (!propertiesById.has(propertyId))
        errors.push(`examples.${exampleIndex}.properties.${propertyId}: unknown property ${propertyId}`)
    }
    for (const slotId of Object.keys(example.slots)) {
      if (!slotIds.has(slotId)) errors.push(`examples.${exampleIndex}.slots.${slotId}: unknown slot ${slotId}`)
    }
    if (example.status === 'recommended') {
      const combination = Object.fromEntries(
        contract.constraints.dimensions.map(propertyId => [
          propertyId,
          example.properties[propertyId] ?? propertiesById.get(propertyId)?.default
        ])
      )
      const matches = contract.constraints.combinations.filter(rule => ruleMatchesCombination(rule, combination))
      if (matches.length !== 1 || matches[0].status !== 'supported') {
        errors.push(`examples.${exampleIndex}: recommended examples must resolve to exactly one supported combination`)
      }
    }
  }

  for (const dimension of HEALTH_DIMENSIONS) {
    if (
      contract.lifecycle.status !== 'draft' &&
      !contract.evaluations.some(evaluation => evaluation.dimension === dimension)
    ) {
      errors.push(`evaluations: missing health dimension ${dimension}`)
    }
  }

  if (contract.lifecycle.status !== 'draft' && contract.evidenceReferences.sources.length === 0) {
    errors.push('evidenceReferences.sources: piloting, stable, and deprecated contracts require evidence sources')
  }

  if (contract.lifecycle.status === 'stable' && contract.surfaces.figma) {
    if (contract.surfaces.figma.mappingStatus !== 'verified') {
      errors.push('surfaces.figma.mappingStatus: stable contracts must use verified Figma mappings')
    }
    if (contract.surfaces.figma.componentKeys.length === 0) {
      errors.push('surfaces.figma.componentKeys: stable contracts must include at least one confirmed component key')
    }
  }

  if (contract.constraints.exhaustive) {
    const dimensionDomains = contract.constraints.dimensions.map(dimension => [
      dimension,
      scalarDomain(propertiesById.get(dimension))
    ])
    const missingDomains = dimensionDomains.filter(([, domain]) => !domain)
    if (missingDomains.length > 0) {
      errors.push(
        `constraints.dimensions: exhaustive dimensions require finite values: ${missingDomains.map(([dimension]) => dimension).join(', ')}`
      )
    } else {
      for (const combination of cartesianCombinations(dimensionDomains)) {
        const matches = contract.constraints.combinations.filter(rule => ruleMatchesCombination(rule, combination))
        if (matches.length !== 1) {
          errors.push(
            `constraints.combinations: ${JSON.stringify(combination)} matched ${matches.length} combinations${
              matches.length > 0 ? ` (${matches.map(rule => rule.id).join(', ')})` : ''
            }`
          )
        }
      }
    }
  }

  return errors
}

export function validateComponentContract(contract) {
  const result = componentContractSchema.safeParse(contract)
  if (!result.success) return { success: false, errors: result.error.issues.map(formatIssue) }
  const errors = validateContractSemantics(result.data)
  return { success: errors.length === 0, errors }
}

export function validateComponentVerification(verification, contract) {
  const result = componentVerificationSchema.safeParse(verification)
  if (!result.success) return { success: false, errors: result.error.issues.map(formatIssue) }

  const errors = []
  if (result.data.componentId !== contract.identity.id) errors.push('componentId: does not match contract identity')
  if (result.data.contractVersion !== contract.contractVersion) errors.push('contractVersion: does not match contract')
  const ruleIds = new Set(contract.evaluations.map(evaluation => evaluation.id))
  const sourceIds = new Set(contract.evidenceReferences.sources.map(source => source.id))
  const duplicates = duplicateIds(result.data.verifications)
  if (duplicates.length > 0) errors.push(`verifications: duplicate ids: ${duplicates.join(', ')}`)
  for (const [index, item] of result.data.verifications.entries()) {
    if (!ruleIds.has(item.ruleId)) errors.push(`verifications.${index}.ruleId: unknown rule ${item.ruleId}`)
    for (const sourceId of item.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`verifications.${index}.sourceIds: unknown evidence source ${sourceId}`)
    }
  }
  return { success: errors.length === 0, errors }
}

function collectContractFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(directory, entry.name)
    return entry.isDirectory()
      ? collectContractFiles(entryPath)
      : entry.isFile() && entry.name.endsWith('.contract.json')
        ? [entryPath]
        : []
  })
}

function packageRelativePath(packageRoot, filePath) {
  return relative(packageRoot, filePath).split(sep).join('/')
}

function resolvePackagePath(packageRoot, filePath) {
  return isAbsolute(filePath) ? filePath : join(packageRoot, filePath)
}

function referencedTokenIds(contract) {
  const ids = (contract.tokens ?? []).map(token => token.tokenId)
  const presentationParts = [
    contract.presentation.parts,
    ...(contract.presentation.variants ?? []).map(item => item.parts)
  ].flat()
  for (const part of presentationParts) ids.push(...Object.values(part.tokens ?? {}))
  return ids
}

export function validateContractCatalog({
  packageRoot,
  inventoryPath = 'catalog/component-inventory.json',
  contractsRoot = 'catalog/contracts',
  tokenRegistryPath = 'catalog/token-registry.json',
  evidenceRoot = 'catalog/evidence'
}) {
  const resolvedInventoryPath = resolvePackagePath(packageRoot, inventoryPath)
  const resolvedContractsRoot = resolvePackagePath(packageRoot, contractsRoot)
  const resolvedTokenRegistryPath = resolvePackagePath(packageRoot, tokenRegistryPath)
  const resolvedEvidenceRoot = resolvePackagePath(packageRoot, evidenceRoot)
  const errors = []
  const contracts = []

  let inventory
  let tokenRegistry
  try {
    inventory = JSON.parse(readFileSync(resolvedInventoryPath, 'utf8'))
    tokenRegistry = tokenRegistrySchema.parse(JSON.parse(readFileSync(resolvedTokenRegistryPath, 'utf8')))
  } catch (error) {
    return { success: false, errors: [error.message], contracts }
  }

  const tokenIds = new Set(tokenRegistry.tokens.map(token => token.id))
  const duplicateTokens = duplicateIds(tokenRegistry.tokens)
  if (duplicateTokens.length > 0)
    errors.push(`${tokenRegistryPath}: duplicate token ids: ${duplicateTokens.join(', ')}`)
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

    for (const tokenId of referencedTokenIds(contract)) {
      if (!tokenIds.has(tokenId)) errors.push(`${contractPath}: unresolved token ${tokenId}`)
    }

    const contractId = contract.identity.id
    if (seenIds.has(contractId)) {
      errors.push(`${contractPath}: duplicate contract id ${contractId}`)
      continue
    }
    seenIds.add(contractId)

    const inventoryEntry = inventoryComponents.find(component => component.id === contractId)
    if (!inventoryEntry) errors.push(`${contractPath}: no component inventory entry for ${contractId}`)
    else if (inventoryEntry.contractPath !== contractPath) {
      errors.push(`${contractPath}: inventory contractPath is ${inventoryEntry.contractPath ?? 'missing'}`)
    }

    const verificationPath = join(
      resolvedEvidenceRoot,
      basename(contractFile).replace(/\.contract\.json$/, '.verification.json')
    )
    if (!existsSync(verificationPath)) {
      errors.push(
        `${contractPath}: missing verification evidence ${packageRelativePath(packageRoot, verificationPath)}`
      )
    } else {
      const verification = JSON.parse(readFileSync(verificationPath, 'utf8'))
      const verificationResult = validateComponentVerification(verification, contract)
      errors.push(
        ...verificationResult.errors.map(error => `${packageRelativePath(packageRoot, verificationPath)}: ${error}`)
      )
    }

    contracts.push({ id: contractId, path: contractPath, status: contract.lifecycle.status })
  }

  return { success: errors.length === 0, errors, contracts }
}
