import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getTokens } from '../guidelines.js'
import { jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerGetTokens(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_tokens',
    {
      title: 'Get Canary tokens',
      description:
        'Return semantic token ids with one-line descriptions and a cn- usage note. Optional query or componentId narrows the list.',
      inputSchema: {
        query: z.string().optional().describe('Filter token ids or descriptions'),
        componentId: z.string().optional().describe('Catalog id or export name such as canary.button')
      }
    },
    async ({ query, componentId }) => jsonResult(getTokens(catalog, { query, componentId }))
  )
}
