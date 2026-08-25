import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerGetComponent } from './tools/get-component.js'
import { registerGetExample } from './tools/get-example.js'
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
  'search_icons'
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

  return server
}
