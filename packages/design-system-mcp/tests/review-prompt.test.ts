import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { expect, test } from 'vitest'

import { buildReviewCanaryUiPrompt, REVIEW_CANARY_UI_PROMPT_NAME } from '../src/prompts/review-canary-ui.js'
import { createMcpServer, MCP_PROMPT_NAMES } from '../src/server.js'
import { loadTestCatalog } from './helpers.js'

test('review prompt flags Lucide, shadcn, raw button, and validate_props without failing CI', () => {
  const text = buildReviewCanaryUiPrompt({
    path: 'src/toolbar.tsx',
    diff: 'import { Trash } from "lucide-react"\n<button>Save</button>'
  })

  expect(text).toMatch(/advisory/i)
  expect(text).toMatch(/Do not fail CI/)
  expect(text).toContain('search_components')
  expect(text).toContain('validate_props')
  expect(text).toContain('lucide-react')
  expect(text).toContain('@/components/ui')
  expect(text).toContain('<button>')
  expect(text).toContain('src/toolbar.tsx')
  expect(text).toContain('lucide-react')
})

test('server lists and returns the Review Canary UI prompt', async () => {
  const server = createMcpServer(loadTestCatalog())
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  const client = new Client({ name: 'canary-mcp-prompt-test', version: '0.0.0' })
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

  const listed = await client.listPrompts()
  expect(listed.prompts.map(prompt => prompt.name)).toEqual([...MCP_PROMPT_NAMES])
  expect(listed.prompts[0]?.name).toBe(REVIEW_CANARY_UI_PROMPT_NAME)

  const got = await client.getPrompt({
    name: REVIEW_CANARY_UI_PROMPT_NAME,
    arguments: { path: 'src/page.tsx', diff: 'import { Button } from "@/components/ui/button"' }
  })
  await client.close()

  const text = got.messages.map(message => ('text' in message.content ? message.content.text : '')).join('\n')
  expect(got.description).toMatch(/advisory/i)
  expect(text).toContain('@/components/ui')
  expect(text).toContain('src/page.tsx')
  expect(text).toMatch(/Do not fail CI/)
})
