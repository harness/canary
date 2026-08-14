import { describe, expect, it } from 'vitest'

import { canonicalizeSnapshot } from '../src/core/canonical'
import type { InstanceSnapshot } from '../src/core/types'
import { buttonEntry } from './helpers/pilotCatalog'

function snapshot(partial: Partial<InstanceSnapshot> = {}): InstanceSnapshot {
  return {
    nodeId: '1:1',
    nodeName: 'Button',
    mainComponentName: 'variant=primary, state=default',
    componentKey: 'button-variant',
    componentSetName: '❖Button/Sm/IconOnlyRounded',
    isFromLibrary: true,
    properties: {
      variant: 'primary',
      theme: '-',
      '👁 disabled': 'off'
    },
    ...partial
  }
}

describe('canonicalizeSnapshot', () => {
  it('resolves canonical values from Figma properties and component names', () => {
    const result = canonicalizeSnapshot(snapshot(), buttonEntry)

    expect(result.values).toMatchObject({
      variant: 'primary',
      size: 'sm',
      theme: 'default',
      rounded: true,
      iconOnly: true,
      disabled: false
    })
    expect(result.sources.size).toBe('componentName')
    expect(result.sources.theme).toBe('property')
  })

  it('uses the declared canonical default when Figma omits a property', () => {
    const result = canonicalizeSnapshot(snapshot({ properties: { theme: 'default' } }), buttonEntry)

    expect(result.values.variant).toBe('primary')
    expect(result.sources.variant).toBe('fallback')
  })
})
