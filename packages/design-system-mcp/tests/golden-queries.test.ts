import { expect, test } from 'vitest'

import { getComponent, getExample } from '../src/examples.js'
import { searchComponents, searchIcons } from '../src/search.js'
import { validateProps } from '../src/validate-props.js'
import { loadTestCatalog } from './helpers.js'

const catalog = loadTestCatalog()

test('primary save button → Button example without leaking source on get_component', () => {
  const hits = searchComponents(catalog, 'primary save button')
  const example = getExample(catalog, 'canary.button')
  const component = getComponent(catalog, 'canary.button')

  expect(hits[0]?.id).toBe('canary.button')
  expect('error' in example).toBe(false)
  if ('error' in example) return
  expect(example.code).toContain('<Button')
  expect(example.import).toContain('@harnessio/ui/components')
  expect(JSON.stringify(component)).not.toContain('<Button')
})

test('modal → Dialog fallback with Dialog.Root example, without requiring TextInput', () => {
  const hits = searchComponents(catalog, 'modal')
  const example = getExample(catalog, 'canary.dialog')

  expect(hits[0]?.exportName).toBe('Dialog')
  expect(hits[0]?.confidence).toBe('fallback')
  expect('error' in example).toBe(false)
  if ('error' in example) return
  expect(example.code).toContain('Dialog.Root')
})

test('form field → TextInput alias', () => {
  const hits = searchComponents(catalog, 'form field')

  expect(hits.some(hit => hit.exportName === 'TextInput')).toBe(true)
})

test('delete icon → IconV2 name=', () => {
  const hits = searchIcons(catalog, 'delete icon')

  expect(hits[0]?.name).toBeTruthy()
  expect(hits[0]?.usage).toMatch(/<IconV2 name="/)
  expect(hits[0]?.usage).not.toContain('icon=')
})

test('navigate to settings ranks Link; Button avoidWhen mentions navigation if present', () => {
  const hits = searchComponents(catalog, 'navigate to settings')
  const linkIndex = hits.findIndex(hit => hit.exportName === 'Link')
  const buttonIndex = hits.findIndex(hit => hit.exportName === 'Button')

  expect(linkIndex).toBeGreaterThanOrEqual(0)
  if (buttonIndex !== -1) {
    expect(linkIndex).toBeLessThan(buttonIndex)
    const button = getComponent(catalog, 'canary.button')
    expect('error' in button).toBe(false)
    if ('error' in button) return
    expect(button.avoidWhen.join(' ')).toMatch(/navigat/i)
  }
})

test('rounded text button is flagged even when size is omitted', () => {
  const result = validateProps(catalog, 'canary.button', {
    variant: 'primary',
    theme: 'danger',
    rounded: true,
    iconOnly: false
  })

  expect(result).toMatchObject({ status: 'deprecated' })
})
