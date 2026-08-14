import { describe, expect, it } from 'vitest'

import type { CanonicalSnapshot } from '../src/core/canonical'
import { evaluateConstraints } from '../src/core/constraints'
import { buttonEntry } from './helpers/pilotCatalog'

function canonical(values: CanonicalSnapshot['values']): CanonicalSnapshot {
  return { values, sources: {} }
}

describe('evaluateConstraints', () => {
  it('classifies an approved combination as supported', () => {
    const result = evaluateConstraints(
      canonical({
        variant: 'primary',
        size: 'sm',
        theme: 'default',
        rounded: false,
        iconOnly: false
      }),
      buttonEntry
    )

    expect(result.status).toBe('supported')
    expect(result.findings).toEqual([])
  })

  it('warns on a deprecated rounded text combination with migration guidance', () => {
    const result = evaluateConstraints(
      canonical({
        variant: 'primary',
        size: 'md',
        theme: 'default',
        rounded: true,
        iconOnly: false
      }),
      buttonEntry
    )

    expect(result.status).toBe('deprecated')
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'WARN_DEPRECATED_COMBINATION',
          severity: 'warn',
          message: expect.stringContaining('Replace the deprecated TextRounded')
        })
      ])
    )
  })

  it('fails an unsupported AI semantic-theme combination', () => {
    const result = evaluateConstraints(
      canonical({
        variant: 'ai',
        size: 'md',
        theme: 'danger',
        rounded: false,
        iconOnly: false
      }),
      buttonEntry
    )

    expect(result.status).toBe('unsupported')
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'FAIL_UNSUPPORTED_COMBINATION',
          severity: 'fail'
        })
      ])
    )
  })

  it('fails closed when an exhaustive dimension cannot be resolved', () => {
    const result = evaluateConstraints(
      canonical({
        variant: 'primary',
        theme: 'default',
        rounded: false,
        iconOnly: false
      }),
      buttonEntry
    )

    expect(result.status).toBe('invalid')
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'FAIL_CONSTRAINT_COVERAGE',
          severity: 'fail',
          expected: ['size']
        })
      ])
    )
  })
})
