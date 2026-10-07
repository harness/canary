#!/usr/bin/env node
/**
 * parity-check.mjs — proves the replica pipeline in lib.mjs still matches the
 * real `pnpm update:icons` / `pnpm update:logos` output.
 *
 * This is the guardrail that makes the no-PAT Figma-console export path
 * trustworthy. Run it BEFORE processing a brand-new asset.
 *
 * How it works: you export an asset that is ALREADY COMMITTED to the repo out
 * of Figma via the Desktop Bridge, feed the raw SVG in here, and this
 * re-derives it through lib.mjs. If the result is byte-identical to the
 * committed file, the replica is faithful AND the bridge's exportAsync output
 * matches what the Figma REST API returns. If it differs, do not ship from the
 * bridge — fall back to the PAT path.
 *
 * Usage:
 *   # list assets already committed, to pick a fixture that's still on the Figma page
 *   node .claude/skills/publish-ds-asset/scripts/parity-check.mjs --committed --type icon
 *
 *   # the actual check
 *   node .claude/skills/publish-ds-asset/scripts/parity-check.mjs \
 *     --type icon --name check-circle --raw /tmp/raw.svg
 *
 *   node .claude/skills/publish-ds-asset/scripts/parity-check.mjs \
 *     --type logo --name github --hex '#070709' --raw /tmp/raw.svg
 *
 * Exit code 0 = parity holds. Exit code 1 = mismatch or misuse.
 */

import { promises as fs } from 'fs'
import path from 'path'

import {
  PATHS,
  assertRunFromPackagesUi,
  parseArgs,
  parseMapFilenames,
  processIcon,
  processLogo,
  processSymbol,
  readIfExists,
  renderMap
} from './lib.mjs'

const args = parseArgs(process.argv.slice(2))

function fail(msg) {
  console.error(`\n❌ ${msg}\n`)
  process.exit(1)
}

/** Character-level first-divergence report — far more useful than "they differ". */
function describeDiff(expected, actual) {
  const lines = []
  let i = 0
  while (i < expected.length && i < actual.length && expected[i] === actual[i]) i++
  const ctx = 60
  lines.push(`  first divergence at byte ${i} of ${expected.length} (committed) / ${actual.length} (rederived)`)
  lines.push(`  committed : ...${JSON.stringify(expected.slice(Math.max(0, i - ctx), i + ctx))}`)
  lines.push(`  rederived : ...${JSON.stringify(actual.slice(Math.max(0, i - ctx), i + ctx))}`)
  return lines.join('\n')
}

async function listCommitted(type) {
  const kinds = type === 'logo' ? ['logo'] : ['icon']
  const dir = PATHS[kinds[0]].svgDir
  const files = await fs.readdir(dir)
  const names = files.filter(f => f.endsWith('.svg')).map(f => f.replace(/\.svg$/, ''))
  names.sort()
  console.log(`${names.length} committed ${kinds[0]}s in ${dir}:\n`)
  console.log(names.join('\n'))
  console.log(
    `\nPick any one of these, export it via the Desktop Bridge, and pass it back with ` +
      `--name/--raw. Both export pages are permanent catalogues, so every shipped asset is ` +
      `still on its page and usable as a fixture.`
  )
}

/**
 * Map-template parity. Needs no Figma export, so it runs on every invocation.
 *
 * The SVG checks below cover processIcon/processLogo/processSymbol only. This
 * covers the OTHER half of the replica: the LiquidJS templates in
 * `buildTemplate`, the `localeCompare` sort in `sortFilenames`, and the
 * import-line format. Without it, an upstream change to a template or the sort
 * order would pass the SVG check silently, `add-asset.mjs` would insert at the
 * wrong position or in the wrong format, and the next full regen would reorder
 * every entry in the map.
 *
 * Method: take the committed map's own filename list, re-render it through the
 * replica, and require byte-identity. Self-contained — no fixture needed.
 */
async function checkMaps() {
  console.log('Map-template parity (templates + sort order)\n')
  let allOk = true
  for (const kind of ['icon', 'logo', 'symbol']) {
    const mapPath = PATHS[kind].map
    const committed = await readIfExists(mapPath)
    if (committed === null) {
      console.log(`  ⚠️  ${kind}: ${mapPath} not found — skipped`)
      continue
    }
    const filenames = parseMapFilenames(committed, kind)
    if (!filenames.length) {
      console.log(`  ❌ ${kind}: parsed 0 entries from ${mapPath} — the import-line regex no longer matches`)
      allOk = false
      continue
    }
    const rerendered = await renderMap(filenames, kind)
    if (rerendered === committed) {
      console.log(`  ✅ ${kind}: ${filenames.length} entries re-render byte-identically`)
    } else {
      console.log(`  ❌ ${kind}: MISMATCH re-rendering ${mapPath} (${filenames.length} entries)`)
      console.log(describeDiff(committed, rerendered))
      allOk = false
    }
  }
  if (!allOk) {
    console.error(
      `\n❌ The name-map replica has DRIFTED from the committed maps.\n\n` +
        `  Do not run add-asset.mjs — it would insert at the wrong position or in the wrong\n` +
        `  format, and the next full regen would reorder every entry.\n\n` +
        `  Mirror the current template and sort from packages/ui/scripts/{icons,logos}.js into\n` +
        `  lib.mjs (buildTemplate / sortFilenames), then re-run this check.\n`
    )
  }
  return allOk
}

async function compare(label, committedPath, rederived) {
  const committed = await readIfExists(committedPath)
  if (committed === null) {
    fail(`No committed file to compare against at ${committedPath}. Pick a different fixture.`)
  }
  if (committed === rederived) {
    console.log(`  ✅ ${label}: byte-identical (${committed.length} bytes) — ${committedPath}`)
    return true
  }
  console.log(`  ❌ ${label}: MISMATCH — ${committedPath}`)
  console.log(describeDiff(committed, rederived))
  return false
}

async function main() {
  await assertRunFromPackagesUi()

  // Map-template parity needs no fixture, so it runs first and always. It is
  // the only guard on the template/sort half of the replica.
  if (args.maps) {
    console.log('')
    process.exit((await checkMaps()) ? 0 : 1)
  }

  const type = args.type
  if (type !== 'icon' && type !== 'logo') {
    fail('--type must be "icon" or "logo"')
  }

  if (args.committed) {
    await listCommitted(type)
    return
  }

  if (!args.name || !args.raw) {
    fail('Both --name and --raw are required. See the usage comment at the top of this file.')
  }

  const raw = await readIfExists(path.resolve(args.raw))
  if (raw === null) fail(`Raw SVG not found: ${args.raw}`)

  console.log('')
  const mapsOk = await checkMaps()

  const filename = `${args.name}.svg`
  console.log(`\nSVG-pipeline parity — ${type} "${args.name}"`)
  console.log(`  raw export: ${args.raw} (${raw.length} bytes)\n`)

  const results = [mapsOk]

  if (type === 'icon') {
    results.push(await compare('icon', path.join(PATHS.icon.svgDir, filename), processIcon(raw)))
  } else {
    if (!args.hex) {
      fail(
        'Logos need --hex (the brand hex from the Figma component description). ' +
          'Without it the background rect is omitted and the comparison is meaningless.'
      )
    }
    results.push(await compare('logo', path.join(PATHS.logo.svgDir, filename), processLogo(raw, args.hex)))
    results.push(await compare('symbol', path.join(PATHS.symbol.svgDir, filename), processSymbol(raw)))
  }

  if (results.every(Boolean)) {
    console.log(
      `\n✅ Parity holds. The replica pipeline and the bridge export both match ` +
        `the committed output — safe to process a new ${type} this way.\n`
    )
  } else {
    console.error(
      `\n❌ Parity FAILED. Do not ship a new ${type} through the Figma-console path.\n\n` +
        `Likely causes, in order of likelihood:\n` +
        `  1. exportAsync settings differ from the Figma REST API defaults. The bridge\n` +
        `     call must use { format: 'SVG', svgOutlineText: true, svgIdAttribute: false,\n` +
        `     svgSimplifyStroke: true }.\n` +
        `  2. The committed file predates a change to packages/ui/scripts/${type}s.js —\n` +
        `     check its git log, then mirror any change into lib.mjs.\n` +
        `  3. The fixture was edited in Figma since it was exported, so the committed\n` +
        `     file is genuinely stale. Try a different fixture before concluding anything.\n\n` +
        `Fall back to the PAT path (pnpm update:${type}s) until this passes.\n`
    )
    process.exit(1)
  }
}

main().catch(err => fail(err.message))
