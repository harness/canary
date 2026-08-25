import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { loadAgentCatalog } from './catalog.js'
import { createMcpServer } from './server.js'

async function main() {
  const catalog = loadAgentCatalog()
  const server = createMcpServer(catalog)
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
