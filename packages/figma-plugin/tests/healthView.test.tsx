/** @vitest-environment jsdom */

import { render } from 'preact'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ComponentHealth } from '../src/core/health'
import { HealthSummary } from '../src/ui/tabs/CheckTab'

const health: ComponentHealth = {
  catalogId: 'canary.button',
  scoreLabel: 'Pilot evidence score',
  profileStatus: 'pilot',
  score: 92,
  status: 'healthy',
  blocked: false,
  blockers: [],
  evaluationCoverage: 87,
  automationCoverage: 80,
  dimensions: [
    {
      id: 'contractDefinition',
      weight: 20,
      score: 100,
      passedWeight: 8,
      totalWeight: 8,
      evaluated: 1,
      total: 1
    },
    {
      id: 'figmaImplementation',
      weight: 25,
      score: 100,
      passedWeight: 27,
      totalWeight: 27,
      evaluated: 4,
      total: 4
    },
    {
      id: 'codeImplementation',
      weight: 25,
      score: 67,
      passedWeight: 22,
      totalWeight: 33,
      evaluated: 4,
      total: 6
    },
    {
      id: 'designCodeParity',
      weight: 20,
      score: 100,
      passedWeight: 11,
      totalWeight: 11,
      evaluated: 2,
      total: 2
    },
    {
      id: 'governanceEvidence',
      weight: 10,
      score: 100,
      passedWeight: 4,
      totalWeight: 4,
      evaluated: 2,
      total: 2
    }
  ]
}

let host: HTMLDivElement

beforeEach(() => {
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(() => {
  render(null, host)
  host.remove()
})

describe('HealthSummary', () => {
  it('shows score and status without coverage measures', () => {
    render(<HealthSummary healthByCatalog={{ 'canary.button': health }} />, host)

    expect(host.textContent).toContain('92/100')
    expect(host.textContent).toContain('Health score')
    expect(host.textContent).toContain('pilot')
    expect(host.textContent).toContain('Healthy')
    expect(host.textContent).not.toContain('Pilot evidence score')
    expect(host.textContent).not.toContain('87% evidence')
    expect(host.textContent).not.toContain('80% automated')
  })

  it('exposes all five weighted dimension scores in an accessible tooltip', () => {
    render(<HealthSummary healthByCatalog={{ 'canary.button': health }} />, host)

    const trigger = host.querySelector<HTMLButtonElement>('.ds-health-trigger')
    const tooltip = host.querySelector<HTMLElement>('[role="tooltip"]')

    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltip?.id)
    expect(trigger?.getAttribute('aria-label')).toContain('92 out of 100')
    expect(tooltip?.textContent).toContain('Contract definition20% weight100/100')
    expect(tooltip?.textContent).toContain('Figma implementation25% weight100/100')
    expect(tooltip?.textContent).toContain('Code implementation25% weight67/100')
    expect(tooltip?.textContent).toContain('Design–code parity20% weight100/100')
    expect(tooltip?.textContent).toContain('Governance evidence10% weight100/100')
  })
})
