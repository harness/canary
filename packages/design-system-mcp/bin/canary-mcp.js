#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(packageRoot, '../..')
const distEntry = join(packageRoot, 'dist/index.js')
const catalogFile = join(repoRoot, 'packages/ui/catalog/generated/agent/components.json')

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
  } else {
    run('pnpm', ['exec', 'tsc', '-p', packageRoot], packageRoot)
  }
}

if (!existsSync(catalogFile)) {
  run(
    process.execPath,
    [join(repoRoot, 'packages/ui/scripts/compile-agent-catalog.mjs'), '--write'],
    join(repoRoot, 'packages/ui')
  )
}

if (!existsSync(catalogFile)) {
  console.error('Missing agent catalog after compile. Run: pnpm --filter @harnessio/ui catalog:generate')
  process.exit(1)
}

await import(pathToFileURL(distEntry).href)
