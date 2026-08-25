import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getGuidelines } from '../guidelines.js'
import { errorResult, jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

export function registerGetGuidelines(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_guidelines',
    {
      title: 'Get Canary guidelines',
      description:
        'Return a short foundation or growth-pattern page (installation, theming, spacing, DualPaneStepper, …). Rules are capped at 12 bullets.',
      inputSchema: {
        id: z
          .string()
          .describe('Foundation id such as installation, theming, color, spacing, usage, or dual-pane-stepper')
      }
    },
    async ({ id }) => {
      const result = getGuidelines(catalog, id)
      return 'error' in result ? errorResult(result) : jsonResult(result)
    }
  )
}
