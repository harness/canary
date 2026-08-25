#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(packageRoot, '../..')
const distEntry = join(packageRoot, 'dist/index.js')
const workspaceCatalog = join(repoRoot, 'packages/ui/catalog/generated/agent/components.json')
const bundledCatalog = join(packageRoot, 'catalog/components.json')
const compiler = join(repoRoot, 'packages/ui/scripts/compile-agent-catalog.mjs')

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' })
  if (result.stdout) process.stderr.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function resolveTsc() {
  const candidates = [join(packageRoot, 'node_modules/.bin/tsc'), join(repoRoot, 'node_modules/.bin/tsc')]
  return candidates.find(existsSync)
}

if (!existsSync(distEntry)) {
  const tsc = resolveTsc()
  if (tsc) {
    run(tsc, ['-p', packageRoot], packageRoot)
  } else if (existsSync(join(packageRoot, 'tsconfig.json'))) {
    run('pnpm', ['exec', 'tsc', '-p', packageRoot], packageRoot)
  } else {
    console.error('Missing dist/. Published packages include dist/; a fresh clone should compile with tsc.')
    process.exit(1)
  }
}

if (!existsSync(workspaceCatalog) && existsSync(compiler)) {
  run(process.execPath, [compiler, '--write'], join(repoRoot, 'packages/ui'))
}

if (!existsSync(workspaceCatalog) && !existsSync(bundledCatalog)) {
  console.error(
    'Missing agent catalog. In this repo run: pnpm --filter @harnessio/ui catalog:generate. Published packages include catalog/ from prepublishOnly.'
  )
  process.exit(1)
}

await import(pathToFileURL(distEntry).href)
