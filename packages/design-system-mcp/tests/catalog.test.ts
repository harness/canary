import { expect, test } from 'vitest'

import { loadAgentCatalog } from '../src/catalog.js'
import { getComponent } from '../src/examples.js'
import { loadTestCatalog } from './helpers.js'

test('loads the compiled agent catalog', () => {
  const catalog = loadTestCatalog()

  expect(catalog.components.some(component => component.id === 'canary.button')).toBe(true)
  expect(catalog.icons.some(icon => icon.name === 'trash')).toBe(true)
  expect(catalog.foundations.some(page => page.id === 'installation')).toBe(true)
  expect(catalog.tokens.some(token => token.id === 'canary.semantic.focus-ring')).toBe(true)
  expect(catalog.sourceSha256).toMatch(/^[a-f0-9]{64}$/)
})

test('refuses to load when the catalog directory is missing', () => {
  expect(() => loadAgentCatalog('/tmp/canary-missing-agent-catalog')).toThrow(
    /pnpm --filter @harnessio\/ui catalog:generate/
  )
})

test('Drawer get_component is fallback and never mentions a missing contract file', () => {
  const drawer = getComponent(loadTestCatalog(), 'canary.drawer')

  expect('error' in drawer).toBe(false)
  if ('error' in drawer) return
  expect(drawer.confidence).toBe('fallback')
  expect(JSON.stringify(drawer)).not.toMatch(/drawer\.contract\.json/)
})
