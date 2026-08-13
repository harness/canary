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
  id: string
  status: string
  schemaVersion: string
  contractVersion: string
  figma: { componentKeys: string[]; exampleNodeId: string }
  properties: { designOnly: Array<{ name: string }>; shared: Array<{ name: string }> }
  supportMatrix: Array<{ id: string; status: string }>
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
    expect(button.id).toBe(buttonContract.id)
    expect(button.status).toBe(buttonContract.status)
    expect(button.source).toEqual({
      contractPath: `packages/ui/${inventoryButton?.contractPath}`,
      schemaVersion: buttonContract.schemaVersion,
      contractVersion: buttonContract.contractVersion,
      sha256: createHash('sha256').update(buttonContractSource).digest('hex')
    })
    expect(button.figma.name).toBe('❖Button')
    expect(button.figma.exampleNodeId).toBe(buttonContract.figma.exampleNodeId)
    expect(button.figma.componentKeys).toEqual(buttonContract.figma.componentKeys)
    expect(button.figma.componentKeys).toHaveLength(12)
    expect(button.designOnly.map(prop => prop.name)).toContain('leadingIcon')
    expect(button.shared.map(prop => prop.name)).toContain('variant')
    expect(button.supportMatrix).toEqual(buttonContract.supportMatrix)
    expect(button.supportMatrix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'text-standard-md-sm-link',
          status: 'supported'
        }),
        expect.objectContaining({
          id: 'icon-semantic-theme-md-sm-xs',
          status: 'unsupported'
        })
      ])
    )
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
