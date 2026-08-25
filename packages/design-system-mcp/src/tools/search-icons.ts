import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { searchIcons } from '../search.js'
import { jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerSearchIcons(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'search_icons',
    {
      title: 'Search Canary icons',
      description: 'Find IconV2 names. Use <IconV2 name="…" /> from @harnessio/ui/components. Never lucide-react.',
      inputSchema: {
        query: z.string().describe('Icon name or synonym such as trash, delete, or search'),
        limit: z.number().int().positive().max(25).optional()
      }
    },
    async ({ query, limit }) => jsonResult({ hits: searchIcons(catalog, query, limit ?? 8) })
  )
}
