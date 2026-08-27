#!/usr/bin/env node
/**
 * Compiles Canary component contracts into the Figma plugin catalog pack.
 * Contracts in packages/ui/catalog/contracts remain the source of truth;
 * catalogs/ is generated and must not be authored by hand.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = path.resolve(pluginRoot, '../..')
const uiRoot = path.resolve(pluginRoot, '../ui')
const inventoryPath = path.join(uiRoot, 'catalog', 'component-inventory.json')
const contractsDir = path.join(uiRoot, 'catalog', 'contracts')
const evaluationProfilePath = path.join(uiRoot, 'catalog', 'evaluation-profile.json')
const buttonReceiptPath = path.join(uiRoot, 'catalog', 'generated', 'button.audit-receipt.json')
const catalogsRoot = path.join(pluginRoot, 'catalogs')
const publicRoot = path.join(pluginRoot, 'public', 'catalogs')
const SYSTEM_ID = 'canary'
const DISPLAY_NAME = 'Canary (Harness)'
const CATALOG_PROP_TYPES = new Set(['enum', 'boolean', 'string', 'number', 'function'])

const CatalogPropSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['enum', 'boolean', 'string', 'number', 'function']).optional(),
  values: z.array(z.string()).optional(),
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

const ConstraintRuleSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['supported', 'deprecated', 'unsupported']),
  surfaces: z.array(z.enum(['figma', 'react'])).min(1),
  conditions: z.record(z.string().min(1), z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])).min(1)),
  description: z.string().min(1),
  migrationId: z.string().min(1).optional(),
  requirementId: z.string().min(1).optional()
})

const CatalogEntrySchema = z.object({
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
  anatomy: z.array(z.record(z.string(), z.unknown())),
  slots: z.array(z.record(z.string(), z.unknown())),
  states: z.array(z.record(z.string(), z.unknown())),
  constraints: z.object({
    exhaustive: z.boolean(),
    dimensions: z.array(z.string().min(1)).min(1),
    combinations: z.array(ConstraintRuleSchema).min(1)
  }),
  evaluations: z.array(z.record(z.string(), z.unknown())).min(1),
  tokenBindings: z.array(z.record(z.string(), z.unknown())),
  accessibility: z.array(z.record(z.string(), z.unknown())).min(1),
  presentation: z.record(z.string(), z.unknown()),
  examples: z.array(z.record(z.string(), z.unknown())).min(1),
  usage: z.record(z.string(), z.unknown()),
  semantics: z.record(z.string(), z.unknown()),
  migrations: z.array(z.record(z.string(), z.unknown())),
  evidenceReferences: z.record(z.string(), z.unknown()),
  evaluationProfile: z.record(z.string(), z.unknown()),
  baselineReceipt: z.record(z.string(), z.unknown()),
  bindings: z.record(z.string(), z.string()).optional(),
  tokens: z.record(z.string(), z.string()).optional(),
  approximation: z.string().optional(),
  patterns: z.array(z.string()).optional()
})

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function repositoryPath(filePath) {
  return path.relative(repositoryRoot, filePath).split(path.sep).join('/')
}

function contractFingerprint(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function catalogType(type) {
  if (type === 'react-node') return 'string'
  if (CATALOG_PROP_TYPES.has(type)) return type
  return undefined
}

function catalogValues(values) {
  if (!Array.isArray(values)) return undefined
  const strings = values.filter(value => value !== null && value !== undefined).map(value => String(value))
  return strings.length > 0 ? strings : undefined
}

function compileProp(property) {
  const compiled = { name: property.id }
  const type = catalogType(property.type)
  if (type) compiled.type = type
  const values = catalogValues(property.values)
  if (values) compiled.values = values
  if (property.default !== undefined && property.default !== null) {
    compiled.default = property.default
  }
  const reactBinding = property.bindings?.react
  if (reactBinding) compiled.mapsTo = reactBinding.name ?? reactBinding.target
  const figmaBinding = property.bindings?.figma
  if (figmaBinding) {
    compiled.figmaBinding = figmaBinding
    if (figmaBinding.kind === 'property') {
      compiled.figmaProperty = figmaBinding.property
      if (figmaBinding.aliases) compiled.figmaPropertyAliases = figmaBinding.aliases
      if (figmaBinding.valueAliases) compiled.figmaValueAliases = figmaBinding.valueAliases
    }
  }
  if (property.description) compiled.figmaNote = property.description
  return compiled
}

function compileExtension(extension) {
  return compileProp({ ...extension, bindings: { react: extension.binding } })
}

function figmaDisplayName(contract) {
  const exportName = contract.surfaces?.react?.export
  if (exportName) return `❖${exportName}`
  const raw = String(contract.surfaces?.figma?.names?.[0] ?? '').trim()
  const root = raw
    .replace(/^❌\s*/, '')
    .split('/')[0]
    .trim()
  return root || contract.id
}

function figmaNamesFromContract(contract) {
  const names = new Set()
  const exportName = contract.surfaces?.react?.export
  if (exportName) {
    names.add(exportName)
    names.add(`❖${exportName}`)
  }
  for (const part of contract.surfaces?.figma?.names ?? []) {
    const token = part.trim().replace(/^❌\s*/, '')
    const root = token
      .split('/')[0]
      .replace(/\{[^}]*\}/g, '')
      .trim()
    if (root) {
      names.add(root)
      names.add(`❖${root}`)
    }
  }
  return [...names]
}

function compileBindings(bindings) {
  if (!Array.isArray(bindings) || bindings.length === 0) return undefined
  const record = {}
  for (const binding of bindings) {
    if (!binding?.designProperty || !binding?.codeProperty) continue
    record[binding.designProperty] = binding.transform
      ? `${binding.codeProperty} (${binding.transform})`
      : binding.codeProperty
  }
  return Object.keys(record).length > 0 ? record : undefined
}

function compileTokens(tokens) {
  if (!tokens) return undefined
  const record = {}
  if (tokens.rootClass) record.rootClass = tokens.rootClass
  for (const rule of tokens.rules ?? []) {
    if (rule?.category && rule?.rule) record[rule.category] = rule.rule
  }
  return Object.keys(record).length > 0 ? record : undefined
}

function compilePatterns(patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) return undefined
  return patterns.map(pattern => pattern.id).filter(Boolean)
}

export function compileContract(contract, source) {
  const figma = contract?.surfaces?.figma
  const code = contract?.surfaces?.react
  const contractId = contract?.identity?.id
  if (!figma || !code) {
    throw new Error(`${contractId ?? 'unknown'}: Figma-governed contracts must include React and Figma metadata`)
  }

  const codeConnect = figma.codeConnect.join(', ')
  const properties = contract.properties ?? []
  const shared = properties.filter(property => property.bindings?.figma && property.bindings?.react)
  const designOnly = properties.filter(property => property.bindings?.figma && !property.bindings?.react)
  const codeOnly = [
    ...properties.filter(property => !property.bindings?.figma && property.bindings?.react).map(compileProp),
    ...(code.extensions ?? []).map(compileExtension)
  ]
  const evaluationProfile = readJson(evaluationProfilePath)
  const baselineReceipt = readJson(buttonReceiptPath)

  const entry = {
    id: contractId,
    status: contract.lifecycle.status,
    code: {
      package: code.package,
      export: code.export,
      path: code.path,
      import: code.import
    },
    figma: {
      library: figma.library,
      fileKey: figma.fileKey,
      name: figmaDisplayName(contract),
      exampleNodeId: figma.exampleNodeId,
      componentKeys: figma.componentKeys,
      codeConnect
    },
    shared: shared.map(compileProp),
    designOnly: designOnly.map(compileProp),
    codeOnly,
    anatomy: contract.anatomy,
    slots: contract.slots,
    states: contract.states,
    constraints: {
      ...contract.constraints,
      combinations: contract.constraints.combinations.map(({ ruleId, ...rule }) => ({
        ...rule,
        ...(ruleId ? { requirementId: ruleId } : {})
      }))
    },
    evaluations: contract.evaluations,
    tokenBindings: contract.tokens,
    accessibility: contract.evaluations.filter(evaluation => evaluation.category === 'accessibility'),
    presentation: contract.presentation,
    examples: contract.examples,
    usage: contract.usage,
    semantics: contract.semantics,
    migrations: contract.migrations,
    evidenceReferences: contract.evidenceReferences,
    evaluationProfile,
    baselineReceipt
  }

  if (source) {
    entry.source = {
      contractPath: repositoryPath(source.filePath),
      schemaVersion: contract.schemaVersion,
      contractVersion: contract.contractVersion,
      sha256: contractFingerprint(source.filePath)
    }
  }

  return CatalogEntrySchema.parse(entry)
}

function loadFigmaContractSources() {
  if (!existsSync(inventoryPath)) {
    throw new Error(`Component inventory missing: ${inventoryPath}`)
  }
  if (!existsSync(contractsDir)) {
    throw new Error(`Contracts directory missing: ${contractsDir}`)
  }

  const inventory = readJson(inventoryPath)
  const inventoryComponents = Array.isArray(inventory.components) ? inventory.components : []
  const mappedFigmaComponents = inventoryComponents.filter(
    component => component?.status === 'mapped' && component.surfaces?.includes('figma')
  )
  if (mappedFigmaComponents.length === 0) {
    throw new Error(`${repositoryPath(inventoryPath)} has no mapped Figma contracts`)
  }

  const sources = []
  const loadedPaths = new Set()
  for (const component of mappedFigmaComponents) {
    if (!component.contractPath) {
      throw new Error(`${component.id}: mapped Figma inventory entry has no contractPath`)
    }

    const filePath = path.resolve(uiRoot, component.contractPath)
    const contractsPrefix = `${contractsDir}${path.sep}`
    if (!filePath.startsWith(contractsPrefix) || !filePath.endsWith('.contract.json')) {
      throw new Error(`${component.id}: contractPath must point to catalog/contracts/*.contract.json`)
    }
    if (!existsSync(filePath)) {
      throw new Error(`${component.id}: contractPath does not exist: ${repositoryPath(filePath)}`)
    }
    if (loadedPaths.has(filePath)) {
      continue
    }

    const contract = readJson(filePath)
    if (!contract.surfaces?.figma) {
      throw new Error(`${component.id}: mapped contract does not govern Figma`)
    }
    if (
      !mappedFigmaComponents.some(
        candidate => candidate.id === contract.identity?.id && candidate.contractPath === component.contractPath
      )
    ) {
      throw new Error(`${component.id}: ${repositoryPath(filePath)} identifies itself as ${contract.identity?.id}`)
    }
    loadedPaths.add(filePath)
    sources.push({ contract, filePath })
  }

  const unreferencedFigmaContracts = readdirSync(contractsDir)
    .filter(file => file.endsWith('.contract.json'))
    .map(file => path.join(contractsDir, file))
    .filter(filePath => {
      const contract = readJson(filePath)
      return Boolean(contract.surfaces?.figma) && !loadedPaths.has(filePath)
    })
  if (unreferencedFigmaContracts.length > 0) {
    throw new Error(
      `Figma contracts are not mapped in component-inventory.json: ${unreferencedFigmaContracts
        .map(repositoryPath)
        .join(', ')}`
    )
  }

  return sources
}

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export function compileCanaryPack({ packedAt = new Date().toISOString() } = {}) {
  const pluginPackage = readJson(path.join(pluginRoot, 'package.json'))
  const sources = loadFigmaContractSources()
  const entries = sources.map(({ contract, filePath }) => compileContract(contract, { filePath }))
  const components = entries.map((entry, index) => {
    const contract = sources[index].contract
    const slug = entry.id.replace(/^canary\./, '')
    return {
      id: entry.id,
      path: `${slug}.catalog.json`,
      figmaNames: figmaNamesFromContract(contract),
      componentKeys: entry.figma.componentKeys ?? []
    }
  })

  const manifest = {
    version: pluginPackage.version,
    system: { id: SYSTEM_ID, displayName: DISPLAY_NAME },
    updatedAt: packedAt,
    components
  }

  return {
    formatVersion: 1,
    packedAt,
    manifest,
    entries
  }
}

function mirrorPublic(systemDir, pack, fileName) {
  mkdirSync(publicRoot, { recursive: true })
  const publicDir = path.join(publicRoot, SYSTEM_ID)
  mkdirSync(publicDir, { recursive: true })
  writeJson(path.join(publicDir, fileName), pack)
  writeJson(path.join(publicDir, 'manifest.json'), pack.manifest)
  for (const component of pack.manifest.components) {
    const src = path.join(systemDir, component.path)
    writeFileSync(path.join(publicDir, component.path), readFileSync(src, 'utf8'))
  }
}

function main() {
  const pack = compileCanaryPack()
  const systemDir = path.join(catalogsRoot, SYSTEM_ID)
  rmSync(systemDir, { recursive: true, force: true })
  mkdirSync(systemDir, { recursive: true })

  writeJson(path.join(systemDir, 'manifest.json'), pack.manifest)
  for (const [index, entry] of pack.entries.entries()) {
    writeJson(path.join(systemDir, pack.manifest.components[index].path), entry)
  }

  const fileName = `${SYSTEM_ID}.catalog.pack.json`
  writeJson(path.join(systemDir, fileName), pack)
  mirrorPublic(systemDir, pack, fileName)

  console.log(
    `PACKED: ${pack.manifest.system.displayName} v${pack.manifest.version} (${pack.entries.length} components) → ${SYSTEM_ID}/${fileName}`
  )
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  try {
    main()
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}
