#!/usr/bin/env node
/**
 * bump-ui-version.mjs — bump the MINOR version of @harnessio/ui for an asset PR.
 *
 * Publishing an icon/logo changes the shipped package, so the version has to
 * move. The bump is relative to the BASE branch (origin/main by default), not
 * to whatever is on the working tree, which makes it idempotent: running it
 * twice on the same branch leaves 1.7.1 -> 1.8.0, not 1.9.0. If main moves
 * ahead while the PR is open, re-run it after rebasing and it re-bases the bump.
 *
 *   1.7.1 on main  ->  1.8.0   (minor + 1, patch reset to 0)
 *
 * Only the "version" line is rewritten, in place, so the rest of package.json
 * keeps its exact formatting.
 *
 * Usage (from anywhere in the repo):
 *   node .claude/skills/publish-ds-icon-logo/scripts/bump-ui-version.mjs
 *   node .../bump-ui-version.mjs --base origin/main
 *   node .../bump-ui-version.mjs --check     # exit 1 if not yet bumped, change nothing
 *
 * Exit 0 = bumped or already correct. Exit 1 = --check found it unbumped, or an error.
 */

import { execFileSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

import { parseArgs } from './names.mjs'

const args = parseArgs(process.argv.slice(2))
const base = typeof args.base === 'string' ? args.base : 'origin/main'
const PKG_REL = 'packages/ui/package.json'
const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

function fail(msg) {
  console.error(`✖ ${msg}`)
  process.exit(1)
}

const root = git('rev-parse', '--show-toplevel')
const pkgPath = path.join(root, PKG_REL)

let baseVersion
try {
  baseVersion = JSON.parse(git('show', `${base}:${PKG_REL}`)).version
} catch (e) {
  fail(`Could not read ${PKG_REL} from ${base}. Run \`git fetch origin\` (VPN needed) or pass --base. ${e.message}`)
}

const m = SEMVER.exec(baseVersion ?? '')
if (!m) fail(`Version "${baseVersion}" on ${base} is not plain MAJOR.MINOR.PATCH; bump it by hand.`)
const target = `${m[1]}.${Number(m[2]) + 1}.0`

const raw = await fs.readFile(pkgPath, 'utf8')
const current = JSON.parse(raw).version

if (current === target) {
  console.log(`✔ @harnessio/ui already at ${target} (${base} is ${baseVersion}). Nothing to do.`)
  process.exit(0)
}

if (args.check) {
  console.error(`✖ @harnessio/ui is ${current}; expected ${target} (minor bump of ${base} ${baseVersion}).`)
  process.exit(1)
}

const VERSION_LINE = /^(\s*"version"\s*:\s*")[^"]+(")/m
if (!VERSION_LINE.test(raw)) fail(`No "version" line found in ${PKG_REL}.`)
await fs.writeFile(pkgPath, raw.replace(VERSION_LINE, `$1${target}$2`))

console.log(`✔ @harnessio/ui ${current} -> ${target} (minor bump of ${base} ${baseVersion})`)
console.log(`  Stage it with the asset: git add ${PKG_REL}`)
