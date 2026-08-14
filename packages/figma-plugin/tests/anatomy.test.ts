import { describe, expect, it } from 'vitest'

import { evaluateAnatomy, findAnatomyControl } from '../src/core/anatomy'
import { canonicalizeSnapshot } from '../src/core/canonical'
import type { InstanceSnapshot } from '../src/core/types'
import { buttonEntry } from './helpers/pilotCatalog'

function snapshot(partial: Partial<InstanceSnapshot> = {}): InstanceSnapshot {
  return {
    nodeId: '1:1',
    nodeName: 'Button',
    mainComponentName: 'variant=primary, state=default',
    componentKey: 'button-variant',
    componentSetName: '❖Button/Md/Text',
    isFromLibrary: true,
    properties: {
      variant: 'primary',
      theme: 'default',
      'button text#37:10': 'Save'
    },
    ...partial
  }
}

describe('evaluateAnatomy', () => {
  it('matches alternate exposed property names to canonical anatomy', () => {
    expect(findAnatomyControl(buttonEntry, '↳ suffix#1955:0')).toMatchObject({
      id: 'trailing-icon'
    })
  })

  it('accepts the required text content', () => {
    const node = snapshot()
    const findings = evaluateAnatomy(node, buttonEntry, canonicalizeSnapshot(node, buttonEntry))

    expect(findings.some(finding => finding.code === 'FAIL_REQUIRED_ANATOMY')).toBe(false)
  })

  it('accepts a required text layer collected from a source component', () => {
    const node = snapshot({
      properties: { variant: 'primary', theme: 'default' },
      childNames: ['prefix', 'text', 'suffix']
    })
    const findings = evaluateAnatomy(node, buttonEntry, canonicalizeSnapshot(node, buttonEntry))

    expect(findings.some(finding => finding.code === 'FAIL_REQUIRED_ANATOMY')).toBe(false)
  })

  it('fails a text Button without its required label', () => {
    const node = snapshot({ properties: { variant: 'primary', theme: 'default' } })
    const findings = evaluateAnatomy(node, buttonEntry, canonicalizeSnapshot(node, buttonEntry))

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'FAIL_REQUIRED_ANATOMY',
          severity: 'fail',
          propName: 'label-or-icon'
        })
      ])
    )
  })

  it('accepts icon-only content without a text label', () => {
    const node = snapshot({
      componentSetName: '❖Button/Md/IconOnly',
      properties: { variant: 'primary', theme: 'default' }
    })
    const findings = evaluateAnatomy(node, buttonEntry, canonicalizeSnapshot(node, buttonEntry))

    expect(findings.some(finding => finding.code === 'FAIL_REQUIRED_ANATOMY')).toBe(false)
  })

  it('records the focus specification as an intentional surface difference', () => {
    const node = snapshot()
    const findings = evaluateAnatomy(node, buttonEntry, canonicalizeSnapshot(node, buttonEntry))

    expect(
      findings.filter(finding => finding.code === 'INFO_INTENTIONAL_DIFFERENCE' && finding.propName === 'focus-visible')
    ).toHaveLength(1)
  })
})
