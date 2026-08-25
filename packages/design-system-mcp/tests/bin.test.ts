import { rmSync } from 'node:fs'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { expect, test } from 'vitest'

import { createMcpServer, MCP_TOOL_NAMES } from '../src/server.js'
import { binPath, loadTestCatalog, packageRoot } from './helpers.js'

async function listToolNamesFromServer() {
  const catalog = loadTestCatalog()
  const server = createMcpServer(catalog)
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  const client = new Client({ name: 'canary-mcp-test', version: '0.0.0' })
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  const listed = await client.listTools()
  await client.close()
  return listed.tools.map(tool => tool.name)
}

test('in-process server lists the five tools', async () => {
  const names = await listToolNamesFromServer()

  expect(names).toEqual([...MCP_TOOL_NAMES])
})

test('bin lists the five tools after compiling a missing dist/', async () => {
  rmSync(`${packageRoot}/dist`, { recursive: true, force: true })

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [binPath],
    cwd: packageRoot,
    stderr: 'pipe'
  })
  const client = new Client({ name: 'canary-mcp-bin-test', version: '0.0.0' })
  await client.connect(transport)
  const listed = await client.listTools()
  await client.close()

  expect(listed.tools.map(tool => tool.name)).toEqual([...MCP_TOOL_NAMES])
}, 60_000)
