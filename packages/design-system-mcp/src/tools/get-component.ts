import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getComponent } from '../examples.js'
import { errorResult, jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerGetComponent(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_component',
    {
      title: 'Get a Canary component',
      description:
        'Return the budgeted Canary component record without example source. Use get_example for snippets and validate_props when hasConstraints is true.',
      inputSchema: {
        id: z.string().describe('Catalog id (canary.button) or export name (Button)')
      }
    },
    async ({ id }) => {
      const result = getComponent(catalog, id)
      return 'error' in result ? errorResult(result) : jsonResult(result)
    }
  )
}
