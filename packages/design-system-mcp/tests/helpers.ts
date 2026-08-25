import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadAgentCatalog } from '../src/catalog.js'
import type { AgentCatalog } from '../src/types.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..')

export const packageRoot = join(repoRoot, 'packages/design-system-mcp')
export const catalogDir = join(repoRoot, 'packages/ui/catalog/generated/agent')
export const binPath = join(packageRoot, 'bin/canary-mcp.js')

let catalog: AgentCatalog | undefined

export function loadTestCatalog(): AgentCatalog {
  catalog ??= loadAgentCatalog(catalogDir)
  return catalog
}
