/**
 * Scaffolds a component or pattern manifest and guide from the contract templates.
 *
 *   node scripts/ds/scaffold-component.ts <Name> --prefix XYZ [--pattern] [--force]
 *
 * Writes src/components/<kebab>/<kebab>.manifest.json and <kebab>.guide.md, or
 * src/patterns/<kebab>/ with --pattern. Unknown values are left as [TK] for a
 * person to fill in.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { parseRegistry } from './lib/registry.ts'
import { REGISTRY_PATH } from './lib/validate.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const CONTRACTS_DIR = join(PACKAGE_ROOT, 'contracts')
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src/components')
const PATTERNS_DIR = join(PACKAGE_ROOT, 'src/patterns')

interface Args {
  name: string
  prefix: string
  pattern: boolean
  force: boolean
}

const USAGE = 'Usage: node scripts/ds/scaffold-component.ts <Name> --prefix XYZ [--pattern] [--force]'

const parseArgs = (argv: string[]): Args | string => {
  const force = argv.includes('--force')
  const pattern = argv.includes('--pattern')
  const prefixIndex = argv.indexOf('--prefix')
  const prefix = prefixIndex >= 0 ? argv[prefixIndex + 1] : undefined
  const name = argv.find((arg, i) => !arg.startsWith('--') && i !== prefixIndex + 1)

  if (!name) return USAGE
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) return `Name must be PascalCase: ${name}`
  if (!prefix) return USAGE
  if (!/^[A-Z]{2,5}$/.test(prefix)) return `Prefix must be 2 to 5 uppercase letters: ${prefix}`
  return { name, prefix, pattern, force }
}

const toKebab = (name: string): string => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const registryProblem = (prefix: string, name: string): string | undefined => {
  const registryFile = relative(PACKAGE_ROOT, REGISTRY_PATH)
  const entry = parseRegistry(readFileSync(REGISTRY_PATH, 'utf8')).entries.get(prefix)
  if (!entry) return `Prefix ${prefix} is not in ${registryFile}. Add a row for ${name} first.`
  if (entry.component !== name) return `Prefix ${prefix} is registered to ${entry.component} in ${registryFile}.`
  return undefined
}

const fill = (template: string, args: Args, kebab: string): string =>
  template
    .replaceAll('{ComponentName}', args.name)
    .replaceAll('{PatternName}', args.name)
    .replaceAll('{component-kebab}', kebab)
    .replaceAll('{pattern-kebab}', kebab)
    .replaceAll('{PREFIX}', args.prefix)

const main = (): number => {
  const args = parseArgs(process.argv.slice(2))
  if (typeof args === 'string') {
    console.error(args)
    return 1
  }

  const problem = registryProblem(args.prefix, args.name)
  if (problem) {
    console.error(problem)
    return 1
  }

  const kebab = toKebab(args.name)

  const dir = join(args.pattern ? PATTERNS_DIR : COMPONENTS_DIR, kebab)
  const kind = args.pattern ? 'pattern.' : ''
  const outputs = [
    { template: `TEMPLATE.${kind}manifest.json`, target: join(dir, `${kebab}.manifest.json`) },
    { template: `TEMPLATE.${kind}guide.md`, target: join(dir, `${kebab}.guide.md`) }
  ]

  const existing = outputs.filter(o => existsSync(o.target))
  if (existing.length > 0 && !args.force) {
    for (const o of existing) console.error(`Exists: ${relative(PACKAGE_ROOT, o.target)} (pass --force to overwrite)`)
    return 1
  }

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log(`Created ${relative(PACKAGE_ROOT, dir)}/${args.pattern ? '' : ' (no component source there yet)'}`)
  }

  for (const o of outputs) {
    writeFileSync(o.target, fill(readFileSync(join(CONTRACTS_DIR, o.template), 'utf8'), args, kebab))
    console.log(`Wrote ${relative(PACKAGE_ROOT, o.target)}`)
  }

  const checklist = args.pattern ? 'PATTERN_CHECKLIST.md' : 'COMPONENT_CHECKLIST.md'
  console.log(`\nReplace every [TK], then run pnpm ds:validate. See contracts/${checklist}.`)
  return 0
}

process.exitCode = main()
