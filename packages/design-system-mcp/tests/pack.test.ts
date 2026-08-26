import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { expect, test } from 'vitest'

import { resolveAgentCatalogDir } from '../src/catalog.js'
import { binPath, catalogDir, packageRoot } from './helpers.js'

test('bundle-agent-catalog copies generated JSON into the package catalog/', () => {
  const bundled = spawnSync(process.execPath, [join(packageRoot, 'scripts/bundle-agent-catalog.mjs')], {
    cwd: packageRoot,
    encoding: 'utf8'
  })

  expect(bundled.status).toBe(0)
  expect(
    spawnSync('git', ['check-ignore', '-q', 'packages/design-system-mcp/catalog/components.json'], {
      cwd: join(packageRoot, '../..')
    }).status
  ).toBe(0)
  expect(resolveAgentCatalogDir({ cwd: packageRoot })).toBe(catalogDir)
})

test('published layout resolves the bundled catalog next to dist/', () => {
  const root = mkdtempSync(join(tmpdir(), 'canary-mcp-pack-'))
  mkdirSync(join(root, 'dist'))
  mkdirSync(join(root, 'catalog'))
  writeFileSync(join(root, 'catalog/components.json'), '{}\n')

  const resolved = resolveAgentCatalogDir({
    cwd: root,
    moduleUrl: pathToFileURL(join(root, 'dist/catalog.js')).href
  })

  expect(resolved).toBe(join(root, 'catalog'))
})

test(
  'npm pack includes dist, bin, and bundled catalog',
  () => {
    const build = spawnSync(process.execPath, [join(packageRoot, 'scripts/bundle-agent-catalog.mjs')], {
      cwd: packageRoot,
      encoding: 'utf8'
    })
    expect(build.status).toBe(0)

    const tsc = spawnSync('pnpm', ['exec', 'tsc', '-p', packageRoot], { cwd: packageRoot, encoding: 'utf8' })
    expect(tsc.status).toBe(0)

    const packed = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: packageRoot,
      encoding: 'utf8'
    })
    expect(packed.status).toBe(0)

    const listing = packed.stdout
    expect(listing).toMatch(/bin\/canary-mcp\.js/)
    expect(listing).toMatch(/dist\/index\.js/)
    expect(listing).toMatch(/catalog\/components\.json/)
    expect(binPath).toMatch(/canary-mcp\.js$/)
  },
  60_000
)
