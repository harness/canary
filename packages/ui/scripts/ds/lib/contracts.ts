import { existsSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

export type ContractKind = 'component' | 'pattern'

export const CONTRACT_DIRS: Record<ContractKind, string> = {
  component: 'src/components',
  pattern: 'src/patterns'
}

const findManifests = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) return findManifests(path)
        return entry.name.endsWith('.manifest.json') ? [path] : []
      })
    : []

/** Every component and pattern manifest under the package, components first, each group sorted. */
export const findContracts = (packageRoot: string, kinds: ContractKind[] = ['component', 'pattern']): string[] =>
  kinds.flatMap(kind => findManifests(join(packageRoot, CONTRACT_DIRS[kind])).sort())

export const kindOf = (manifest: unknown): ContractKind =>
  (manifest as { kind?: unknown } | null)?.kind === 'pattern' ? 'pattern' : 'component'

export const toKebab = (name: string): string => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const toPascal = (kebab: string): string =>
  kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

/** A pattern's name: the PascalCase form of the last segment of its id, e.g. canary.pattern.execution-status -> ExecutionStatus. */
export const patternName = (id: string): string => toPascal(id.split('.').pop() ?? id)

export const kebabOf = (manifestPath: string): string => basename(manifestPath, '.manifest.json')
