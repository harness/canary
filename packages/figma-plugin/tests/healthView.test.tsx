/** @vitest-environment jsdom */

import { render } from 'preact'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ComponentHealth } from '../src/core/health'
import { HealthSummary } from '../src/ui/tabs/CheckTab'

const health: ComponentHealth = {
  catalogId: 'canary.button',
  score: 92,
  status: 'healthy',
  blocked: false,
  blockers: [],
  evaluationCoverage: 87,
  automationCoverage: 80,
  dimensions: []
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
  it('shows score, status, and both coverage measures', () => {
    render(<HealthSummary healthByCatalog={{ 'canary.button': health }} />, host)

    expect(host.textContent).toContain('92/100')
    expect(host.textContent).toContain('Healthy')
    expect(host.textContent).toContain('87% evidence')
    expect(host.textContent).toContain('80% automated')
  })
})
