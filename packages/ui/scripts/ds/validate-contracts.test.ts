import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import type { Finding } from './lib/findings.ts'
import { validateContract } from './lib/validate.ts'

const REPO_ROOT = resolve(import.meta.dirname, '../../../..')
const DIR = resolve(REPO_ROOT, 'packages/ui/src/components/status-badge')
const MANIFEST_PATH = resolve(DIR, 'status-badge.manifest.json')
const GUIDE_PATH = resolve(DIR, 'status-badge.guide.md')
const MANIFEST_SOURCE = readFileSync(MANIFEST_PATH, 'utf8')
const GUIDE_SOURCE = readFileSync(GUIDE_PATH, 'utf8')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any

const REGISTRY_SOURCE = readFileSync(resolve(REPO_ROOT, 'packages/ui/contracts/rule-ids.md'), 'utf8')

const run = (
  mutateManifest: (m: Json) => void = () => {},
  guideSource: string = GUIDE_SOURCE,
  registrySource: string = REGISTRY_SOURCE
): Finding[] => {
  const manifest = JSON.parse(MANIFEST_SOURCE)
  mutateManifest(manifest)
  return validateContract({
    repoRoot: REPO_ROOT,
    manifestPath: MANIFEST_PATH,
    manifest,
    guidePath: GUIDE_PATH,
    guideSource,
    registrySource
  })
}

const errorKeys = (findings: Finding[]): string[] => findings.filter(f => f.severity === 'error').map(f => f.key)

const replaceOnce = (source: string, from: string, to: string): string => {
  if (!source.includes(from)) throw new Error(`Fixture text not found: ${from}`)
  return source.replace(from, to)
}

const replaceRow = (source: string, prefix: string, row: string): string => {
  const pattern = new RegExp(`^\\| ${prefix} .*$`, 'm')
  if (!pattern.test(source)) throw new Error(`Registry row not found: ${prefix}`)
  return source.replace(pattern, row)
}

describe('validate-contracts: StatusBadge', () => {
  it('passes the committed manifest and guide with only the declared waiver', () => {
    const findings = run()
    expect(errorKeys(findings)).toEqual([])
    expect(findings.filter(f => f.severity === 'waived').map(f => f.key)).toEqual(['prop-required:children'])
  }, 60_000)

  describe('broken manifest', () => {
    const cases: [string, (m: Json) => void, string][] = [
      ['schema: missing governance.guide', m => delete m.governance.guide, 'schema:manifest/governance'],
      [
        'schema: default missing on optional prop',
        m => delete m.props.shared[1].default,
        'schema:manifest/props/shared/1'
      ],
      ['rule ID not in guide', m => (m.constraints[0].rule = 'SBD-099'), 'rule-unknown:SBD-099'],
      [
        'incorrect example cites unknown rule',
        m => (m.examples.incorrect[1].violates = ['SBD-098']),
        'rule-unknown:SBD-098'
      ],
      ['enum value not in type', m => m.props.shared[1].values.push('purple'), 'prop-values:theme'],
      [
        'required prop marked optional',
        m => (delete m.props.shared[0].required, (m.props.shared[0].default = 'primary')),
        'prop-optional:variant'
      ],
      [
        'prop missing from type',
        m => m.props.codeOnly.push({ name: 'tone', type: 'string' }),
        'prop-missing-in-type:tone'
      ],
      ['type prop missing from manifest', m => m.props.codeOnly.splice(0, 1), 'prop-missing-in-manifest:pulse'],
      ['prop kind mismatch', m => (m.props.codeOnly[0].type = 'string'), 'prop-kind:pulse'],
      ['types constraint the type does not enforce', m => (m.constraints[0].forbid = ['size']), 'constraint-types:0'],
      [
        'token ref that does not exist',
        m => (m.tokens.refs['radius'] = 'badge.radius-xl'),
        'token-missing:badge.radius-xl'
      ],
      ['stale waiver', m => (m.knownGaps[4].waives = 'prop-required:icon'), 'waiver-stale:prop-required:icon'],
      [
        'correct example breaks a constraint',
        m => m.examples.correct.push('<StatusBadge variant="status" icon="check">Done</StatusBadge>'),
        'example-correct:3'
      ],
      [
        'correct example misses a required prop',
        m => m.examples.correct.push('<StatusBadge theme="success">Live</StatusBadge>'),
        'example-correct:3'
      ],
      [
        'incorrect example the constraints accept',
        m => (m.examples.incorrect[0].code = '<StatusBadge variant="status">Done</StatusBadge>'),
        'example-incorrect:0:SBD-007'
      ],
      [
        'variantPropertyMap disagrees with props',
        m => (m.figma.variantPropertyMap.icon = 'icon#1293:13'),
        'figma-key:icon'
      ],
      ['enum map does not cover values', m => delete m.props.shared[1].figmaEnumMap['🟠 risk'], 'enum-map:theme'],
      ['shared prop with no binding', m => m.bindings.splice(1, 1), 'binding-missing:size'],
      ['unresolved [TK] placeholder', m => (m.purpose.summary = '[TK]'), 'placeholder:manifest']
    ]

    it.each(cases)('%s', (_name, mutate, expected) => {
      expect(errorKeys(run(mutate))).toContain(expected)
    })

    it('reports schema errors with instancePath', () => {
      const findings = run(m => (m.figma.lastVerified = 'yesterday'))
      expect(findings.find(f => f.code === 'schema')?.instancePath).toBe('/figma/lastVerified')
    })
  })

  describe('broken guide', () => {
    const cases: [string, string, string][] = [
      [
        'heading title disagrees with front matter',
        replaceOnce(GUIDE_SOURCE, '## SBD-001 — StatusBadge represents state', '## SBD-001 — StatusBadge is state'),
        'heading-title:SBD-001'
      ],
      [
        'metadata restated in body',
        replaceOnce(GUIDE_SOURCE, '## SBD-009 — Fixed shape', '**Status:** proposed\n\n## SBD-009 — Fixed shape'),
        'body-metadata:L'
      ],
      [
        'rule with no heading',
        replaceOnce(GUIDE_SOURCE, '## SBD-016 — Guidance', 'Guidance'),
        'heading-missing:SBD-016'
      ],
      [
        'heading with no front matter entry',
        `${GUIDE_SOURCE}\n## SBD-019 — New rule\n\nText.\n`,
        'heading-unknown:SBD-019'
      ],
      [
        'malformed rule heading',
        replaceOnce(GUIDE_SOURCE, '## SBD-010 — theme', '## SBD-010: theme'),
        'heading-format:L'
      ],
      [
        'gap heading outside Known gaps',
        replaceOnce(
          replaceOnce(GUIDE_SOURCE, '### SBD-012 — Open', '## SBD-012 — Open'),
          '## Known gaps',
          '## SBD-012 placeholder'
        ),
        'heading-placement:SBD-012'
      ],
      [
        'types check target not exported',
        replaceOnce(GUIDE_SOURCE, '- types:StatusBadgeProps', '- types:StatusBadgeNope'),
        'check-target:SBD-004:types:StatusBadgeNope'
      ],
      [
        'schema check target does not resolve',
        replaceOnce(GUIDE_SOURCE, '- schema:/constraints', '- schema:/constraintz'),
        'check-target:SBD-007:schema:/constraintz'
      ],
      [
        'test check target missing',
        replaceOnce(
          GUIDE_SOURCE,
          'tier: 2\n    check: review\n  - id: SBD-018',
          'tier: 2\n    check: test:packages/ui/nope.test.ts#renders\n  - id: SBD-018'
        ),
        'check-target:SBD-017:test:packages/ui/nope.test.ts#renders'
      ],
      [
        'test check names a test that does not exist',
        replaceOnce(GUIDE_SOURCE, '#SBD-004 renders a non-interactive indicator', '#SBD-004 renders a button'),
        'check-target:SBD-004:test:'
      ],
      [
        'depends_on unknown rule',
        replaceOnce(GUIDE_SOURCE, 'depends_on: [SBD-017]', 'depends_on: [SBD-097]'),
        'rule-unknown:SBD-097'
      ],
      [
        'front matter schema: tier out of range',
        replaceOnce(
          GUIDE_SOURCE,
          'tier: 3\n    check: review\n  - id: SBD-004',
          'tier: 4\n    check: review\n  - id: SBD-004'
        ),
        'schema:guide/rules/2/tier'
      ],
      [
        'front matter schema: bad check syntax',
        replaceOnce(GUIDE_SOURCE, '- types:StatusBadgeProps', '- typescript'),
        'schema:guide/rules/3/check'
      ]
    ]

    it.each(cases)('%s', (_name, guideSource, expected) => {
      const keys = errorKeys(run(undefined, guideSource))
      expect(keys.some(key => key.startsWith(expected))).toBe(true)
    })
  })

  describe('broken prefix registry', () => {
    const cases: [string, string, string][] = [
      [
        'prefix not registered',
        replaceRow(REGISTRY_SOURCE, 'SBD', '| XYZ    | StatusBadge |         |'),
        'prefix-unregistered:SBD'
      ],
      [
        'prefix registered to another component',
        replaceRow(REGISTRY_SOURCE, 'SBD', '| SBD    | Tag         |         |'),
        'prefix-owner:SBD'
      ],
      [
        'rule ID is retired',
        replaceRow(REGISTRY_SOURCE, 'SBD', '| SBD    | StatusBadge | SBD-016 |'),
        'rule-retired:SBD-016'
      ],
      ['prefix listed twice', `${REGISTRY_SOURCE}| SBD    | Tag         |         |\n`, 'registry-duplicate:SBD']
    ]

    it.each(cases)('%s', (_name, registrySource, expected) => {
      expect(errorKeys(run(undefined, GUIDE_SOURCE, registrySource))).toContain(expected)
    })
  })
})

const PATTERN_DIR = resolve(REPO_ROOT, 'packages/ui/src/patterns/execution-status')
const PATTERN_MANIFEST_PATH = resolve(PATTERN_DIR, 'execution-status.manifest.json')
const PATTERN_GUIDE_PATH = resolve(PATTERN_DIR, 'execution-status.guide.md')
const PATTERN_MANIFEST_SOURCE = readFileSync(PATTERN_MANIFEST_PATH, 'utf8')
const PATTERN_GUIDE_SOURCE = readFileSync(PATTERN_GUIDE_PATH, 'utf8')

const runPattern = (
  mutateManifest: (m: Json) => void = () => {},
  guideSource: string = PATTERN_GUIDE_SOURCE,
  registrySource: string = REGISTRY_SOURCE
): Finding[] => {
  const manifest = JSON.parse(PATTERN_MANIFEST_SOURCE)
  mutateManifest(manifest)
  return validateContract({
    repoRoot: REPO_ROOT,
    manifestPath: PATTERN_MANIFEST_PATH,
    manifest,
    guidePath: PATTERN_GUIDE_PATH,
    guideSource,
    registrySource
  })
}

describe('validate-contracts: ExecutionStatus pattern', () => {
  it('passes the committed pattern manifest and guide', () => {
    expect(errorKeys(runPattern())).toEqual([])
  })

  const cases: [string, (m: Json) => void, string][] = [
    ['schema: kind missing', m => delete m.kind, 'schema:manifest/'],
    [
      'id does not match the file name',
      m => (m.id = 'canary.pattern.run-status'),
      'pattern-id:canary.pattern.run-status'
    ],
    ['rule ref in no guide', m => (m.anatomy[0].rules = ['EXS-099']), 'rule-unknown:EXS-099'],
    ['component rule ref in no guide', m => (m.examples.incorrect[0].violates = ['SBD-099']), 'rule-unknown:SBD-099'],
    [
      'anatomy prop value the component lacks',
      m => m.anatomy[1].props.theme.push('purple'),
      'anatomy-props:badge.theme'
    ],
    ['anatomy prop the component lacks', m => (m.anatomy[1].props.tone = 'loud'), 'anatomy-props:badge.tone'],
    ['component export mismatch', m => (m.components[0].export = 'Tag'), 'pattern-component:Tag'],
    ['component path missing', m => (m.components[1].path = 'packages/ui/src/nope.tsx'), 'pattern-component:Tree'],
    ['states.map key not in values', m => (m.states.map = { paused: {} }), 'states-map:paused'],
    ['unresolved [TK] placeholder', m => (m.purpose.summary = '[TK]'), 'placeholder:manifest'],
    ['annotated [TK: note] placeholder', m => (m.purpose.summary = '[TK: ask Design]'), 'placeholder:manifest'],
    [
      'correct example outside the anatomy narrowing',
      m => (m.examples.correct[0].code = '<StatusBadge variant="outline" theme="info">Queued</StatusBadge>'),
      'example-correct:0'
    ],
    [
      'correct example breaking a component constraint',
      m =>
        (m.examples.correct[0].code = '<StatusBadge variant="status" theme="success" icon="check">Done</StatusBadge>'),
      'example-correct:0'
    ],
    [
      'correct example breaking a component lint rule',
      m =>
        (m.examples.correct[0].code =
          '<StatusBadge variant="outline" theme="success" className="animate-pulse">Running</StatusBadge>'),
      'example-correct:0'
    ],
    ['correct example using no pattern component', m => (m.examples.correct[0].code = '<div />'), 'example-correct:0'],
    [
      'incorrect example that no check rejects',
      m => (m.examples.incorrect[0].code = '<StatusBadge variant="outline" theme="success">Running</StatusBadge>'),
      'example-incorrect:0:SBD-007'
    ]
  ]

  it.each(cases)('%s', (_name, mutate, expected) => {
    expect(errorKeys(runPattern(mutate))).toContain(expected)
  })

  it('names the replacement for a retired StatusBadge rule', () => {
    const retired = runPattern(m => (m.anatomy[0].rules = ['SBD-008'])).find(f => f.key === 'rule-retired:SBD-008')
    expect(retired?.message).toContain('Use EXS-003.')
  })

  it('names the replacement when a ref is retired', () => {
    const registry = replaceRow(REGISTRY_SOURCE, 'SBD', '| SBD    | StatusBadge | SBD-006 (EXS-001) |')
    const retired = runPattern(m => (m.anatomy[1].rules = ['SBD-006']), PATTERN_GUIDE_SOURCE, registry).find(
      f => f.key === 'rule-retired:SBD-006'
    )
    expect(retired?.message).toContain('Use EXS-001.')
  })

  it('rejects a types check, since a pattern has no props type', () => {
    const guide = replaceOnce(
      PATTERN_GUIDE_SOURCE,
      'tier: 2\n    check: review\n  - id: EXS-002',
      'tier: 2\n    check: types:Nope\n  - id: EXS-002'
    )
    expect(errorKeys(runPattern(undefined, guide))).toContain('check-target:EXS-001:types:Nope')
  })

  it('fails when the prefix is registered to another owner', () => {
    const registry = replaceRow(REGISTRY_SOURCE, 'EXS', '| EXS    | RunStatus |         |')
    expect(errorKeys(runPattern(undefined, PATTERN_GUIDE_SOURCE, registry))).toContain('prefix-owner:EXS')
  })
})
