/**
 * Scaffolds a component manifest and guide from the contract templates.
 *
 *   node scripts/ds/scaffold-component.ts <ComponentName> --prefix XYZ [--force]
 *
 * Writes src/components/<kebab>/<kebab>.manifest.json and <kebab>.guide.md.
 * Unknown values are left as [TK] for a person to fill in.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { parseRegistry } from './lib/registry.ts'
import { REGISTRY_PATH } from './lib/validate.ts'

const PACKAGE_ROOT = resolve(import.meta.dirname, '../..')
const CONTRACTS_DIR = join(PACKAGE_ROOT, 'contracts')
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src/components')

interface Args {
  name: string
  prefix: string
  force: boolean
}

const USAGE = 'Usage: node scripts/ds/scaffold-component.ts <ComponentName> --prefix XYZ [--force]'

const parseArgs = (argv: string[]): Args | string => {
  const force = argv.includes('--force')
  const prefixIndex = argv.indexOf('--prefix')
  const prefix = prefixIndex >= 0 ? argv[prefixIndex + 1] : undefined
  const name = argv.find((arg, i) => !arg.startsWith('--') && i !== prefixIndex + 1)

  if (!name) return USAGE
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) return `Component name must be PascalCase: ${name}`
  if (!prefix) return USAGE
  if (!/^[A-Z]{2,5}$/.test(prefix)) return `Prefix must be 2 to 5 uppercase letters: ${prefix}`
  return { name, prefix, force }
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
    .replaceAll('{component-kebab}', kebab)
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

  const dir = join(COMPONENTS_DIR, kebab)
  const outputs = [
    { template: 'TEMPLATE.manifest.json', target: join(dir, `${kebab}.manifest.json`) },
    { template: 'TEMPLATE.guide.md', target: join(dir, `${kebab}.guide.md`) }
  ]

  const existing = outputs.filter(o => existsSync(o.target))
  if (existing.length > 0 && !args.force) {
    for (const o of existing) console.error(`Exists: ${relative(PACKAGE_ROOT, o.target)} (pass --force to overwrite)`)
    return 1
  }

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log(`Created ${relative(PACKAGE_ROOT, dir)}/ (no component source there yet)`)
  }

  for (const o of outputs) {
    writeFileSync(o.target, fill(readFileSync(join(CONTRACTS_DIR, o.template), 'utf8'), args, kebab))
    console.log(`Wrote ${relative(PACKAGE_ROOT, o.target)}`)
  }

  console.log('\nReplace every [TK], then run pnpm ds:validate. See contracts/COMPONENT_CHECKLIST.md.')
  return 0
}

process.exitCode = main()
