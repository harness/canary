# Line-height token cleanup + `leading-cn-*` utility

Branch: `feat/UUI-3404-line-height-cleanup` · Ticket: [UUI-3404](https://harness.atlassian.net/browse/UUI-3404)

Follow-on to the line-height 4px-grid rollout ([UUI-3159](https://harness.atlassian.net/browse/UUI-3159)). Three workstreams, **all complete**:
1. **Done** — remove the dead line-height-variant style references left in `$themes.json`.
2. **Done** — introduce a token-backed `leading-cn-*` Tailwind utility and remap hardcoded line-heights onto it.
3. **Done** — triage the remaining raw line-height values; migrate the real ramp candidates, document the intentional hold-backs.

---

## Background: how line-heights work now

The old system generated the line-height ramp by **multiplying font size by a ratio**:
`none` = 1.14, `tight` = 1.25, `snug` = 1.375, `normal` = 1.5, `relaxed` = 1.625, `loose` = 2.
So `line-height-6-tight` = `fontSize.6 × 1.25`. That produced ~75 tokens (17 sizes × up to 6 ratios).

UUI-3159 replaced that with a **flat, absolute pixel ramp on a 4px grid**:

| Token | Value | px |
|-------|-------|----|
| `lineHeight.8` | 0.5rem | 8 |
| `lineHeight.12` | 0.75rem | 12 |
| `lineHeight.16` | 1rem | 16 |
| `lineHeight.20` | 1.25rem | 20 |
| `lineHeight.24` | 1.5rem | 24 |
| `lineHeight.28` | 1.75rem | 28 |
| `lineHeight.32` | 2rem | 32 |
| `lineHeight.36` | 2.25rem | 36 |
| `lineHeight.40` | 2.5rem | 40 |

Only `multiplier.none` (1.14) survives, used solely by legacy `chart.*` tokens.

The **composite typography styles** (`body.normal`, `heading.section`, …) were re-pointed to this numeric ramp. Verified: every `{lineHeight.*}` reference in the composite sources resolves to an existing numeric token; **zero** references to the old named variants remain. These composites surface in code as `font-*` utilities (`font-body-normal`, `font-heading-hero`) applied by the `<Text variant="…">` component — the `font` shorthand var already carries the correct line-height.

---

## Workstream 1 — `$themes.json` cleanup (DONE)

### What was removed
31 orphaned composite **style references** from the `$figmaStyleReferences` map — old per-line-height style variants that no longer exist as composites or `font-*` utilities:

| Group | Count | Examples |
|-------|-------|----------|
| `*.leading-*` | 20 | `body.leading-normal.default`, `caption.leading-snug.default` |
| `body.none.*` / `body.tight.*` | 4 | `body.none.normal`, `body.tight.strong` |
| `caption.tight.*` | 2 | `caption.tight.normal`, `caption.tight.soft` |
| `typography.display.default.*` | 5 | `.none`, `.normal`, `.snug`, `.relaxed`, `.loose` |

Left in place: `typography.caption.data.normal` (ambiguous — `.normal` may denote weight, not line-height; no sibling variant to confirm). Live composites (`body.normal`, `caption.normal`, `heading.*`, etc.) untouched.

### Why it's safe (verified)
- `$figmaStyleReferences` is **Figma-push metadata only**. The build (`scripts/build.js`) reads `$themes.json` only via `permutateThemes()`, which consumes each theme's `selectedTokenSets` — it never reads `$figmaStyleReferences`.
- **Proof:** stashed the edit, rebuilt, and `diff -rq` of the two `dist/` outputs is **byte-for-byte identical** across all 60 files. No change to Canary's compiled CSS; platformUI (consumes built `@harnessio/ui` artifacts) is unaffected.
- Context: Tokens Studio is being deprecated, so `$themes.json` is now hand-maintained rather than sync-regenerated.

---

## Workstream 2 — `leading-cn-*` utility (DONE)

### Problem
`packages/ui/tailwind-design-system.ts` tokenized `fontSize` and `letterSpacing` but had **no `lineHeight` key**. So `leading-snug/tight/normal/relaxed` usages fell through to Tailwind's stock **unitless multipliers** — genuinely hardcoded, and off-grid (e.g. `leading-tight` on 12px = 15px, which breaks the 4px rhythm).

### Benefit of a token-backed utility
1. **Grid alignment** — fixed-px token line-heights always land on the 4px grid.
2. **Single source of truth** — change the ramp once, all usages follow.
3. **Consistency** — matches the existing `text-cn-size-*` / `cn-tight` token utilities.
4. **No drift** — removes scattered magic numbers.

Tradeoff: token line-heights are absolute px (don't auto-scale with font size like a multiplier) — intentional for a grid-based system.

### Phase 1 — Add the utility (additive, non-breaking) ✅
Added under `theme.extend.lineHeight` in `tailwind-design-system.ts`:
```ts
// Token-backed line-height ramp (4px grid) → `leading-cn-8` … `leading-cn-40`.
// Additive under `extend`, so stock `leading-*` stay available during the remap.
lineHeight: {
  'cn-8': 'var(--cn-line-height-8)',   // 8px
  'cn-12': 'var(--cn-line-height-12)', // 12px
  'cn-16': 'var(--cn-line-height-16)', // 16px
  'cn-20': 'var(--cn-line-height-20)', // 20px
  'cn-24': 'var(--cn-line-height-24)', // 24px
  'cn-28': 'var(--cn-line-height-28)', // 28px
  'cn-32': 'var(--cn-line-height-32)', // 32px
  'cn-36': 'var(--cn-line-height-36)', // 36px
  'cn-40': 'var(--cn-line-height-40)', // 40px
}
```
Under `extend` (not top-level) so stock `leading-*` keep working during transition — nothing breaks on landing. Confirmed shipped: `.leading-cn-16{line-height:var(--cn-line-height-16)}` … resolve to `--cn-line-height-16: 1rem`, `--cn-line-height-20: 1.25rem`, etc.

### Phase 2 — Remap the hardcoded stock classes ✅
All **19** stock `leading-*` usages across 12 files remapped: 18 to token classes, 1 redundant override removed. Verified `0` stock `leading-(snug|tight|loose|relaxed|normal)` remain in `packages/`.

| File / usage | Was | Now |
|---|---|---|
| `views/execution/pipeline-status.tsx` (×6) | `leading-tight` | `leading-cn-16` |
| `views/execution/console-logs.tsx:87` | `leading-normal` | `leading-cn-16` |
| `views/pipeline-nodes/components/node-title.tsx:18` | `leading-snug` | `leading-cn-16` |
| `views/pipelines/pipeline-list/pipeline-list.tsx` (×2) | `leading-snug` / `leading-tight` | `leading-cn-16` |
| `views/pipelines/execution-list/execution-list.tsx:30` | `leading-tight` | `leading-cn-16` |
| `views/repo/pull-request/components/pull-request-accordian.tsx:158` | `leading-tight` | `leading-cn-16` |
| `views/repo/pull-request/.../conversation/regular-and-code-comment.tsx:371` | `leading-tight` | `leading-cn-16` |
| `views/repo/pull-request/.../conversation/pull-request-filters.tsx:56` | `leading-snug` (redundant on `<Text variant="heading-subsection">`) | **removed** — variant already carries the line-height |
| `ui/src/components/chat/chat.tsx:60` (message body) | `leading-relaxed` | `leading-cn-20` |
| `ui/src/components/treeview.tsx` (×2) | `leading-tight` | `leading-cn-16` |
| `ui/tailwind-utils-config/components/time-ago-card.ts:4` | `@apply leading-snug` | `@apply leading-cn-16` |
| `ui/tailwind-utils-config/components/tag.ts:135` | `@apply leading-normal` | `@apply leading-cn-16` |

Most snap to `leading-cn-16` (tightest grid step that clears the label font size); chat message body → `leading-cn-20` to match body rhythm. The `pull-request-filters` override was dropped rather than remapped because the `heading-subsection` `<Text>` variant already bakes in the correct line-height.

---

## Workstream 3 — straggler triage (DONE)

Swept every remaining raw `lineHeight` / `line-height` / `leading-[…]` in `packages/`. Of ~9 hits, only **2** were real ramp candidates; the rest are intentional or out of scope.

### Migrated (real ramp candidates)
| File | Was | Now | Why |
|---|---|---|---|
| `ui/src/components/chat/chat.tsx:76` (inline `CodeBlock`) | `leading-[18px]` | `leading-cn-20` | 18px was off-grid; 20 matches the chat body it sits inside |
| `ui/src/components/problems.tsx:35` | `leading-[15px]` | `leading-cn-16` | 15px off-grid; 16 is the nearest step clearing the text |

(`problems.test.tsx` assertion updated to match. The off-system `text-[13px]` on that element is a font-size concern, left untouched.)

### Intentionally left as-is
- **Centering resets — `lineHeight: '1'`** in `stepper.ts` (×2), `drawer.ts`, `skeleton.ts`. These collapse the line box to exactly the font size so a single glyph/digit centers inside a circle/pill via flex. They are **not** ramp values — snapping to `leading-cn-16` would add vertical space and break the centering.
- **Already-justified one-off** — `stepper.ts` `fontSize: 11px` / `lineHeight: 1.35`. No `--cn-font-size-*` matches 11px and no `--cn-line-height-*` matches 1.35; documented inline, left hardcoded.
- **Third-party CSS** — `styles.css` `.diff-tailwindcss-wrapper .leading-[1.4]` / `[1.6]` belong to the vendored diff viewer, not the canary design system. Out of scope.

---

## Verification (as-shipped)
- ✅ `--cn-line-height-8…40` present in the freshly built core-design-system tokens.
- ✅ `@harnessio/ui` builds clean (exit 0) — the `@apply leading-cn-16` rules would hard-fail the build if the utility didn't resolve; they compiled.
- ✅ Shipped `@harnessio/ui` CSS carries the utility rules: `.leading-cn-16{line-height:var(--cn-line-height-16)}` and `.leading-cn-20{line-height:var(--cn-line-height-20)}` (utilities dedupe across usages).
- ✅ `problems` test suite passes (54/54).
- ⓘ No live preview to spot-check — canary is the component library, not a runnable app; line-heights render downstream via platformUI, which consumes the built artifacts and generates the `leading-cn-*` utilities from the exported preset.

## Optional follow-up (not in this branch)
**Lock down** — once consumers have fully migrated, move `lineHeight` from `extend` to top-level in `tailwind-design-system.ts` to remove Tailwind's stock `leading-*` and prevent future hardcoding.
