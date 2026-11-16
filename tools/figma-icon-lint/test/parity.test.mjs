// Runs the shared rules through both entry points (library + CLI) and asserts they agree.
import assert from 'assert'
import { spawnSync } from 'child_process'
import { mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import { lintPage } from '../../../.claude/skills/publish-ds-icon-logo/scripts/lint-rules.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const cli = path.resolve(here, '../../../.claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs')
const logo = (name, over = {}) => ({
  name, type: 'COMPONENT', width: 22, height: 22, description: '#123456',
  children: [{ name: 'Vector', type: 'VECTOR', isMask: false, fillHex: '#FFFFFF', fillType: 'SOLID', fillBound: true }],
  ...over
})

const cases = [
  { label: 'clean', comps: [logo('.good')], errors: 0 },
  { label: 'empty description', comps: [logo('.bad', { description: '' })], errors: 1 },
  { label: 'filename collision', comps: [logo('.dup-a'), logo('.dup_a')], errors: 1 },
  { label: 'gradient fill', comps: [logo('.grad', { children: [{ name: 'V', type: 'VECTOR', isMask: false, fillHex: '#FFFFFF', fillType: 'GRADIENT_LINEAR', fillBound: true }] })], errors: 1 }
]

const dir = mkdtempSync(path.join(tmpdir(), 'lint-'))
for (const c of cases) {
  const data = { page: 'brands-to-dev', type: 'logo', components: c.comps }
  const lib = lintPage(data)
  assert.strictEqual(lib.errorCount, c.errors, `${c.label}: library error count`)
  const f = path.join(dir, 'p.json')
  writeFileSync(f, JSON.stringify(data))
  const r = spawnSync('node', [cli, '--in', f, '--quiet'], { encoding: 'utf8' })
  assert.strictEqual(r.status === 0, c.errors === 0, `${c.label}: CLI exit code`)
  assert(r.stdout.includes(`${c.errors} error(s)`), `${c.label}: CLI reports same count`)
}

// shipped-name warning appears only when shippedNames is passed (selection mode in the plugin)
const warn = lintPage({ page: 'brands-to-dev', type: 'logo', components: [logo('.slack')] }, { shippedNames: new Set(['slack']) })
assert.strictEqual(warn.warnCount, 1)
assert.strictEqual(lintPage({ page: 'brands-to-dev', type: 'logo', components: [logo('.slack')] }).warnCount, 0)

console.log(`✅ ${cases.length} parity cases + shipped-name check passed`)
