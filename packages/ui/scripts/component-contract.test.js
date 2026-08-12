import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from 'vitest'

function writeJson(root, relativePath, value) {
  const filePath = join(root, relativePath)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
  return filePath
}

function completeDraftContract() {
  return {
    schemaVersion: '0.2.0',
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
