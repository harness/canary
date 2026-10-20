/**
 * Validates every component and pattern manifest and its paired guide.
 *
 *   node scripts/ds/validate-contracts.ts [path/to/x.manifest.json ...]
 *
 * With no arguments it checks every *.manifest.json under src/components and src/patterns.
 * Exits 1 when any unwaived finding remains.
 */

import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

import { findContracts } from './lib/contracts.ts'
import { formatFinding, type Finding } from './lib/findings.ts'
import { validateContract } from './lib/validate.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const REPO_ROOT = resolve(PACKAGE_ROOT, '../..')

const validateFile = (manifestPath: string): Finding[] => {
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const guideRef = (manifest as { governance?: { guide?: unknown } }).governance?.guide
  const guidePath =
    typeof guideRef === 'string'
      ? resolve(dirname(manifestPath), guideRef)
      : manifestPath.replace(/\.manifest\.json$/, '.guide.md')
  return validateContract({
    repoRoot: REPO_ROOT,
    manifestPath,
    manifest,
    guidePath,
    guideSource: readFileSync(guidePath, 'utf8')
  })
}

const main = (): number => {
  const args = process.argv.slice(2)
  const manifests = args.length > 0 ? args.map(arg => resolve(arg)) : findContracts(PACKAGE_ROOT)
  let errors = 0

  for (const manifestPath of manifests) {
    const findings = validateFile(manifestPath)
    const failed = findings.filter(f => f.severity === 'error')
    errors += failed.length
    console.log(`${failed.length === 0 ? 'ok  ' : 'FAIL'} ${relative(REPO_ROOT, manifestPath)}`)
    for (const f of findings) console.log(`  ${formatFinding(f)}`)
  }

  console.log(`\n${manifests.length} contract(s), ${errors} error(s).`)
  return errors > 0 ? 1 : 0
}

process.exitCode = main()
