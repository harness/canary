import { describe, expect, it } from 'vitest'

import { checkInstance, checkInstances } from '../src/core/check'
import type { InstanceSnapshot } from '../src/core/types'
import { buttonEntry as entry, pilotIndex } from './helpers/pilotCatalog'

const index = pilotIndex()

function snap(partial: Partial<InstanceSnapshot>): InstanceSnapshot {
  return {
    nodeId: '10:20',
    nodeName: 'Button',
    mainComponentName: '❖Button',
    componentKey: 'abc',
    isFromLibrary: true,
    properties: {},
    ...partial
  }
}

describe('checkInstance', () => {
  it('passes legal primary/sm shared props', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'primary',
          size: 'sm',
          theme: '⚫ default',
          rounded: false,
          disabled: false,
          iconOnly: false
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    expect(result.findings.filter(f => f.severity === 'fail')).toEqual([])
    expect(result.ok).toBe(true)
  })

  it('accepts the Figma dash theme as the default for a link Button', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'link',
          size: 'md',
          theme: '-'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )

    expect(result.findings.filter(f => f.severity === 'fail')).toEqual([])
    expect(result.ok).toBe(true)
  })

  it('fails illegal subtle variant with proposeDefaults', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'subtle',
          size: 'md',
          theme: 'default'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const fail = result.findings.find(f => f.code === 'FAIL_SHARED_VALUE')
    expect(fail).toBeDefined()
    expect(fail?.propName).toBe('variant')
    expect(fail?.actual).toBe('subtle')
    expect(fail?.expected).toContain('primary')
    expect(fail?.proposeDefaults?.requestedChange).toMatch(/subtle/i)
    expect(result.ok).toBe(false)
  })

  it('records icon boolean helpers as intentional composition differences', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'primary',
          size: 'md',
          theme: 'default',
          'icon#1567:1': true,
          'suffix icon#1687:61': false,
          'button text#1567:0': 'Save'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const designOnly = result.findings.filter(f => f.code === 'INFO_INTENTIONAL_DIFFERENCE')
    expect(designOnly.length).toBeGreaterThanOrEqual(1)
    expect(designOnly.some(f => f.propName === 'leading-icon')).toBe(true)
    expect(designOnly[0]?.bindingHint).toBeTruthy()
    expect(result.ok).toBe(true)
  })

  it('treats the exposed nested suffix control as trailingIcon once', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'ai',
          size: 'md',
          theme: 'default',
          'suffix icon#1687:61': true,
          '↳ suffix#1955:0': 'IconV2/bolt'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )

    expect(result.findings.filter(f => f.severity === 'fail')).toEqual([])
    expect(
      result.findings.filter(f => f.code === 'INFO_INTENTIONAL_DIFFERENCE' && f.propName === 'trailing-icon')
    ).toHaveLength(1)
    expect(result.ok).toBe(true)
  })

  it('accepts the icon-only tooltip control as design-only composition', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'primary',
          size: 'xs',
          theme: 'default',
          'tooltip#7883:174': true
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )

    expect(result.findings.filter(f => f.severity === 'fail')).toEqual([])
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INFO_INTENTIONAL_DIFFERENCE',
          propName: 'tooltip',
          bindingHint: 'Tooltip through tooltipProps'
        })
      ])
    )
    expect(result.ok).toBe(true)
  })

  it('fails detached instances', () => {
    const result = checkInstance(snap({ isFromLibrary: false }), entry, { treatMissingLibraryFlagAs: 'ignore' })
    expect(result.findings.some(f => f.code === 'FAIL_DETACHED')).toBe(true)
    expect(result.ok).toBe(false)
  })

  it('fails unknown props', () => {
    const result = checkInstance(
      snap({
        properties: {
          variant: 'primary',
          size: 'md',
          theme: 'default',
          mysteryGlow: true
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const unknown = result.findings.find(f => f.code === 'FAIL_UNKNOWN_PROP')
    expect(unknown?.propName).toBe('mysteryGlow')
    expect(unknown?.proposeDefaults?.type).toBe('designOnly')
  })

  it('evaluates the approved component combination from canonical Figma values', () => {
    const result = checkInstance(
      snap({
        componentSetName: '❖Button/Md/Text',
        properties: {
          variant: 'ai',
          theme: 'danger',
          'button text#37:10': 'Generate'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'FAIL_UNSUPPORTED_COMBINATION',
          severity: 'fail'
        })
      ])
    )
    expect(result.ok).toBe(false)
  })

  it('recognizes anatomy controls instead of treating them as unknown props', () => {
    const result = checkInstance(
      snap({
        componentSetName: '❖Button/Md/Text',
        properties: {
          variant: 'primary',
          theme: 'default',
          'button text#37:10': 'Save',
          '↳ suffix#1955:0': 'IconV2/bolt'
        }
      }),
      entry,
      { treatMissingLibraryFlagAs: 'ignore' }
    )

    expect(result.findings.some(finding => finding.code === 'FAIL_UNKNOWN_PROP')).toBe(false)
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INFO_INTENTIONAL_DIFFERENCE',
          propName: 'trailing-icon'
        })
      ])
    )
  })
})

describe('unmapped instances', () => {
  const unmapped = snap({
    nodeName: 'prefix',
    mainComponentName: '❖IconSlot',
    componentKey: 'not-in-catalog'
  })

  it('never counts an unmapped instance as pass', () => {
    const report = checkInstances([unmapped], index, {
      treatMissingLibraryFlagAs: 'ignore',
      strictUnmapped: false
    })
    expect(report.summary.pass).toBe(0)
    expect(report.summary.unmapped).toBe(1)
    expect(report.summary.mappedCount).toBe(0)
    expect(report.instances[0]?.ok).toBe(false)
    expect(report.instances[0]?.status).toBe('unmapped')
  })

  it('explains that an unmapped instance cannot be verified', () => {
    const report = checkInstances([unmapped], index, {
      treatMissingLibraryFlagAs: 'ignore',
      strictUnmapped: false
    })
    const finding = report.instances[0]?.findings[0]
    expect(finding?.code).toBe('INFO_UNMAPPED')
    expect(finding?.severity).toBe('info')
    expect(finding?.message).toContain('Not in catalog')
    expect(finding?.proposeDefaults?.type).toBe('component')
  })

  it('drops unmapped parts nested inside a reported component', () => {
    const parent = snap({
      nodeId: '1:1',
      nodeName: 'Button',
      properties: {
        variant: 'primary',
        size: 'md',
        theme: 'default'
      }
    })
    const part = snap({
      nodeId: '1:2',
      nodeName: 'prefix',
      mainComponentName: '❖IconSlot',
      componentKey: 'not-in-catalog',
      parentNodeId: '1:1'
    })
    const report = checkInstances([parent, part], index, {
      treatMissingLibraryFlagAs: 'ignore',
      strictUnmapped: false
    })
    expect(report.instances).toHaveLength(1)
    expect(report.summary.instanceCount).toBe(1)
    expect(report.summary.unmapped).toBe(0)
    expect(report.summary.pass).toBe(1)
  })

  it('keeps a mapped child of a mapped parent', () => {
    const parent = snap({ nodeId: '1:1', nodeName: 'Card' })
    const child = snap({
      nodeId: '1:2',
      nodeName: 'Badge',
      mainComponentName: '❖Badge',
      parentNodeId: '1:1'
    })
    const report = checkInstances([parent, child], index, {
      treatMissingLibraryFlagAs: 'ignore'
    })
    expect(report.instances).toHaveLength(2)
  })
})

/**
 * The repro from the field: a genuine ❖Button/Md/Text instance. Its main
 * component is a variant, so the name is a property combination and the key
 * is the variant's, not the published set key the catalog records.
 */
describe('variant-set library instances', () => {
  const VARIANT_COMBO = 'variant=primary, 👁 disabled=off, state=default, theme=⚫ default'

  const libraryButton = snap({
    nodeId: '1:544',
    nodeName: '❖Button/Md/Text',
    nodeType: 'INSTANCE',
    mainComponentName: VARIANT_COMBO,
    componentKey: 'variant-key-not-in-catalog',
    componentSetName: '❖Button/Md/Text',
    componentSetKey: '188019ff5a5c45f3009b963213c98e95dc1c780f',
    isFromLibrary: true,
    properties: {
      variant: 'primary',
      '👁 disabled': 'off',
      state: 'default',
      theme: '⚫ default',
      'button text#37:10': 'Button',
      'icon#37:11': false
    }
  })

  it('checks a genuine library instance instead of calling it unmapped', () => {
    const report = checkInstances([libraryButton], index, {
      treatMissingLibraryFlagAs: 'ignore'
    })
    expect(report.summary.unmapped).toBe(0)
    expect(report.summary.mappedCount).toBe(1)
    expect(report.instances[0]?.catalogId).toBe('canary.button')
    expect(report.instances[0]?.status).toBe('checked')
    expect(report.findings.filter(f => f.severity === 'fail')).toEqual([])
    expect(report.summary.pass).toBe(1)
  })

  it('still fails an off-catalog shared value on that instance', () => {
    const report = checkInstances(
      [
        {
          ...libraryButton,
          properties: { ...libraryButton.properties, variant: 'subtle' }
        }
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const fail = report.findings.find(f => f.code === 'FAIL_SHARED_VALUE')
    expect(fail?.propName).toBe('variant')
    expect(report.summary.pass).toBe(0)
  })

  it('names the component in the unmapped message, not its properties', () => {
    const report = checkInstances(
      [
        snap({
          nodeName: 'Save',
          nodeType: 'INSTANCE',
          mainComponentName: VARIANT_COMBO,
          componentKey: 'not-in-catalog',
          componentSetName: '❖Mystery',
          componentSetKey: 'also-not-in-catalog'
        })
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const message = report.instances[0]?.findings[0]?.message ?? ''
    expect(message).toContain('❖Mystery')
    expect(message).not.toContain('variant=primary')
    expect(message).not.toContain('=')
  })
})

describe('detached components', () => {
  it('fails a local component whose name matches a catalog component', () => {
    const report = checkInstances(
      [
        snap({
          nodeId: '1:1500',
          nodeName: 'Button',
          nodeType: 'COMPONENT',
          mainComponentName: null,
          componentKey: null,
          isFromLibrary: false
        })
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    const finding = report.findings[0]
    expect(finding?.code).toBe('FAIL_DETACHED')
    expect(finding?.catalogId).toBe('canary.button')
    expect(finding?.message).toContain('local component')
    expect(report.summary.fail).toBe(1)
    expect(report.summary.pass).toBe(0)
    expect(report.summary.mappedCount).toBe(1)
  })

  it('fails a detached frame whose name matches a catalog component', () => {
    const report = checkInstances(
      [
        snap({
          nodeId: '1:1600',
          nodeName: '❖Button',
          nodeType: 'FRAME',
          mainComponentName: null,
          componentKey: null,
          isFromLibrary: false
        })
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    expect(report.findings[0]?.code).toBe('FAIL_DETACHED')
    expect(report.findings[0]?.message).toContain('detached frame')
  })

  it('does not name-match a renamed library instance by its layer name', () => {
    const report = checkInstances(
      [
        snap({
          nodeName: 'Button',
          mainComponentName: '❖Mystery',
          componentKey: 'not-in-catalog'
        })
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    expect(report.summary.mappedCount).toBe(0)
  })
})

describe('checkInstances', () => {
  it('reports unmapped only when strictUnmapped and ❖ prefix', () => {
    const snapshots: InstanceSnapshot[] = [
      snap({
        mainComponentName: '❖Mystery',
        properties: { variant: 'x' }
      })
    ]
    const quiet = checkInstances(snapshots, index, {
      treatMissingLibraryFlagAs: 'ignore',
      strictUnmapped: false
    })
    expect(quiet.findings.some(f => f.code === 'FAIL_UNMAPPED')).toBe(false)

    const strict = checkInstances(snapshots, index, {
      treatMissingLibraryFlagAs: 'ignore',
      strictUnmapped: true
    })
    expect(strict.findings.some(f => f.code === 'FAIL_UNMAPPED')).toBe(true)
  })

  it('summarizes mapped button check', () => {
    const report = checkInstances(
      [
        snap({
          properties: {
            variant: 'primary',
            size: 'sm',
            theme: 'default'
          }
        })
      ],
      index,
      { treatMissingLibraryFlagAs: 'ignore' }
    )
    expect(report.summary.instanceCount).toBe(1)
    expect(report.summary.mappedCount).toBe(1)
    expect(report.summary.pass).toBe(1)
    expect(report.instances[0]?.ok).toBe(true)
  })
})
