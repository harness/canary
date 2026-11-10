import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = resolve(__dirname, '../../../..')
const pkgDir = resolve(__dirname, '../..')
const sync = resolve(repoRoot, 'ds-prototyping-kit/scripts/sync.js')

const hasDist = existsSync(resolve(pkgDir, 'dist/components.d.ts'))
// Set DS_KIT_REQUIRE_DIST=1 in a pipeline that builds first, so a missing build fails instead of skipping.
const requireDist = process.env.DS_KIT_REQUIRE_DIST === '1'

function runSync(...flags: string[]): { ok: boolean; output: string } {
  try {
    const output = execFileSync('node', [sync, pkgDir, repoRoot, ...flags], { encoding: 'utf8', stdio: 'pipe' })
    return { ok: true, output }
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string }
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` }
  }
}

describe('ds-prototyping-kit drift', () => {
  it('eslint/rules.js matches the canary copy', () => {
    const result = runSync('--rules-only')
    expect(result.output).toContain('eslint/rules.js: matches canary')
    expect(result.ok).toBe(true)
  })

  it.skipIf(!hasDist && !requireDist)('forbidden-element messages name components the package exports', () => {
    const result = runSync()
    expect(result.output).toContain('forbidden elements: all named components exist')
    expect(result.ok).toBe(true)
  })
})
