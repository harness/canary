import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

import type { AgentCatalog, AgentCatalogFile, AgentComponent, AgentFoundation, AgentIcon } from './types.js'

const envelopeSchema = z.object({
  formatVersion: z.number(),
  sourceInventoryCount: z.number(),
  sourceSha256: z.string(),
  records: z.array(z.unknown())
})

const combinationSchema = z.object({
  id: z.string(),
  status: z.enum(['supported', 'deprecated', 'unsupported']),
  conditions: z.record(z.string(), z.array(z.union([z.string(), z.boolean(), z.number()]))),
  description: z.string().optional(),
  migrationId: z.string().optional(),
  ruleId: z.string().optional()
})

const componentSchema = z
  .object({
    id: z.string(),
    exportName: z.string(),
    import: z.string(),
    package: z.string(),
    family: z.string(),
    category: z.string().optional(),
    aliases: z.array(z.string()),
    members: z.array(z.string()).optional(),
    summary: z.string(),
    confidence: z.enum(['stable', 'fallback', 'unreviewed']),
    useWhen: z.array(z.string()),
    avoidWhen: z.array(z.string()),
    related: z.array(z.string()),
    props: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        values: z.array(z.string()).optional(),
        default: z.union([z.string(), z.boolean(), z.number()]).optional(),
        description: z.string().optional()
      })
    ),
    do: z.array(z.string()),
    dont: z.array(z.string()),
    examples: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        purpose: z.string(),
        recommended: z.boolean().optional(),
        code: z.string().optional()
      })
    ),
    constraints: z
      .object({
        exhaustive: z.boolean(),
        dimensions: z.array(z.string()),
        combinations: z.array(combinationSchema).optional()
      })
      .optional(),
    migrations: z.array(z.object({ id: z.string(), instructions: z.string() })).optional(),
    sourcePath: z.string(),
    portalPath: z.string().optional(),
    contractVersion: z.string().optional()
  })
  .passthrough()

const iconSchema = z.object({
  name: z.string(),
  import: z.string(),
  usage: z.string(),
  synonyms: z.array(z.string())
})

const foundationSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  rules: z.array(z.string()),
  examples: z.array(z.string()).optional()
})

function readEnvelope<T>(path: string, recordSchema: z.ZodType<T>): AgentCatalogFile<T> {
  const parsed = envelopeSchema.parse(JSON.parse(readFileSync(path, 'utf8')))
  return {
    formatVersion: parsed.formatVersion,
    sourceInventoryCount: parsed.sourceInventoryCount,
    sourceSha256: parsed.sourceSha256,
    records: parsed.records.map(record => recordSchema.parse(record))
  }
}

function walkToWorkspaceRoot(start: string): string | undefined {
  let current = start
  while (true) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) return current
    const parent = dirname(current)
    if (parent === current) return undefined
    current = parent
  }
}

export function resolveAgentCatalogDir(
  options: {
    env?: NodeJS.ProcessEnv
    cwd?: string
    moduleUrl?: string
  } = {}
): string {
  const envDir = options.env?.CANARY_AGENT_CATALOG_DIR
  if (envDir) return envDir

  const cwd = options.cwd ?? process.cwd()
  const moduleDir = dirname(fileURLToPath(options.moduleUrl ?? import.meta.url))
  for (const start of [cwd, moduleDir]) {
    const workspaceRoot = walkToWorkspaceRoot(start)
    if (workspaceRoot) return join(workspaceRoot, 'packages/ui/catalog/generated/agent')
  }

  const sibling = join(moduleDir, '../../ui/catalog/generated/agent')
  if (existsSync(join(sibling, 'components.json'))) return sibling

  return join(moduleDir, '../catalog')
}

export function loadAgentCatalog(catalogDir = resolveAgentCatalogDir()): AgentCatalog {
  const componentsPath = join(catalogDir, 'components.json')
  const iconsPath = join(catalogDir, 'icons.json')
  const foundationsPath = join(catalogDir, 'foundations.json')

  if (!existsSync(componentsPath) || !existsSync(iconsPath) || !existsSync(foundationsPath)) {
    throw new Error(`Missing agent catalog at ${catalogDir}. Run: pnpm --filter @harnessio/ui catalog:generate`)
  }

  const components = readEnvelope(componentsPath, componentSchema)
  const icons = readEnvelope(iconsPath, iconSchema)
  const foundations = readEnvelope(foundationsPath, foundationSchema)

  return {
    components: components.records as AgentComponent[],
    icons: icons.records as AgentIcon[],
    foundations: foundations.records as AgentFoundation[],
    sourceSha256: components.sourceSha256
  }
}

export function findComponent(catalog: AgentCatalog, idOrExportName: string): AgentComponent | undefined {
  const needle = idOrExportName.trim().toLowerCase()
  return catalog.components.find(
    component => component.id.toLowerCase() === needle || component.exportName.toLowerCase() === needle
  )
}
