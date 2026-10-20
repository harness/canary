/**
 * Pre-commit entry point. lint-staged passes the staged paths.
 *
 *   node scripts/ds/check-staged.ts <file ...>
 *
 * Runs `check.ts all <Component>` for each component with a contract whose folder has a staged file.
 * A staged change to contracts/, scripts/ds/ or agents/ runs the checks for every contract.
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src/components')
const SHARED_DIRS = ['contracts', join('scripts', 'ds'), 'agents'].map(dir => join(PACKAGE_ROOT, dir) + sep)

const componentFor = (file: string): string | undefined => {
  const rel = relative(COMPONENTS_DIR, file)
  if (rel.startsWith('..')) return undefined
  const folder = rel.split(sep)[0]
  return existsSync(join(COMPONENTS_DIR, folder, `${folder}.manifest.json`)) ? folder : undefined
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
