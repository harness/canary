#!/usr/bin/env node
// Builds docs/components-index.md: one line per component exported from @harnessio/ui/components.
//
//   node build-component-index.js <path-to-@harnessio/ui> <out.md> [portal-components-docs-dir]
//
// Names come from dist/components.d.ts (the real export list). If a docs directory is given,
// the one-line purpose comes from the matching <kebab-name>.mdx `description:` frontmatter.
// Components with no doc get an empty purpose; the script reports the coverage.
const fs = require('fs')
const path = require('path')

const [pkgDir, outFile, docsDir] = process.argv.slice(2)
if (!pkgDir || !outFile) {
  console.error('usage: build-component-index.js <path-to-@harnessio/ui> <out.md> [docs-dir]')
  process.exit(1)
}

const dts = fs.readFileSync(path.join(pkgDir, 'dist', 'components.d.ts'), 'utf8')
const pkgVersion = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version

const VALUE_DECL = /^(?:export )?declare (?:const|function|class|enum) ([A-Za-z0-9_]+)/gm
const localValues = new Set([...dts.matchAll(VALUE_DECL)].map(m => m[1]))
const exported = new Set([...dts.matchAll(/^export declare (?:const|function|class|enum) ([A-Za-z0-9_]+)/gm)].map(m => m[1]))

// `export { Local as Public }` and `export { Name }`
for (const m of dts.matchAll(/^export \{([^}]*)\}/gm)) {
  for (const part of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
    const [local, , alias] = part.split(/\s+/)
    if (localValues.has(local)) exported.add(alias ?? local)
  }
}

const isComponentName = n => /^[A-Z]/.test(n) && !/^(use|Use)[A-Z]/.test(n)
const names = [...exported].filter(isComponentName).sort()

const kebab = n => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()

const docIndex = new Map()
if (docsDir) {
  const walk = d => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.mdx')) docIndex.set(e.name.replace(/\.mdx$/, ''), p)
    }
  }
  walk(docsDir)
}

const describe = name => {
  const file = docIndex.get(kebab(name))
  if (!file) return ''
  const fm = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  const d = fm && fm[1].match(/^description:\s*(.+)$/m)
  return d ? d[1].replace(/^['"]|['"]$/g, '').replace(/\|/g, '\\|').trim() : ''
}

// Fallback: first sentence of the JSDoc block directly above the declaration in the d.ts.
const jsdoc = name => {
  const re = new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*?)\\*/\\s*(?:export )?declare (?:const|function|class|enum) ${name}\\b`)
  const m = dts.match(re)
  if (!m) return ''
  const text = m[1].split('\n').map(l => l.replace(/^\s*\*\s?/, '')).filter(l => l && !l.startsWith('@') && !l.startsWith('```')).join(' ')
  const first = text.match(/^[^.]*\.?/)
  return (first ? first[0] : '').replace(/\|/g, '\\|').trim()
}

const rows = names.map(n => ({ n, d: describe(n) || jsdoc(n) }))
const withPurpose = rows.filter(r => r.d).length

const body = [
  '# Component index',
  '',
  `Generated from \`@harnessio/ui@${pkgVersion}\` (\`dist/components.d.ts\`). Do not hand-edit; run \`scripts/build-component-index.js\`.`,
  '',
  'Every row is importable from `@harnessio/ui/components`. If what you need is not here, it does not exist: say so, do not hand-roll a lookalike.',
  'Find props and allowed values for a component with one search in `node_modules/@harnessio/ui/dist/components.d.ts` (search `declare const <Name>` or `<Name>Props`); do not read the whole file.',
  '',
  '| Component | Purpose |',
  '|---|---|',
  ...rows.map(r => `| \`${r.n}\` | ${r.d || ''} |`),
  ''
].join('\n')

fs.writeFileSync(outFile, body)
console.log(`${rows.length} components; ${withPurpose} with a purpose line (${Math.round((100 * withPurpose) / rows.length)}%) -> ${outFile}`)
