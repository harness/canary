import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

import {
  componentContractSchemaV05,
  componentVerificationSchema,
  evaluationProfileSchema
} from './component-contract-schema.mjs'

export const artifactFormatVersion = 1
export const referenceFormatVersion = 2

const artifactPaths = [
  'catalog/generated/component-contract.schema.json',
  'catalog/generated/component-contract.types.ts',
  'catalog/generated/component-contract.reference.json',
  'catalog/generated/button.audit-receipt.json'
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function schemaType(node) {
  if (node.type) return Array.isArray(node.type) ? node.type.join(' | ') : node.type
  if (node.enum) return 'enum'
  if (node.anyOf) return [...new Set(node.anyOf.map(schemaType))].join(' | ')
  if (node.oneOf) return [...new Set(node.oneOf.map(schemaType))].join(' | ')
  return 'object'
}

function fieldOwner(path) {
  const root = path.split('.')[0]
  if (
    ['identity', 'semantics', 'anatomy', 'slots', 'states', 'presentation', 'tokens', 'usage', 'examples'].includes(
      root
    )
  ) {
    return 'Design system design and engineering'
  }
  if (['surfaces', 'properties', 'constraints'].includes(root)) return 'Design system engineering with design review'
  if (['evaluations', 'evidenceReferences', 'lifecycle', 'ownership', 'migrations'].includes(root)) {
    return 'Design system governance'
  }
  return 'Schema maintainers'
}

function fieldConsumers(path) {
  const root = path.split('.')[0]
  if (root === 'surfaces') return ['Compiler', 'Canary Copilot', 'CI', 'Future generators']
  if (['properties', 'anatomy', 'slots', 'states', 'constraints', 'presentation', 'examples'].includes(root)) {
    return ['Canary Copilot', 'CI', 'Documentation', 'Future generators']
  }
  if (['evaluations', 'evidenceReferences'].includes(root)) {
    return ['Health scoring', 'CI', 'Governance', 'Documentation']
  }
  return ['Engineers', 'Designers', 'Agents', 'Documentation']
}

function resolveRef(root, node) {
  if (!node?.$ref?.startsWith('#/')) return node
  return node.$ref
    .slice(2)
    .split('/')
    .reduce((value, segment) => value?.[segment.replaceAll('~1', '/').replaceAll('~0', '~')], root)
}

function resolveSchemaNode(root, node) {
  const direct = resolveRef(root, node) ?? node
  if (direct?.allOf?.length === 1) return resolveSchemaNode(root, direct.allOf[0])
  return direct
}

function schemaReferenceRows(schema) {
  const rows = []
  const seen = new Set()

  const visit = (path, rawNode, required) => {
    const node = resolveSchemaNode(schema, rawNode)
    const key = `${path}|${node?.$ref ?? ''}`
    if (seen.has(key)) return
    seen.add(key)

    if (path) {
      rows.push({
        path,
        type: schemaType(node),
        required,
        allowedValues: node.enum ?? node.const ?? null,
        default: node.default ?? null,
        description: node.description ?? `Contract field ${path}.`
      })
    }

    for (const branch of node.anyOf ?? node.oneOf ?? []) visit(path, branch, required)

    const requiredNames = new Set(node.required ?? [])
    for (const [name, child] of Object.entries(node.properties ?? {})) {
      const childNode = resolveSchemaNode(schema, child)
      const authorRequired = requiredNames.has(name) && childNode?.default === undefined
      visit(path ? `${path}.${name}` : name, child, authorRequired)
    }
    if (node.items) visit(`${path}[]`, node.items, true)
    if (node.additionalProperties && typeof node.additionalProperties === 'object') {
      visit(`${path}.*`, node.additionalProperties, false)
    }
  }

  visit('', schema, true)
  return rows.sort((a, b) => a.path.localeCompare(b.path))
}

function fieldReferenceSections(rows) {
  return [...new Set(rows.map(row => row.path.split('.')[0].replace(/\[\]$/u, '')))]
    .sort()
    .map(path => ({ path, owner: fieldOwner(path), consumers: fieldConsumers(path) }))
}

function generatedTypes() {
  return `/* Generated from component-contract-schema.mjs. Do not edit. */
export type ContractScalar = string | number | boolean | null
export type ContractSurface = 'figma' | 'react'
export type ContractStatus = 'draft' | 'piloting' | 'stable' | 'deprecated'
export type ConstraintStatus = 'supported' | 'deprecated' | 'unsupported'
export type HealthDimension =
  | 'contractDefinition'
  | 'figmaImplementation'
  | 'codeImplementation'
  | 'designCodeParity'
  | 'governanceEvidence'
export type RequirementSeverity = 'critical' | 'major' | 'minor' | 'informational'
export type EnforcementMode = 'automated' | 'manual' | 'advisory'

export type ComponentContract = {
  schemaVersion: '0.5.0'
  contractVersion: string
  identity: Record<string, unknown>
  semantics: Record<string, unknown>
  lifecycle: { status: ContractStatus; replacementId?: string }
  ownership: { team: string; contacts: string[] }
  surfaces: Partial<Record<ContractSurface, Record<string, unknown>>>
  anatomy: Array<Record<string, unknown>>
  properties: Array<Record<string, unknown>>
  slots: Array<Record<string, unknown>>
  states: Array<Record<string, unknown>>
  constraints: {
    exhaustive: boolean
    dimensions: string[]
    combinations: Array<{
      id: string
      status: ConstraintStatus
      surfaces: ContractSurface[]
      conditions: Record<string, ContractScalar[]>
      description: string
      migrationId?: string
      ruleId?: string
    }>
  }
  tokens: Array<Record<string, unknown>>
  presentation: Record<string, unknown>
  usage: Record<string, unknown>
  examples: Array<Record<string, unknown>>
  evaluations: Array<{
    id: string
    dimension: HealthDimension
    severity: RequirementSeverity
    enforcement: EnforcementMode
    statement: string
    remediation?: string
    evaluator?: string
    maxAgeDays?: number
  }>
  migrations: Array<Record<string, unknown>>
  evidenceReferences: { sources: Array<Record<string, unknown>> }
}
`
}

function daysBetween(from, to) {
  return Math.floor((Date.parse(to) - Date.parse(from)) / 86_400_000)
}

function buildReceipt(contract, verificationSource, profile) {
  const verificationByRequirement = new Map()
  for (const verification of verificationSource.verifications) {
    const current = verificationByRequirement.get(verification.ruleId)
    if (!current || current.verifiedAt < verification.verifiedAt) {
      verificationByRequirement.set(verification.ruleId, verification)
    }
  }
  const evaluatedAt = [...verificationByRequirement.values()]
    .map(verification => verification.verifiedAt)
    .sort()
    .at(-1)

  return {
    formatVersion: artifactFormatVersion,
    componentId: contract.identity.id,
    schemaVersion: contract.schemaVersion,
    contractVersion: contract.contractVersion,
    evaluationProfileVersion: profile.version,
    evaluatedAt,
    sourceSha256: createHash('sha256').update(json(contract)).digest('hex'),
    verificationSourceSha256: createHash('sha256').update(json(verificationSource)).digest('hex'),
    evaluations: contract.evaluations.map(requirement => {
      const verification = verificationByRequirement.get(requirement.id)
      const maxAgeDays = requirement.maxAgeDays ?? profile.defaultEvidenceMaxAgeDays
      const fresh = verification ? daysBetween(verification.verifiedAt, evaluatedAt) <= maxAgeDays : false
      return {
        requirementId: requirement.id,
        dimension: requirement.dimension,
        severity: requirement.severity,
        enforcement: requirement.enforcement,
        result: verification?.result ?? 'unevaluated',
        verifiedAt: verification?.verifiedAt ?? null,
        fresh,
        sourceIds: verification?.sourceIds ?? []
      }
    })
  }
}

export function generateContractArtifacts({ packageRoot, write = false }) {
  const contract = componentContractSchemaV05.parse(
    readJson(join(packageRoot, 'catalog/contracts/button.contract.json'))
  )
  const verificationSource = componentVerificationSchema.parse(
    readJson(join(packageRoot, 'catalog/evidence/button.verification.json'))
  )
  const profile = evaluationProfileSchema.parse(readJson(join(packageRoot, 'catalog/evaluation-profile.json')))
  const contractSchema = z.toJSONSchema(componentContractSchemaV05, {
    target: 'draft-7',
    reused: 'ref'
  })
  contractSchema.$id = 'https://canary.harness.io/contracts/component-contract-0.5.0.schema.json'
  contractSchema.title = 'Canary Component Contract 0.5.0'

  const artifacts = new Map([
    [artifactPaths[0], json(contractSchema)],
    [artifactPaths[1], generatedTypes()],
    [
      artifactPaths[2],
      json({
        formatVersion: referenceFormatVersion,
        schemaVersion: '0.5.0',
        sections: fieldReferenceSections(schemaReferenceRows(contractSchema)),
        rows: schemaReferenceRows(contractSchema)
      })
    ],
    [artifactPaths[3], json(buildReceipt(contract, verificationSource, profile))]
  ])

  const stalePaths = []
  for (const [relativePath, contents] of artifacts) {
    const path = join(packageRoot, relativePath)
    if (write) {
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, contents)
      continue
    }
    if (!existsSync(path) || readFileSync(path, 'utf8') !== contents) stalePaths.push(relativePath)
  }

  return { artifacts, stalePaths }
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isCli) {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const write = process.argv.includes('--write')
  const result = generateContractArtifacts({ packageRoot, write })
  if (!write && result.stalePaths.length > 0) {
    for (const path of result.stalePaths) console.error(`Stale generated contract artifact: ${path}`)
    process.exitCode = 1
  } else {
    console.log(`${write ? 'Generated' : 'Verified'} ${result.artifacts.size} contract artifacts`)
  }
}
