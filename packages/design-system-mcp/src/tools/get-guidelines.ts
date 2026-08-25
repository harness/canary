import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getGuidelines } from '../guidelines.js'
import { errorResult, jsonResult } from '../tool-result.js'
import type { AgentCatalog } from '../types.js'

function guidelinesIdSchema() {
  return z
    .string()
    .describe(
      'Foundation or recipe id such as installation, theming, dialog-form, filter-bar, page-header, empty-state, or dual-pane-drawer'
    )
}

function handleGuidelines(catalog: AgentCatalog, id: string) {
  const result = getGuidelines(catalog, id)
  return 'error' in result ? errorResult(result) : jsonResult(result)
}

export function registerGetGuidelines(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_guidelines',
    {
      title: 'Get Canary guidelines',
      description:
        'Return a short foundation, growth-pattern, or screen-recipe page (installation, theming, filter-bar, …). Rules are capped at 12 bullets.',
      inputSchema: { id: guidelinesIdSchema() }
    },
    async ({ id }) => handleGuidelines(catalog, id)
  )
}

export function registerGetPattern(server: McpServer, catalog: AgentCatalog) {
  server.registerTool(
    'get_pattern',
    {
      title: 'Get Canary screen pattern',
      description:
        'Alias of get_guidelines for screen recipes: dialog-form, filter-bar, page-header, empty-state, dual-pane-drawer.',
      inputSchema: { id: guidelinesIdSchema() }
    },
    async ({ id }) => handleGuidelines(catalog, id)
  )
}
