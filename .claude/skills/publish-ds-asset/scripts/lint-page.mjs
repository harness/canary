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
 *   2. node .claude/skills/publish-ds-asset/scripts/lint-page.mjs --in /tmp/page.json
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

import { VALID_NAME, parseArgs, sanitizeFilename } from './names.mjs'

const args = parseArgs(process.argv.slice(2))

const EXPECTED_SIZE = { icon: 16, logo: 22 }
const HEX6 = /^#[0-9a-fA-F]{6}$/

/** WCAG relative luminance, used only to catch mark-invisible-on-background. */
function luminance(hex) {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255)
  const f = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function contrastRatio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

function lintComponent(c, type) {
  const errors = []
  const warnings = []
  const E = m => errors.push(m)
  const W = m => warnings.push(m)

  // ── Node type ───────────────────────────────────────────────────────────
  if (c.type !== 'COMPONENT') {
    E(`type is ${c.type}, must be COMPONENT — the export script skips anything else`)
  }

  // ── Name ────────────────────────────────────────────────────────────────
  if (!c.name.startsWith('.')) {
    W(`name is missing the leading dot (export pages mark export-ready components with "."); ` +
      `harmless to the filename but review will send it back`)
  }
  const bare = c.name.replace(/^\./, '')
  if (!VALID_NAME.test(bare)) {
    E(`name "${bare}" is invalid: lowercase letters, digits and single dashes only, no leading ` +
      `digit. A dot (node.js) or leading digit (1password) yields an invalid TS import and ` +
      `typecheck fails. Ships as "${sanitizeFilename(c.name)}.svg"`)
  }

  // ── Size ────────────────────────────────────────────────────────────────
  const want = EXPECTED_SIZE[type]
  if (Math.round(c.width) !== want || Math.round(c.height) !== want) {
    E(`size is ${Math.round(c.width)}×${Math.round(c.height)}, must be ${want}×${want}`)
  }

  // ── Structure ───────────────────────────────────────────────────────────
  const kids = c.children || []
  const masked = kids.filter(k => k.isMask === true)
  if (masked.length) {
    E(`has ${masked.length} mask layer(s) (${masked.map(k => k.name).join(', ')}). Masks are ` +
      `banned on export pages — they export as a degenerate <mask x="inf" y="inf"/> and the ` +
      `asset renders blank. Remove the mask and keep a single flattened vector`)
  }
  // ── Gradient / image fills — cannot ship, need a monochrome source ──────
  //
  // Verified behaviour: the LOGO pipeline preserves `fill="url(#…)"` and the
  // gradient def verbatim, so a gradient ships silently with no error and looks
  // nothing like its flat siblings. The SYMBOL and ICON pipelines rewrite every
  // fill to currentColor, which collapses colour-separated sub-shapes into one
  // another — the mark can become an unreadable silhouette — and leaves an
  // orphaned gradient def behind. Neither outcome is acceptable.
  // Check BOTH fills and strokes. Outline icons are stroke-based and carry no
  // fill at all, so a fills-only check would miss gradients on every icon.
  const nonSolid = kids.flatMap(k => [
    { name: k.name, where: 'fill', type: k.fillType },
    { name: k.name, where: 'stroke', type: k.strokeType }
  ]).filter(p => p.type && p.type !== 'SOLID')
  if (nonSolid.length) {
    const t = nonSolid[0].type
    const kind = t.startsWith('GRADIENT') ? 'a gradient' : `${/^[AEIOU]/.test(t) ? 'an' : 'a'} ${t.toLowerCase()} fill`
    E(`${nonSolid[0].where} on "${nonSolid[0].name}" is ${t}, not SOLID. HDS marks are ` +
      `single-colour; ${kind} cannot be exported automatically. Source a monochrome mark ` +
      `instead, in this order:\n` +
      `         1. simpleicons.org — already single-path, single-colour\n` +
      `         2. the brand's own guidelines / press kit — look for the mono or one-colour mark\n` +
      `         3. redraw the vector by hand as a single flattened path\n` +
      `         See references/figma-spec.md "Gradient and multi-colour marks"`)
  }

  // A dump produced by an older version of the figma_execute snippet has no
  // fillType, which would silently skip the gradient check above. Say so rather
  // than reporting a clean pass that was never actually checked.
  const missingFillType = kids.filter(k => k.fillHex !== undefined && k.fillType === undefined)
  if (missingFillType.length) {
    W(`the dump has no "fillType" for "${missingFillType[0].name}", so the gradient/image-fill ` +
      `check was SKIPPED for this component. Re-dump using the current snippet in SKILL.md`)
  }

  // ── Mixed stroke caps/joins: a RISK INDICATOR, not proof ────────────────
  //
  // SVG has one stroke-linecap and one stroke-linejoin per path, so Figma
  // cannot always represent per-vertex variation and may bake the stroke into a
  // filled outline instead. A filled outline looks right at 16px but ignores
  // the stroke-width the cn-icon-* size classes set, so it will not thin out at
  // md/lg/xl like its siblings.
  //
  // This is a WARNING, not an error, because MIXED does not reliably mean
  // outlined. Measured:
  //   .ai-evals  cap MIXED, join MIXED  -> outlined to fill   (bad)
  //   .ai-verify cap MIXED, join ROUND  -> stroke preserved   (fine, shipped)
  // `.ai-verify` is a legitimate mixed fill+stroke icon; MIXED there just
  // reflects closed filled subpaths sitting alongside an open stroked one.
  // Erroring on MIXED would block it.
  //
  // The authoritative check is the EXPORT, not this property — see the
  // post-export verification in SKILL.md Step 4A.
  const mixedStroke = kids.filter(k => k.strokeCap === 'MIXED' || k.strokeJoin === 'MIXED')
  if (mixedStroke.length) {
    const k = mixedStroke[0]
    W(`"${k.name}" has mixed stroke caps/joins (cap: ${k.strokeCap}, join: ${k.strokeJoin}). ` +
      `Figma may bake the stroke into a filled outline, which would ignore the stroke-width from ` +
      `the cn-icon-* size classes and not thin out at larger sizes. This is often harmless — a ` +
      `mixed fill+stroke icon reports MIXED legitimately. **Confirm from the export**: if the ` +
      `component has strokes but the exported SVG has no stroke= attribute, the stroke was ` +
      `outlined — set the cap and join uniformly to ROUND and re-export`)
  }

  const colorRects = kids.filter(k => k.type === 'RECTANGLE' && /icon\s*color/i.test(k.name))
  if (colorRects.length) {
    E(`contains an "${colorRects[0].name}" rectangle — that is the color-mask pattern from the ` +
      `designer page. It must not appear on an export page; delete it and fill the vector directly`)
  }

  if (type === 'logo') {
    if (kids.length !== 1) {
      E(`has ${kids.length} children, must have exactly 1 vector`)
    }
    // .lovable and .ansible ship with FRAME children and render fine, so this is
    // informational rather than an error — but a frame can hide nested structure
    // that violates the single-flattened-glyph rule.
    const nonVector = kids.filter(k => k.type !== 'VECTOR')
    if (nonVector.length && !colorRects.length) {
      W(`child "${nonVector[0].name}" is a ${nonVector[0].type}, not a VECTOR. Confirm it is one ` +
        `flattened glyph and not a nested composition`)
    }
  } else if (kids.length > 1) {
    W(`has ${kids.length} children. Solid icons may legitimately use a few filled paths, but ` +
      `confirm it is one coherent glyph and not a layered composition`)
  }

  // ── Logo-specific: description hex, and mark visibility ─────────────────
  if (type === 'logo') {
    const desc = (c.description || '').trim()
    if (!desc) {
      E(`description is EMPTY. The export reads the brand hex from it; without it the SVG gets ` +
        `no background and no border, and LogoV2 renders as a broken-looking blank`)
    } else if (!HEX6.test(desc)) {
      E(`description "${desc}" is not a 6-digit hex colour`)
    } else {
      // The .apple/.windows failure: mark colour indistinguishable from its background.
      const mark = kids.map(k => k.fillHex).find(h => h && HEX6.test(h))
      if (mark) {
        const ratio = contrastRatio(desc, mark)
        if (ratio < 1.5) {
          E(`mark ${mark} is invisible on background ${desc} (contrast ${ratio.toFixed(2)}:1). ` +
            `Use pure/black for a light background, pure/white for a dark one`)
        } else if (ratio < 3) {
          W(`mark ${mark} is low-contrast on background ${desc} (${ratio.toFixed(2)}:1) — check ` +
            `it at 20px`)
        }
      }
    }

    const unbound = kids.filter(k => k.fillHex && k.fillBound === false)
    if (unbound.length) {
      W(`fill on "${unbound[0].name}" is a raw hex, not a bound variable. Bind it to pure/black ` +
        `or pure/white so it tracks the design system`)
    }
  }

  return { name: c.name, errors, warnings }
}

function lintCollisions(components) {
  const byFilename = new Map()
  for (const c of components) {
    const f = sanitizeFilename(c.name) + '.svg'
    if (!byFilename.has(f)) byFilename.set(f, [])
    byFilename.get(f).push(c.name)
  }
  return [...byFilename.entries()]
    .filter(([, names]) => names.length > 1)
    .map(([f, names]) =>
      `COLLISION: ${names.join(' and ')} both ship as ${f}. The export regenerates the whole map, ` +
      `so one silently overwrites the other with no error`
    )
}

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
