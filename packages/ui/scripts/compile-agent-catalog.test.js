import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, expect, test } from 'vitest'

import { compileAgentCatalog } from './compile-agent-catalog.mjs'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const tempRoots = []

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

function writeFixture(root, relativePath, contents) {
  const filePath = join(root, relativePath)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, typeof contents === 'string' ? contents : `${JSON.stringify(contents, null, 2)}\n`)
  return filePath
}

function parseCatalog(result) {
  return {
    components: JSON.parse(result.files['catalog/generated/agent/components.json']),
    icons: JSON.parse(result.files['catalog/generated/agent/icons.json']),
    foundations: JSON.parse(result.files['catalog/generated/agent/foundations.json']),
    tokens: JSON.parse(result.files['catalog/generated/agent/tokens.json'])
  }
}

function findRecord(records, id) {
  return records.find(record => record.id === id)
}

function createFixturePackage() {
  const root = mkdtempSync(join(tmpdir(), 'canary-agent-catalog-'))
  tempRoots.push(root)

  writeFixture(root, 'catalog/agent-aliases.json', {
    Dialog: ['modal', 'dialog overlay'],
    Drawer: ['drawer', 'slide-over', 'side panel']
  })
  writeFixture(root, 'catalog/icon-synonyms.json', {
    trash: ['delete', 'remove']
  })
  writeFixture(root, 'src/components/icon-v2/icon-name-map.ts', [
    'export const IconNameMapV2 = {',
    '  trash: Trash,',
    '  xmark: Xmark',
    '}',
    ''
  ].join('\n'))
  writeFixture(
    root,
    'src/components/button.tsx',
    "export const Button = () => null\n"
  )
  writeFixture(
    root,
    'src/components/dialog.tsx',
    ['export const Dialog = {', '  Root,', '  Trigger,', '  Content,', '  Close', '}', ''].join('\n')
  )
  writeFixture(
    root,
    'src/components/drawer/index.ts',
    ['export const Drawer = {', '  Root: DrawerRoot,', '  Trigger: DrawerTrigger', '}', ''].join('\n')
  )
  writeFixture(root, 'src/components/mystery.ts', 'export const MysteryExport = () => null\n')
  writeFixture(
    root,
    'catalog/contracts/button.contract.json',
    {
      contractVersion: '0.0.1',
      identity: {
        id: 'canary.button',
        name: 'Button',
        summary: 'Triggers an immediate user action.',
        aliases: ['Action Button']
      },
      lifecycle: { status: 'stable' },
      semantics: {
        useWhen: ['The user needs to trigger an action.'],
        avoidWhen: ['The interaction navigates to a destination.']
      },
      surfaces: {
        react: {
          import: 'import { Button } from "@harnessio/ui/components"'
        }
      },
      properties: [
        {
          id: 'size',
          name: 'size',
          type: 'enum',
          values: ['md', 'sm'],
          default: 'md',
          description: 'Sets the component dimensions.',
          bindings: { react: { kind: 'prop', name: 'size' } }
        }
      ],
      usage: {
        do: [{ statement: 'Use primary for the highest-priority action.' }],
        dont: [{ statement: 'Use Button for ordinary navigation.' }],
        relatedComponents: ['Link']
      },
      examples: [
        {
          id: 'icon-only-action',
          name: 'Icon-only action',
          purpose: 'Shows a compact icon action.',
          status: 'recommended',
          references: {
            code: "<Button iconOnly aria-label='Add'><IconV2 icon='plus' /></Button>"
          }
        }
      ],
      constraints: {
        exhaustive: true,
        dimensions: ['size'],
        combinations: []
      },
      migrations: [{ id: 'rounded-text-to-standard', instructions: 'Replace rounded text Buttons.' }]
    }
  )
  writeFixture(
    root,
    'portal/dialog.mdx',
    [
      '---',
      'title: Dialog',
      'description: A dialog overlay that appears above the page content',
      '---',
      '',
      'import { DocsPage } from "@/components/docs-page";',
      '',
      '<DocsPage.ComponentExample',
      '  client:only',
      '  code={`<Dialog.Root>',
      '      <Dialog.Trigger>',
      '        <Button>Open Dialog</Button>',
      '      </Dialog.Trigger>',
      '    </Dialog.Root>`}',
      '/>',
      '',
      '## Usage',
      '',
      '```typescript jsx',
      'import { DocsPage } from "@/components/docs-page";',
      'import { Dialog } from "@harnessio/ui/components";',
      '',
      'return (',
      '  <Dialog.Root />',
      ')',
      '```',
      ''
    ].join('\n')
  )
  writeFixture(
    root,
    'portal/drawer.mdx',
    [
      '---',
      'title: Drawer',
      'description: Drawer component with stacking',
      '---',
      '',
      '<DocsPage.ComponentExample',
      '  client:only',
      '  code={`<Drawer.Root>',
      '      <Drawer.Trigger>',
      '        <Button>Open Drawer</Button>',
      '      </Drawer.Trigger>',
      '    </Drawer.Root>`}',
      '/>',
      ''
    ].join('\n')
  )
  writeFixture(
    root,
    'portal/button.mdx',
    [
      '---',
      'title: Button',
      'description: Original button portal copy',
      '---',
      '',
      'Button docs.',
      ''
    ].join('\n')
  )
  writeFixture(root, 'catalog/component-inventory.json', {
    schemaVersion: 1,
    components: [
      {
        id: 'canary.button',
        exportName: 'Button',
        sourcePath: 'src/components/button.tsx',
        family: 'button',
        disposition: 'contract',
        portalDoc: 'portal/button.mdx',
        contractPath: 'catalog/contracts/button.contract.json',
        status: 'mapped'
      },
      {
        id: 'canary.dialog',
        exportName: 'Dialog',
        sourcePath: 'src/components/dialog.tsx',
        family: 'dialog',
        disposition: 'unreviewed',
        portalDoc: 'portal/dialog.mdx',
        status: 'unreviewed'
      },
      {
        id: 'canary.drawer',
        exportName: 'Drawer',
        sourcePath: 'src/components/drawer/index.ts',
        family: 'drawer',
        disposition: 'contract',
        portalDoc: 'portal/drawer.mdx',
        contractPath: 'catalog/contracts/drawer.contract.json',
        status: 'classified'
      },
      {
        id: 'canary.diff-mode-enum',
        exportName: 'DiffModeEnum',
        sourcePath: 'src/components/diff-viewer.tsx',
        family: 'diff-viewer',
        disposition: 'unreviewed',
        recommendedDisposition: 'part-of-family',
        status: 'unreviewed'
      },
      {
        id: 'canary.mystery-export',
        exportName: 'MysteryExport',
        sourcePath: 'src/components/mystery.ts',
        family: 'mystery',
        disposition: 'unreviewed',
        status: 'unreviewed'
      }
    ]
  })

  return root
}

const compiled = compileAgentCatalog({ packageRoot, write: false })
const catalog = parseCatalog(compiled)

test('projects Button as stable from the contract', () => {
  const button = findRecord(catalog.components.records, 'canary.button')

  expect(button.confidence).toBe('stable')
  expect(button.import).toBe('import { Button } from "@harnessio/ui/components"')
  expect(button.do.length).toBeGreaterThan(0)
  expect(button.dont.length).toBeGreaterThan(0)
  expect(button.props.some(prop => prop.name === 'variant')).toBe(true)
  expect(button.constraints?.exhaustive).toBe(true)
  expect(button.migrations?.some(item => item.id === 'rounded-text-to-standard')).toBe(true)
  expect(button.contractVersion).toBeTruthy()
})

test('rewrites stale IconV2 icon= example source to name=', () => {
  const button = findRecord(catalog.components.records, 'canary.button')
  const iconOnly = button.examples.find(example => example.id === 'icon-only-action')

  expect(iconOnly.code).toContain("IconV2 name='plus'")
  expect(iconOnly.code).not.toContain('icon=')
})

test('projects Dialog as fallback from Portal ComponentExample members', () => {
  const dialog = findRecord(catalog.components.records, 'canary.dialog')
  const exampleCode = dialog.examples.map(example => example.code).join('\n')

  expect(dialog.confidence).toBe('fallback')
  expect(dialog.import).toBe('import { Dialog } from "@harnessio/ui/components"')
  expect(dialog.props).toEqual([])
  expect(dialog.sourcePath).toBeTruthy()
  expect(exampleCode).toContain('Dialog.Root')
  expect(dialog.examples[0].id).toMatch(/^portal-example-/)
  expect(dialog.members).toEqual(expect.arrayContaining(['Root', 'Trigger', 'Content', 'Header', 'Title']))
  expect(dialog.aliases).toContain('modal')
})

test('projects Drawer as fallback when the named contract file is missing', () => {
  const drawer = findRecord(catalog.components.records, 'canary.drawer')
  const exampleCode = drawer.examples.map(example => example.code).join('\n')

  expect(drawer.confidence).toBe('fallback')
  expect(drawer.props).toEqual([])
  expect(drawer.sourcePath).toBeTruthy()
  expect(exampleCode).toContain('Drawer.Root')
  expect(drawer.members).toEqual(expect.arrayContaining(['Root', 'Trigger']))
  expect(drawer.do).toEqual([])
  expect(drawer.dont).toEqual([])
})

test('excludes type, enum, map, and context noise from the searchable set', () => {
  const ids = catalog.components.records.map(record => record.id)

  expect(ids).not.toContain('canary.diff-mode-enum')
  expect(ids).not.toContain('canary.form-wrapper-context')
  expect(ids).not.toContain('canary.icon-name-map-v2')
  expect(ids).not.toContain('canary.logo-name-map-v2')
})

test('keeps unreviewed exports without invented do/don’t', () => {
  const accent = findRecord(catalog.components.records, 'canary.accent-color')

  expect(accent.confidence).toBe('unreviewed')
  expect(accent.do).toEqual([])
  expect(accent.dont).toEqual([])
})

test('maps IconV2 to the visual icon Portal page and lists trash with delete synonym', () => {
  const iconV2 = findRecord(catalog.components.records, 'canary.icon-v2')
  const trash = catalog.icons.records.find(icon => icon.name === 'trash')

  expect(iconV2.confidence).toBe('fallback')
  expect(iconV2.portalPath).toContain('components/visual/icon.mdx')
  expect(iconV2.examples.some(example => example.code?.includes('<IconV2 name="check"'))).toBe(true)
  expect(trash.usage).toBe('<IconV2 name="trash" />')
  expect(trash.synonyms).toEqual(expect.arrayContaining(['delete', 'remove']))
})

test('compiles installation, theming, and other foundation pages', () => {
  const byId = Object.fromEntries(catalog.foundations.records.map(record => [record.id, record]))

  expect(byId.installation.rules.some(rule => rule.includes('pnpm add @harnessio/ui'))).toBe(true)
  expect(byId.installation.rules.some(rule => rule.includes('react >= 17'))).toBe(true)
  expect(byId.installation.rules.some(rule => rule.includes('@harnessio/ui/styles.css'))).toBe(true)
  expect(Object.keys(byId).sort()).toEqual(
    [
      'button-layout',
      'color',
      'color-system',
      'dialog-form',
      'dual-pane-drawer',
      'dual-pane-stepper',
      'empty-state',
      'filter-bar',
      'icons',
      'installation',
      'layout',
      'page-header',
      'single-pane-stepper',
      'spacing',
      'theming',
      'typography',
      'usage',
      'variables'
    ].sort()
  )
  expect(byId['filter-bar'].rules.some(rule => rule.includes('@harnessio/filters'))).toBe(true)
  expect(byId['filter-bar'].rules.some(rule => rule.includes('FilterBar') && rule.includes('@harnessio/ui'))).toBe(true)
  expect(byId['dialog-form'].rules.some(rule => rule.includes('ButtonLayout'))).toBe(true)
  expect(byId['page-header'].rules.some(rule => rule.includes('Page.Header'))).toBe(true)
  expect(byId['empty-state'].rules.some(rule => rule.includes('NoData'))).toBe(true)
  expect(byId['dual-pane-drawer'].rules.some(rule => rule.includes('Drawer.DualPane'))).toBe(true)
  expect(byId.theming).toBeTruthy()
  expect(byId.theming.rules.length).toBeGreaterThan(0)
  expect(byId.theming.rules.length).toBeLessThanOrEqual(12)
  for (const record of catalog.foundations.records) {
    expect(record.rules.length).toBeLessThanOrEqual(12)
  }
  expect(catalog.tokens.records.some(token => token.id === 'canary.semantic.focus-ring')).toBe(true)
  expect(catalog.components).not.toHaveProperty('generatedAt')
  expect(catalog.icons).not.toHaveProperty('generatedAt')
  expect(catalog.foundations).not.toHaveProperty('generatedAt')
  expect(catalog.tokens).not.toHaveProperty('generatedAt')
})

test('two compiles of the same tree are byte-identical', () => {
  const second = compileAgentCatalog({ packageRoot, write: false })

  expect(second.files['catalog/generated/agent/components.json']).toBe(
    compiled.files['catalog/generated/agent/components.json']
  )
  expect(second.files['catalog/generated/agent/icons.json']).toBe(compiled.files['catalog/generated/agent/icons.json'])
  expect(second.files['catalog/generated/agent/foundations.json']).toBe(
    compiled.files['catalog/generated/agent/foundations.json']
  )
  expect(second.files['catalog/generated/agent/tokens.json']).toBe(compiled.files['catalog/generated/agent/tokens.json'])
  expect(compiled.sourceSha256).toMatch(/^[a-f0-9]{64}$/)
})

test('missing contract files and ComponentExample extraction work on a fixture package', () => {
  const fixtureRoot = createFixturePackage()
  const result = compileAgentCatalog({ packageRoot: fixtureRoot, write: false })
  const parsed = parseCatalog(result)
  const button = findRecord(parsed.components.records, 'canary.button')
  const dialog = findRecord(parsed.components.records, 'canary.dialog')
  const drawer = findRecord(parsed.components.records, 'canary.drawer')
  const mystery = findRecord(parsed.components.records, 'canary.mystery-export')
  const ids = parsed.components.records.map(record => record.id)

  expect(button.confidence).toBe('stable')
  expect(button.examples[0].code).toContain("IconV2 name='plus'")
  expect(dialog.confidence).toBe('fallback')
  expect(dialog.props).toEqual([])
  expect(dialog.examples[0].code).toContain('Dialog.Root')
  expect(dialog.examples.some(example => example.code?.includes('@/components'))).toBe(false)
  expect(dialog.members).toEqual(expect.arrayContaining(['Root', 'Trigger', 'Content']))
  expect(drawer.confidence).toBe('fallback')
  expect(drawer.props).toEqual([])
  expect(drawer.examples[0].code).toContain('Drawer.Root')
  expect(mystery.confidence).toBe('unreviewed')
  expect(mystery.props).toEqual([])
  expect(ids).not.toContain('canary.diff-mode-enum')
  expect(parsed.foundations.records.map(record => record.id)).toEqual(['installation'])
  expect(parsed.foundations.records[0].rules.some(rule => rule.includes('pnpm add @harnessio/ui'))).toBe(true)
})

test('editing Portal copy changes sourceSha256 after regenerate', () => {
  const fixtureRoot = createFixturePackage()
  const first = compileAgentCatalog({ packageRoot: fixtureRoot, write: false })
  writeFixture(
    fixtureRoot,
    'portal/button.mdx',
    ['---', 'title: Button', 'description: Edited button portal copy', '---', '', 'Changed copy.', ''].join('\n')
  )
  const second = compileAgentCatalog({ packageRoot: fixtureRoot, write: false })

  expect(second.sourceSha256).not.toBe(first.sourceSha256)
  expect(second.files['catalog/generated/agent/components.json']).not.toBe(
    first.files['catalog/generated/agent/components.json']
  )
})

test('ignores the generated agent catalog directory', () => {
  const gitignore = readFileSync(join(packageRoot, '.gitignore'), 'utf8')
  const ignored = spawnSync('git', ['check-ignore', '-v', 'packages/ui/catalog/generated/agent/components.json'], {
    cwd: join(packageRoot, '../..'),
    encoding: 'utf8'
  })

  expect(gitignore).toMatch(/catalog\/generated\/agent\//)
  expect(ignored.status).toBe(0)
  expect(ignored.stdout).toMatch(/catalog\/generated\/agent\//)
})

test('catalog:validate prints the locked contract line then agent validation', () => {
  const chained = spawnSync(
    '/bin/sh',
    ['-c', 'node scripts/validate-component-contracts.mjs && node scripts/validate-agent-catalog.mjs'],
    {
      cwd: packageRoot,
      encoding: 'utf8'
    }
  )

  expect(chained.status).toBe(0)
  expect(chained.stderr).toBe('')
  expect(chained.stdout.startsWith('Validated 1 component contract: canary.button (stable)\n')).toBe(true)
  expect(chained.stdout).toMatch(/Validated agent catalog: \d+ components, \d+ icons\n$/)
})
