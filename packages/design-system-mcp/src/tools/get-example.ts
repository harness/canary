import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getExample } from '../examples.js'
import { errorResult, jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerGetExample(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_example',
    {
      title: 'Get a Canary example snippet',
      description:
        'Return one Canary example snippet. This is the only tool that returns component source. Default is the first recommended or Portal ComponentExample.',
      inputSchema: {
        id: z.string().describe('Catalog id or export name'),
        exampleId: z.string().optional().describe('Example id from get_component')
      }
    },
    async ({ id, exampleId }) => {
      const result = getExample(catalog, id, exampleId)
      return 'error' in result ? errorResult(result) : jsonResult(result)
    }
  )
}
