#!/usr/bin/env node
// Usage: node lint.js <dir-with-.tsx-files> [tailwind-config-path]
// Prints JSON: { files, total, byRule: { ruleId: count } }. Exit 0 always; read the JSON.
// Env: DS_ESLINT_ROOT = directory whose node_modules has eslint + plugins.
const path = require('path')
const root = process.env.DS_ESLINT_ROOT
if (!root) throw new Error('Set DS_ESLINT_ROOT to a directory whose node_modules contains eslint and its plugins')
const { ESLint } = require(require.resolve('eslint', { paths: [root] }))

async function main() {
  const [dir, tailwindConfig] = process.argv.slice(2)
  const eslint = new ESLint({
    useEslintrc: false,
    ignore: false,
    cwd: path.resolve(dir),
    resolvePluginsRelativeTo: root,
    overrideConfigFile: path.join(__dirname, '..', 'eslint', 'ds-prototyping.js'),
    overrideConfig: tailwindConfig ? { settings: { tailwindcss: { config: path.resolve(tailwindConfig) } } } : {}
  })
  const results = await eslint.lintFiles([path.join(path.resolve(dir), '**/*.{ts,tsx}')])
  const byRule = {}
  let total = 0
  for (const r of results)
    for (const m of r.messages) {
      const key = m.ruleId ?? 'parse-error'
      byRule[key] = (byRule[key] ?? 0) + 1
      total += 1
    }
  console.log(JSON.stringify({ files: results.length, total, byRule }))
}
main().catch(e => {
  console.error(e.message)
  process.exit(1)
})
