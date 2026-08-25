import { expect, test } from 'vitest'

import { validateProps } from '../src/validate-props.js'
import { loadTestCatalog } from './helpers.js'

const catalog = loadTestCatalog()

test('legal primary with omitted size is supported', () => {
  const result = validateProps(catalog, 'canary.button', { variant: 'primary' })

  expect(result).toMatchObject({ status: 'supported' })
})

test('legal primary with explicit size md is supported', () => {
  const result = validateProps(catalog, 'canary.button', { variant: 'primary', size: 'md' })

  expect(result).toMatchObject({ status: 'supported' })
})

test('rounded text Button is deprecated when size is omitted', () => {
  const result = validateProps(catalog, 'canary.button', {
    variant: 'primary',
    theme: 'danger',
    rounded: true,
    iconOnly: false
  })

  expect(result).toMatchObject({ status: 'deprecated' })
  if ('status' in result) {
    expect(result.migration).toMatch(/standard-shape Button/)
  }
})

test('rounded text Button is deprecated with explicit size md', () => {
  const result = validateProps(catalog, 'canary.button', {
    variant: 'primary',
    size: 'md',
    theme: 'danger',
    rounded: true,
    iconOnly: false
  })

  expect(result).toMatchObject({ status: 'deprecated' })
})

test('AI + danger is unsupported', () => {
  const result = validateProps(catalog, 'canary.button', { variant: 'ai', theme: 'danger' })

  expect(result).toMatchObject({ status: 'unsupported' })
})

test('icon-only rounded is supported', () => {
  const result = validateProps(catalog, 'canary.button', { rounded: true, iconOnly: true })

  expect(result).toMatchObject({ status: 'supported' })
})

test('Dialog without constraints returns unknown, not supported', () => {
  const result = validateProps(catalog, 'canary.dialog', { size: 'md' })

  expect(result).toMatchObject({ status: 'unknown' })
  expect(result).not.toMatchObject({ status: 'supported' })
})

test('unknown id returns a structured error', () => {
  const result = validateProps(catalog, 'canary.not-a-component', {})

  expect(result).toMatchObject({ error: expect.stringContaining('Unknown component') })
})
