#!/usr/bin/env node
/**
 * check-regressions.mjs — GUARD B. Catch silent damage AFTER an export.
 *
 * Guard A (lint-page.mjs) checks Figma before you export. This checks the repo
 * after, and catches regressions A cannot see: a hand-patched asset being
 * clobbered, an asset vanishing from a map, theming being lost.
 *
 * Run it after `pnpm update:icons` / `pnpm update:logos`, and before committing.
 * Essential on the PAT route, which regenerates all 534 icons / 181 logos.
 *
 * Usage (from packages/ui):
 *   node ../../.claude/skills/publish-ds-asset/scripts/check-regressions.mjs
 *   node ../../.claude/skills/publish-ds-asset/scripts/check-regressions.mjs --ref origin/main
 *
 *   --ref <git-ref>  baseline to compare against (default HEAD)
 *   --expect <name>  the one asset you intend to add; anything else new is an error
 *
 * Exit 0 = clean. Exit 1 = regression detected.
 */

import { execFileSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

import { PATHS, assertRunFromPackagesUi, parseArgs, parseMapFilenames, readIfExists } from './lib.mjs'

const args = parseArgs(process.argv.slice(2))
const REF = args.ref ? String(args.ref) : 'HEAD'

const errors = []
const warnings = []
const info = []

/** Read a path as it exists at a git ref. Returns null if absent there. */
function gitShow(relPath) {
  try {
    return execFileSync('git', ['show', `${REF}:./${relPath}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 32 * 1024 * 1024
    })
  } catch {
    return null
  }
}

const hasBackgroundRect = svg => /<rect[^>]*rx="3"[^>]*ry="3"[^>]*fill="#/.test(svg)
const hasCurrentColor = svg => svg.includes('currentColor')
const transformOf = svg => (svg.match(/transform="([^"]*)"/) || [])[1] || null

async function checkKind(kind) {
  const { svgDir, map } = PATHS[kind]

  const mapTree = await readIfExists(map)
  if (mapTree === null) {
    errors.push(`${map} is missing from the working tree`)
    return
  }
  const mapRef = gitShow(map)
  if (mapRef === null) {
    warnings.push(`${map} does not exist at ${REF} — skipping ${kind} comparison`)
    return
  }

  const liveRef = new Set(parseMapFilenames(mapRef, kind))
  const liveTree = new Set(parseMapFilenames(mapTree, kind))

  // Documented failure mode: an asset silently drops out of the regenerated map.
  for (const f of liveRef) {
    if (!liveTree.has(f)) {
      errors.push(
        `${kind}: "${f}" was in ${map} at ${REF} but is GONE now. The regenerated map dropped ` +
          `it — most likely it was removed from the Figma export page. Consumers using it will ` +
          `break. Restore it unless the removal is intentional`
      )
    }
  }

  for (const f of liveTree) {
    if (liveRef.has(f)) continue
    if (args.expect && f === `${args.expect}.svg`) {
      info.push(`${kind}: "${f}" added (expected)`)
    } else {
      errors.push(
        `${kind}: "${f}" is NEW and unexpected. Someone else's in-progress asset was picked up ` +
          `by the regen. Remove it and its map entry — publish one asset per PR` +
          (args.expect ? ` (you declared --expect ${args.expect})` : '')
      )
    }
  }

  // Content regressions on assets that are live in BOTH revisions.
  for (const f of liveTree) {
    if (!liveRef.has(f)) continue

    const rel = path.join(svgDir, f)
    const tree = await readIfExists(rel)
    if (tree === null) {
      errors.push(`${kind}: "${f}" is in ${map} but ${rel} does not exist on disk`)
      continue
    }
    const ref = gitShow(rel)
    if (ref === null || ref === tree) continue

    if (kind === 'logo' && hasBackgroundRect(ref) && !hasBackgroundRect(tree)) {
      errors.push(
        `${kind}: "${f}" LOST its background rect. Its Figma component description is probably ` +
          `empty — the logo will render as a broken-looking blank. This is the UUI-3963 failure`
      )
    }
    if (hasCurrentColor(ref) && !hasCurrentColor(tree)) {
      errors.push(
        `${kind}: "${f}" LOST its currentColor theming — it will no longer adapt to light/dark`
      )
    }

    const [tRef, tTree] = [transformOf(ref), transformOf(tree)]
    if (tRef && tTree && tRef !== tTree) {
      warnings.push(
        `${kind}: "${f}" transform changed\n         was: ${tRef}\n         now: ${tTree}\n` +
          `         If "was" is not the script's standard output it was hand-patched, and the ` +
          `regen has just reverted that patch`
      )
    }

    const shrink = 1 - tree.length / ref.length
    if (shrink > 0.4) {
      warnings.push(
        `${kind}: "${f}" shrank ${Math.round(shrink * 100)}% (${ref.length} -> ${tree.length} ` +
          `bytes) — possible geometry loss`
      )
    }
  }
}

async function main() {
  await assertRunFromPackagesUi()

  // Fail loudly rather than silently comparing against nothing.
  try {
    execFileSync('git', ['rev-parse', '--verify', REF], { stdio: 'ignore' })
  } catch {
    console.error(`\n❌ Not a valid git ref: ${REF}\n`)
    process.exit(1)
  }

  console.log(`\nChecking for regressions against ${REF}\n`)

  for (const kind of ['icon', 'logo', 'symbol']) await checkKind(kind)

  for (const i of info) console.log(`  ✅ ${i}`)
  for (const w of warnings) console.log(`  ⚠️  ${w}`)
  for (const e of errors) console.log(`  ❌ ${e}`)

  if (!errors.length && !warnings.length && !info.length) {
    console.log('  ✅ no asset changes detected')
  }

  console.log(`\n${errors.length ? '❌' : '✅'} ${errors.length} error(s), ${warnings.length} warning(s)\n`)

  if (errors.length) {
    console.log(
      'Do not commit. Restore the affected files from the baseline and re-add only your own ' +
        'asset:\n  git checkout ' + REF + ' -- packages/ui/src/components/<logo-v2|icon-v2>\n'
    )
    process.exit(1)
  }
}

main().catch(err => {
  console.error(`\n❌ ${err.message}\n`)
  process.exit(1)
})
