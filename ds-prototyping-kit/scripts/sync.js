#!/usr/bin/env node
// Drift check for the kit. Exits 1 with a reason when either check fails.
//
//   node sync.js <path-to-@harnessio/ui> [canary-repo-root] [--write] [--rules-only]
//
// 1. eslint/rules.js must equal canary's eslint/rules.js (--write copies canary's over it).
// 2. Every component named in the forbidden-elements messages of eslint/ds-prototyping.js
//    must be exported by the installed package.
// --rules-only skips check 2, which needs the package built (dist/components.d.ts).
// canary-repo-root defaults to two levels above this kit (the kit living inside canary).
const fs = require('fs')
const path = require('path')
const { readTypes, componentNames } = require('./lib-exports')

const args = process.argv.slice(2)
const write = args.includes('--write')
const rulesOnly = args.includes('--rules-only')
const [pkgDir, canaryArg] = args.filter(a => !a.startsWith('--'))
if (!pkgDir) {
  console.error('usage: sync.js <path-to-@harnessio/ui> [canary-repo-root] [--write] [--rules-only]')
  process.exit(2)
}

const kitRoot = path.join(__dirname, '..')
const canaryRoot = path.resolve(canaryArg ?? path.join(kitRoot, '..'))
const failures = []

// 1. rules.js drift
const kitRules = path.join(kitRoot, 'eslint', 'rules.js')
const canaryRules = path.join(canaryRoot, 'eslint', 'rules.js')
if (!fs.existsSync(canaryRules)) {
  failures.push(`canary rules not found at ${canaryRules}`)
} else if (fs.readFileSync(kitRules, 'utf8') !== fs.readFileSync(canaryRules, 'utf8')) {
  if (write) {
    fs.copyFileSync(canaryRules, kitRules)
    console.log('eslint/rules.js: copied from canary')
  } else {
    failures.push('eslint/rules.js differs from canary eslint/rules.js (run with --write to copy it)')
  }
} else {
  console.log('eslint/rules.js: matches canary')
}

if (!rulesOnly) {
  // 2. forbidden-elements messages name real components
  const config = require(path.join(kitRoot, 'eslint', 'ds-prototyping.js'))
  const forbid = config.rules['react/forbid-elements'][1].forbid
  const available = new Set(componentNames(readTypes(pkgDir)))
  for (const { element, message } of forbid) {
    const named = message.replace('@harnessio/ui/components', '').match(/\b[A-Z][A-Za-z0-9]+\b/g) ?? []
    const components = named.filter(n => n !== 'Use')
    if (components.length === 0) failures.push(`<${element}>: message names no component`)
    for (const name of components) if (!available.has(name)) failures.push(`<${element}>: message names ${name}, which is not exported by the package`)
  }
  if (!failures.some(f => f.startsWith('<'))) console.log(`forbidden elements: all named components exist (${forbid.length} checked)`)
}

if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL ${f}`)
  process.exit(1)
}
