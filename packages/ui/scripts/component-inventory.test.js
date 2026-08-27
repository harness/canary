import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { afterEach, expect, test } from 'vitest'

const tempRoots = []

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

function writeFixture(root, relativePath, contents) {
  const filePath = join(root, relativePath)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, contents)
  return filePath
}

test('builds an inventory from public runtime exports and attaches supporting evidence', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-inventory-'))
  tempRoots.push(packageRoot)

  const componentsIndexPath = writeFixture(
    packageRoot,
    'src/components/index.ts',
    [
      "export * from './button'",
      "export * from './inputs'",
      "export * as Dialog from './dialog'",
      "export type * from './types'"
    ].join('\n')
  )
  writeFixture(
    packageRoot,
    'src/components/button.ts',
    [
      'const Button = () => null',
      'const buttonVariants = {}',
      'type ButtonProps = {}',
      'export { Button, buttonVariants, ButtonProps }'
    ].join('\n')
  )
  writeFixture(packageRoot, 'src/components/inputs/index.ts', "export * from './text-input'")
  writeFixture(
    packageRoot,
    'src/components/inputs/text-input.ts',
    [
      'export const TextInput = () => null',
      'export const TextInputHelper = () => null',
      'export interface TextInputProps {}'
    ].join('\n')
  )
  writeFixture(packageRoot, 'src/components/dialog/index.ts', 'export const Root = () => null')
  writeFixture(packageRoot, 'src/components/types.ts', 'export type Ignored = string')

  const portalDocsRoot = join(packageRoot, 'portal/components')
  writeFixture(packageRoot, 'portal/components/button.mdx', '# Button')
  writeFixture(packageRoot, 'portal/components/form/text-input.mdx', '# Text input')

  const codeConnectRoot = join(packageRoot, 'src/components')
  writeFixture(packageRoot, 'src/components/button-primary.figma.ts', '// component=Button\nexport default {}')
  writeFixture(
    packageRoot,
    'src/components/inputs/text-input-horizontal.figma.ts',
    '// component=TextInput\nexport default {}'
  )

  let inventoryModule
  try {
    inventoryModule = await import('./component-inventory.mjs')
  } catch {
    inventoryModule = undefined
  }

  expect(typeof inventoryModule?.generateComponentInventory).toBe('function')

  const inventory = inventoryModule.generateComponentInventory({
    packageRoot,
    componentsIndexPath,
    portalDocsRoot,
    codeConnectRoot
  })

  expect(inventory.components).toEqual([
    {
      id: 'canary.button',
      exportName: 'Button',
      sourcePath: 'src/components/button.ts',
      family: 'button',
      disposition: 'unreviewed',
      recommendedDisposition: 'contract',
      portalDoc: 'portal/components/button.mdx',
      codeConnect: ['src/components/button-primary.figma.ts'],
      figmaComponentKeys: [],
      priority: 'pilot',
      status: 'unreviewed'
    },
    {
      id: 'canary.dialog',
      exportName: 'Dialog',
      sourcePath: 'src/components/dialog/index.ts',
      family: 'dialog',
      disposition: 'unreviewed',
      recommendedDisposition: 'unreviewed',
      codeConnect: [],
      figmaComponentKeys: [],
      priority: 'medium',
      status: 'unreviewed'
    },
    {
      id: 'canary.text-input',
      exportName: 'TextInput',
      sourcePath: 'src/components/inputs/text-input.ts',
      family: 'inputs',
      disposition: 'unreviewed',
      recommendedDisposition: 'contract',
      portalDoc: 'portal/components/form/text-input.mdx',
      codeConnect: ['src/components/inputs/text-input-horizontal.figma.ts'],
      figmaComponentKeys: [],
      priority: 'pilot',
      status: 'unreviewed'
    },
    {
      id: 'canary.text-input-helper',
      exportName: 'TextInputHelper',
      sourcePath: 'src/components/inputs/text-input.ts',
      family: 'inputs',
      disposition: 'unreviewed',
      recommendedDisposition: 'part-of-family',
      codeConnect: [],
      figmaComponentKeys: [],
      priority: 'medium',
      status: 'unreviewed'
    }
  ])
})

test('preserves reviewed inventory fields when evidence is regenerated', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-inventory-'))
  tempRoots.push(packageRoot)

  const componentsIndexPath = writeFixture(packageRoot, 'src/components/index.ts', "export * from './button'")
  writeFixture(packageRoot, 'src/components/button.ts', 'export const Button = () => null')
  writeFixture(packageRoot, 'src/components/button-primary.figma.ts', '// component=Button\nexport default {}')

  const { generateComponentInventory } = await import('./component-inventory.mjs')
  const inventory = generateComponentInventory({
    packageRoot,
    componentsIndexPath,
    portalDocsRoot: join(packageRoot, 'portal/components'),
    codeConnectRoot: join(packageRoot, 'src/components'),
    existingInventory: {
      components: [
        {
          id: 'canary.button',
          exportName: 'Button',
          sourcePath: 'old/button.ts',
          family: 'actions',
          disposition: 'contract',
          codeConnect: [],
          figmaComponentKeys: ['button-key'],
          contractPath: 'catalog/button.catalog.json',
          governedBy: 'canary.action',
          replacedBy: 'canary.primary-action',
          surfaces: ['figma', 'code'],
          priority: 'high',
          status: 'classified'
        }
      ]
    }
  })

  expect(inventory.components[0]).toEqual({
    id: 'canary.button',
    exportName: 'Button',
    sourcePath: 'src/components/button.ts',
    family: 'actions',
    disposition: 'contract',
    recommendedDisposition: 'contract',
    codeConnect: ['src/components/button-primary.figma.ts'],
    figmaComponentKeys: ['button-key'],
    contractPath: 'catalog/button.catalog.json',
    governedBy: 'canary.action',
    replacedBy: 'canary.primary-action',
    surfaces: ['figma', 'code'],
    priority: 'high',
    status: 'classified'
  })
})

test('refreshes generated priority while an inventory entry is still unreviewed', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-inventory-'))
  tempRoots.push(packageRoot)

  const componentsIndexPath = writeFixture(packageRoot, 'src/components/index.ts', "export * from './card'")
  writeFixture(packageRoot, 'src/components/card.ts', 'export const Card = () => null')
  writeFixture(packageRoot, 'portal/components/card.mdx', '# Card')

  const { generateComponentInventory } = await import('./component-inventory.mjs')
  const inventory = generateComponentInventory({
    packageRoot,
    componentsIndexPath,
    portalDocsRoot: join(packageRoot, 'portal/components'),
    codeConnectRoot: join(packageRoot, 'src/components'),
    existingInventory: {
      components: [
        {
          id: 'canary.card',
          disposition: 'unreviewed',
          priority: 'medium',
          status: 'unreviewed'
        }
      ]
    }
  })

  expect(inventory.components[0].priority).toBe('high')
})

test('matches Code Connect evidence by component metadata instead of filename prefix', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-inventory-'))
  tempRoots.push(packageRoot)

  const componentsIndexPath = writeFixture(
    packageRoot,
    'src/components/index.ts',
    ["export * from './message'", "export * from './message-bubble'"].join('\n')
  )
  writeFixture(packageRoot, 'src/components/message.ts', 'export const Message = () => null')
  writeFixture(packageRoot, 'src/components/message-bubble.ts', 'export const MessageBubble = () => null')
  writeFixture(packageRoot, 'src/components/message-bubble.figma.ts', '// component=MessageBubble\nexport default {}')

  const { generateComponentInventory } = await import('./component-inventory.mjs')
  const inventory = generateComponentInventory({
    packageRoot,
    componentsIndexPath,
    portalDocsRoot: join(packageRoot, 'portal/components'),
    codeConnectRoot: join(packageRoot, 'src/components')
  })

  expect(inventory.components.find(component => component.exportName === 'Message')?.codeConnect).toEqual([])
  expect(inventory.components.find(component => component.exportName === 'MessageBubble')?.codeConnect).toEqual([
    'src/components/message-bubble.figma.ts'
  ])
})

test('serializes the generated inventory using canonical JSON formatting', async () => {
  const { serializeComponentInventory } = await import('./component-inventory.mjs')

  const serialized = await serializeComponentInventory(
    {
      schemaVersion: 1,
      components: [
        {
          id: 'canary.accordion',
          codeConnect: ['src/components/accordion-card.figma.ts', 'src/components/accordion-default.figma.ts']
        }
      ]
    },
    join(process.cwd(), 'catalog/component-inventory.json')
  )

  expect(serialized).toBe(
    [
      '{',
      '  "schemaVersion": 1,',
      '  "components": [',
      '    {',
      '      "id": "canary.accordion",',
      '      "codeConnect": ["src/components/accordion-card.figma.ts", "src/components/accordion-default.figma.ts"]',
      '    }',
      '  ]',
      '}',
      ''
    ].join('\n')
  )
})
