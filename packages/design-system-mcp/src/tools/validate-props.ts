import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { errorResult, jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'
import { validateProps } from '../validate-props.js'

export function registerValidateProps(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'validate_props',
    {
      title: 'Validate Canary component props',
      description:
        'Check a React prop map against a component contract. Omitted Button dimensions are filled from documented defaults. No constraints returns unknown, not supported.',
      inputSchema: {
        id: z.string().describe('Catalog id or export name'),
        props: z.record(z.string(), z.unknown()).describe('React prop map to evaluate')
      }
    },
    async ({ id, props }) => {
      const result = validateProps(catalog, id, props)
      return 'error' in result ? errorResult(result) : jsonResult(result)
    }
  )
}
