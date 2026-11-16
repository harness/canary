#!/usr/bin/env node
/**
 * lint-page.mjs — GUARD A. Catch malformed Figma components BEFORE anyone exports.
 *
 * Every rule here exists because it actually broke a shipped asset:
 *  - empty description      -> .playwright shipped with no background (UUI-3963)
 *  - mask child             -> .apple exported as `<mask x="inf" y="inf"/>`, i.e. blank
 *  - white mark on light bg -> .apple/.windows were set to render invisibly
 *  - dot inside the name    -> stray node.js.svg, invalid TS import, typecheck fails
 *
 * This script is intentionally dependency-free and does NOT talk to Figma. The
 * bridge extracts, this judges — so the rules stay unit-testable and this runs
 * from any directory.
 *
 * Usage:
 *   1. Dump the page with figma_execute (snippet in SKILL.md) to a JSON file.
 *   2. node .claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs --in /tmp/page.json
 *
 *   --only <name>   lint just one component (e.g. the one you are about to ship)
 *   --quiet         suppress per-component OK lines
 *
 * Exit 0 = no errors (warnings allowed). Exit 1 = at least one error.
 *
 * Expected JSON shape:
 *   { "page": "brands-to-dev", "type": "logo",
 *     "components": [ { "name": ".github", "type": "COMPONENT", "width": 22, "height": 22,
 *                       "description": "#070709",
 *                       "children": [ { "name": "Vector", "type": "VECTOR", "isMask": false,
 *                                       "fillHex": "#FFFFFF", "fillBound": true } ] } ] }
 */

import { promises as fs } from 'fs'
import path from 'path'

import { lintCollisions, lintComponent } from './lint-rules.mjs'
import { parseArgs } from './names.mjs'

const args = parseArgs(process.argv.slice(2))

async function main() {
  if (!args.in) {
    console.error('\n❌ --in <page.json> is required. See the usage comment at the top of this file.\n')
    process.exit(1)
  }

  const raw = await fs.readFile(path.resolve(args.in), 'utf8')
  const data = JSON.parse(raw)
  const type = data.type === 'icon' || data.type === 'logo' ? data.type : null
  if (!type) {
    console.error(`\n❌ JSON "type" must be "icon" or "logo", got ${JSON.stringify(data.type)}\n`)
    process.exit(1)
  }

  let components = data.components || []
  if (args.only) {
    const want = String(args.only)
    components = components.filter(c => c.name === want || c.name === `.${want}`)
    if (!components.length) {
      console.error(`\n❌ No component named "${args.only}" in ${args.in}\n`)
      process.exit(1)
    }
  }

  console.log(`\nLinting ${components.length} ${type}(s) from page "${data.page}"\n`)

  const results = components.map(c => lintComponent(c, type))
  // Collisions are page-wide, so only meaningful on a full-page lint.
  const collisions = args.only ? [] : lintCollisions(components)

  let errorCount = 0
  let warnCount = 0

  for (const r of results) {
    if (!r.errors.length && !r.warnings.length) {
      if (!args.quiet) console.log(`  ✅ ${r.name}`)
      continue
    }
    console.log(`  ${r.errors.length ? '❌' : '⚠️ '} ${r.name}`)
    for (const e of r.errors) console.log(`       ERROR: ${e}`)
    for (const w of r.warnings) console.log(`       warn:  ${w}`)
    errorCount += r.errors.length
    warnCount += r.warnings.length
  }

  for (const c of collisions) {
    console.log(`  ❌ ${c}`)
    errorCount++
  }

  console.log(
    `\n${errorCount ? '❌' : '✅'} ${errorCount} error(s), ${warnCount} warning(s) across ` +
      `${components.length} component(s)\n`
  )

  if (errorCount) {
    console.log('Fix the errors in Figma before exporting. Warnings are judgement calls.\n')
    process.exit(1)
  }
}

main().catch(err => {
  console.error(`\n❌ ${err.message}\n`)
  process.exit(1)
})
