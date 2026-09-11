import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

test('guidance selects marked examples independently of page order and rejects ambiguous markers', () => {
  const fixture = mkdtempSync(resolve(tmpdir(), 'canary-guidance-markers-'))
  try {
    for (const path of [
      'packages/ui/package.json',
      'packages/ui/scripts/build-agent-guidance.mjs',
      'packages/ui/src/components/button.tsx',
      'packages/ui/src/components/inputs/text-input.tsx',
      'packages/ui/src/components/form-primitives/select.tsx',
      'apps/portal/src/content/docs/design-system/usage.mdx',
      'apps/portal/src/content/docs/components/actions/button.mdx',
      'apps/portal/src/content/docs/components/form/text-input.mdx',
      'apps/portal/src/content/docs/components/form/select.mdx'
    ])
      cpSync(resolve(root, path), resolve(fixture, path), { recursive: true })
    const script = resolve(fixture, 'packages/ui/scripts/build-agent-guidance.mjs')
    const output = resolve(fixture, 'packages/ui/agent/examples/Select.tsx')
    execFileSync(process.execPath, [script])
    const expected = readFileSync(output, 'utf8')
    const page = resolve(fixture, 'apps/portal/src/content/docs/components/form/select.mdx')
    const original = readFileSync(page, 'utf8')
    const unrelated = '<DocsPage.ComponentExample code={`<span>${unrelated}</span>`} />\n\n'
    writeFileSync(page, unrelated + original)
    execFileSync(process.execPath, [script])
    assert.equal(readFileSync(output, 'utf8'), expected)
    for (const changed of [
      original.replace('{/* agent-example:start */}', ''),
      original + '\n{/* agent-example:start */}',
      original
        .replace('{/* agent-example:start */}', '{/* agent-example:end */}')
        .replace('{/* agent-example:end */}\n\n## Usage', '{/* agent-example:start */}\n\n## Usage')
    ]) {
      writeFileSync(page, changed)
      const result = spawnSync(process.execPath, [script], { encoding: 'utf8' })
      assert.notEqual(result.status, 0)
      assert.match(result.stderr, /marker pair|Unsupported example/)
      assert.equal(readFileSync(output, 'utf8'), expected)
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
