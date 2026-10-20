import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js'

import { effectiveValue, matchesValue, parseUsages, type JsxUsage } from './examples.ts'
import { finding, type Finding } from './findings.ts'
import { parseGuide, type ParsedGuide } from './guide.ts'
import { readPropsType, type PropsTypeInfo, type TypeProp } from './props-type.ts'
import { parseRegistry, type Registry } from './registry.ts'
import { buildTokenIndex } from './tokens.ts'

type PropValue = string | number | boolean | (string | number | boolean)[]

interface ManifestProp {
  name: string
  type: string
  values?: string[]
  required?: boolean
  default?: unknown
  figmaProperty?: string
  figmaEnumMap?: Record<string, string>
}

interface Manifest {
  code: { export: string; path: string; propsType?: string }
  figma: { variantPropertyMap?: Record<string, string> }
  props: { shared: ManifestProp[]; designOnly: ManifestProp[]; codeOnly: ManifestProp[] }
  constraints?: {
    when: Record<string, PropValue>
    forbid?: string[]
    require?: string[]
    rule: string
    enforcedBy?: string
  }[]
  illegalCombinations?: { combination: Record<string, PropValue>; side: string; rule?: string }[]
  bindings?: { figmaProperty: string; codeProp: string; transform: string; enumMap?: Record<string, string> }[]
  tokens: { source?: string[]; refs: Record<string, string> }
  examples?: { correct?: string[]; incorrect?: (string | { code: string; violates: string[] })[] }
  governance: { guide: string }
  knownGaps?: (string | { summary: string; rule?: string; waives?: string })[]
}

interface GuideRule {
  id: string
  title: string
  check: string | string[]
  depends_on?: string[]
}

interface GuideFrontMatter {
  prefix: string
  manifest: string
  rules: GuideRule[]
  gaps?: { id: string; title: string }[]
}

export interface ContractInput {
  repoRoot: string
  manifestPath: string
  manifest: unknown
  guidePath: string
  guideSource: string
  registrySource?: string
}

const SCHEMA_DIR = resolve(import.meta.dirname, '../../../contracts')
const PACKAGE_TSCONFIG = resolve(import.meta.dirname, '../../../tsconfig.json')
export const REGISTRY_PATH = join(SCHEMA_DIR, 'rule-ids.md')

let validators: { manifest: ValidateFunction; guide: ValidateFunction } | undefined

const getValidators = (): { manifest: ValidateFunction; guide: ValidateFunction } => {
  if (validators) return validators
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false,
    allowUnionTypes: true,
    validateFormats: false
  })
  const load = (name: string): object => JSON.parse(readFileSync(join(SCHEMA_DIR, name), 'utf8'))
  validators = {
    manifest: ajv.compile(load('component-manifest.schema.json')),
    guide: ajv.compile(load('component-guide.schema.json'))
  }
  return validators
}

const schemaFindings = (errors: ErrorObject[] | null | undefined, file: string, prefix: string): Finding[] =>
  (errors ?? []).map(error =>
    finding(
      'schema',
      `${prefix}${error.instancePath || '/'}`,
      file,
      error.instancePath,
      `${error.message ?? 'invalid'}${error.params ? ` ${JSON.stringify(error.params)}` : ''}`
    )
  )

const resolvePointer = (data: unknown, pointer: string): boolean => {
  if (pointer === '' || pointer === '/') return true
  let node: unknown = data
  for (const raw of pointer.slice(1).split('/')) {
    const key = raw.replace(/~1/g, '/').replace(/~0/g, '~')
    if (node === null || typeof node !== 'object' || !(key in node)) return false
    node = (node as Record<string, unknown>)[key]
  }
  return true
}

const checkGuide = (
  guide: ParsedGuide,
  frontMatter: GuideFrontMatter,
  ctx: { guideFile: string; manifestPath: string; guidePath: string }
): Finding[] => {
  const out: Finding[] = []
  const { guideFile } = ctx
  const ids = new Map<string, string>()

  frontMatter.rules.forEach((rule, index) => {
    if (ids.has(rule.id))
      out.push(finding('rule-duplicate', rule.id, guideFile, `/rules/${index}/id`, `${rule.id} is defined twice.`))
    ids.set(rule.id, rule.title)
  })
  ;(frontMatter.gaps ?? []).forEach((gap, index) => {
    if (ids.has(gap.id))
      out.push(finding('rule-duplicate', gap.id, guideFile, `/gaps/${index}/id`, `${gap.id} is both a rule and a gap.`))
    ids.set(gap.id, gap.title)
  })

  frontMatter.rules.forEach((rule, index) => {
    ;(rule.depends_on ?? []).forEach((dep, depIndex) => {
      if (!ids.has(dep))
        out.push(
          finding(
            'rule-unknown',
            dep,
            guideFile,
            `/rules/${index}/depends_on/${depIndex}`,
            `${dep} is not defined in this guide.`
          )
        )
    })
  })

  if (resolve(dirname(ctx.guidePath), frontMatter.manifest) !== ctx.manifestPath)
    out.push(
      finding(
        'guide-manifest',
        frontMatter.manifest,
        guideFile,
        '/manifest',
        'Does not point back to the manifest that references this guide.'
      )
    )

  const expectHeading = (id: string, title: string, gap: boolean, pointer: string): void => {
    const matches = guide.headings.filter(heading => heading.id === id)
    if (matches.length === 0) {
      out.push(finding('heading-missing', id, guideFile, pointer, `No '## ${id} — ${title}' heading in the body.`))
      return
    }
    if (matches.length > 1)
      out.push(
        finding('heading-duplicate', id, guideFile, `#L${matches[1].line}`, `${id} has ${matches.length} headings.`)
      )
    const heading = matches[0]
    if (heading.title !== title)
      out.push(
        finding(
          'heading-title',
          id,
          guideFile,
          `#L${heading.line}`,
          `Heading title '${heading.title}' does not match front matter title '${title}'.`
        )
      )
    const placementOk = gap ? heading.inKnownGaps && heading.level === 3 : !heading.inKnownGaps && heading.level === 2
    if (!placementOk)
      out.push(
        finding(
          'heading-placement',
          id,
          guideFile,
          `#L${heading.line}`,
          gap
            ? 'Gaps belong under ## Known gaps as ### headings.'
            : 'Rules belong outside ## Known gaps as ## headings.'
        )
      )
  }

  frontMatter.rules.forEach((rule, index) => expectHeading(rule.id, rule.title, false, `/rules/${index}`))
  ;(frontMatter.gaps ?? []).forEach((gap, index) => expectHeading(gap.id, gap.title, true, `/gaps/${index}`))

  for (const heading of guide.headings) {
    if (!ids.has(heading.id))
      out.push(
        finding(
          'heading-unknown',
          heading.id,
          guideFile,
          `#L${heading.line}`,
          `${heading.id} has a heading but no front matter entry.`
        )
      )
  }
  for (const malformed of guide.malformedHeadings)
    out.push(
      finding(
        'heading-format',
        `L${malformed.line}`,
        guideFile,
        `#L${malformed.line}`,
        `'${malformed.text}' mentions a rule ID but is not '## ID — title'.`
      )
    )
  for (const meta of guide.metadataLines)
    out.push(
      finding(
        'body-metadata',
        `L${meta.line}`,
        guideFile,
        `#L${meta.line}`,
        `'${meta.text}' restates rule metadata. Status, tier and check live in front matter only.`
      )
    )

  return out
}

const testNames = (source: string): Set<string> =>
  new Set([...source.matchAll(/\b(?:it|test)(?:\.\w+)?\(\s*(['"`])(.+?)\1/g)].map(match => match[2]))

const checkTargets = (
  frontMatter: GuideFrontMatter,
  manifest: Manifest,
  ctx: { repoRoot: string; guideFile: string; propsInfo: PropsTypeInfo }
): Finding[] => {
  const out: Finding[] = []
  frontMatter.rules.forEach((rule, index) => {
    const checks = Array.isArray(rule.check) ? rule.check : [rule.check]
    checks.forEach((check, checkIndex) => {
      const pointer = Array.isArray(rule.check) ? `/rules/${index}/check/${checkIndex}` : `/rules/${index}/check`
      const [kind, ...rest] = check.split(':')
      const target = rest.join(':')
      const fail = (message: string): void => {
        out.push(finding('check-target', `${rule.id}:${check}`, ctx.guideFile, pointer, message))
      }

      if (kind === 'review') return
      if (kind === 'types') {
        if (!ctx.propsInfo.moduleExports.includes(target)) fail(`${target} is not exported from ${manifest.code.path}.`)
        return
      }
      if (kind === 'schema') {
        if (!resolvePointer(manifest, target)) fail(`JSON pointer ${target} does not resolve in the manifest.`)
        return
      }
      if (kind === 'test') {
        const [path, name] = [target.slice(0, target.indexOf('#')), target.slice(target.indexOf('#') + 1)]
        const absolute = join(ctx.repoRoot, path)
        if (!existsSync(absolute)) return fail(`Test file ${path} does not exist.`)
        if (!testNames(readFileSync(absolute, 'utf8')).has(name)) fail(`Test '${name}' not found in ${path}.`)
        return
      }
      if (kind === 'lint') {
        const config = join(ctx.repoRoot, '.eslintrc.js')
        if (!existsSync(config) || !readFileSync(config, 'utf8').includes(target))
          fail(`ESLint rule ${target} is not configured in .eslintrc.js.`)
        return
      }
      if (kind === 'docs' && !existsSync(join(ctx.repoRoot, target))) fail(`Docs path ${target} does not exist.`)
    })
  })
  return out
}

const checkRuleRefs = (manifest: Manifest, ruleIds: Set<string>, manifestFile: string): Finding[] => {
  const refs: { id: string; pointer: string }[] = [
    ...(manifest.constraints ?? []).map((c, i) => ({ id: c.rule, pointer: `/constraints/${i}/rule` })),
    ...(manifest.illegalCombinations ?? []).flatMap((c, i) =>
      c.rule ? [{ id: c.rule, pointer: `/illegalCombinations/${i}/rule` }] : []
    ),
    ...(manifest.examples?.incorrect ?? []).flatMap((example, i) =>
      typeof example === 'string'
        ? []
        : example.violates.map((id, j) => ({ id, pointer: `/examples/incorrect/${i}/violates/${j}` }))
    ),
    ...(manifest.knownGaps ?? []).flatMap((gap, i) =>
      typeof gap !== 'string' && gap.rule ? [{ id: gap.rule, pointer: `/knownGaps/${i}/rule` }] : []
    )
  ]
  return refs
    .filter(ref => !ruleIds.has(ref.id))
    .map(ref => finding('rule-unknown', ref.id, manifestFile, ref.pointer, `${ref.id} is not defined in the guide.`))
}

const sameSet = (a: string[], b: string[]): boolean =>
  a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index])

const KIND_FOR_TYPE: Record<string, TypeProp['kind'][]> = {
  enum: ['literal-union'],
  string: ['string', 'literal-union'],
  boolean: ['boolean'],
  number: ['number'],
  function: ['function'],
  node: ['other', 'string', 'number', 'boolean'],
  array: ['other']
}

const checkProps = (manifest: Manifest, info: PropsTypeInfo, manifestFile: string): Finding[] => {
  const out: Finding[] = []
  const typeName = manifest.code.propsType ?? `${manifest.code.export}Props`
  if (info.error) return [finding('props-type', typeName, manifestFile, '/code/propsType', info.error)]

  const groups: ['shared' | 'codeOnly', ManifestProp[]][] = [
    ['shared', manifest.props.shared],
    ['codeOnly', manifest.props.codeOnly]
  ]
  const listed = new Set(groups.flatMap(([, props]) => props.map(prop => prop.name)))

  for (const [group, props] of groups) {
    props.forEach((prop, index) => {
      const pointer = `/props/${group}/${index}`
      const occurrences = info.members.map(member => member.get(prop.name))
      const live = occurrences.filter((p): p is TypeProp => p !== undefined && p.kind !== 'never')

      if (live.length === 0) {
        out.push(
          finding(
            'prop-missing-in-type',
            prop.name,
            manifestFile,
            pointer,
            `${prop.name} is not a prop of ${typeName}.`
          )
        )
        return
      }

      const allowedKinds = KIND_FOR_TYPE[prop.type] ?? []
      const badKind = live.find(p => !allowedKinds.includes(p.kind))
      if (badKind)
        out.push(
          finding(
            'prop-kind',
            prop.name,
            manifestFile,
            `${pointer}/type`,
            `Manifest type '${prop.type}' does not match the TypeScript type (${badKind.kind}).`
          )
        )

      if (prop.type === 'enum' && prop.values) {
        const typeValues = [...new Set(live.flatMap(p => p.literals))]
        if (!sameSet(typeValues, prop.values))
          out.push(
            finding(
              'prop-values',
              prop.name,
              manifestFile,
              `${pointer}/values`,
              `Manifest values [${prop.values.join(', ')}] differ from ${typeName} values [${typeValues.sort().join(', ')}].`
            )
          )
      }

      const typeRequired = live.some(p => !p.optional)
      if (prop.required === true && live.some(p => p.optional))
        out.push(
          finding(
            'prop-required',
            prop.name,
            manifestFile,
            `${pointer}/required`,
            `Manifest marks ${prop.name} required; ${typeName} makes it optional.`
          )
        )
      if (prop.required !== true && typeRequired)
        out.push(
          finding(
            'prop-optional',
            prop.name,
            manifestFile,
            pointer,
            `${typeName} requires ${prop.name}; the manifest does not mark it required.`
          )
        )
    })
  }

  const localProps = new Map(
    info.members.flatMap(member =>
      [...member.values()].filter(p => p.declaredLocally && p.kind !== 'never').map(p => [p.name, p] as const)
    )
  )
  for (const prop of localProps.values()) {
    if (listed.has(prop.name)) continue
    out.push(
      finding(
        'prop-missing-in-manifest',
        prop.name,
        manifestFile,
        '/props',
        `${typeName} declares ${prop.name}, but the manifest lists it under neither shared nor codeOnly.`
      )
    )
  }

  ;(manifest.constraints ?? []).forEach((constraint, index) => {
    if (constraint.enforcedBy !== 'types') return
    const narrowed = info.members.filter(member =>
      Object.entries(constraint.when).every(([name, expected]) => {
        const p = member.get(name)
        if (!p || p.literals.length === 0) return false
        return p.literals.every(value => matchesValue(value, expected))
      })
    )
    const pointer = `/constraints/${index}`
    if (narrowed.length === 0) {
      out.push(
        finding(
          'constraint-types',
          String(index),
          manifestFile,
          pointer,
          `enforcedBy is 'types' but no member of ${typeName} narrows to ${JSON.stringify(constraint.when)}.`
        )
      )
      return
    }
    for (const member of narrowed) {
      for (const name of constraint.forbid ?? []) {
        const p = member.get(name)
        if (p && p.kind !== 'never')
          out.push(
            finding(
              'constraint-types',
              String(index),
              manifestFile,
              pointer,
              `${typeName} allows ${name} when ${JSON.stringify(constraint.when)}.`
            )
          )
      }
      for (const name of constraint.require ?? []) {
        const p = member.get(name)
        if (!p || p.optional)
          out.push(
            finding(
              'constraint-types',
              String(index),
              manifestFile,
              pointer,
              `${typeName} does not require ${name} when ${JSON.stringify(constraint.when)}.`
            )
          )
      }
    }
  })

  return out
}

const checkTokens = (manifest: Manifest, repoRoot: string, manifestFile: string): Finding[] => {
  const sources = manifest.tokens.source ?? ['packages/core-design-system/design-tokens']
  const missingSource = sources.filter(source => !existsSync(join(repoRoot, source)))
  if (missingSource.length > 0)
    return missingSource.map(source =>
      finding('token-source', source, manifestFile, '/tokens/source', `Token source ${source} does not exist.`)
    )

  const index = buildTokenIndex(sources.map(source => join(repoRoot, source)))
  return Object.entries(manifest.tokens.refs)
    .filter(([, ref]) => !index.has(ref))
    .map(([key, ref]) =>
      finding(
        'token-missing',
        ref,
        manifestFile,
        `/tokens/refs/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`,
        `Token ${ref} is not defined in ${sources.join(', ')}.`
      )
    )
}

const checkBindings = (manifest: Manifest, manifestFile: string): Finding[] => {
  const out: Finding[] = []
  const shared = new Map(manifest.props.shared.map(prop => [prop.name, prop]))
  const codeProps = new Set([...shared.keys(), ...manifest.props.codeOnly.map(prop => prop.name)])
  const bindings = manifest.bindings ?? []

  bindings.forEach((binding, index) => {
    const pointer = `/bindings/${index}`
    if (!codeProps.has(binding.codeProp))
      out.push(
        finding(
          'binding-prop',
          binding.codeProp,
          manifestFile,
          `${pointer}/codeProp`,
          `${binding.codeProp} is not a shared or codeOnly prop.`
        )
      )
    if (binding.transform !== 'enum-map') return

    const prop = shared.get(binding.codeProp)
    const map = binding.enumMap ?? prop?.figmaEnumMap
    if (!map) {
      out.push(
        finding(
          'enum-map',
          binding.codeProp,
          manifestFile,
          pointer,
          'transform is enum-map but neither the binding nor the shared prop has an enum map.'
        )
      )
      return
    }
    if (binding.enumMap && prop?.figmaEnumMap && JSON.stringify(binding.enumMap) !== JSON.stringify(prop.figmaEnumMap))
      out.push(
        finding(
          'enum-map',
          binding.codeProp,
          manifestFile,
          `${pointer}/enumMap`,
          'Binding enumMap and shared prop figmaEnumMap disagree.'
        )
      )
    if (prop?.values && !sameSet([...new Set(Object.values(map))], prop.values))
      out.push(
        finding(
          'enum-map',
          binding.codeProp,
          manifestFile,
          pointer,
          `Enum map targets [${Object.values(map).join(', ')}] do not cover exactly the values of ${prop.name}.`
        )
      )
  })

  manifest.props.shared.forEach((prop, index) => {
    if (!prop.figmaProperty) return
    if (!bindings.some(binding => binding.codeProp === prop.name && binding.figmaProperty === prop.figmaProperty))
      out.push(
        finding(
          'binding-missing',
          prop.name,
          manifestFile,
          `/props/shared/${index}/figmaProperty`,
          `No binding maps ${prop.figmaProperty} to ${prop.name}.`
        )
      )
    const mapped = manifest.figma.variantPropertyMap?.[prop.name]
    if (mapped !== undefined && mapped !== prop.figmaProperty)
      out.push(
        finding(
          'figma-key',
          prop.name,
          manifestFile,
          `/figma/variantPropertyMap/${prop.name}`,
          `variantPropertyMap says '${mapped}', props.shared says '${prop.figmaProperty}'.`
        )
      )
  })

  return out
}

const usageViolations = (usage: JsxUsage, manifest: Manifest): { rule?: string; message: string }[] => {
  const all = [...manifest.props.shared, ...manifest.props.codeOnly]
  const defaults = new Map(all.filter(prop => prop.default !== undefined).map(prop => [prop.name, prop.default]))
  const violations: { rule?: string; message: string }[] = []

  for (const prop of all) {
    if (prop.required !== true) continue
    const present = prop.name === 'children' ? usage.hasChildren : usage.attrs.has(prop.name)
    if (!present) violations.push({ message: `missing required prop ${prop.name}` })
  }
  for (const prop of all) {
    const attr = usage.attrs.get(prop.name)
    if (prop.type !== 'enum' || !prop.values || attr?.kind !== 'literal') continue
    if (!prop.values.includes(attr.value))
      violations.push({ message: `${prop.name}="${attr.value}" is not one of ${prop.values.join(', ')}` })
  }
  for (const constraint of manifest.constraints ?? []) {
    const active = Object.entries(constraint.when).every(([name, expected]) =>
      matchesValue(effectiveValue(usage, name, defaults), expected)
    )
    if (!active) continue
    for (const name of constraint.forbid ?? [])
      if (usage.attrs.has(name))
        violations.push({
          rule: constraint.rule,
          message: `${name} is forbidden when ${JSON.stringify(constraint.when)}`
        })
    for (const name of constraint.require ?? [])
      if (!usage.attrs.has(name))
        violations.push({
          rule: constraint.rule,
          message: `${name} is required when ${JSON.stringify(constraint.when)}`
        })
  }
  for (const combo of manifest.illegalCombinations ?? []) {
    if (combo.side === 'figma') continue
    const hit = Object.entries(combo.combination).every(([name, expected]) =>
      matchesValue(effectiveValue(usage, name, defaults), expected)
    )
    if (hit) violations.push({ rule: combo.rule, message: `illegal combination ${JSON.stringify(combo.combination)}` })
  }
  return violations
}

const checkExamples = (manifest: Manifest, manifestFile: string): Finding[] => {
  const out: Finding[] = []
  const component = manifest.code.export
  const constraintRules = new Set((manifest.constraints ?? []).map(constraint => constraint.rule))

  ;(manifest.examples?.correct ?? []).forEach((code, index) => {
    const pointer = `/examples/correct/${index}`
    const usages = parseUsages(code, component)
    if (usages.length === 0)
      out.push(finding('example-correct', String(index), manifestFile, pointer, `No <${component}> usage found.`))
    for (const usage of usages)
      for (const violation of usageViolations(usage, manifest))
        out.push(finding('example-correct', String(index), manifestFile, pointer, violation.message))
  })
  ;(manifest.examples?.incorrect ?? []).forEach((example, index) => {
    if (typeof example === 'string') return
    const checkable = example.violates.filter(rule => constraintRules.has(rule))
    if (checkable.length === 0) return
    const tripped = new Set(
      parseUsages(example.code, component).flatMap(usage => usageViolations(usage, manifest).map(v => v.rule))
    )
    for (const rule of checkable) {
      if (tripped.has(rule)) continue
      out.push(
        finding(
          'example-incorrect',
          `${index}:${rule}`,
          manifestFile,
          `/examples/incorrect/${index}`,
          `Example claims to violate ${rule}, but none of the ${rule} constraints reject it.`
        )
      )
    }
  })

  return out
}

const applyWaivers = (findings: Finding[], manifest: Manifest, manifestFile: string): Finding[] => {
  const out = [...findings]
  ;(manifest.knownGaps ?? []).forEach((gap, index) => {
    if (typeof gap === 'string' || !gap.waives) return
    const matched = out.filter(f => f.key === gap.waives)
    if (matched.length === 0) {
      out.push(
        finding(
          'waiver-stale',
          gap.waives,
          manifestFile,
          `/knownGaps/${index}/waives`,
          `Waiver '${gap.waives}' matches no finding. Remove it or fix the key.`
        )
      )
      return
    }
    for (const f of matched) f.severity = 'waived'
  })
  return out
}

/**
 * Validates one manifest and its paired guide. Pure apart from reading the
 * component source, token source and check targets from disk.
 */
const checkRegistry = (
  registry: Registry,
  frontMatter: GuideFrontMatter,
  manifest: Manifest,
  ctx: { guideFile: string; registryFile: string }
): Finding[] => {
  const out: Finding[] = []
  const { guideFile, registryFile } = ctx
  const component = manifest.code.export

  for (const dup of registry.duplicates)
    out.push(finding('registry-duplicate', dup.prefix, registryFile, `L${dup.line}`, `${dup.prefix} is listed twice.`))

  const others = [...registry.entries.values()].filter(
    e => e.component === component && e.prefix !== frontMatter.prefix
  )
  for (const other of others)
    out.push(
      finding(
        'registry-component',
        `${component}:${other.prefix}`,
        registryFile,
        `L${other.line}`,
        `${component} is also registered under ${other.prefix}.`
      )
    )

  const entry = registry.entries.get(frontMatter.prefix)
  if (!entry) {
    out.push(
      finding(
        'prefix-unregistered',
        frontMatter.prefix,
        guideFile,
        '/prefix',
        `${frontMatter.prefix} is not in ${registryFile}.`
      )
    )
    return out
  }
  if (entry.component !== component)
    out.push(
      finding(
        'prefix-owner',
        frontMatter.prefix,
        guideFile,
        '/prefix',
        `${frontMatter.prefix} is registered to ${entry.component}, not ${component}.`
      )
    )

  const ids = [
    ...frontMatter.rules.map((rule, index) => ({ id: rule.id, path: `/rules/${index}/id` })),
    ...(frontMatter.gaps ?? []).map((gap, index) => ({ id: gap.id, path: `/gaps/${index}/id` }))
  ]
  for (const { id, path } of ids) {
    if (entry.retired.includes(id))
      out.push(finding('rule-retired', id, guideFile, path, `${id} is retired in ${registryFile}.`))
    if (!id.startsWith(`${frontMatter.prefix}-`))
      out.push(finding('rule-prefix', id, guideFile, path, `Expected prefix ${frontMatter.prefix}.`))
  }
  return out
}

const placeholderFindings = (source: string, file: string, label: string): Finding[] => {
  const count = source.split('[TK]').length - 1
  if (count === 0) return []
  return [finding('placeholder', label, file, '', `${count} unresolved [TK] placeholder(s).`)]
}

export const validateContract = (input: ContractInput): Finding[] => {
  const { repoRoot } = input
  const manifestFile = relative(repoRoot, input.manifestPath)
  const guideFile = relative(repoRoot, input.guidePath)
  const { manifest: validateManifest, guide: validateGuide } = getValidators()

  const out: Finding[] = [
    ...placeholderFindings(JSON.stringify(input.manifest), manifestFile, 'manifest'),
    ...placeholderFindings(input.guideSource, guideFile, 'guide')
  ]
  if (!validateManifest(input.manifest)) out.push(...schemaFindings(validateManifest.errors, manifestFile, 'manifest'))

  const guide = parseGuide(input.guideSource)
  if (guide.frontMatterError) out.push(finding('front-matter', 'parse', guideFile, '', guide.frontMatterError))
  else if (!validateGuide(guide.frontMatter)) out.push(...schemaFindings(validateGuide.errors, guideFile, 'guide'))

  if (out.length > 0) return out

  const manifest = input.manifest as Manifest
  const frontMatter = guide.frontMatter as GuideFrontMatter

  if (resolve(dirname(input.manifestPath), manifest.governance.guide) !== input.guidePath)
    out.push(
      finding(
        'governance-guide',
        manifest.governance.guide,
        manifestFile,
        '/governance/guide',
        'Does not resolve to the guide.'
      )
    )

  const ruleIds = new Set([...frontMatter.rules.map(rule => rule.id), ...(frontMatter.gaps ?? []).map(gap => gap.id)])
  const componentPath = join(repoRoot, manifest.code.path)
  const typeName = manifest.code.propsType ?? `${manifest.code.export}Props`
  const propsInfo: PropsTypeInfo = existsSync(componentPath)
    ? readPropsType(componentPath, typeName, PACKAGE_TSCONFIG)
    : { members: [], moduleExports: [], error: `Component source ${manifest.code.path} does not exist.` }

  out.push(
    ...checkGuide(guide, frontMatter, { guideFile, manifestPath: input.manifestPath, guidePath: input.guidePath }),
    ...checkRegistry(
      parseRegistry(input.registrySource ?? readFileSync(REGISTRY_PATH, 'utf8')),
      frontMatter,
      manifest,
      { guideFile, registryFile: relative(repoRoot, REGISTRY_PATH) }
    ),
    ...checkTargets(frontMatter, manifest, { repoRoot, guideFile, propsInfo }),
    ...checkRuleRefs(manifest, ruleIds, manifestFile),
    ...checkProps(manifest, propsInfo, manifestFile),
    ...checkTokens(manifest, repoRoot, manifestFile),
    ...checkBindings(manifest, manifestFile),
    ...checkExamples(manifest, manifestFile)
  )

  return applyWaivers(out, manifest, manifestFile)
}
