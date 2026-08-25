import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { compactInventory } from './guidelines.js'
import { registerGetComponent } from './tools/get-component.js'
import { registerGetExample } from './tools/get-example.js'
import { registerGetGuidelines, registerGetPattern } from './tools/get-guidelines.js'
import { registerGetTokens } from './tools/get-tokens.js'
import { registerSearchComponents } from './tools/search-components.js'
import { registerSearchIcons } from './tools/search-icons.js'
import { registerValidateProps } from './tools/validate-props.js'
import type { AgentCatalog } from './types.js'

export const MCP_SERVER_NAME = 'canary'
export const MCP_SERVER_VERSION = '0.1.0'
export const MCP_TOOL_NAMES = [
  'search_components',
  'get_component',
  'get_example',
  'validate_props',
  'search_icons',
  'get_tokens',
  'get_guidelines',
  'get_pattern'
] as const

export function createMcpServer(catalog: AgentCatalog): McpServer {
  const server = new McpServer({
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
    title: 'Canary design system'
  })

  registerSearchComponents(server, catalog)
  registerGetComponent(server, catalog)
  registerGetExample(server, catalog)
  registerValidateProps(server, catalog)
  registerSearchIcons(server, catalog)
  registerGetTokens(server, catalog)
  registerGetGuidelines(server, catalog)
  registerGetPattern(server, catalog)

  server.registerResource(
    'inventory',
    'canary://inventory',
    {
      description: 'Compact Canary component inventory: id, exportName, confidence, category',
      mimeType: 'application/json'
    },
    async uri => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(compactInventory(catalog))
        }
      ]
    })
  )

  return server
}
