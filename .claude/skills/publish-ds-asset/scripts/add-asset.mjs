#!/usr/bin/env node
/**
 * add-asset.mjs — turn one raw Figma SVG export into a committed-ready asset.
 *
 * Writes the processed SVG(s) and inserts the import + map entry at the exact
 * position a full `pnpm update:icons` / `pnpm update:logos` regen would put
 * them, so the next person's regen produces no reorder noise.
 *
 * This touches ONE asset. That is the whole point: the upstream scripts rebuild
 * all 534 icons / 181 logos from the Figma page every run, which is where the
 * playbook's "isolate your icon from the diff" cleanup comes from. Here there
 * is nothing to isolate.
 *
 * Run parity-check.mjs first. This script refuses to guess whether the replica
 * pipeline is still faithful.
 *
 * Usage (from packages/ui):
 *   node ../../.claude/skills/publish-ds-asset/scripts/add-asset.mjs \
 *     --type icon --name agent-dlc --raw /tmp/agent-dlc.svg
 *
 *   node ../../.claude/skills/publish-ds-asset/scripts/add-asset.mjs \
 *     --type logo --name acme-cloud --hex '#1F6FEB' --raw /tmp/acme-cloud.svg
 *
 * Add --force to overwrite an existing asset of the same name (renaming or
 * replacing a shipped asset is a breaking change for consumers — see the
 * playbooks before doing this).
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
  renderMap,
  sanitizeFilename,
  toAssetKey,
  toComponentName
} from './lib.mjs'

const args = parseArgs(process.argv.slice(2))

function fail(msg) {
  console.error(`\n❌ ${msg}\n`)
  process.exit(1)
}

/**
 * Undo log for the write phase. Each successful write registers how to reverse
 * itself, using the pre-write content we already read into memory — a brand-new
 * file is unlinked, an overwritten one is restored verbatim. If a later write
 * throws partway through (e.g. a read-only map), rollback() runs these in
 * reverse so the tree is left exactly as it was found, rather than half-applied.
 * Nothing destructive runs unless a write already succeeded this run.
 */
const rollbacks = []

async function rollback() {
  if (!rollbacks.length) return
  console.error(
    `\n⚠️  A write failed partway through. Reverting the ${rollbacks.length} change(s) ` +
      `already made this run so nothing is left half-applied:`
  )
  for (const { path: p, undo } of [...rollbacks].reverse()) {
    try {
      await undo()
      console.error(`     reverted ${p}`)
    } catch (e) {
      console.error(`     ⚠️  could not revert ${p}: ${e.message} — check \`git status\` by hand`)
    }
  }
}

/**
 * Enforces the naming rules from playbook 3 that actually break the build if
 * violated, rather than the stylistic ones a human must judge.
 */
function validateName(name, type) {
  if (sanitizeFilename(name) !== name) {
    fail(
      `Name "${name}" is not already filename-safe — the upstream sanitizer would ` +
        `rewrite it to "${sanitizeFilename(name)}". Rename the Figma component ` +
        `(without the leading dot) to exactly the name you want on disk.`
    )
  }
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    fail(
      `Name "${name}" fails the kebab-case rule: lowercase letters, digits and ` +
        `single dashes only, and it may not start with a digit.\n` +
        `  A dot in the name (node.js) or a leading digit (1password) produces an ` +
        `invalid TypeScript import identifier and typecheck fails.\n` +
        `  Use "nodejs", "onepassword" etc.`
    )
  }
  if (type === 'logo' && /-(solid|badge|outline)$/.test(name)) {
    console.warn(
      `⚠️  "${name}" uses an icon-style variant suffix. Logos do not take ` +
        `-solid/-badge/-outline suffixes (playbook 3). Continuing, but double-check this.`
    )
  }
}

function validateHex(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    fail(
      `--hex "${hex}" is not a 6-digit hex colour. It must be the brand hex, copied ` +
        `verbatim from the Figma component's Description field (e.g. '#070709').`
    )
  }
}

/** Insert into a generated map and verify the shape of the change. */
async function updateMap(kind, filename) {
  const mapPath = PATHS[kind].map
  const before = await readIfExists(mapPath)
  // Throw rather than fail() so any writes made earlier this run get rolled back
  // (see rollback()). fail()'s process.exit() would strand a half-applied change.
  if (before === null) throw new Error(`Name map missing: ${mapPath}`)

  const existing = parseMapFilenames(before, kind)
  const key = toAssetKey(filename)

  if (existing.includes(filename) && !args.force) {
    throw new Error(
      `"${key}" is already in ${mapPath}.\n` +
        `  Either this asset already shipped (go look at it — you may have found the ` +
        `wrong precedent to follow), or you need a more specific name.\n` +
        `  Re-run with --force only if you intend to replace it.`
    )
  }

  const next = existing.includes(filename) ? existing : [...existing, filename]
  const after = await renderMap(next, kind)
  await fs.writeFile(mapPath, after, 'utf8')
  rollbacks.push({ path: mapPath, undo: () => fs.writeFile(mapPath, before, 'utf8') })

  const beforeLines = before.split('\n').length
  const afterLines = after.split('\n').length
  const delta = afterLines - beforeLines
  // key is kebab-case today (VALID_NAME forbids regex metacharacters), but escape
  // it anyway so a future naming-rule change can't turn this into a broken match.
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const occurrences = (after.match(new RegExp(`'${safeKey}'|^\\s+${safeKey}:`, 'gm')) || []).length

  // +2 = one import line, one map entry. Anything else means the regen moved
  // something it shouldn't have, and the diff needs human eyes.
  const expected = existing.includes(filename) ? 0 : 2
  if (delta !== expected) {
    console.warn(
      `⚠️  ${mapPath} changed by ${delta} lines, expected ${expected}. ` +
        `Inspect \`git diff ${mapPath}\` carefully before committing.`
    )
  }

  console.log(`  ✅ ${mapPath}  (${delta >= 0 ? '+' : ''}${delta} lines, key appears ${occurrences}×)`)
  return mapPath
}

async function writeSvg(kind, filename, content) {
  const target = path.join(PATHS[kind].svgDir, filename)
  const prior = await readIfExists(target)
  if (prior !== null && !args.force) {
    // Throw (not fail()) so earlier writes this run roll back — see rollback().
    throw new Error(
      `${target} already exists.\n` +
        `  Note: the repo currently carries SVGs on disk that are absent from the name ` +
        `map (orphans left behind when an asset was removed from the Figma export page ` +
        `but its file was never deleted). So "file exists" does not always mean ` +
        `"already shipped" — check the map too:\n` +
        `    grep -n "'${toAssetKey(filename)}'" packages/ui/${PATHS[kind].map}\n` +
        `  If the file is an orphan of a genuinely different asset, pick another name. ` +
        `If it is a stale copy of this same asset, re-run with --force.`
    )
  }
  await fs.writeFile(target, content, 'utf8')
  rollbacks.push({
    path: target,
    undo: () => (prior === null ? fs.unlink(target) : fs.writeFile(target, prior, 'utf8'))
  })
  console.log(`  ✅ ${target}  (${content.length} bytes${prior !== null ? ', OVERWRITTEN' : ''})`)
  return target
}

async function main() {
  await assertRunFromPackagesUi()

  const type = args.type
  if (type !== 'icon' && type !== 'logo') fail('--type must be "icon" or "logo"')
  if (!args.name || !args.raw) fail('Both --name and --raw are required.')

  const name = String(args.name).replace(/^\./, '')
  validateName(name, type)

  const raw = await readIfExists(path.resolve(args.raw))
  if (raw === null) fail(`Raw SVG not found: ${args.raw}`)
  if (!raw.includes('<svg')) fail(`${args.raw} does not look like an SVG.`)

  const filename = `${name}.svg`
  const written = []

  console.log(`\nAdding ${type} "${name}"  (import identifier: ${toComponentName(filename)})\n`)

  // Any throw from here on — a write guard tripping, or a genuine fs error partway
  // through a multi-file logo — unwinds the writes already made this run before
  // the error reaches the user, so the tree is never left half-applied.
  try {
    if (type === 'icon') {
      const processed = processIcon(raw)
      if (!processed.includes('currentColor')) {
        fail(
          `Processed icon contains no "currentColor" — the themify step found no ` +
            `fill/stroke to convert.\n` +
            `  The Figma component's colour must be #000000 (not a variable, not none), ` +
            `and masks must be removed. See references/figma-spec.md.`
        )
      }
      written.push(await writeSvg('icon', filename, processed))
      written.push(await updateMap('icon', filename))
    } else {
      if (!args.hex) {
        fail(
          `Logos require --hex. The brand hex lives in the Figma component's ` +
            `Description field; if it is empty the generated SVG gets no background ` +
            `and no border, and LogoV2 renders as a broken-looking blank.`
        )
      }
      validateHex(String(args.hex))

      const logoSvg = processLogo(raw, String(args.hex))
      const symbolSvg = processSymbol(raw)

      if (!logoSvg.includes(String(args.hex))) {
        fail(`Processed logo does not contain ${args.hex} — the background rect was not applied.`)
      }
      if (!symbolSvg.includes('currentColor')) {
        fail(`Processed symbol contains no "currentColor" — the mark has no fill/stroke to convert.`)
      }

      written.push(await writeSvg('logo', filename, logoSvg))
      written.push(await writeSvg('symbol', filename, symbolSvg))
      written.push(await updateMap('logo', filename))
      written.push(await updateMap('symbol', filename))
    }
  } catch (err) {
    await rollback()
    throw err
  }

  console.log(`\nStage exactly these ${written.length} paths — never \`git add .\`, so .env cannot slip in:\n`)
  console.log(written.map(p => `  packages/ui/${p}`).join('\n'))
  console.log(`\nNext: \`pnpm typecheck\`, then confirm \`git status --short\` shows nothing else.\n`)
}

main().catch(err => fail(err.message))
