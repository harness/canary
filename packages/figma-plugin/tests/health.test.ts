import { describe, expect, it } from 'vitest'

import { scoreComponentHealth } from '../src/core/health'
import type { Finding } from '../src/core/types'
import { buttonEntry } from './helpers/pilotCatalog'

describe('scoreComponentHealth', () => {
  it('scores Button from its baseline evidence and exposes coverage', () => {
    const health = scoreComponentHealth(buttonEntry, [])

    expect(health.score).toBe(100)
    expect(health.status).toBe('healthy')
    expect(health.blocked).toBe(false)
    expect(health.evaluationCoverage).toBe(100)
    expect(health.automationCoverage).toBe(80)
    expect(health.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'figmaImplementation', score: 100 }),
        expect.objectContaining({ id: 'codeImplementation', score: 100 })
      ])
    )
  })

  it('blocks health when a live critical requirement fails', () => {
    const finding: Finding = {
      code: 'FAIL_UNSUPPORTED_COMBINATION',
      severity: 'fail',
      nodeId: '1:1',
      catalogId: 'canary.button',
      requirementId: 'button.supported-combination',
      message: 'AI danger is unsupported.'
    }

    const health = scoreComponentHealth(buttonEntry, [finding])

    expect(health.blocked).toBe(true)
    expect(health.status).toBe('blocked')
    expect(health.blockers).toEqual(['button.supported-combination'])
    expect(health.score).toBeLessThan(100)
  })

  it('uses the worst live result when several instances share a requirement', () => {
    const findings: Finding[] = [
      {
        code: 'WARN_DEPRECATED_COMBINATION',
        severity: 'warn',
        nodeId: '1:1',
        catalogId: 'canary.button',
        requirementId: 'button.supported-combination',
        message: 'Deprecated but allowed.'
      },
      {
        code: 'FAIL_UNSUPPORTED_COMBINATION',
        severity: 'fail',
        nodeId: '1:2',
        catalogId: 'canary.button',
        requirementId: 'button.supported-combination',
        message: 'Unsupported.'
      }
    ]

    expect(scoreComponentHealth(buttonEntry, findings).status).toBe('blocked')
  })
})
