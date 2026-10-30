#!/usr/bin/env node
/**
 * ds-check: Validate component manifests and design system contracts
 *
 * Usage:
 *   pnpm ds-check              # Run all checks
 *   pnpm ds-check --schema     # Validate manifest structure against the schema
 *   pnpm ds-check --refs       # Check governance.rulesDocs + registry paths exist
 *   pnpm ds-check --code       # Check code.export/path/import are present and well-formed
 *   pnpm ds-check --source     # Compare manifest enum values to the component's CVA variants
 *                              # or TypeScript string-literal union
 *   pnpm ds-check --generated  # Fail if a committed OpenAPI spec is stale
 *   pnpm ds-check --write      # Regenerate OpenAPI specs from manifests
 *
 * The OpenAPI specs in schemas/ are GENERATED from the manifests. Edit the
 * manifest and run --write; never hand-edit a spec.
 *
 * Manifests are read from schemas/ (hand-authored) and generated/manifests/
 * (generated, if present). Paths inside a manifest are resolved relative to the
 * package root, not the manifest's own directory.
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// The manifest schema declares draft 2020-12, so the matching Ajv entrypoint is required.
// Plain 'ajv' defaults to draft-07 and throws on the $schema ref.
import Ajv from 'ajv/dist/2020.js'
import { format as prettierFormat, resolveConfig as prettierResolveConfig } from 'prettier'
import * as ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..')
const SCHEMA_PATH = path.resolve(PACKAGE_ROOT, 'schemas/component-manifest.schema.json')
const REGISTRY_PATH = path.resolve(PACKAGE_ROOT, 'schemas/registry.json')
const MANIFEST_DIRS = [path.resolve(PACKAGE_ROOT, 'schemas'), path.resolve(PACKAGE_ROOT, 'generated/manifests')]

interface CheckOptions {
  schema?: boolean
  refs?: boolean
  code?: boolean
  source?: boolean
  generated?: boolean
  write?: boolean
  verbose?: boolean
}

function parseArgs(): CheckOptions {
  const args = process.argv.slice(2)
  const options: CheckOptions = {}

  options.verbose = args.includes('--verbose')
  options.write = args.includes('--write')

  const selectors = args.filter(a => a !== '--verbose' && a !== '--write')
  const validSelectors = ['--schema', '--refs', '--code', '--source', '--generated']

  // Validate all selector flags are recognized
  const unknownSelectors = selectors.filter(sel => !validSelectors.includes(sel))
  if (unknownSelectors.length > 0) {
    console.error(`❌ Unknown flag(s): ${unknownSelectors.join(', ')}`)
    console.error(`Valid flags: ${validSelectors.join(', ')}`)
    process.exit(1)
  }

  // No selector flags (or --write alone) runs every check
  if (selectors.length === 0) {
    options.schema = true
    options.refs = true
    options.code = true
    options.source = true
    options.generated = true
  } else {
    if (selectors.includes('--schema')) options.schema = true
    if (selectors.includes('--refs')) options.refs = true
    if (selectors.includes('--code')) options.code = true
    if (selectors.includes('--source')) options.source = true
    if (selectors.includes('--generated')) options.generated = true
  }

  // Regeneration happens inside the generated check, so asking to write without it is a
  // no-op: `--source --write` used to exit 0 having regenerated nothing. Writing implies
  // the check that does the writing.
  if (options.write) options.generated = true

  return options
}

async function loadSchema(): Promise<Record<string, unknown>> {
  try {
    const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf-8')
    return JSON.parse(schemaContent) as Record<string, unknown>
  } catch (err) {
    console.error(`❌ Failed to load schema at ${SCHEMA_PATH}`)
    process.exit(1)
  }
}

function findManifests(): string[] {
  const manifests: string[] = []

  for (const dir of MANIFEST_DIRS) {
    if (!fs.existsSync(dir)) continue

    manifests.push(
      ...fs
        .readdirSync(dir)
        // TEMPLATE.manifest.json is a scaffold with placeholder values; it is not a real contract
        .filter(f => f.endsWith('.manifest.json') && !f.startsWith('TEMPLATE.'))
        .map(f => path.join(dir, f))
    )
  }

  return manifests
}

function validateSchema(
  manifest: Record<string, unknown>,
  schema: Record<string, unknown>
): { valid: boolean; errors?: Array<{ message?: string; instancePath?: string; params?: unknown }> } {
  // The schema uses "date-time" and "uri" formats. Declared here (rather than pulling in
  // ajv-formats) so strict mode stays on and an unrecognised format is still an error.
  const ajv = new Ajv({
    // Report every violation, not just the first — otherwise fixing a manifest is whack-a-mole
    allErrors: true,
    formats: {
      'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
      uri: /^[a-zA-Z][a-zA-Z0-9+.-]*:/
    }
  })
  const validate = ajv.compile(schema)
  const valid = validate(manifest)

  if (!valid) {
    return { valid: false, errors: validate.errors ?? [] }
  }

  const conditionErrors = conditionalPropErrors(manifest)
  if (conditionErrors.length > 0) return { valid: false, errors: conditionErrors }

  const contentErrors = [
    ...placeholderErrors(manifest),
    ...exampleIconErrors(manifest),
    ...exampleIgnoredPropErrors(manifest)
  ]
  if (contentErrors.length > 0) return { valid: false, errors: contentErrors }

  return { valid: true }
}

/**
 * Scaffold values from TEMPLATE.manifest.json and from the docs. The schema only checks the
 * *format* of the Figma identifiers, so a copied placeholder like "1234:5678" is valid
 * against it and would otherwise ship as if it pointed at a real node.
 */
const FIGMA_PLACEHOLDERS = [/^ABC123/i, /^1A2B3C/i, /^1234:5678$/, /\{[^}]*\}/]

function placeholderErrors(manifest: Record<string, unknown>): Array<{ message: string; instancePath: string }> {
  const figma = manifest.figma as Record<string, unknown> | undefined
  if (!figma) return []
  return Object.entries(figma)
    .filter(([, value]) => typeof value === 'string' && FIGMA_PLACEHOLDERS.some(re => re.test(value)))
    .map(([key, value]) => ({
      instancePath: `/figma/${key}`,
      message: `figma.${key} is a template placeholder ("${value}"); replace it with the real value from Figma`
    }))
}

/** Icon names the library actually ships: the keys of IconNameMapV2. */
function loadIconNames(): Set<string> {
  const file = path.resolve(PACKAGE_ROOT, 'src/components/icon-v2/icon-name-map.ts')
  const src = fs.readFileSync(file, 'utf-8')
  const body = src.slice(src.indexOf('export const IconNameMapV2'))
  return new Set([...body.matchAll(/^\s+['"]?([a-z0-9][a-z0-9-]*)['"]?:/gm)].map(m => m[1]))
}

/**
 * A correct example that names an icon the library doesn't have teaches agents a prop value
 * the type rejects. Only `examples.correct` is checked: `incorrect` examples may be wrong on purpose.
 */
function exampleIconErrors(manifest: Record<string, unknown>): Array<{ message: string; instancePath: string }> {
  const correct = (manifest.examples as { correct?: unknown } | undefined)?.correct
  if (!Array.isArray(correct)) return []
  const known = loadIconNames()
  const errors: Array<{ message: string; instancePath: string }> = []
  correct.forEach((example, index) => {
    if (typeof example !== 'string') return
    const names = [
      ...example.matchAll(/\bicon=(['"])([^'"]+)\1/g),
      ...example.matchAll(/<IconV2\b[^>]*?\bname=(['"])([^'"]+)\1/g)
    ].map(m => m[2])
    for (const name of names.filter(n => !known.has(n))) {
      errors.push({
        instancePath: `/examples/correct/${index}`,
        message: `example uses icon "${name}", which is not a key of IconNameMapV2`
      })
    }
  })
  return errors
}

/**
 * Props the component accepts but silently ignores for some variants, so the type probe can't
 * express the rule (see BTN-003: a union that rejected it broke consumers' spread wrappers).
 * Correct examples must not teach the combination.
 */
const IGNORED_PROP_RULES: Record<string, { prop: string; variantProp: string; variants: string[]; rule: string }> = {
  button: { prop: 'theme', variantProp: 'variant', variants: ['ai', 'link', 'transparent'], rule: 'BTN-003' }
}

function exampleIgnoredPropErrors(manifest: Record<string, unknown>): Array<{ message: string; instancePath: string }> {
  const config = IGNORED_PROP_RULES[String(manifest.id).split('.').pop() ?? '']
  const correct = (manifest.examples as { correct?: unknown } | undefined)?.correct
  if (!config || !Array.isArray(correct)) return []
  const errors: Array<{ message: string; instancePath: string }> = []
  correct.forEach((example, index) => {
    if (typeof example !== 'string') return
    for (const tag of example.matchAll(/<Button\b[^>]*>/g)) {
      const variant = tag[0].match(new RegExp(`\\b${config.variantProp}=(['"])([^'"]+)\\1`))?.[2]
      if (variant && config.variants.includes(variant) && new RegExp(`\\b${config.prop}=`).test(tag[0])) {
        errors.push({
          instancePath: `/examples/correct/${index}`,
          message: `${config.rule}: example passes ${config.prop} with ${config.variantProp}="${variant}", which ignores it`
        })
      }
    }
  })
  return errors
}

/**
 * `onlyWhen` / `neverWhen` name another prop and some of its values. JSON Schema can't check
 * that those exist in the same manifest, so a typo (`"varient"`, `"statuss"`) would silently
 * describe a rule that never applies.
 */
function conditionalPropErrors(manifest: Record<string, unknown>): Array<{ message: string; instancePath: string }> {
  const props = (manifest.props ?? {}) as Record<string, Array<Record<string, unknown>>>
  const all = (['shared', 'designOnly', 'codeOnly'] as const).flatMap(bucket =>
    (props[bucket] ?? []).map((prop, index) => ({ bucket, index, prop }))
  )
  const enums = new Map(
    all.filter(({ prop }) => Array.isArray(prop.values)).map(({ prop }) => [String(prop.name), prop.values as string[]])
  )
  const errors: Array<{ message: string; instancePath: string }> = []

  for (const { bucket, index, prop } of all) {
    for (const field of ['onlyWhen', 'neverWhen'] as const) {
      const condition = prop[field] as Record<string, string[]> | undefined
      if (!condition) continue
      for (const [target, values] of Object.entries(condition)) {
        const at = `/props/${bucket}/${index}/${field}/${target}`
        const allowed = enums.get(target)
        if (!allowed) {
          errors.push({
            instancePath: at,
            message: `"${prop.name}" ${field} refers to "${target}", which is not an enum prop in this manifest`
          })
          continue
        }
        for (const value of values.filter(v => !allowed.includes(v))) {
          errors.push({
            instancePath: at,
            message: `"${prop.name}" ${field} lists "${value}", which is not a value of "${target}"`
          })
        }
      }
    }
  }
  return errors
}

/**
 * Resolve a manifest/registry doc path. Paths are always package-root-relative
 * (e.g. "docs/system/spacing.md").
 *
 * `apps/` paths used to resolve from the repo root so a manifest could cite a doc-site
 * page. That is no longer allowed: the docs site is maintained separately, lags the code
 * and is less detailed than the manifests, so it is not a reference for design-system
 * rules. Such paths now resolve inside the package, fail to exist, and are reported — the
 * rules live in docs/system/.
 */
function resolveDocPath(docPath: string): string {
  return path.resolve(PACKAGE_ROOT, docPath)
}

function validateRulesDocs(manifest: Record<string, unknown>): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  const governance = manifest.governance as Record<string, unknown> | undefined
  if (!governance?.rulesDocs || !Array.isArray(governance.rulesDocs)) {
    errors.push('governance.rulesDocs is not an array')
    return { valid: false, errors }
  }

  for (const docPath of governance.rulesDocs) {
    if (typeof docPath !== 'string') {
      errors.push(`governance.rulesDocs contains non-string value: ${String(docPath)}`)
      continue
    }
    const resolvedPath = resolveDocPath(docPath)

    if (!fs.existsSync(resolvedPath)) {
      errors.push(`governance.rulesDocs references non-existent file: ${docPath} (resolved to ${resolvedPath})`)
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

/**
 * Check registry.json: every systemRules path resolves, and every rule doc on
 * disk is registered. Catches both dangling entries and unregistered docs.
 */
function validateRegistry(): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  if (!fs.existsSync(REGISTRY_PATH)) {
    return { valid: false, errors: [`registry.json not found at ${REGISTRY_PATH}`] }
  }

  let registry: Record<string, unknown>
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as Record<string, unknown>
  } catch (err) {
    return { valid: false, errors: [`registry.json is not valid JSON: ${err instanceof Error ? err.message : err}`] }
  }

  const systemRules = registry.systemRules
  if (!Array.isArray(systemRules)) {
    return { valid: false, errors: ['registry.json systemRules is not an array'] }
  }

  const registered = new Set<string>()
  for (const rule of systemRules as Array<Record<string, unknown>>) {
    const rulePath = typeof rule?.path === 'string' ? rule.path : undefined
    if (!rulePath) {
      errors.push(`systemRules entry missing a string "path": ${JSON.stringify(rule)}`)
      continue
    }
    registered.add(rulePath)
    if (!fs.existsSync(resolveDocPath(rulePath))) {
      errors.push(`systemRules references non-existent file: ${rulePath}`)
    }
    if (!rule.title) {
      errors.push(`systemRules entry "${rulePath}" is missing a title`)
    }
  }

  // Skill entries point at a manifest + OpenAPI doc; a dangling path here fails
  // silently at consumption time, so treat it like any other broken reference.
  const skills = registry.skills
  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('registry.json skills is not an array')
  } else if (Array.isArray(skills)) {
    for (const skill of skills as Array<Record<string, unknown>>) {
      const id = typeof skill?.id === 'string' ? skill.id : JSON.stringify(skill)
      for (const field of ['manifest', 'openapi'] as const) {
        const value = skill?.[field]
        if (typeof value !== 'string') {
          errors.push(`skills entry "${id}" is missing a string "${field}"`)
          continue
        }
        if (!fs.existsSync(resolveDocPath(value))) {
          errors.push(`skills entry "${id}" references non-existent ${field}: ${value}`)
        }
      }
    }
  }

  // Every doc in docs/system/ must be registered, or it ships unadvertised
  const systemDir = path.resolve(PACKAGE_ROOT, 'docs/system')
  if (fs.existsSync(systemDir)) {
    for (const file of fs.readdirSync(systemDir).filter(f => f.endsWith('.md'))) {
      const rel = `docs/system/${file}`
      if (!registered.has(rel)) {
        errors.push(`${rel} exists but is not registered in registry.json systemRules`)
      }
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

/** Resolve manifest `code.path`, which is repo-root-relative. */
function resolveCodePath(codePath: string): string {
  return path.resolve(REPO_ROOT, codePath)
}

/**
 * Skip over a quoted string starting at position i, handling escape sequences.
 * Returns the position after the closing quote, or -1 if unterminated.
 */
function skipString(src: string, i: number, quote: string): number {
  i++ // move past opening quote
  while (i < src.length) {
    if (src[i] === '\\')
      i += 2 // skip escape sequence
    else if (src[i] === quote) return i + 1
    else i++
  }
  return -1 // unterminated string
}

/**
 * Return the contents of the `{...}` block that begins at or after `from`,
 * matched by brace balance so nested objects don't truncate the result.
 * Skips over string literals and comments to avoid counting braces within them.
 */
function extractBlock(src: string, from: number): string | undefined {
  const open = src.indexOf('{', from)
  if (open === -1) return undefined

  let depth = 0
  for (let i = open; i < src.length; i++) {
    const ch = src[i]

    // Skip string literals
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipString(src, i, ch)
      if (i === -1) return undefined
      i-- // back up one since the loop will increment
      continue
    }

    // Skip comments
    if (ch === '/' && i + 1 < src.length) {
      if (src[i + 1] === '/') {
        // Line comment: skip to end of line
        const nl = src.indexOf('\n', i)
        i = nl === -1 ? src.length - 1 : nl - 1
        continue
      }
      if (src[i + 1] === '*') {
        // Block comment: skip to */
        const end = src.indexOf('*/', i + 2)
        if (end === -1) return undefined
        i = end + 1
        continue
      }
    }

    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return src.slice(open + 1, i)
    }
  }
  return undefined
}

/**
 * Keys declared directly in an object-literal block, ignoring nested levels. Object literals
 * separate entries with commas; type literals may also use newlines or semicolons (typeMembers).
 */
function topLevelKeys(block: string, typeMembers = false): string[] {
  const keys: string[] = []
  let depth = 0
  let atKeyPosition = true

  for (let i = 0; i < block.length; i++) {
    const ch = block[i]

    // A quoted key (`'forest-green': '…'`) must be read before the string-literal skip
    // below, which would otherwise swallow the key and drop the variant entirely.
    if (depth === 0 && atKeyPosition && (ch === '"' || ch === "'")) {
      const quoted = /^['"]([\w-]+)['"]\??\s*:/.exec(block.slice(i))
      if (quoted) {
        keys.push(quoted[1])
        i += quoted[0].length - 1
        atKeyPosition = false
        continue
      }
    }

    // Skip string literals
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipString(block, i, ch)
      if (i === -1) break
      i-- // back up one since the loop will increment
      continue
    }

    // Skip comments
    if (ch === '/' && i + 1 < block.length) {
      if (block[i + 1] === '/') {
        const nl = block.indexOf('\n', i)
        i = nl === -1 ? block.length - 1 : nl - 1
        continue
      }
      if (block[i + 1] === '*') {
        const end = block.indexOf('*/', i + 2)
        if (end === -1) break
        i = end + 1
        continue
      }
    }

    if (ch === '{' || ch === '[' || ch === '(') depth++
    else if (ch === '}' || ch === ']' || ch === ')') depth--
    else if ((ch === ',' || (typeMembers && (ch === ';' || ch === '\n'))) && depth === 0) atKeyPosition = true
    else if (depth === 0 && atKeyPosition && /[\w'"]/.test(ch)) {
      const rest = block.slice(i)
      const m = /^['"]?([\w-]+)['"]?\??\s*:/.exec(rest)
      if (m) {
        keys.push(m[1])
        i += m[0].length - 1
      }
      atKeyPosition = false
    }
  }
  return keys
}

/**
 * Compare manifest enum values against the component's CVA `variants` block.
 * This is the only boundary where a human keeps two things in sync by hand, so
 * it is where values silently diverge (e.g. a manifest saying `error` where the
 * component says `danger`). CVA-declared variants only — relationships encoded
 * in the TypeScript type (discriminated unions) are not expressible here.
 */
/**
 * Read a prop's allowed values from a TypeScript string-literal union, for the ~2/3 of
 * components that declare variants in the type rather than through CVA. Handles both
 * inline and multi-line unions, and resolves one level of named alias:
 *
 *   size?: 'sm' | 'md'
 *   variant?:
 *     | 'primary'
 *     | 'secondary'
 *   theme?: BadgeTheme          // with `type BadgeTheme = 'muted' | 'success'` in the file
 *
 * Returns [] when the prop is absent or its type is not a literal union, so the caller
 * treats it as unverified rather than as an empty set.
 */
function unionValuesFor(src: string, propName: string): string[] {
  // Capture the type expression: everything up to the terminator, including wrapped lines
  // that begin with `|`.
  const decl = new RegExp(`(?:^|[\\s{;])${propName}\\??\\s*:\\s*([^;\\n}]*(?:\\n\\s*\\|[^;\\n}]*)*)`, 'm').exec(src)
  if (!decl) return []

  const readLiterals = (expr: string): string[] => {
    const quoted = expr.match(/'([^']+)'|"([^"]+)"/g)
    return quoted ? quoted.map(q => q.slice(1, -1)) : []
  }

  const direct = readLiterals(decl[1])
  if (direct.length > 0) return direct

  // Bare identifier — resolve `type X = 'a' | 'b'` once, in the same file.
  const alias = decl[1].trim().replace(/\[\]$/, '')
  if (!/^[A-Za-z_$][\w$]*$/.test(alias)) return []
  const aliasDecl = new RegExp(`type\\s+${alias}\\s*=\\s*([^;\\n]*(?:\\n\\s*\\|[^;\\n]*)*)`, 'm').exec(src)
  return aliasDecl ? readLiterals(aliasDecl[1]) : []
}

/**
 * Prop names declared in the component's own `…Props` types: every key of every object
 * literal inside a `type XProps = …` or `interface XProps { … }` declaration, including
 * the literals on each side of an intersection or union. Props that only arrive through
 * a spread type (React.HTMLAttributes and the like) are not declared here, so they are
 * never reported as missing from the manifest.
 */
function declaredPropNames(src: string): Set<string> {
  const names = new Set<string>()
  const decl = /\b(?:type\s+\w*Props\w*[^=\n]*=|interface\s+\w*Props\w*[^{\n]*)/g

  for (const m of src.matchAll(decl)) {
    let i = (m.index ?? 0) + m[0].length
    let depth = 0

    while (i < src.length) {
      const ch = src[i]
      if (ch === '"' || ch === "'" || ch === '`') {
        const next = skipString(src, i, ch)
        if (next === -1) break
        i = next
        continue
      }
      if (ch === '{' && depth === 0) {
        const block = extractBlock(src, i)
        if (block === undefined) break
        for (const key of topLevelKeys(block, true)) names.add(key)
        i += block.length + 2
        continue
      }
      if (ch === '(' || ch === '[' || ch === '<') depth++
      else if (ch === ')' || ch === ']' || (ch === '>' && src[i - 1] !== '=')) depth--
      else if (depth <= 0 && ch === ';') break
      else if (depth <= 0 && ch === '\n') {
        // A declaration continues while a line ends or the next begins with & or |.
        const before = src.slice(0, i).trimEnd().slice(-1)
        const after = src.slice(i).trimStart()[0]
        if (!'&|=,<'.includes(before) && after !== '&' && after !== '|') break
      }
      i++
    }
  }
  return names
}

/**
 * `onlyWhen` / `neverWhen` are claims about the component's TypeScript types: "pulse is
 * rejected unless variant is 'status'". Nothing else checks that. This compiles a throwaway
 * probe against the real types — one assignment per case — and requires the allowed
 * combinations to compile and the forbidden ones to fail.
 */
function validateConditionalTypes(manifest: Record<string, unknown>): { valid: boolean; errors?: string[] } {
  const code = manifest.code as Record<string, unknown> | undefined
  const codePath = typeof code?.path === 'string' ? code.path : undefined
  const exportName = typeof code?.export === 'string' ? code.export : undefined
  if (!codePath || !exportName) return { valid: true }

  const props = (manifest.props ?? {}) as Record<string, Array<Record<string, unknown>>>
  const all = (['shared', 'designOnly', 'codeOnly'] as const).flatMap(bucket => props[bucket] ?? [])
  const enums = new Map(all.filter(p => Array.isArray(p.values)).map(p => [String(p.name), p]))

  interface Case {
    line: string
    describe: string
    expect: 'accept' | 'reject'
  }
  const cases: Case[] = []
  const lit = (v: string) => JSON.stringify(v)
  const add = (prop: string, target: string | null, value: string | null, expect: Case['expect'], why: string) => {
    const fields = [...(target && value !== null ? [`${target}: ${lit(value)}`] : []), `${prop}: sample_${prop}`]
    cases.push({
      line: `const _${cases.length}: P = { ${fields.join(', ')} }`,
      describe: `${prop} with ${target && value !== null ? `${target}=${lit(value)}` : `${target ?? 'its condition'} omitted`} ${why}`,
      expect
    })
  }

  const sampled = new Set<string>()
  for (const prop of all) {
    const name = String(prop.name)
    for (const field of ['onlyWhen', 'neverWhen'] as const) {
      const condition = prop[field] as Record<string, string[]> | undefined
      if (!condition) continue
      sampled.add(name)
      for (const [target, listed] of Object.entries(condition)) {
        const every = (enums.get(target)?.values ?? []) as string[]
        const others = every.filter(v => !listed.includes(v))
        const fallback = enums.get(target)?.default as string | undefined
        if (field === 'onlyWhen') {
          listed.forEach(v => add(name, target, v, 'accept', 'should be accepted (onlyWhen)'))
          others.forEach(v => add(name, target, v, 'reject', 'should be rejected (onlyWhen)'))
          if (fallback !== undefined && !listed.includes(fallback)) {
            add(name, null, null, 'reject', `should be rejected: the default ${target} is "${fallback}" (onlyWhen)`)
          }
        } else {
          listed.forEach(v => add(name, target, v, 'reject', 'should be rejected (neverWhen)'))
          others.forEach(v => add(name, target, v, 'accept', 'should be accepted (neverWhen)'))
        }
      }
    }
  }
  if (cases.length === 0) return { valid: true }

  const probePath = path.resolve(PACKAGE_ROOT, 'scripts/.ds-check-probe.tsx')
  const modulePath = resolveCodePath(codePath).replace(/\.tsx?$/, '')
  const header = [
    `import type * as React from 'react'`,
    `import { ${exportName} } from ${lit(modulePath)}`,
    `type P = React.ComponentProps<typeof ${exportName}>`,
    // Any value the prop accepts on any union member, so the probe never guesses a literal
    `type Val<K extends string> = P extends unknown ? (K extends keyof P ? NonNullable<P[K]> : never) : never`,
    ...[...sampled].map(n => `declare const sample_${n}: Val<${lit(n)}>`)
  ]
  const text = [...header, ...cases.map(c => c.line)].join('\n') + '\n'

  const configPath = path.resolve(PACKAGE_ROOT, 'tsconfig.json')
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, PACKAGE_ROOT)
  const options: ts.CompilerOptions = { ...parsed.options, noEmit: true }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (file, languageVersion, ...rest) =>
    path.resolve(file) === probePath
      ? ts.createSourceFile(file, text, languageVersion, true, ts.ScriptKind.TSX)
      : getSourceFile(file, languageVersion, ...rest)
  const fileExists = host.fileExists.bind(host)
  host.fileExists = file => path.resolve(file) === probePath || fileExists(file)

  const program = ts.createProgram([probePath], options, host)
  const probe = program.getSourceFile(probePath)
  if (!probe) return { valid: false, errors: ['could not build the type probe'] }

  const failedLines = new Map<number, string>()
  const setupErrors: string[] = []
  for (const d of program.getSemanticDiagnostics(probe)) {
    const line = d.start === undefined ? -1 : ts.getLineAndCharacterOfPosition(probe, d.start).line - header.length
    const message = ts.flattenDiagnosticMessageText(d.messageText, ' ')
    if (line >= 0 && line < cases.length) failedLines.set(line, message)
    else setupErrors.push(message)
  }
  if (setupErrors.length > 0) {
    return { valid: false, errors: [`cannot probe the types of ${exportName}: ${setupErrors[0]}`] }
  }

  const errors: string[] = []
  cases.forEach((c, i) => {
    const rejected = failedLines.has(i)
    if (c.expect === 'reject' && !rejected) errors.push(`${c.describe}, but the type accepts it`)
    if (c.expect === 'accept' && rejected) {
      errors.push(`${c.describe}, but the type rejects it: ${failedLines.get(i)}`)
    }
  })
  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}

function validateSourceProps(manifest: Record<string, unknown>): {
  valid: boolean
  errors?: string[]
  skipped?: string
} {
  const errors: string[] = []
  const code = manifest.code as Record<string, unknown> | undefined
  const codePath = typeof code?.path === 'string' ? code.path : undefined
  if (!codePath) return { valid: true, skipped: 'manifest has no code.path' }

  const resolved = resolveCodePath(codePath)
  if (!fs.existsSync(resolved)) {
    return { valid: false, errors: [`code.path does not exist: ${codePath}`] }
  }

  const src = fs.readFileSync(resolved, 'utf-8')
  const props = (manifest.props ?? {}) as Record<string, unknown>

  /**
   * Both shared and codeOnly props exist in the source, so both are checkable. The bucket
   * records where a prop comes from — Figma and code, or code alone — and says nothing about
   * whether its values can be verified. Checking only `shared` conflated the two: a component
   * with no Figma counterpart has to declare every prop in codeOnly, which left all of its
   * enums unverified, so the honest bucket cost you the check. designOnly stays out, since
   * those props deliberately have no code counterpart to compare against.
   */
  const checkable = (['shared', 'codeOnly'] as const).flatMap(bucket =>
    ((props[bucket] ?? []) as Array<Record<string, unknown>>).map(prop => ({ bucket, prop }))
  )

  // Props the manifest claims are enums. These are the claims this check exists to verify.
  const declaredEnums = checkable
    .filter(({ prop }) => typeof prop.name === 'string' && Array.isArray(prop.values))
    .map(({ prop }) => String(prop.name))

  /**
   * Skipping is only safe when there was nothing to verify. If the manifest declares enum
   * props and we could not compare them, that is a failure — reporting ✅ for an
   * unverifiable claim is indistinguishable from reporting ✅ for a verified one.
   */
  const unverifiable = (reason: string, props: string[]) =>
    declaredEnums.length === 0
      ? { valid: true, skipped: reason }
      : {
          valid: false,
          errors: [
            `cannot verify enum props against ${path.basename(codePath)} (${reason}): ${props.join(', ')}`,
            `Values are read from the CVA variants block or a TypeScript string-literal union.`,
            `Either the component builds them dynamically (e.g. cva(base, getVariants())), or these props`,
            `are not enums in the source — in which case remove "values" so the manifest stops claiming they are.`
          ]
        }

  // A component declares its variants either through CVA or in the TypeScript type. Only
  // 25 of 77 flat components use CVA, so both are checked — CVA first, since when a
  // component has both, CVA is what actually produces the classes.
  //
  // A component may make several cva() calls (tabs, dialog, accordion each declare
  // several). Collect the variants block from every call: scanning only the first
  // compared the manifest against the wrong block, inventing or missing mismatches.
  // Each `variants:` is bounded to its own cva() so a later call's block isn't stolen.
  const variantsBlocks: string[] = []
  const cvaIndices: number[] = []
  for (let i = src.indexOf('cva('); i !== -1; i = src.indexOf('cva(', i + 1)) cvaIndices.push(i)
  for (let c = 0; c < cvaIndices.length; c++) {
    const nextCva = c + 1 < cvaIndices.length ? cvaIndices[c + 1] : src.length
    const vIdx = src.indexOf('variants:', cvaIndices[c])
    if (vIdx === -1 || vIdx >= nextCva) continue
    const block = extractBlock(src, vIdx)
    if (block) variantsBlocks.push(block)
  }

  const verified = new Set<string>()

  for (const { bucket, prop } of checkable) {
    const name = typeof prop.name === 'string' ? prop.name : undefined
    const values = Array.isArray(prop.values) ? (prop.values as string[]) : undefined
    if (!name || !values) continue

    let sourceValues: string[] = []

    // A prop may be split across cva() calls; union its keys from every block that
    // defines it so the manifest is compared against the full set of produced values.
    if (variantsBlocks.length > 0) {
      const merged = new Set<string>()
      for (const block of variantsBlocks) {
        const keyIdx = new RegExp(`(^|[\\s,{])${name}\\s*:`, 'm').exec(block)?.index
        if (keyIdx === undefined) continue
        const propBlock = extractBlock(block, keyIdx)
        if (propBlock) for (const k of topLevelKeys(propBlock)) merged.add(k)
      }
      if (merged.size > 0) sourceValues = [...merged]
    }

    if (sourceValues.length === 0) sourceValues = unionValuesFor(src, name)
    if (sourceValues.length === 0) continue // unverified — reported after the loop

    verified.add(name)
    const missingInManifest = sourceValues.filter(v => !values.includes(v))
    const missingInSource = values.filter(v => !sourceValues.includes(v))

    if (missingInManifest.length > 0) {
      errors.push(
        `props.${bucket} "${name}": in ${path.basename(codePath)} but not the manifest: ${missingInManifest.join(', ')}`
      )
    }
    if (missingInSource.length > 0) {
      errors.push(
        `props.${bucket} "${name}": in the manifest but not ${path.basename(codePath)}: ${missingInSource.join(', ')}`
      )
    }
  }

  // Any declared enum we never reached is an unchecked claim, even if others compared fine.
  const unchecked = declaredEnums.filter(n => !verified.has(n))
  if (unchecked.length > 0 && errors.length === 0) {
    return unverifiable('not declared via CVA variants or a TypeScript union', unchecked)
  }

  /**
   * Prop names, both directions. The enum check above only sees props that have values, so
   * a prop added to, renamed in or removed from the component would leave the manifest wrong
   * with every gate green. Declared props must appear in the manifest (any bucket, since
   * designOnly props are still documented), and manifest props must exist in the source.
   * A manifest prop that is not declared in the component's own types passes only when it is
   * an HTML attribute the component inherits.
   */
  const declared = declaredPropNames(src)
  // Props typed through VariantProps<typeof x> are the CVA variant names, not written in a type literal.
  for (const block of variantsBlocks) for (const key of topLevelKeys(block)) declared.add(key)
  const inherited = (n: string) =>
    /^(aria|data)-/.test(n) ||
    ['className', 'children', 'style', 'id', 'title', 'disabled', 'onClick', 'type'].includes(n)
  const manifestNames = new Set(
    (['shared', 'designOnly', 'codeOnly'] as const).flatMap(bucket =>
      ((props[bucket] ?? []) as Array<Record<string, unknown>>).map(p => String(p.name))
    )
  )
  const sourceChecked = new Set(checkable.map(({ prop }) => String(prop.name)))

  if (declared.size === 0 && sourceChecked.size > 0) {
    errors.push(
      `cannot verify prop names against ${path.basename(codePath)}: no "type …Props" or "interface …Props" with declared props found`
    )
  } else {
    for (const name of sourceChecked) {
      if (!declared.has(name) && !inherited(name)) {
        errors.push(`props "${name}": in the manifest but not declared in ${path.basename(codePath)}`)
      }
    }
    for (const name of declared) {
      if (!manifestNames.has(name)) {
        errors.push(`props "${name}": declared in ${path.basename(codePath)} but not in the manifest`)
      }
    }
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

/** Map a manifest prop type to an OpenAPI property schema. */
function openApiTypeFor(prop: Record<string, unknown>): Record<string, unknown> {
  const type = String(prop.type)
  const values = Array.isArray(prop.values) ? (prop.values as string[]) : undefined

  switch (type) {
    case 'enum':
      return { type: 'string', ...(values ? { enum: values } : {}) }
    case 'number':
      return { type: 'number' }
    case 'boolean':
      return { type: 'boolean' }
    case 'array':
      return { type: 'array', items: { type: 'string' } }
    case 'object':
      // A props-bag (e.g. iconProps). Its members are the nested component's contract,
      // not this one's, so record the shape without enumerating them here.
      return { type: 'object', additionalProperties: true }
    case 'node':
      return { type: 'string', 'x-code-type': 'node' }
    case 'function':
      // No OpenAPI type covers a callback; record it without asserting a JSON type.
      return { 'x-code-type': 'function' }
    default:
      return { type: 'string' }
  }
}

/**
 * Build the OpenAPI spec for a component from its manifest.
 *
 * The spec is DERIVED, never hand-edited: a hand-written spec drifted from both
 * the manifest and the source within a single PR (inventing `label`/`closeable`,
 * omitting the required `variant`). Edit the manifest and regenerate instead.
 */
function buildOpenApi(manifest: Record<string, unknown>, version: string): Record<string, unknown> {
  const code = (manifest.code ?? {}) as Record<string, unknown>
  const purpose = (manifest.purpose ?? {}) as Record<string, unknown>
  const props = (manifest.props ?? {}) as Record<string, unknown>
  const exportName = String(code.export ?? 'Component')
  const slug =
    String(manifest.id ?? '')
      .split('.')
      .pop() ?? 'component'

  const properties: Record<string, unknown> = {}
  const required: string[] = []

  const buckets: Array<[string, Array<Record<string, unknown>>]> = [
    ['shared', (props.shared ?? []) as Array<Record<string, unknown>>],
    ['designOnly', (props.designOnly ?? []) as Array<Record<string, unknown>>],
    ['codeOnly', (props.codeOnly ?? []) as Array<Record<string, unknown>>]
  ]

  for (const [provenance, list] of buckets) {
    for (const prop of list) {
      const name = String(prop.name)
      const description = prop.codeNote ?? prop.notes
      properties[name] = {
        ...openApiTypeFor(prop),
        ...(prop.default !== undefined ? { default: prop.default } : {}),
        ...(description ? { description: String(description) } : {}),
        'x-provenance': provenance,
        ...(prop.trigger ? { 'x-trigger': String(prop.trigger) } : {}),
        ...(prop.onlyWhen ? { 'x-only-when': prop.onlyWhen } : {}),
        ...(prop.neverWhen ? { 'x-never-when': prop.neverWhen } : {}),
        ...(prop.transform ? { 'x-transform': String(prop.transform) } : {})
      }
      if (prop.required === true) required.push(name)
    }
  }

  const governance = (manifest.governance ?? {}) as Record<string, unknown>
  const rulesDocs = (Array.isArray(governance.rulesDocs) ? governance.rulesDocs : []) as string[]

  return {
    openapi: '3.0.0',
    info: {
      title: `${exportName} Component Skill`,
      description: String(purpose.summary ?? ''),
      version,
      'x-skill-id': manifest.id,
      'x-skill-status': manifest.status,
      'x-skill-package': code.package
    },
    servers: [],
    paths: {
      [`/components/${slug}`]: {
        post: {
          summary: `Create a ${exportName} component`,
          description: `Generate or validate a ${exportName} component instance with specified props`,
          operationId: `create${exportName}`,
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: `#/components/schemas/${exportName}Props` } }
            }
          },
          responses: {
            '200': {
              description: `${exportName} component created successfully`,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      componentId: { type: 'string', description: 'Unique identifier for the instance' },
                      jsx: { type: 'string', description: 'Generated JSX/TSX code' },
                      props: { type: 'object', description: 'Resolved prop values with defaults' }
                    }
                  }
                }
              }
            },
            '400': { description: `Invalid ${exportName} configuration` }
          }
        }
      }
    },
    components: {
      schemas: {
        [`${exportName}Props`]: {
          type: 'object',
          description: `Props for the ${exportName} React component. Generated from the manifest — do not edit by hand.`,
          properties,
          ...(required.length > 0 ? { required } : {}),
          additionalProperties: false
        }
      }
    },
    'x-generated-from': `schemas/${slug}.manifest.json — regenerate with \`pnpm ds-check --write\``,
    'x-tokens': manifest.tokens ?? {},
    'x-accessibility': manifest.accessibility ?? {},
    'x-examples': manifest.examples ?? {},
    'x-known-gaps': manifest.knownGaps ?? [],
    'x-governance': {
      systemRules: rulesDocs.filter(p => p.startsWith('docs/system/')),
      componentRules: rulesDocs.filter(p => !p.startsWith('docs/system/'))
    },
    'x-internal-manifest': `schemas/${slug}.manifest.json`
  }
}

/** Registry version for a skill, so the spec version has a single source. */
function registryVersionFor(manifestId: unknown): string {
  try {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as Record<string, unknown>
    const skills = (Array.isArray(registry.skills) ? registry.skills : []) as Array<Record<string, unknown>>
    const match = skills.find(s => s.id === manifestId)
    if (typeof match?.version === 'string') return match.version
  } catch {
    // Registry problems are reported by validateRegistry; fall through to the default.
  }
  return '1.0.0'
}

/**
 * Serialize generated JSON exactly as Prettier would write it.
 *
 * Without this the generator and Prettier disagree on array wrapping, and a
 * `pnpm format` run would leave the spec permanently "stale" — regenerating
 * reintroduces the diff Prettier just removed, and the check never goes green.
 */
async function formatJson(value: unknown, filepath: string): Promise<string> {
  const raw = JSON.stringify(value, null, 2) + '\n'
  try {
    const config = await prettierResolveConfig(filepath)
    return await prettierFormat(raw, { ...config, filepath, parser: 'json' })
  } catch {
    // Prettier is a dev dependency; fall back to plain JSON rather than failing the run.
    return raw
  }
}

/**
 * Compare the committed OpenAPI spec to what the manifest generates.
 * Regeneration must be a no-op, so a stale spec cannot be committed.
 */
async function validateOpenApiDrift(
  manifest: Record<string, unknown>,
  slug: string,
  write: boolean
): Promise<{ valid: boolean; errors?: string[]; wrote?: boolean }> {
  const specPath = path.resolve(PACKAGE_ROOT, `schemas/${slug}.openapi.json`)
  const expected = await formatJson(buildOpenApi(manifest, registryVersionFor(manifest.id)), specPath)

  if (write) {
    const changed = !fs.existsSync(specPath) || fs.readFileSync(specPath, 'utf-8') !== expected
    if (changed) fs.writeFileSync(specPath, expected)
    return { valid: true, wrote: changed }
  }

  if (!fs.existsSync(specPath)) {
    return { valid: false, errors: [`${slug}.openapi.json is missing; run \`pnpm ds-check --write\``] }
  }

  if (fs.readFileSync(specPath, 'utf-8') !== expected) {
    return {
      valid: false,
      errors: [
        `${slug}.openapi.json is out of date with ${slug}.manifest.json.`,
        `Run \`pnpm ds-check --write\` to regenerate. Do not edit the spec by hand.`
      ]
    }
  }

  return { valid: true }
}

function validateCodeExport(manifest: Record<string, unknown>): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  const code = manifest.code as Record<string, unknown> | undefined
  if (!code?.export) {
    errors.push('code.export is missing')
    return { valid: false, errors }
  }

  const exportName = String(code.export)
  if (!/^[A-Z][A-Za-z0-9]*$/.test(exportName)) {
    errors.push(`code.export must be a valid TypeScript export name (PascalCase): "${exportName}"`)
  }

  if (!code.path) {
    errors.push('code.path is missing')
  }

  if (!code.import) {
    errors.push('code.import is missing')
  }

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

async function runChecks(options: CheckOptions): Promise<void> {
  const schema = await loadSchema()
  const manifests = findManifests()

  let passCount = 0
  let failCount = 0

  if (options.refs) {
    const registryResult = validateRegistry()
    if (registryResult.valid) {
      console.log('✅ registry.json')
    } else {
      console.error('❌ registry.json: validation failed')
      registryResult.errors?.forEach(err => console.error(`   ${err}`))
      failCount++
    }
  }

  if (manifests.length === 0) {
    console.error(`\n❌ No manifests found. Looked in:`)
    MANIFEST_DIRS.forEach(d => console.error(`   ${d}`))
    console.error(`   An empty run is treated as a failure so a misconfigured path cannot pass silently.\n`)
    process.exit(1)
  }

  console.log(`\n🔍 Checking ${manifests.length} manifest(s)...\n`)

  for (const manifestPath of manifests) {
    const componentName = path.basename(manifestPath, '.manifest.json')
    let componentPassed = true

    try {
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
      const manifest = JSON.parse(manifestContent) as Record<string, unknown>

      // Schema validation
      if (options.schema) {
        const schemaResult = validateSchema(manifest, schema)
        if (!schemaResult.valid) {
          console.error(`❌ ${componentName}: Schema validation failed`)
          if (schemaResult.errors) {
            schemaResult.errors.forEach(err => {
              // Without the path and offending key, "must NOT have additional properties" is unactionable
              const at = err.instancePath ? err.instancePath : '(root)'
              const detail = err.params ? ` ${JSON.stringify(err.params)}` : ''
              console.error(`   ${at}: ${err.message}${detail}`)
            })
          }
          componentPassed = false
        }
      }

      // Governance refs validation
      if (options.refs && componentPassed) {
        const refsResult = validateRulesDocs(manifest)
        if (!refsResult.valid) {
          console.error(`❌ ${componentName}: governance.rulesDocs validation failed`)
          if (refsResult.errors) {
            refsResult.errors.forEach(err => console.error(`   ${err}`))
          }
          componentPassed = false
        }
      }

      // Code export validation
      if (options.code && componentPassed) {
        const codeResult = validateCodeExport(manifest)
        if (!codeResult.valid) {
          console.error(`❌ ${componentName}: code validation failed`)
          if (codeResult.errors) {
            codeResult.errors.forEach(err => console.error(`   ${err}`))
          }
          componentPassed = false
        }
      }

      // Manifest enum values vs the component's CVA variants
      if (options.source && componentPassed) {
        const sourceResult = validateSourceProps(manifest)
        if (!sourceResult.valid) {
          console.error(`❌ ${componentName}: source prop validation failed`)
          sourceResult.errors?.forEach(err => console.error(`   ${err}`))
          componentPassed = false
        } else if (sourceResult.skipped && options.verbose) {
          console.log(`   ℹ️  source check skipped: ${sourceResult.skipped}`)
        }

        if (sourceResult.valid) {
          const typeResult = validateConditionalTypes(manifest)
          if (!typeResult.valid) {
            console.error(`❌ ${componentName}: onlyWhen/neverWhen are not enforced by the types`)
            typeResult.errors?.forEach(err => console.error(`   ${err}`))
            componentPassed = false
          }
        }
      }

      // Generated OpenAPI spec must match the manifest
      if (options.generated && componentPassed) {
        const driftResult = await validateOpenApiDrift(manifest, componentName, options.write === true)
        if (!driftResult.valid) {
          console.error(`❌ ${componentName}: generated spec is stale`)
          driftResult.errors?.forEach(err => console.error(`   ${err}`))
          componentPassed = false
        } else if (driftResult.wrote) {
          console.log(`   ✏️  regenerated ${componentName}.openapi.json`)
        }
      }

      if (componentPassed) {
        console.log(`✅ ${componentName}`)
        passCount++
      } else {
        failCount++
      }
    } catch (err) {
      console.error(`❌ ${componentName}: Failed to parse manifest`)
      console.error(`   ${err instanceof Error ? err.message : String(err)}`)
      failCount++
    }
  }

  console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed\n`)

  if (failCount > 0) {
    process.exit(1)
  }
}

// Main entry
const options = parseArgs()
runChecks(options).catch(err => {
  console.error('❌ ds-check failed:', err)
  process.exit(1)
})
