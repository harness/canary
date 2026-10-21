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

  return { valid: true }
}

/**
 * Resolve a manifest/registry doc path. Paths are package-root-relative
 * (e.g. "docs/system/spacing.md"), except repo-level paths like "apps/portal/...".
 */
function resolveDocPath(docPath: string): string {
  return docPath.startsWith('apps/') ? path.resolve(REPO_ROOT, docPath) : path.resolve(PACKAGE_ROOT, docPath)
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

/** Keys declared directly in an object-literal block, ignoring nested levels. */
function topLevelKeys(block: string): string[] {
  const keys: string[] = []
  let depth = 0
  let atKeyPosition = true

  for (let i = 0; i < block.length; i++) {
    const ch = block[i]

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
    else if (ch === ',' && depth === 0) atKeyPosition = true
    else if (depth === 0 && atKeyPosition && /[\w'"]/.test(ch)) {
      const rest = block.slice(i)
      const m = /^['"]?([\w-]+)['"]?\s*:/.exec(rest)
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
  const cvaIdx = src.indexOf('cva(')
  if (cvaIdx === -1) return { valid: true, skipped: 'component does not use CVA' }

  const variantsIdx = src.indexOf('variants:', cvaIdx)
  const variantsBlock = variantsIdx === -1 ? undefined : extractBlock(src, variantsIdx)
  if (!variantsBlock) return { valid: true, skipped: 'no CVA variants block found' }

  const shared = ((manifest.props as Record<string, unknown>)?.shared ?? []) as Array<Record<string, unknown>>
  let compared = 0

  for (const prop of shared) {
    const name = typeof prop.name === 'string' ? prop.name : undefined
    const values = Array.isArray(prop.values) ? (prop.values as string[]) : undefined
    if (!name || !values) continue

    const keyIdx = new RegExp(`(^|[\\s,{])${name}\\s*:`, 'm').exec(variantsBlock)?.index
    if (keyIdx === undefined) continue // prop is not CVA-driven; nothing to compare

    const propBlock = extractBlock(variantsBlock, keyIdx)
    if (!propBlock) continue

    const sourceValues = topLevelKeys(propBlock)
    if (sourceValues.length === 0) continue

    compared++
    const missingInManifest = sourceValues.filter(v => !values.includes(v))
    const missingInSource = values.filter(v => !sourceValues.includes(v))

    if (missingInManifest.length > 0) {
      errors.push(
        `props.shared "${name}": in ${path.basename(codePath)} but not the manifest: ${missingInManifest.join(', ')}`
      )
    }
    if (missingInSource.length > 0) {
      errors.push(
        `props.shared "${name}": in the manifest but not ${path.basename(codePath)}: ${missingInSource.join(', ')}`
      )
    }
  }

  if (compared === 0) return { valid: true, skipped: 'no CVA-backed enum props to compare' }
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
