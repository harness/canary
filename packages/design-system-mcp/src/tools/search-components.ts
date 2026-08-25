import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { searchComponents } from '../search.js'
import { jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerSearchComponents(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'search_components',
    {
      title: 'Search Canary components',
      description:
        'Find Canary UI components by intent, alias, or export name. Call this before writing new JSX. Import from @harnessio/ui/components; do not use shadcn or Lucide.',
      inputSchema: {
        query: z.string().describe('Natural-language intent, alias, or component name'),
        limit: z.number().int().positive().max(25).optional()
      }
    },
    async ({ query, limit }) => jsonResult({ hits: searchComponents(catalog, query, limit ?? 8) })
  )
}
