import { expect, test } from 'vitest'

import { estimateTokens, GET_COMPONENT_TOKEN_BUDGET, SEARCH_HIT_TOKEN_BUDGET } from '../src/budgets.js'
import { getComponent, getExample } from '../src/examples.js'
import { searchComponents } from '../src/search.js'
import { loadTestCatalog } from './helpers.js'

const catalog = loadTestCatalog()

test('search hits stay within the token budget', () => {
  const hits = searchComponents(catalog, 'button')

  for (const hit of hits) {
    expect(estimateTokens(hit)).toBeLessThanOrEqual(SEARCH_HIT_TOKEN_BUDGET)
  }
})

test('get_component stays within budget and does not include example source', () => {
  const component = getComponent(catalog, 'canary.button')
  const payload = JSON.stringify(component)

  expect('error' in component).toBe(false)
  expect(payload).not.toContain('<Button')
  if (!('error' in component) && component.constraints) {
    expect(component.constraints).not.toHaveProperty('combinations')
  }
  expect(estimateTokens(component)).toBeLessThanOrEqual(GET_COMPONENT_TOKEN_BUDGET)
})

test('get_example is the only code channel', () => {
  const example = getExample(catalog, 'canary.button')

  expect('error' in example).toBe(false)
  if ('error' in example) return
  expect(example.code).toContain('<Button')
  expect(example.import).toContain('@harnessio/ui/components')
})

test('oversize Portal examples are truncated by the compiler, not dropped', () => {
  const dialog = getExample(catalog, 'canary.dialog')

  expect('error' in dialog).toBe(false)
  if ('error' in dialog) return
  expect(dialog.code).toContain('Dialog.Root')
  expect(dialog.code.split('\n').length).toBeLessThanOrEqual(40)
})
