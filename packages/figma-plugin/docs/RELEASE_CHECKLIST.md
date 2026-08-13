# Internal release checklist — Canary Copilot

**Not** a Figma Community marketplace submission. Org/private plugin for Harness designers.

## Pre-dogfood (current: `0.2.0` → bump when ready)

- [x] One canonical `manifest.json`: name `Canary Copilot`, locked id, Figma Design + Dev Mode, dynamic page access
- [x] `networkAccess` and default bundled-catalog behavior documented
- [x] Privacy + Support docs present (`PRIVACY.md`, `SUPPORT.md`)
- [x] Fresh install path: bundled Canary only (`pnpm build` → import `manifest.json`)
- [x] Button catalog compiled from the in-repo Button contract (`componentKeys` from HDS Components 3.0)
- [x] Core perf guardrail (2k snapshots &lt; 100ms)
- [ ] Optional: custom manifest URL pack + allow-listed domain
- [ ] Short internal demo (Loom/GIF) for designer onboarding
- [ ] False-positive triage exercised on ≥3 real files ([SUPPORT.md](../SUPPORT.md))

## Dogfood week

1. Install from this branch’s `packages/figma-plugin/manifest.json` after `pnpm --filter @harnessio/figma-plugin build`.
2. ≥**3 designers** run Check + Propose on product files using Button.
3. File false positives; fix **contracts** (then recompile) / normalize before calling v1.
4. Target: **&lt;5%** of Button/Badge findings dismissed as wrong.

## Ship v1.0.0 (when dogfood gate passes)

1. Bump `package.json` + catalog pack `version` to `1.0.0`.
2. Re-read Privacy/Support for accuracy.
3. Confirm icon assets under `assets/` referenced if Figma import needs them.
4. Tag: `figma-plugin-v1.0.0` (do **not** tag until dogfood sign-off).
5. Distribute org/private plugin link + USER_GUIDE.

## Version readiness notes (2026-08-06)

| Field | Value |
|-------|-------|
| Current package | `0.2.0` (Tasks 0–20 complete; ready for internal dogfood) |
| Recommended next | `1.0.0` after false-positive bar + demo |
| Catalog pack | Canary `0.2.0` (generated from the plugin package version) |
| Blockers to 1.0 | Live dogfood (≥3 designers), demo recording, optional remote CDN allow-list |

## Assets

| File | Use |
|------|-----|
| `assets/icon.png` | 128×128 plugin icon to upload when publishing (Figma takes the icon in the publish form, not in `manifest.json`) |
| `assets/icon.svg` | Vector source for `icon.png` — Harness mark on a brand-cyan tile |
| `assets/harness-mark.svg` | Bare Harness mark, transparent background |
| `assets/harness-mark.png` | Original supplied 48×48 Harness mark raster |
| `assets/empty-check.svg` | Empty-state illustration reference |

The in-plugin header mark is not one of these files — it is inlined vector in
`src/ui/components/HarnessMark.tsx`, coloured by `--brand-harness`.
