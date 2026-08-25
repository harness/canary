#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function bundleAgentCatalog({ packageRoot, sourceDir }) {
  const source = sourceDir ?? join(packageRoot, '../ui/catalog/generated/agent')
  const dest = join(packageRoot, 'catalog')
  const components = join(source, 'components.json')

  if (!existsSync(components)) {
    throw new Error(`Missing generated agent catalog at ${source}. Run: pnpm --filter @harnessio/ui catalog:generate`)
  }

  mkdirSync(dest, { recursive: true })
  for (const name of readdirSync(source)) {
    if (!name.endsWith('.json')) continue
    cpSync(join(source, name), join(dest, name))
  }

  return dest
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isCli) {
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const dest = bundleAgentCatalog({ packageRoot })
  console.error(`Bundled agent catalog into ${dest}`)
}
