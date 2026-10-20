/**
 * Runs the contract checks for one component or pattern, or for all of them.
 *
 *   node scripts/ds/check.ts test [Component]  run the tests that guide `check: test:` entries name
 *   node scripts/ds/check.ts all [Component]   validator, reference staleness, then those tests
 *
 * Component may be PascalCase (StatusBadge) or kebab-case (status-badge). A pattern name works the same way.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { CONTRACT_DIRS, findContracts, toKebab } from './lib/contracts.ts'
import { parseGuide } from './lib/guide.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const REPO_ROOT = resolve(PACKAGE_ROOT, '../..')

const manifestsFor = (component: string | undefined): string[] | string => {
  if (!component) return findContracts(PACKAGE_ROOT)
  const kebab = toKebab(component)
  const paths = Object.values(CONTRACT_DIRS).map(dir => join(PACKAGE_ROOT, dir, kebab, `${kebab}.manifest.json`))
  const found = paths.filter(path => existsSync(path))
  if (found.length > 0) return found
  return `No contract for ${component}: neither ${paths.map(path => relative(PACKAGE_ROOT, path)).join(' nor ')} exists.`
}

interface TestTarget {
  file: string
  name: string
}

const testTargets = (manifestPath: string): TestTarget[] => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { governance: { guide: string } }
  const guide = parseGuide(readFileSync(resolve(dirname(manifestPath), manifest.governance.guide), 'utf8'))
  const rules = (guide.frontMatter as { rules?: { check?: string | string[] }[] }).rules ?? []
  return rules
    .flatMap(rule => (rule.check === undefined ? [] : Array.isArray(rule.check) ? rule.check : [rule.check]))
    .filter(check => check.startsWith('test:'))
    .map(check => {
      const [file, ...name] = check.slice('test:'.length).split('#')
      return { file: resolve(REPO_ROOT, file), name: name.join('#') }
    })
}

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const run = (command: string, args: string[]): number => {
  console.log(`\n$ ${command} ${args.join(' ')}`)
  return spawnSync(command, args, { cwd: PACKAGE_ROOT, stdio: 'inherit' }).status ?? 1
}

const runTests = (manifests: string[]): number => {
  const targets = manifests.flatMap(testTargets)
  if (targets.length === 0) {
    console.log('No `test:` checks named in the selected guides.')
    return 0
  }
  const files = [...new Set(targets.map(t => relative(PACKAGE_ROOT, t.file)))]
  const pattern = `^.*(${targets.map(t => escapeRegExp(t.name)).join('|')})$`
  return run('pnpm', ['exec', 'vitest', '--run', ...files, '-t', pattern])
}

const main = (): number => {
  const [mode, component] = process.argv.slice(2)
  if (mode !== 'test' && mode !== 'all') {
    console.error('Usage: node scripts/ds/check.ts <test|all> [Component]')
    return 1
  }
  const manifests = manifestsFor(component)
  if (typeof manifests === 'string') {
    console.error(manifests)
    return 1
  }
  if (mode === 'test') return runTests(manifests)

  const results = [
    run('node', ['scripts/ds/validate-contracts.ts', ...manifests.map(m => relative(PACKAGE_ROOT, m))]),
    run('node', ['scripts/ds/generate-references.ts', '--check']),
    runTests(manifests)
  ]
  return results.some(status => status !== 0) ? 1 : 0
}

process.exitCode = main()
