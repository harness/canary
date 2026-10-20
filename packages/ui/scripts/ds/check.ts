/**
 * Runs the contract checks for one component, or for all of them.
 *
 *   node scripts/ds/check.ts test [Component]  run the tests that guide `check: test:` entries name
 *   node scripts/ds/check.ts all [Component]   validator, reference staleness, then those tests
 *
 * Component may be PascalCase (StatusBadge) or kebab-case (status-badge).
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { parseGuide } from './lib/guide.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const REPO_ROOT = resolve(PACKAGE_ROOT, '../..')
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src/components')

const toKebab = (name: string): string => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const findManifests = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return findManifests(path)
    return entry.name.endsWith('.manifest.json') ? [path] : []
  })

const manifestsFor = (component: string | undefined): string[] | string => {
  if (!component) return findManifests(COMPONENTS_DIR).sort()
  const kebab = toKebab(component)
  const path = join(COMPONENTS_DIR, kebab, `${kebab}.manifest.json`)
  return existsSync(path) ? [path] : `No contract for ${component}: ${relative(PACKAGE_ROOT, path)} does not exist.`
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
