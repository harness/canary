/**
 * Pre-commit entry point. lint-staged passes the staged paths.
 *
 *   node scripts/ds/check-staged.ts <file ...>
 *
 * Runs `check.ts all <Name>` for each component or pattern with a contract whose folder has a staged file.
 * A staged change to contracts/, scripts/ds/ or agents/ runs the checks for every contract.
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

import { CONTRACT_DIRS } from './lib/contracts.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const SHARED_DIRS = ['contracts', join('scripts', 'ds'), 'agents'].map(dir => join(PACKAGE_ROOT, dir) + sep)

const componentFor = (file: string): string | undefined => {
  for (const dir of Object.values(CONTRACT_DIRS).map(d => join(PACKAGE_ROOT, d))) {
    const rel = relative(dir, file)
    if (rel.startsWith('..')) continue
    const folder = rel.split(sep)[0]
    return existsSync(join(dir, folder, `${folder}.manifest.json`)) ? folder : undefined
  }
  return undefined
}

const check = (component?: string): number =>
  spawnSync('node', ['scripts/ds/check.ts', 'all', ...(component ? [component] : [])], {
    cwd: PACKAGE_ROOT,
    stdio: 'inherit'
  }).status ?? 1

const main = (): number => {
  const files = process.argv.slice(2).map(file => resolve(file))
  if (files.some(file => SHARED_DIRS.some(dir => file.startsWith(dir)))) return check()

  const components = [...new Set(files.map(componentFor).filter((c): c is string => c !== undefined))]
  const failed = components.filter(component => check(component) !== 0)
  return failed.length > 0 ? 1 : 0
}

process.exitCode = main()
