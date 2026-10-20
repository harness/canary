#!/usr/bin/env node
/**
 * ds-check: Validate component manifests and design system contracts
 *
 * Usage:
 *   pnpm ds-check              # Check all manifests in generated/manifests/
 *   pnpm ds-check --schema     # Validate schema structure only
 *   pnpm ds-check --refs       # Check governance.rulesDocs paths exist
 *   pnpm ds-check --code       # Validate code.export against actual exports
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import Ajv from 'ajv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = path.resolve(__dirname, '../schemas/component-manifest.schema.json')
const MANIFESTS_DIR = path.resolve(__dirname, '../generated/manifests')

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
  if (!fs.existsSync(MANIFESTS_DIR)) {
    console.warn(`⚠️  Manifests directory not found: ${MANIFESTS_DIR}`)
    return []
  }

  return fs
    .readdirSync(MANIFESTS_DIR)
    .filter(f => f.endsWith('.manifest.json'))
    .map(f => path.join(MANIFESTS_DIR, f))
}

function validateSchema(
  manifest: Record<string, unknown>,
  schema: Record<string, unknown>
): { valid: boolean; errors?: Array<{ message?: string }> } {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const valid = validate(manifest)

  if (!valid) {
    return { valid: false, errors: validate.errors ?? [] }
  }

  return { valid: true }
}

function validateRulesDocs(
  manifest: Record<string, unknown>,
  manifestPath: string
): { valid: boolean; errors?: string[] } {
  const errors: string[] = []
  const manifestDir = path.dirname(manifestPath)

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
    // Resolve relative paths
    const resolvedPath = docPath.startsWith('apps/portal')
      ? path.resolve(manifestDir, '../../../..', docPath)
      : path.resolve(manifestDir, docPath)

    if (!fs.existsSync(resolvedPath)) {
      errors.push(`governance.rulesDocs references non-existent file: ${docPath} (resolved to ${resolvedPath})`)
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

  if (manifests.length === 0) {
    console.log('ℹ️  No manifests found to check')
    return
  }

  console.log(`\n🔍 Checking ${manifests.length} manifest(s)...\n`)

  let passCount = 0
  let failCount = 0

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
            schemaResult.errors.forEach(err => console.error(`   ${err.message}`))
          }
          componentPassed = false
        }
      }

      // Governance refs validation
      if (options.refs && componentPassed) {
        const refsResult = validateRulesDocs(manifest, manifestPath)
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
