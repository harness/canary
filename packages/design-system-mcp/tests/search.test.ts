import { expect, test } from 'vitest'

import { searchComponents, searchIcons } from '../src/search.js'
import { loadTestCatalog } from './helpers.js'

test('button ranks canary.button first', () => {
  const hits = searchComponents(loadTestCatalog(), 'button')

  expect(hits[0]?.id).toBe('canary.button')
  expect(hits[0]?.why).toMatch(/exact/i)
})

test('modal ranks Dialog via alias before the stable Button boost', () => {
  const hits = searchComponents(loadTestCatalog(), 'modal')

  expect(hits[0]?.exportName).toBe('Dialog')
  expect(hits[0]?.confidence).toBe('fallback')
  expect(hits[0]?.why).toMatch(/alias/i)
})

test('form field ranks TextInput', () => {
  const hits = searchComponents(loadTestCatalog(), 'form field')

  expect(hits.some(hit => hit.exportName === 'TextInput')).toBe(true)
  expect(hits[0]?.exportName).toBe('TextInput')
})

test('delete icon resolves to the trash IconV2 name', () => {
  const hits = searchIcons(loadTestCatalog(), 'delete')

  expect(hits[0]?.name).toBe('trash')
  expect(hits[0]?.usage).toBe('<IconV2 name="trash" />')
  expect(hits[0]?.synonyms).toContain('delete')
})
