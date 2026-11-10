#!/usr/bin/env node
// Asserts the lint config gives the expected violation count on each fixture. Run after any
// change to eslint/ds-prototyping.js. Exit 1 on any mismatch.
// Env: DS_ESLINT_ROOT = directory whose node_modules has eslint + plugins.
//      DS_PACKAGE_DIR = built @harnessio/ui package. no-custom-classname needs its Tailwind
//      preset to know which classes exist, so the counts are only valid with it.
const fs = require('fs')
const os = require('os')
const path = require('path')
const root = process.env.DS_ESLINT_ROOT
const pkg = process.env.DS_PACKAGE_DIR
if (!root) throw new Error('Set DS_ESLINT_ROOT to a directory whose node_modules contains eslint and its plugins')
if (!pkg) throw new Error('Set DS_PACKAGE_DIR to a built @harnessio/ui package')
const { ESLint } = require(require.resolve('eslint', { paths: [root] }))

const EXPECTED = {
  'bad.tsx': 16,
  'good.tsx': 0,
  'edge.tsx': 0,
  'bad-geometry.tsx': 4
}

async function main() {
  const dir = path.join(__dirname, 'fixtures')
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-fixtures-'))
  fs.mkdirSync(path.join(scratch, 'node_modules', '@harnessio'), { recursive: true })
  fs.symlinkSync(path.resolve(pkg), path.join(scratch, 'node_modules', '@harnessio', 'ui'))
  const tailwind = path.join(scratch, 'tailwind.config.js')
  fs.writeFileSync(
    tailwind,
    "const preset = require('@harnessio/ui/tailwind-design-system')\nmodule.exports = { presets: [preset.default ?? preset], content: [] }\n"
  )
  const eslint = new ESLint({
    useEslintrc: false,
    ignore: false,
    cwd: dir,
    resolvePluginsRelativeTo: root,
    overrideConfigFile: path.join(__dirname, '..', '..', 'eslint', 'ds-prototyping.js'),
    overrideConfig: { settings: { tailwindcss: { config: tailwind } } }
  })
  const results = await eslint.lintFiles(Object.keys(EXPECTED).map(f => path.join(dir, f)))
  let failed = false
  for (const r of results) {
    const name = path.basename(r.filePath)
    const actual = r.messages.length
    const ok = actual === EXPECTED[name]
    if (!ok) failed = true
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: expected ${EXPECTED[name]}, got ${actual}`)
    if (!ok) for (const m of r.messages) console.log(`       ${m.line}:${m.column} ${m.ruleId} ${m.message.slice(0, 90)}`)
  }
  fs.rmSync(scratch, { recursive: true, force: true })
  if (failed) process.exit(1)
}
main().catch(e => {
  console.error(e.message)
  process.exit(1)
})
