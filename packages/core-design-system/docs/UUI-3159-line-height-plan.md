# UUI-3159 — Line-Height Grid Hygiene: Implementation Plan

**Status:** SHIPPED — PR #11341 (Phase 1 complete, 2026-08-19) · **Chosen approach:** Option B (canonical fixed scale + repoint, charts frozen)
**Ticket:** UUI-3159 · **Related doc:** `UUI-3159-line-height-mapping.md` (repo root — full before/after token mapping)

---

## Decision log

- **Option A (redefine computed token values in place)** — REJECTED. Because line-height tokens are *shared* between desktop styles and charts, redefining a token value drags charts along with desktop. It cannot honor the "charts off-limits" rule, and it leaves misleadingly-named tokens (`snug` holding a fixed value).
- **Option B (add a small canonical fixed scale, repoint desktop styles, delete the dead computed tokens)** — CHOSEN. Only approach that (a) keeps charts frozen, (b) yields honest names, (c) ends with *fewer* tokens. Goal is a lean scale — the app does not need many line-heights with ratio variations; that gets muddy fast.

## Token sharing (why Option B)

- **Chart-only (5):** `1.none`, `6.none`, `8.none`, `10.none`, `15.none`
- **Shared chart + desktop (2):** `3.none`, `4.none`
- **Desktop-only (18):** everything else
- All chart tokens use the **`none`** multiplier only.

## Desktop usage distribution (charts excluded)

| Target | # desktop styles |
|-------:|:----------------|
| 16px | 10 |
| 20px | 17 |
| 24px | 10 |
| 28px | 1 |
| 36px | 3 |
| 40px | 1 |

Weight is in **16 / 20 / 24**; thin tail at 28 / 36 / 40 → the lever for keeping the scale small.

---

## Phase 0 — Scale decided (2026-08-18)

**a) Steps — DECIDED: full 4px grid, 8 → 40 (out of the box).** A flat uniform grid, not a per-size ratio matrix — that's what keeps it from getting muddy.

| Token | rem | px | Status |
|-------|-----|----|--------|
| `lineHeight.8`  | 0.5rem  | 8  | ✅ added |
| `lineHeight.12` | 0.75rem | 12 | ✅ added |
| `lineHeight.16` | 1rem    | 16 | ✅ added |
| `lineHeight.20` | 1.25rem | 20 | ✅ added |
| `lineHeight.24` | 1.5rem  | 24 | ✅ added |
| `lineHeight.28` | 1.75rem | 28 | ✅ added |
| `lineHeight.32` | 2rem    | 32 | ✅ added |
| `lineHeight.36` | 2.25rem | 36 | ✅ added |
| `lineHeight.40` | 2.5rem  | 40 | ✅ added |

All 9 steps shipped. `lineHeight.8` required freeing its key from the chart token (see Resolutions).

**b) Naming — DECIDED: numeric px** (`lineHeight.8` … `lineHeight.40`), matching existing.

**Ties — RESOLVED (2026-08-19):** `3.snug` (18px) → **16** (caption-code, small font, tighter leading is right); `6.relaxed` (26px) → **28** (multi-line markdown body). **Phase 0 fully closed** — every desktop style now maps to a grid step.

## Phase 1 — Fresh branch
- New branch off `origin/main`. Abandon PR #11335 (its in-place edits + orphaned fixed tokens are discarded). New PR at the end.

## Phase 2 — Add canonical tokens
- Add the agreed scale to `packages/core-design-system/design-tokens/core/typography.json`. Nothing else.

## Phase 3 — Repoint desktop styles ✅
- `breakpoint/desktop.json`: all 41 style refs repointed → grid tokens.
- Shared tokens `3.none` / `4.none`: desktop occurrences repointed; chart occurrences retained (later namespaced — see Resolutions).
- `components/desktop/base/chart.json`: style **values** untouched; references were later namespaced (value-preserving).

## Phase 4 — Delete dead tokens ✅
- Removed the **18 desktop-only** computed tokens.
- Retained the 7 chart-referenced computed tokens — now namespaced as `lineHeight.chart.{1,3,4,6,8,10,15}.none`.
- Pruned `multiplier` to **`none`** only.
- `$themes.json`: **left as-is (deviation)** — already full of phantom token entries; it's Figma-plugin metadata, not validated by the style-dictionary build.

## Phase 5 — Verify ✅
- Rebuilt `core-design-system` + `packages/ui`; typography renders cleanly on the Doc Site, no console errors on the current build.
- Compiled chart vars confirmed byte-identical (`--cn-line-height-chart-10-none`=1.995rem, etc.); chart composite styles unchanged.

---

## End state
- **Desktop:** flat 4px grid `lineHeight.{8–40}`; desktop computed scale gone.
- **Charts:** unchanged (still computed via `multiplier.none`), now isolated under `lineHeight.chart.*`. Fully retiring charts = separate follow-up; only then can the multiplier be deleted entirely.
- **Net:** flat grid + honest names; ratio matrix removed.

## Resolutions (execution log — 2026-08-19)
Shipped as **PR #11341** on branch `feat/UUI-3159-line-height-4px-grid`.
- **Full grid added:** `lineHeight.{8,12,16,20,24,28,32,36,40}` (8 = 0.5rem … 40 = 2.5rem).
- **`lineHeight.8` collision resolved (option 1):** the flat key `8` collided with retained chart `8.none`. Freed it by moving the 7 chart tokens under `lineHeight.chart.*` — a value-preserving rename. Compiled chart output verified byte-identical; no direct consumers of the old `--cn-line-height-{1,3,4,6,8,10,15}-none` vars in canary or platformUI; 9 `chart.json` refs updated.
- **AI Code Review fix:** deleting `7.tight` had orphaned `packages/views/src/repo/components/repo-header.tsx` (`h-[var(--cn-line-height-7-tight)]`); repointed to `--cn-line-height-24` (7.tight ≈22.5px → grid 24). Verified it was the only such consumer in canary.
- **Naming note (acknowledged):** `lineHeight.8` (grid, 8px) coexists with legacy `lineHeight.chart.8.none` (fontSize-index 8 ≈ 22.8px) — distinct meanings, disambiguated by the `chart.*` namespace.

## Follow-ups (out of scope for this PR)
- **platformUI:** `apps/code/src/features/code/views/repo/components/repo-header.tsx:50` uses the same `--cn-line-height-7-tight`; needs the identical repoint (`--cn-line-height-24`) when the new `@harnessio/ui` publishes.
- **Chart migration:** move charts off the `lineHeight.chart.*` computed tokens so they + `multiplier.none` can be deleted, which also lets `$themes.json` be cleaned.

## How to verify preview (Canary Doc Site)
1. `cd packages/core-design-system && pnpm build` (compiles tokens)
2. `cd packages/ui && pnpm build`
3. `cd apps/portal && pnpm dev` → typography page (Astro may pick 4322 if 4321 is busy)
