import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { expect, test } from 'vitest'

import { getGuidelines, getTokens } from '../src/guidelines.js'
import { createMcpServer } from '../src/server.js'
import { loadTestCatalog } from './helpers.js'

const catalog = loadTestCatalog()

test('get_guidelines returns installation with required Canary setup rules', () => {
  const page = getGuidelines(catalog, 'installation')

  expect('error' in page).toBe(false)
  if ('error' in page) return
  expect(page.rules.some(rule => rule.includes('pnpm add @harnessio/ui'))).toBe(true)
  expect(page.rules.some(rule => rule.includes('react >= 17'))).toBe(true)
  expect(page.rules.some(rule => rule.includes('@harnessio/ui/styles.css'))).toBe(true)
  expect(page.rules.length).toBeLessThanOrEqual(12)
})

test('get_guidelines returns theming', () => {
  const page = getGuidelines(catalog, 'theming')

  expect('error' in page).toBe(false)
  if ('error' in page) return
  expect(page.id).toBe('theming')
  expect(page.rules.length).toBeGreaterThan(0)
  expect(page.rules.length).toBeLessThanOrEqual(12)
})

test('get_tokens returns registry ids with a cn- usage note', () => {
  const { tokens } = getTokens(catalog)
  const focus = tokens.find(token => token.id === 'canary.semantic.focus-ring')

  expect(focus?.description).toBeTruthy()
  expect(focus?.usage).toMatch(/cn-/)
})

test('get_tokens can filter by query', () => {
  const { tokens } = getTokens(catalog, { query: 'focus' })

  expect(tokens.some(token => token.id === 'canary.semantic.focus-ring')).toBe(true)
})

test('get_tokens can filter by Button component', () => {
  const { tokens } = getTokens(catalog, { componentId: 'canary.button' })

  expect(tokens.some(token => token.id.includes('button'))).toBe(true)
})

test('get_guidelines returns screen recipes including the filters package', () => {
  const filterBar = getGuidelines(catalog, 'filter-bar')
  const viaPattern = getGuidelines(catalog, 'dialog-form')

  expect('error' in filterBar).toBe(false)
  if ('error' in filterBar) return
  expect(filterBar.rules.some(rule => rule.includes('@harnessio/filters'))).toBe(true)
  expect(filterBar.rules.some(rule => rule.includes('createFilters'))).toBe(true)
  expect(filterBar.rules.some(rule => /FilterBar/.test(rule) && rule.includes('@harnessio/ui'))).toBe(true)
  expect(filterBar.rules.length).toBeLessThanOrEqual(12)

  expect('error' in viaPattern).toBe(false)
  if ('error' in viaPattern) return
  expect(viaPattern.rules.some(rule => rule.includes('ButtonLayout'))).toBe(true)
})

test('get_guidelines unknown id returns known ids in the hint', () => {
  const result = getGuidelines(catalog, 'not-a-page')

  expect('error' in result).toBe(true)
  if (!('error' in result)) return
  expect(result.error).toMatch(/Unknown guidelines id/)
  expect(result.hint).toMatch(/installation/)
  expect(result.hint).toMatch(/theming/)
})

test('canary://inventory lists compact component rows', async () => {
  const server = createMcpServer(catalog)
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  const client = new Client({ name: 'canary-mcp-inventory-test', version: '0.0.0' })
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

  const listed = await client.listResources()
  expect(listed.resources.some(resource => resource.uri === 'canary://inventory')).toBe(true)

  const read = await client.readResource({ uri: 'canary://inventory' })
  const text = read.contents[0] && 'text' in read.contents[0] ? read.contents[0].text : undefined
  const rows = JSON.parse(text ?? '[]') as Array<{ id: string; exportName: string; confidence: string }>

  await client.close()

  expect(rows.some(row => row.id === 'canary.button' && row.exportName === 'Button')).toBe(true)
})
