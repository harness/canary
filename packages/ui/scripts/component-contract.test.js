import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'
import { expect, test } from 'vitest'

import buttonStyles from '../tailwind-utils-config/components/button.ts'

function writeJson(root, relativePath, value) {
  const filePath = join(root, relativePath)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
  return filePath
}

function collectProductionComponents(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : collectProductionComponents(entryPath)
    }

    return entry.isFile() && /\.(jsx|tsx)$/.test(entry.name) && !entry.name.includes('.figma.') ? [entryPath] : []
  })
}

function findRoundedNonIconOnlyControls(source, filePath) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const lines = []

  const visit = node => {
    const openingElement = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : undefined
    if (openingElement && ['Button', 'Toggle'].includes(openingElement.tagName.getText(sourceFile))) {
      const attributes = openingElement.attributes.properties.filter(ts.isJsxAttribute)
      const hasRounded = attributes.some(attribute => attribute.name.getText(sourceFile) === 'rounded')
      const hasIconOnly = attributes.some(attribute => attribute.name.getText(sourceFile) === 'iconOnly')

      if (hasRounded && !hasIconOnly) {
        lines.push(sourceFile.getLineAndCharacterOfPosition(openingElement.getStart(sourceFile)).line + 1)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return lines
}

function completeDraftContract() {
  return {
    schemaVersion: '0.3.0',
    contractVersion: '0.1.0',
    id: 'canary.button',
    status: 'draft',
    surfaces: ['figma', 'code'],
    overview: {
      name: 'Button',
      description: 'Triggers an immediate action.',
      useWhen: ['The user needs to submit or confirm an action.'],
      avoidWhen: ['The user needs to navigate to another location.']
    },
    code: {
      package: '@harnessio/ui',
      export: 'Button',
      import: 'import { Button } from "@harnessio/ui/components"',
      path: 'src/components/button.tsx'
    },
    figma: {
      library: 'HDS | Components 3.0',
      fileKey: 'figma-file-key',
      name: 'Button',
      exampleNodeId: '1:2',
      mappingStatus: 'unverified',
      componentKeys: [],
      candidateComponentKeys: ['candidate-key'],
      codeConnect: ['src/components/button.figma.ts']
    },
    anatomy: [
      {
        id: 'root',
        name: 'Root',
        required: true,
        description: 'Interactive button container.'
      },
      {
        id: 'label-or-icon',
        name: 'Label or icon',
        required: true,
        description: 'Communicates the action.'
      }
    ],
    properties: {
      shared: [
        {
          name: 'variant',
          type: 'enum',
          values: ['primary', 'secondary'],
          default: 'primary',
          description: 'Visual emphasis.'
        }
      ],
      designOnly: [],
      codeOnly: []
    },
    states: [
      {
        name: 'default',
        required: true,
        surfaces: ['figma', 'code'],
        description: 'Resting state.'
      },
      {
        name: 'focus',
        required: true,
        surfaces: ['code'],
        description: 'Keyboard focus is visible.'
      }
    ],
    behavior: [
      {
        id: 'activate',
        description: 'Invokes the supplied action once when activated.'
      }
    ],
    accessibility: {
      requirements: ['Every button has an accessible name.']
    },
    usage: {
      do: ['Use a concise action label.'],
      dont: ['Use a button for navigation.'],
      relatedComponents: ['Link']
    },
    readiness: {
      structure: {
        autoLayoutRequired: true,
        requiredSlots: ['root', 'label-or-icon'],
        optionalSlots: []
      },
      states: {
        required: ['default', 'focus']
      },
      documentation: {
        descriptionRequired: true,
        codeConnectRequired: true
      },
      accessibility: {
        iconOnlyRequiresAccessibleName: true
      }
    },
    evidence: {
      sources: [
        {
          type: 'source',
          path: 'src/components/button.tsx'
        }
      ],
      provisionalFields: ['figma.candidateComponentKeys'],
      openQuestions: ['Confirm the current Figma component keys.']
    }
  }
}

test('accepts a complete draft contract without confirmed Figma keys', async () => {
  let contractModule
  try {
    contractModule = await import('./component-contract.mjs')
  } catch {
    contractModule = undefined
  }

  expect(typeof contractModule?.validateComponentContract).toBe('function')
  expect(contractModule.validateComponentContract(completeDraftContract())).toEqual({
    success: true,
    errors: []
  })
})

test('accepts a machine-readable support matrix', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')
  const contract = completeDraftContract()
  contract.supportMatrix = [
    {
      id: 'standard-primary',
      status: 'supported',
      surfaces: ['figma', 'code'],
      conditions: {
        variant: ['primary'],
        size: ['md'],
        iconOnly: [false]
      },
      description: 'Primary medium text Buttons are supported.'
    }
  ]
  contract.properties.shared.push(
    {
      name: 'size',
      type: 'enum',
      values: ['md', 'sm'],
      default: 'md',
      description: 'Component size.'
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: false,
      description: 'Renders only an icon.'
    }
  )

  expect(validateComponentContract(contract)).toEqual({
    success: true,
    errors: []
  })
})

test('rejects support-matrix conditions that are not declared contract properties', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')
  const contract = completeDraftContract()
  contract.supportMatrix = [
    {
      id: 'unknown-condition',
      status: 'unsupported',
      surfaces: ['figma', 'code'],
      conditions: {
        shape: ['rounded']
      },
      description: 'Unknown dimensions cannot be evaluated reliably.'
    }
  ]

  const result = validateComponentContract(contract)

  expect(result.success).toBe(false)
  expect(result.errors).toContain('supportMatrix.0.conditions.shape: unknown property shape')
})

test('rejects support-matrix values with the wrong property type', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')
  const contract = completeDraftContract()
  contract.properties.shared.push({
    name: 'iconOnly',
    type: 'boolean',
    default: false,
    description: 'Renders only an icon.'
  })
  contract.supportMatrix = [
    {
      id: 'invalid-boolean',
      status: 'supported',
      surfaces: ['figma', 'code'],
      conditions: {
        iconOnly: ['false']
      },
      description: 'String booleans cannot be matched to Boolean properties.'
    }
  ]

  const result = validateComponentContract(contract)

  expect(result.success).toBe(false)
  expect(result.errors).toContain('supportMatrix.0.conditions.iconOnly: values must match the boolean property type')
})

test('rejects property names duplicated across contract surfaces', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')
  const contract = completeDraftContract()
  contract.properties.codeOnly.push({
    name: 'variant',
    type: 'string',
    description: 'Duplicate semantic property.'
  })

  const result = validateComponentContract(contract)

  expect(result.success).toBe(false)
  expect(result.errors).toContain('properties: property names must be unique across shared, designOnly, and codeOnly')
})

test('requires verified Figma component keys before a contract can be stable', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')
  const contract = completeDraftContract()
  contract.status = 'stable'

  const result = validateComponentContract(contract)

  expect(result.success).toBe(false)
  expect(result.errors).toContain('figma.mappingStatus: stable contracts must use verified Figma mappings')
  expect(result.errors).toContain(
    'figma.componentKeys: stable contracts must include at least one confirmed component key'
  )
})

test('validates contract files against their component inventory entries', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-contracts-'))

  try {
    writeJson(packageRoot, 'catalog/component-inventory.json', {
      schemaVersion: 1,
      components: [
        {
          id: 'canary.button',
          contractPath: 'catalog/contracts/button.contract.json'
        }
      ]
    })
    writeJson(packageRoot, 'catalog/contracts/button.contract.json', completeDraftContract())

    const contractModule = await import('./component-contract.mjs')
    expect(typeof contractModule.validateContractCatalog).toBe('function')

    expect(contractModule.validateContractCatalog({ packageRoot })).toEqual({
      success: true,
      errors: [],
      contracts: [
        {
          id: 'canary.button',
          path: 'catalog/contracts/button.contract.json',
          status: 'draft'
        }
      ]
    })
  } finally {
    rmSync(packageRoot, { recursive: true, force: true })
  }
})

test('rejects a contract whose inventory entry points somewhere else', async () => {
  const packageRoot = mkdtempSync(join(tmpdir(), 'canary-contracts-'))

  try {
    writeJson(packageRoot, 'catalog/component-inventory.json', {
      schemaVersion: 1,
      components: [
        {
          id: 'canary.button',
          contractPath: 'catalog/contracts/not-button.contract.json'
        }
      ]
    })
    writeJson(packageRoot, 'catalog/contracts/button.contract.json', completeDraftContract())

    const { validateContractCatalog } = await import('./component-contract.mjs')
    const result = validateContractCatalog({ packageRoot })

    expect(result.success).toBe(false)
    expect(result.errors).toContain(
      'catalog/contracts/button.contract.json: inventory contractPath is catalog/contracts/not-button.contract.json'
    )
  } finally {
    rmSync(packageRoot, { recursive: true, force: true })
  }
})

test('validates the checked-in component contract catalog', async () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const { validateContractCatalog } = await import('./component-contract.mjs')

  expect(validateContractCatalog({ packageRoot })).toEqual({
    success: true,
    errors: [],
    contracts: [
      {
        id: 'canary.button',
        path: 'catalog/contracts/button.contract.json',
        status: 'draft'
      }
    ]
  })
})

test('defines rounded as supported for icon-only Buttons and deprecated for text Buttons', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))
  const roundedProperty = contract.properties.shared.find(property => property.name === 'rounded')
  const roundedPattern = contract.patterns.find(pattern => pattern.id === 'rounded-icon-only')

  expect(roundedProperty).toMatchObject({
    when: 'Supported when iconOnly is true; deprecated when iconOnly is false.'
  })
  expect(roundedProperty.description).toContain('Rounded icon-only Buttons are supported')
  expect(roundedPattern.rule).toContain('Use rounded only with iconOnly')
})

test('records keyboard focus as an intentional code-only state matching the Button styles', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))
  const focusState = contract.states.find(state => state.name === 'focus')
  const focusPattern = contract.patterns.find(pattern => pattern.id === 'keyboard-focus-reference')
  const focusStyles = buttonStyles['.cn-button']['&:where(:focus-visible)']

  expect(focusState).toMatchObject({
    surfaces: ['code'],
    description: expect.stringContaining('Intentional code-only runtime state')
  })
  expect(focusPattern.rule).toContain('Do not add focus to the published Figma state property')
  expect(contract.evidence.provisionalFields).not.toContain('states.focus')
  expect(contract.evidence.openQuestions.some(question => question.toLowerCase().includes('focus'))).toBe(false)
  expect(focusStyles).toMatchObject({
    outline: 'var(--cn-focus)',
    boxShadow: 'inset 0 0 0 2px var(--cn-gray-25)',
    position: 'relative',
    zIndex: '1'
  })
  expect(focusStyles['&:not(.cn-button-link)']).toEqual({
    '@apply outline-offset-cn-tight': ''
  })
})

test('maps the omitted Figma theme only for md and sm text Buttons', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const componentRoot = join(packageRoot, 'src/components')
  const buttonCodeConnectFiles = readdirSync(componentRoot)
    .filter(file => /^button(?:-.+)?\.figma\.ts$/.test(file))
    .filter(file => !file.startsWith('button-group') && !file.startsWith('button-layout'))
    .sort()
  const filesWithOmittedTheme = buttonCodeConnectFiles.filter(file =>
    readFileSync(join(componentRoot, file), 'utf8').includes("'-': undefined")
  )

  expect(filesWithOmittedTheme).toEqual(['button-md-text.figma.ts', 'button.figma.ts'])
})

test('uses public Figma property names in Button Code Connect templates', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const componentRoot = join(packageRoot, 'src/components')
  const buttonCodeConnectFiles = readdirSync(componentRoot)
    .filter(file => /^button(?:-.+)?\.figma\.ts$/.test(file))
    .filter(file => !file.startsWith('button-group') && !file.startsWith('button-layout'))
    .sort()
  const filesWithInternalPropertyIds = buttonCodeConnectFiles.filter(file =>
    /instance\.get(?:Boolean|Enum|InstanceSwap|String)\('[^']+#\d+:\d+'\)/.test(
      readFileSync(join(componentRoot, file), 'utf8')
    )
  )

  expect(filesWithInternalPropertyIds).toEqual([])
})

test('defines an exhaustive approved Button support matrix', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))
  const properties = Object.fromEntries(contract.properties.shared.map(property => [property.name, property]))
  const valuesByDimension = {
    variant: properties.variant.values,
    size: properties.size.values,
    theme: properties.theme.values,
    rounded: [false, true],
    iconOnly: [false, true]
  }
  const combinations = Object.entries(valuesByDimension).reduce(
    (rows, [propertyName, values]) => rows.flatMap(row => values.map(value => ({ ...row, [propertyName]: value }))),
    [{}]
  )
  const matchingRules = combination =>
    contract.supportMatrix.filter(rule =>
      Object.entries(rule.conditions).every(([propertyName, values]) => values.includes(combination[propertyName]))
    )

  for (const combination of combinations) {
    expect(matchingRules(combination), JSON.stringify(combination)).toHaveLength(1)
  }

  expect(
    matchingRules({ variant: 'link', size: 'md', theme: 'default', rounded: false, iconOnly: false })[0].status
  ).toBe('supported')
  expect(
    matchingRules({ variant: 'link', size: 'md', theme: 'success', rounded: false, iconOnly: false })[0].status
  ).toBe('unsupported')
  expect(
    matchingRules({ variant: 'primary', size: 'xs', theme: 'danger', rounded: true, iconOnly: true })[0].status
  ).toBe('supported')
  expect(
    matchingRules({ variant: 'primary', size: 'xs', theme: 'danger', rounded: true, iconOnly: false })[0].status
  ).toBe('deprecated')
  expect(
    matchingRules({ variant: 'primary', size: '2xs', theme: 'default', rounded: false, iconOnly: true })[0].status
  ).toBe('unsupported')
})

test('detects rounded text Button and Toggle usage while allowing rounded icon-only controls', () => {
  const source = `
    const Example = () => <>
      <Button rounded>Deprecated Button</Button>
      <Toggle rounded text="Deprecated Toggle" />
      <Button iconOnly rounded aria-label="Supported Button" />
      <Toggle iconOnly rounded text="Supported Toggle" />
    </>
  `

  expect(findRoundedNonIconOnlyControls(source, 'example.tsx')).toEqual([3, 4])
})

test('prevents new rounded non-icon-only Button and Toggle usage in production', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const sourceRoots = [
    { directory: join(packageRoot, 'src'), label: 'packages/ui/src' },
    { directory: join(packageRoot, '../views/src'), label: 'packages/views/src' },
    { directory: join(packageRoot, '../../apps'), label: 'apps' }
  ]
  const violations = sourceRoots.flatMap(({ directory, label }) =>
    collectProductionComponents(directory).flatMap(filePath => {
      const repositoryPath = join(label, filePath.slice(directory.length + 1))
      const source = readFileSync(filePath, 'utf8')
      return findRoundedNonIconOnlyControls(source, filePath).map(line => `${repositoryPath}:${line}`)
    })
  )

  expect(violations).toEqual([])
})

test('provides a successful command-line contract check', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const result = spawnSync(process.execPath, ['scripts/validate-component-contracts.mjs'], {
    cwd: packageRoot,
    encoding: 'utf8'
  })

  expect(result.status).toBe(0)
  expect(result.stderr).toBe('')
  expect(result.stdout).toBe('Validated 1 component contract: canary.button (draft)\n')
})
