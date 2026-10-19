#!/usr/bin/env node
/**
 * check-typecheck.mjs — prove a typecheck failure is pre-existing, not yours.
 *
 * packages/ui typechecks with `tsc -b` (build mode), which compiles referenced
 * sibling projects. In a fresh git worktree those siblings are unbuilt, so
 * typecheck fails with errors like `Cannot find module '@harnessio/yaml-editor'`
 * that have nothing to do with the asset you just added. Chasing them wastes
 * time; the playbook's manual fix is to stash your change, re-run against
 * pristine main, and compare. This script does exactly that, safely.
 *
 * What it does:
 *   1. Run `pnpm typecheck` WITH your change. If it passes, stop — nothing to prove.
 *   2. If it fails, stash ONLY the asset paths (tracked edits + untracked SVGs),
 *      re-run typecheck against the now-pristine tree, then restore your stash.
 *   3. Diff the actual `error TS…` signatures. Errors present in BOTH runs are
 *      pre-existing and not yours; errors only in the WITH-change run are.
 *
 * It never fixes anything and never leaves your change stashed: the pop runs in a
 * finally, and it refuses to pop a stash that is not the one it pushed.
 *
 * Usage (from packages/ui):
 *   node ../../.claude/skills/publish-ds-asset/scripts/check-typecheck.mjs
 *   node ../../.claude/skills/publish-ds-asset/scripts/check-typecheck.mjs --type icon
 *
 *   --type icon|logo  only isolate that family's component dir (default: both)
 *
 * Exit 0 = typecheck passes, or every failure is pre-existing.
 * Exit 1 = your change introduces at least one new error (or it can't be isolated).
 *
 * NOTE: runs `pnpm typecheck` up to twice; `tsc -b` can take a minute or two each.
 */

import { execFileSync } from 'child_process'
import path from 'path'

import { PATHS, assertRunFromPackagesUi, parseArgs } from './lib.mjs'

const args = parseArgs(process.argv.slice(2))
const STASH_MSG = 'publish-ds-asset:check-typecheck'

/** The component directory a family lives in, e.g. src/components/icon-v2. */
function componentDirs() {
  const forType = t => path.dirname(PATHS[t].map)
  if (args.type === 'icon') return [forType('icon')]
  if (args.type === 'logo') return [...new Set([forType('logo'), forType('symbol')])]
  if (args.type) {
    console.error(`\n❌ --type must be "icon" or "logo", got ${JSON.stringify(args.type)}\n`)
    process.exit(1)
  }
  // No --type: isolate both families. A clean dir in the pathspec is harmless.
  return [...new Set([forType('icon'), forType('logo'), forType('symbol')])]
}

/** Run the package typecheck, capturing output whether it passes or fails. */
function runTypecheck() {
  try {
    const output = execFileSync('pnpm', ['typecheck'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024
    })
    return { code: 0, output }
  } catch (e) {
    // tsc exits non-zero on errors; execFileSync throws but still carries output.
    return { code: e.status ?? 1, output: `${e.stdout || ''}${e.stderr || ''}` }
  }
}

const parseErrors = output =>
  output
    .split('\n')
    .map(l => l.trim())
    .filter(l => /error TS\d+/.test(l))

/** Errors in `withErrs` that are not accounted for in `baseErrs` (multiset diff). */
function novelErrors(withErrs, baseErrs) {
  const counts = new Map()
  for (const e of baseErrs) counts.set(e, (counts.get(e) || 0) + 1)
  const novel = []
  for (const e of withErrs) {
    const n = counts.get(e) || 0
    if (n > 0) counts.set(e, n - 1)
    else novel.push(e)
  }
  return novel
}

function git(gitArgs, opts = {}) {
  return execFileSync('git', gitArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts })
}

function hasChanges(dirs) {
  return git(['status', '--porcelain', '--', ...dirs]).trim().length > 0
}

async function main() {
  await assertRunFromPackagesUi()

  const dirs = componentDirs()

  console.log('\nRunning typecheck WITH your change (tsc -b, this can take a minute)…\n')
  const withRun = runTypecheck()

  if (withRun.code === 0) {
    console.log('✅ typecheck passes with your change — nothing to prove.\n')
    return
  }

  const withErrs = parseErrors(withRun.output)
  console.log(`❌ typecheck failed with your change — ${withErrs.length} error line(s).\n`)

  if (!hasChanges(dirs)) {
    console.log(
      `There are no changes under ${dirs.join(', ')} to stash, so the failure cannot be isolated ` +
        `to your asset. The errors above stand on their own — investigate them directly.\n`
    )
    process.exit(1)
  }

  console.log(`Stashing ${dirs.join(', ')} and re-running against pristine main…\n`)

  let pushed = false
  try {
    git(['stash', 'push', '--include-untracked', '-m', STASH_MSG, '--', ...dirs])
    pushed = true

    const baseRun = runTypecheck()
    const baseErrs = parseErrors(baseRun.output)
    console.log(
      `Pristine main: ${baseRun.code === 0 ? 'typecheck passes' : `${baseErrs.length} error line(s)`}.\n`
    )

    const novel = novelErrors(withErrs, baseErrs)

    if (novel.length === 0) {
      console.log(
        `✅ All ${withErrs.length} failure(s) are PRE-EXISTING — they appear on pristine main too, ` +
          `so they are not introduced by your asset.\n` +
          `   Report them; do not try to fix them inside an asset PR. (In a fresh worktree, ` +
          `\`pnpm build\` from the root first makes them go away.)\n`
      )
    } else {
      console.log(`❌ Your change introduces ${novel.length} NEW error(s) not present on main:\n`)
      for (const e of novel.slice(0, 25)) console.log(`     ${e}`)
      if (novel.length > 25) console.log(`     …and ${novel.length - 25} more`)
      console.log('\n   These are yours — fix them before committing.\n')
      process.exitCode = 1
    }
  } finally {
    if (pushed) {
      // Only pop the stash we created. If the top of the stack is not ours,
      // something else intervened — do not blindly pop and risk the wrong one.
      const top = git(['stash', 'list', '-1']).trim()
      if (top.includes(STASH_MSG)) {
        git(['stash', 'pop'])
        console.log('Restored your change from the stash.\n')
      } else {
        console.error(
          `\n⚠️  Expected my stash ("${STASH_MSG}") at the top of the stack but found:\n` +
            `     ${top || '(empty)'}\n` +
            `   I did NOT pop it, to avoid restoring the wrong stash. Your change is in the stash — ` +
            `recover it with \`git stash list\` and \`git stash pop stash@{N}\`.\n`
        )
      }
    }
  }
}

main().catch(err => {
  console.error(`\n❌ ${err.message}\n`)
  process.exit(1)
})
