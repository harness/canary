#!/usr/bin/env node
/**
 * ds-check: Validate component manifests and design system contracts
 *
 * Usage:
 *   pnpm ds-check              # Run all checks
 *   pnpm ds-check --schema     # Validate schema structure only
 *   pnpm ds-check --refs       # Check governance.rulesDocs + registry paths exist
 *   pnpm ds-check --code       # Validate code.export against actual exports
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
  verbose?: boolean
}

function parseArgs(): CheckOptions {
  const args = process.argv.slice(2)
  const options: CheckOptions = {}

  // If no flags, run all checks
  if (args.length === 0) {
    options.schema = true
    options.refs = true
    options.code = true
  } else {
    if (args.includes('--schema')) options.schema = true
    if (args.includes('--refs')) options.refs = true
    if (args.includes('--code')) options.code = true
    if (args.includes('--verbose')) options.verbose = true
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
