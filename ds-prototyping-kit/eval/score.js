#!/usr/bin/env node
// Usage: node score.js [results-dir]. Prints lint violations per prompt, baseline vs kit.
const fs = require('fs')
const path = require('path')
const dir = process.argv[2] ?? path.join(__dirname, 'results')
const read = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }

const conditions = fs.existsSync(dir) ? fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()) : []
const ids = new Set()
const data = {}
for (const c of conditions) {
  data[c] = {}
  for (const id of fs.readdirSync(path.join(dir, c))) {
    ids.add(id)
    const lint = read(path.join(dir, c, id, 'lint.json'))
    const run = read(path.join(dir, c, id, 'run.json'))
    data[c][id] = { total: lint?.total ?? null, byRule: lint?.byRule ?? {}, wrote: lint ? lint.files > 0 : false, cost: run?.total_cost_usd ?? null }
  }
}
const cell = r => (!r ? '-' : r.total === null ? 'lint-error' : !r.wrote ? 'no-file' : String(r.total))
console.log(['prompt', ...conditions].join('\t'))
for (const id of [...ids].sort()) console.log([id, ...conditions.map(c => cell(data[c][id]))].join('\t'))
for (const c of conditions) {
  const rows = Object.values(data[c])
  const scored = rows.filter(r => r.total !== null && r.wrote)
  const clean = scored.filter(r => r.total === 0).length
  console.log(`\n${c}: ${clean}/${scored.length} prompts lint-clean; ${rows.length - scored.length} unscored (no file or lint error)`)
}
