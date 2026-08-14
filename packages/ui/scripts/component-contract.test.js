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

function getLiteralJsxAttribute(attributes, sourceFile, name) {
  const attribute = attributes.find(item => item.name.getText(sourceFile) === name)
  if (!attribute) return undefined
  if (!attribute.initializer) return true
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text
  if (!ts.isJsxExpression(attribute.initializer) || !attribute.initializer.expression) return undefined

  const expression = attribute.initializer.expression
  if (ts.isStringLiteral(expression)) return expression.text
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false
  return undefined
}

function findUnsupportedButtonCombinations(source, filePath) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const violations = []

  const visit = node => {
    const openingElement = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : undefined
    if (openingElement?.tagName.getText(sourceFile) === 'Button') {
      const attributes = openingElement.attributes.properties.filter(ts.isJsxAttribute)
      const variant = getLiteralJsxAttribute(attributes, sourceFile, 'variant') ?? 'primary'
      const size = getLiteralJsxAttribute(attributes, sourceFile, 'size') ?? 'md'
      const theme = getLiteralJsxAttribute(attributes, sourceFile, 'theme') ?? 'default'
      const iconOnly = getLiteralJsxAttribute(attributes, sourceFile, 'iconOnly') === true
      const line = sourceFile.getLineAndCharacterOfPosition(openingElement.getStart(sourceFile)).line + 1

      if (size === '2xs' || size === '3xs') {
        violations.push({ line, reason: `unsupported size ${size}` })
      }
      if (
        (theme === 'success' || theme === 'danger') &&
        (iconOnly || ['ai', 'transparent', 'link'].includes(variant))
      ) {
        violations.push({ line, reason: `${String(variant)} ${String(theme)} theme` })
      }
      if (variant === 'link' && (size === 'xs' || iconOnly)) {
        violations.push({ line, reason: `link ${iconOnly ? 'icon-only' : 'xs'} combination` })
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return violations
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

function completePilotContract() {
  return {
    schemaVersion: '0.4.0',
    contractVersion: '0.1.0',
    identity: {
      id: 'canary.button',
      name: 'Button',
      summary: 'Triggers an immediate action.',
      aliases: []
    },
    semantics: {
      purpose: 'Trigger an immediate user action.',
      useWhen: ['The user needs to submit or confirm an action.'],
      avoidWhen: ['The user needs to navigate to another location.'],
      roles: ['button']
    },
    lifecycle: {
      status: 'piloting'
    },
    ownership: {
      team: 'Canary Design System',
      contacts: ['design-systems']
    },
    surfaces: {
      figma: {
        library: 'HDS | Components 3.0',
        fileKey: 'figma-file-key',
        names: ['Button/Md/Text'],
        exampleNodeId: '1:2',
        mappingStatus: 'verified',
        componentKeys: ['component-key'],
        candidateComponentKeys: [],
        codeConnect: ['src/components/button.figma.ts']
      },
      react: {
        package: '@harnessio/ui',
        export: 'Button',
        import: 'import { Button } from "@harnessio/ui/components"',
        path: 'src/components/button.tsx'
      }
    },
    anatomy: [
      {
        id: 'root',
        name: 'Root',
        description: 'Interactive button container.',
        presence: 'required',
        role: 'button',
        bindings: {
          figma: { kind: 'root' },
          react: { kind: 'root', target: 'Button' }
        }
      }
    ],
    properties: [
      {
        id: 'variant',
        name: 'Variant',
        description: 'Visual emphasis.',
        type: 'enum',
        values: ['primary', 'secondary'],
        default: 'primary',
        bindings: {
          figma: { kind: 'property', property: 'variant' },
          react: { kind: 'prop', name: 'variant', type: "ButtonProps['variant']" }
        }
      },
      {
        id: 'loading',
        name: 'Loading',
        description: 'Shows pending progress.',
        type: 'boolean',
        default: false,
        bindings: {
          react: { kind: 'prop', name: 'loading', type: 'boolean' }
        }
      }
    ],
    states: [
      {
        id: 'default',
        name: 'Default',
        description: 'Resting state.',
        required: true,
        bindings: {
          figma: { kind: 'property', property: 'state', value: 'default' },
          react: { kind: 'behavior', target: 'resting state' }
        },
        fidelity: { figma: 'exact', react: 'exact' }
      }
    ],
    constraints: {
      exhaustive: false,
      dimensions: ['variant'],
      rules: [
        {
          id: 'primary',
          status: 'supported',
          surfaces: ['figma', 'react'],
          conditions: { variant: ['primary'] },
          description: 'Primary is supported.',
          requirementId: 'button.supported-combination'
        }
      ]
    },
    tokens: [
      {
        id: 'root-background',
        partId: 'root',
        channel: 'background',
        token: 'color.background.primary'
      }
    ],
    accessibility: [
      {
        id: 'accessible-name',
        statement: 'Every Button has an accessible name.',
        requirementId: 'button.accessible-name'
      }
    ],
    usage: {
      do: [{ id: 'use-for-actions', statement: 'Use Button for actions.' }],
      dont: [{ id: 'avoid-navigation', statement: 'Do not use Button for destinations.' }],
      relatedComponents: ['Link']
    },
    requirements: [
      {
        id: 'button.contract-complete',
        dimension: 'contractDefinition',
        severity: 'major',
        enforcement: 'automated',
        statement: 'The contract validates.'
      },
      {
        id: 'button.supported-combination',
        dimension: 'figmaImplementation',
        severity: 'critical',
        enforcement: 'automated',
        statement: 'Figma instances use supported combinations.'
      },
      {
        id: 'button.code-api',
        dimension: 'codeImplementation',
        severity: 'major',
        enforcement: 'automated',
        statement: 'The React API matches the contract.'
      },
      {
        id: 'button.parity',
        dimension: 'designCodeParity',
        severity: 'major',
        enforcement: 'automated',
        statement: 'Figma and React bindings agree.'
      },
      {
        id: 'button.evidence-current',
        dimension: 'governanceEvidence',
        severity: 'minor',
        enforcement: 'manual',
        statement: 'Evidence is current.'
      },
      {
        id: 'button.accessible-name',
        dimension: 'codeImplementation',
        severity: 'critical',
        enforcement: 'manual',
        statement: 'Every Button has an accessible name.'
      }
    ],
    migrations: [],
    evidence: {
      sources: [
        {
          id: 'button-source',
          type: 'source',
          path: 'src/components/button.tsx'
        }
      ],
      verifications: [
        {
          id: 'button-code-api-verified',
          requirementId: 'button.code-api',
          result: 'pass',
          verifiedAt: '2026-08-13',
          sourceIds: ['button-source']
        }
      ]
    }
  }
}

test('accepts a complete schema 0.4.0 pilot contract', async () => {
  const { validateComponentContract } = await import('./component-contract.mjs')

  expect(validateComponentContract(completePilotContract())).toEqual({
    success: true,
    errors: []
  })
})

test('derives shared, design-only, and code-only classifications from surface bindings', async () => {
  const { classifyPropertySurface } = await import('./component-contract.mjs')
  const [shared, codeOnly] = completePilotContract().properties

  expect(classifyPropertySurface(shared)).toBe('shared')
  expect(
    classifyPropertySurface({
      ...shared,
      bindings: { figma: shared.bindings.figma }
    })
  ).toBe('designOnly')
  expect(classifyPropertySurface(codeOnly)).toBe('codeOnly')
})

test('validates the centrally controlled component-health profile', async () => {
  const { evaluationProfileSchema } = await import('./component-contract-schema.mjs')
  const profile = {
    version: '1.0.0',
    dimensions: {
      contractDefinition: 20,
      figmaImplementation: 25,
      codeImplementation: 25,
      designCodeParity: 20,
      governanceEvidence: 10
    },
    severityWeights: {
      critical: 8,
      major: 3,
      minor: 1,
      informational: 0
    },
    thresholds: {
      healthy: 90,
      needsAttention: 70,
      atRisk: 0
    },
    blockedOnCritical: true,
    defaultEvidenceMaxAgeDays: 180
  }

  expect(typeof evaluationProfileSchema?.safeParse).toBe('function')
  expect(evaluationProfileSchema?.safeParse(profile).success).toBe(true)
})

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
        status: 'piloting'
      }
    ]
  })
})

test('uses schema 0.4.0 for the checked-in Button contract', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))

  expect(contract.schemaVersion).toBe('0.4.0')
  expect(contract.contractVersion).toBe('0.7.0')
  expect(contract.identity.id).toBe('canary.button')
  expect(contract.lifecycle.status).toBe('piloting')
  expect(contract.properties.map(property => property.id)).toContain('variant')
  expect(contract.constraints.exhaustive).toBe(true)
  expect(contract.constraints.rules).toHaveLength(13)
  expect(contract.evidence).not.toHaveProperty('provisionalFields')
  expect(contract.evidence).not.toHaveProperty('openQuestions')
})

test('generates deterministic schema, type, reference, and Button receipt artifacts', async () => {
  let artifactModule
  try {
    artifactModule = await import('./component-contract-artifacts.mjs')
  } catch {
    artifactModule = undefined
  }

  expect(typeof artifactModule?.generateContractArtifacts).toBe('function')
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const first = artifactModule.generateContractArtifacts({ packageRoot, write: false })
  const second = artifactModule.generateContractArtifacts({ packageRoot, write: false })

  expect([...first.artifacts.keys()]).toEqual([
    'catalog/generated/component-contract.schema.json',
    'catalog/generated/component-contract.types.ts',
    'catalog/generated/component-contract.reference.json',
    'catalog/generated/button.audit-receipt.json'
  ])
  expect([...first.artifacts.entries()]).toEqual([...second.artifacts.entries()])
  expect(JSON.parse(first.artifacts.get('catalog/generated/component-contract.schema.json')).$id).toBe(
    'https://canary.harness.io/contracts/component-contract-0.4.0.schema.json'
  )
  expect(
    JSON.parse(first.artifacts.get('catalog/generated/component-contract.reference.json')).rows.length
  ).toBeGreaterThan(40)
  expect(JSON.parse(first.artifacts.get('catalog/generated/button.audit-receipt.json'))).toMatchObject({
    componentId: 'canary.button',
    schemaVersion: '0.4.0',
    contractVersion: '0.7.0',
    evaluationProfileVersion: '1.0.0'
  })
})

test('defines rounded as supported for icon-only Buttons and deprecated for text Buttons', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))
  const roundedProperty = contract.properties.find(property => property.id === 'rounded')
  const roundedMigration = contract.migrations.find(migration => migration.id === 'rounded-text-to-standard')

  expect(roundedProperty.description).toContain('Rounded icon-only Buttons are supported')
  expect(roundedProperty.bindings.figma).toMatchObject({ kind: 'componentName', fallback: false })
  expect(roundedMigration.instructions).toContain('equivalent standard-shape Button')
})

test('records keyboard focus as an intentional code-only state matching the Button styles', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const contract = JSON.parse(readFileSync(join(packageRoot, 'catalog/contracts/button.contract.json'), 'utf8'))
  const focusState = contract.states.find(state => state.id === 'focus-visible')
  const focusStyles = buttonStyles['.cn-button']['&:where(:focus-visible)']

  expect(focusState).toMatchObject({
    fidelity: { figma: 'specification', react: 'exact' },
    bindings: {
      figma: { kind: 'specification' },
      react: { kind: 'pseudoClass', target: ':focus-visible' }
    }
  })
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

test('omits theme mapping from default-theme-only icon Button templates', () => {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const componentRoot = join(packageRoot, 'src/components')
  const iconButtonFiles = readdirSync(componentRoot)
    .filter(file => /^button-(?:md|sm|xs)-icon-only(?:-rounded)?\.figma\.ts$/.test(file))
    .sort()
  const filesWithThemeMapping = iconButtonFiles.filter(file =>
    readFileSync(join(componentRoot, file), 'utf8').includes("getEnum('theme'")
  )

  expect(iconButtonFiles).toHaveLength(6)
  expect(filesWithThemeMapping).toEqual([])
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
  const properties = Object.fromEntries(contract.properties.map(property => [property.id, property]))
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
    contract.constraints.rules.filter(rule =>
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
  ).toBe('unsupported')
  expect(
    matchingRules({ variant: 'primary', size: 'xs', theme: 'default', rounded: true, iconOnly: true })[0].status
  ).toBe('supported')
  expect(
    matchingRules({ variant: 'ai', size: 'md', theme: 'success', rounded: false, iconOnly: false })[0].status
  ).toBe('unsupported')
  expect(
    matchingRules({ variant: 'primary', size: 'xs', theme: 'danger', rounded: true, iconOnly: false })[0].status
  ).toBe('deprecated')
  expect(properties.size.values).toEqual(['md', 'sm', 'xs'])
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

test('detects unsupported literal Button combinations', () => {
  const source = `
    const Example = () => <>
      <Button size="2xs" iconOnly />
      <Button variant="ai" theme="success" />
      <Button variant="transparent" theme="danger" />
      <Button variant="primary" theme="success" iconOnly />
      <Button variant="link" size="xs" />
      <Button variant="primary" theme="danger" />
      <Button variant="ai" />
    </>
  `

  expect(findUnsupportedButtonCombinations(source, 'example.tsx')).toEqual([
    { line: 3, reason: 'unsupported size 2xs' },
    { line: 4, reason: 'ai success theme' },
    { line: 5, reason: 'transparent danger theme' },
    { line: 6, reason: 'primary success theme' },
    { line: 7, reason: 'link xs combination' }
  ])
})

test('prevents unsupported literal Button combinations in production', () => {
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
      return findUnsupportedButtonCombinations(source, filePath).map(
        ({ line, reason }) => `${repositoryPath}:${line} ${reason}`
      )
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
  expect(result.stdout).toBe('Validated 1 component contract: canary.button (piloting)\n')
})
