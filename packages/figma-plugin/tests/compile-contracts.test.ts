import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { button, manifest } from './helpers/pilotCatalog'

const buttonContractPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../ui/catalog/contracts/button.contract.json'
)
const buttonContractSource = readFileSync(buttonContractPath, 'utf8')
const inventory = JSON.parse(
  readFileSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../ui/catalog/component-inventory.json'),
    'utf8'
  )
) as {
  components: Array<{ id: string; status: string; surfaces: string[]; contractPath?: string }>
}
const mappedFigmaComponents = inventory.components.filter(
  component => component.status === 'mapped' && component.surfaces.includes('figma')
)
const inventoryButton = mappedFigmaComponents.find(component => component.id === 'canary.button')
const buttonContract = JSON.parse(buttonContractSource) as {
  schemaVersion: string
  contractVersion: string
  identity: { id: string }
  lifecycle: { status: string }
  surfaces: { figma: { componentKeys: string[]; exampleNodeId: string } }
  properties: Array<{ id: string; bindings: { figma?: unknown; react?: unknown } }>
  anatomy: Array<{ id: string }>
  slots: Array<{ id: string }>
  states: Array<{ id: string; fidelity: { figma?: string } }>
  constraints: { combinations: Array<{ id: string; status: string; ruleId?: string }> }
  evaluations: Array<{ id: string; category: string }>
  examples: Array<{ id: string }>
}

const REMOVED_POC_KEYS = [
  '72ddb011a49dad7644013d53bf0ca292fa3d0801',
  '3b8741c1dab53bf70bf58f7999ecea8e81f8d012',
  '07e1e3cd641d5f03f14a0c985b32a98c0d67aa50',
  '18e6ebfc9bda70f0024b8ee64d5ec26c738d6ebc'
]

describe('compiled Button catalog', () => {
  it('matches the in-repo Button contract', () => {
    expect(inventoryButton?.contractPath).toBe('catalog/contracts/button.contract.json')
    expect(button.id).toBe(buttonContract.identity.id)
    expect(button.status).toBe(buttonContract.lifecycle.status)
    expect(button.source).toEqual({
      contractPath: `packages/ui/${inventoryButton?.contractPath}`,
      schemaVersion: buttonContract.schemaVersion,
      contractVersion: buttonContract.contractVersion,
      sha256: createHash('sha256').update(buttonContractSource).digest('hex')
    })
    expect(button.figma.name).toBe('❖Button')
    expect(button.figma.exampleNodeId).toBe(buttonContract.surfaces.figma.exampleNodeId)
    expect(button.figma.componentKeys).toEqual(buttonContract.surfaces.figma.componentKeys)
    expect(button.figma.componentKeys).toHaveLength(12)
    expect(button.anatomy.map(part => part.id)).toContain('label-or-icon')
    expect(button.slots.map(slot => slot.id)).toContain('content')
    expect(button.examples.map(example => example.id)).toContain('primary-action')
    expect(button.states.find(state => state.id === 'focus-visible')?.fidelity).toMatchObject({
      figma: 'specification'
    })
    expect(button.shared.find(prop => prop.name === 'theme')?.figmaValueAliases).toEqual({ '-': 'default' })
    expect(button.shared.map(prop => prop.name)).toContain('variant')
    expect(button.codeOnly.map(prop => prop.name)).toContain('onClick')
    expect(button.constraints.combinations).toEqual(
      buttonContract.constraints.combinations.map(({ ruleId, ...rule }) => ({
        ...rule,
        ...(ruleId ? { requirementId: ruleId } : {})
      }))
    )
    expect(button.constraints.combinations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'text-standard-md-sm-link',
          status: 'supported'
        }),
        expect.objectContaining({
          id: 'icon-semantic-theme-md-sm-xs',
          status: 'supported'
        })
      ])
    )
    expect(button.evaluations.map(evaluation => evaluation.id)).toContain('button.supported-combination')
    expect(button.tokenBindings.map(binding => binding.id)).toContain('focus-outline')
    expect(button.accessibility.map(rule => rule.id)).toContain('button.accessible-name')
    expect(button.usage.dont.map(rule => rule.id)).toContain('dont-2')
    expect(button.evaluationProfile.version).toBe('1.0.0')
    expect(button.baselineReceipt).toMatchObject({
      componentId: 'canary.button',
      schemaVersion: '0.5.0',
      contractVersion: '0.9.1',
      evaluationProfileVersion: '1.0.0'
    })
    for (const key of REMOVED_POC_KEYS) {
      expect(button.figma.componentKeys).not.toContain(key)
    }
  })
})

describe('compiled Canary pack', () => {
  it('includes only mapped, Figma-governed inventory entries', () => {
    expect(manifest.system.id).toBe('canary')
    expect(manifest.components.map(component => component.id)).toEqual(
      mappedFigmaComponents.map(component => component.id)
    )
    expect(manifest.components[0]?.figmaNames).toEqual(expect.arrayContaining(['Button', '❖Button']))
  })
})
