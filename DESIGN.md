---
version: alpha
name: Harness Canary
description: Production design system for the Harness Unified UI — Radix-based React components grounded in style-dictionary tokens, consumed via Tailwind. Source of truth for `@harnessio/ui` and downstream apps (`frontend/platformUI`).

# =============================================================================
# COLORS
# =============================================================================
# Two layers:
#   1. Primitive ramps — 14 hues × 16 shades, plus pure white/black. Verbatim
#      from packages/core-design-system/design-tokens/core/colors_lch.json.
#   2. Semantic aliases (`cn-*`) — what components consume. Light theme is
#      canonical; dark variants live under `themes.dark` below. Verbatim from
#      packages/core-design-system/design-tokens/mode/light/default.json.
# Always reference aliases (`{colors.cn-bg-1}`), never primitives, in
# component code.
# =============================================================================
colors:
  # ---- Primitives ------------------------------------------------------------
  pure-white: "lch(100% 0 0)"
  pure-black: "lch(5% 1.5 270)"

  gray-25:    "lch(99% 0 272)"
  gray-50:    "lch(97% 0 272)"
  gray-100:   "lch(92% 1 272)"
  gray-150:   "lch(87% 1 272)"
  gray-200:   "lch(84% 3.5 272)"
  gray-300:   "lch(79% 6 272)"
  gray-400:   "lch(76% 6.5 272)"
  gray-500:   "lch(65% 6 272)"
  gray-600:   "lch(57% 5.5 273)"
  gray-700:   "lch(47% 6 275)"
  gray-800:   "lch(33% 9 278)"
  gray-850:   "lch(24.5% 9 278)"
  gray-900:   "lch(16% 6 280)"
  gray-950:   "lch(10% 2 280)"
  gray-1000:  "lch(7.5% 1 280)"

  red-25:     "lch(98% 4 10)"
  red-50:     "lch(96% 7 12)"
  red-100:    "lch(93% 15 16)"
  red-150:    "lch(88% 25 20)"
  red-200:    "lch(82% 35 20)"
  red-300:    "lch(78% 45 20)"
  red-400:    "lch(72% 58 25)"
  red-500:    "lch(67% 76 30)"
  red-600:    "lch(61% 90 32)"
  red-700:    "lch(48% 86 32)"
  red-800:    "lch(45% 80 31)"
  red-850:    "lch(35% 55 25)"
  red-900:    "lch(18% 33 375)"
  red-950:    "lch(15% 28 375)"
  red-1000:   "lch(8% 8 360)"

  orange-25:    "lch(98.5% 4 70)"
  orange-50:    "lch(96% 11 68)"
  orange-100:   "lch(93% 16 65)"
  orange-150:   "lch(89% 28 62)"
  orange-200:   "lch(84% 41 58)"
  orange-300:   "lch(78% 58 55)"
  orange-400:   "lch(72% 78 53)"
  orange-500:   "lch(67% 100 52)"
  orange-600:   "lch(60% 97 49)"
  orange-700:   "lch(49% 92 52)"
  orange-800:   "lch(41% 80 51)"
  orange-850:   "lch(32% 55 48)"
  orange-900:   "lch(23% 42 48)"
  orange-950:   "lch(16% 21 48)"
  orange-1000:  "lch(10% 6 55)"

  yellow-25:    "lch(99% 9 98)"
  yellow-50:    "lch(96% 38 95)"
  yellow-100:   "lch(93% 48 92)"
  yellow-150:   "lch(89% 65 88)"
  yellow-200:   "lch(84% 84 82)"
  yellow-300:   "lch(77% 100 76)"
  yellow-400:   "lch(72% 98 70)"
  yellow-500:   "lch(65% 95 66)"
  yellow-600:   "lch(58% 95 63)"
  yellow-700:   "lch(49% 82 60)"
  yellow-800:   "lch(41% 60 58)"
  yellow-850:   "lch(32% 45 57)"
  yellow-900:   "lch(23% 33 58)"
  yellow-950:   "lch(16% 19 60)"
  yellow-1000:  "lch(10% 4 60)"

  brown-25:    "lch(98% 4 38)"
  brown-50:    "lch(96% 7 38)"
  brown-100:   "lch(93% 13 38)"
  brown-150:   "lch(89% 22 38)"
  brown-200:   "lch(84% 33 38)"
  brown-300:   "lch(78% 48 38)"
  brown-400:   "lch(72% 62 38)"
  brown-500:   "lch(65% 62 38)"
  brown-600:   "lch(56% 56 38)"
  brown-700:   "lch(49% 50 38)"
  brown-800:   "lch(41% 42 38)"
  brown-850:   "lch(32% 34 38)"
  brown-900:   "lch(23% 24 38)"
  brown-950:   "lch(16% 14 40)"
  brown-1000:  "lch(10% 4 50)"

  lime-25:    "lch(99% 10 120)"
  lime-50:    "lch(98% 23 120)"
  lime-100:   "lch(96% 32 120)"
  lime-150:   "lch(90% 56 120)"
  lime-200:   "lch(84% 68 122)"
  lime-300:   "lch(78% 80 120)"
  lime-400:   "lch(72% 90 120)"
  lime-500:   "lch(65% 85 123)"
  lime-600:   "lch(56% 80 125)"
  lime-700:   "lch(50% 72 125)"
  lime-800:   "lch(41% 60 125)"
  lime-850:   "lch(32% 54 125)"
  lime-900:   "lch(23% 33 128)"
  lime-950:   "lch(17% 20 128)"
  lime-1000:  "lch(10% 5 130)"

  forest-25:    "lch(99% 6 150)"
  forest-50:    "lch(96% 25 150)"
  forest-100:   "lch(93% 42 151)"
  forest-150:   "lch(89% 63 151)"
  forest-200:   "lch(81% 78 152)"
  forest-300:   "lch(78% 89 152)"
  forest-400:   "lch(72% 87 152)"
  forest-500:   "lch(65% 80 152)"
  forest-600:   "lch(56% 75 153)"
  forest-700:   "lch(50% 70 153)"
  forest-800:   "lch(36% 64 158)"
  forest-850:   "lch(28% 44 150)"
  forest-900:   "lch(19% 30 152)"
  forest-950:   "lch(16% 21 158)"
  forest-1000:  "lch(10% 7 160)"

  mint-25:    "lch(99% 5 165)"
  mint-50:    "lch(96% 20 165)"
  mint-100:   "lch(93% 20 166)"
  mint-150:   "lch(89% 33 167)"
  mint-200:   "lch(84% 65 165)"
  mint-300:   "lch(78% 70 165)"
  mint-400:   "lch(72% 75 165)"
  mint-500:   "lch(65% 70 165)"
  mint-600:   "lch(56% 63 165)"
  mint-700:   "lch(49% 55 165)"
  mint-800:   "lch(41% 50 165)"
  mint-850:   "lch(32% 43 165)"
  mint-900:   "lch(23% 30 165)"
  mint-950:   "lch(16% 18 165)"
  mint-1000:  "lch(10% 4 165)"

  cyan-25:    "lch(99% 5 195)"
  cyan-50:    "lch(97% 17 195)"
  cyan-100:   "lch(94% 15 196)"
  cyan-150:   "lch(89% 27 195)"
  cyan-200:   "lch(84% 60 195)"
  cyan-300:   "lch(78% 62 195)"
  cyan-400:   "lch(72% 60 195)"
  cyan-500:   "lch(65% 53 195)"
  cyan-600:   "lch(56% 50 195)"
  cyan-700:   "lch(48% 42 195)"
  cyan-800:   "lch(36% 38 195)"
  cyan-850:   "lch(28% 38 195)"
  cyan-900:   "lch(18% 22 195)"
  cyan-950:   "lch(16% 15 195)"
  cyan-1000:  "lch(10% 5 210)"

  blue-25:    "lch(98% 3 240)"
  blue-50:    "lch(97% 6 240)"
  blue-100:   "lch(95% 10 243)"
  blue-150:   "lch(91% 15 255)"
  blue-200:   "lch(86% 27 255)"
  blue-300:   "lch(76% 55 253)"
  blue-400:   "lch(72% 54 255)"
  blue-500:   "lch(65% 58 255)"
  blue-600:   "lch(60% 61 255)"
  blue-700:   "lch(48% 51 255)"
  blue-800:   "lch(41% 46 255)"
  blue-850:   "lch(32% 38 255)"
  blue-900:   "lch(22% 32 252)"
  blue-950:   "lch(15% 18 250)"
  blue-1000:  "lch(11% 6 262)"

  indigo-25:    "lch(98% 3 280)"
  indigo-50:    "lch(96% 6 280)"
  indigo-100:   "lch(93% 11 280)"
  indigo-150:   "lch(91% 15 286)"
  indigo-200:   "lch(87% 20 284)"
  indigo-300:   "lch(78% 36 280)"
  indigo-400:   "lch(72% 47 280)"
  indigo-500:   "lch(64% 60 280)"
  indigo-600:   "lch(51% 85 280)"
  indigo-700:   "lch(47% 80 280)"
  indigo-800:   "lch(41% 72 280)"
  indigo-850:   "lch(32% 60 280)"
  indigo-900:   "lch(19% 30 266)"
  indigo-950:   "lch(14% 20 264)"
  indigo-1000:  "lch(10% 5 270)"

  violet-25:    "lch(98% 3 290)"
  violet-50:    "lch(97% 5 290)"
  violet-100:   "lch(93% 10 295)"
  violet-150:   "lch(90% 18 295)"
  violet-200:   "lch(84% 29 290)"
  violet-300:   "lch(78% 38 290)"
  violet-400:   "lch(72% 49 290)"
  violet-500:   "lch(65% 61 290)"
  violet-600:   "lch(56% 77 290)"
  violet-700:   "lch(49% 90 290)"
  violet-800:   "lch(41% 82 290)"
  violet-850:   "lch(32% 67 290)"
  violet-900:   "lch(23% 52 290)"
  violet-950:   "lch(16% 28 288)"
  violet-1000:  "lch(10% 5 285)"

  purple-25:    "lch(98% 5 320)"
  purple-50:    "lch(96% 10 320)"
  purple-100:   "lch(93% 17 320)"
  purple-150:   "lch(89% 30 320)"
  purple-200:   "lch(84% 42 320)"
  purple-300:   "lch(78% 60 320)"
  purple-400:   "lch(72% 78 320)"
  purple-500:   "lch(65% 95 320)"
  purple-600:   "lch(58% 100 320)"
  purple-700:   "lch(48% 94 320)"
  purple-800:   "lch(41% 75 320)"
  purple-850:   "lch(32% 60 320)"
  purple-900:   "lch(23% 40 320)"
  purple-950:   "lch(16% 18 320)"
  purple-1000:  "lch(10% 4 320)"

  pink-25:    "lch(98% 4 350)"
  pink-50:    "lch(96% 8 350)"
  pink-100:   "lch(93% 14 350)"
  pink-150:   "lch(89% 23 350)"
  pink-200:   "lch(84% 34 350)"
  pink-300:   "lch(78% 49 350)"
  pink-400:   "lch(72% 64 350)"
  pink-500:   "lch(65% 80 350)"
  pink-600:   "lch(58% 82 350)"
  pink-700:   "lch(50% 75 350)"
  pink-800:   "lch(41% 68 350)"
  pink-850:   "lch(32% 54 350)"
  pink-900:   "lch(23% 35 350)"
  pink-950:   "lch(16% 22 350)"
  pink-1000:  "lch(10% 6 350)"

  # ---- Semantic aliases (light theme — canonical) ---------------------------
  # Backgrounds — four elevation layers
  cn-bg-0:           "{colors.gray-25}"      # nav, sidebars, page chrome
  cn-bg-1:           "{colors.pure-white}"   # app base
  cn-bg-2:           "{colors.gray-25}"      # cards, form fields, dropdowns
  cn-bg-3:           "{colors.pure-white}"   # popovers, tooltips, dialogs

  # Text — four contrast levels + intent
  cn-text-1:         "{colors.pure-black}"   # headings, max emphasis
  cn-text-2:         "{colors.gray-850}"     # body, default
  cn-text-3:         "{colors.gray-700}"     # secondary, metadata
  cn-text-4:         "{colors.gray-600}"     # disabled, hints
  cn-text-success:   "{colors.lime-700}"
  cn-text-danger:    "{colors.red-700}"
  cn-text-warning:   "{colors.yellow-700}"
  cn-text-merged:    "{colors.purple-700}"
  cn-text-brand:     "{colors.indigo-700}"

  # Borders — three weights + intent
  cn-border-1:       "{colors.gray-500}"     # high contrast, interactive
  cn-border-2:       "{colors.gray-150}"     # default
  cn-border-3:       "{colors.gray-100}"     # subtle dividers
  cn-border-brand:   "{colors.indigo-700}"
  cn-border-success: "{colors.lime-500}"
  cn-border-danger:  "{colors.red-500}"
  cn-border-warning: "{colors.yellow-400}"

  # Intent sets — backgrounds for primary/secondary/outline roles. Components
  # reach for these via `cn-set-{intent}-{role}-{bg|text}` CSS variables; the
  # full matrix (14 intents × 3 roles × 4 properties) lives in
  # design-tokens/mode/light/default.json. Anchors below.
  cn-set-brand-primary-bg:        "{colors.indigo-700}"
  cn-set-brand-primary-text:      "{colors.pure-white}"
  cn-set-brand-secondary-bg:      "{colors.blue-100}"
  cn-set-brand-secondary-text:    "{colors.indigo-800}"
  cn-set-success-primary-bg:      "{colors.lime-500}"
  cn-set-danger-primary-bg:       "{colors.red-700}"
  cn-set-warning-primary-bg:      "{colors.yellow-400}"

# =============================================================================
# TYPOGRAPHY
# =============================================================================
# Inter for UI, JetBrains Mono for code. Variable-font weight axis maps the
# common 100–900 scale to its own `Thin/ExtraLight/310/360/440/550/Bold/...`
# values; in CSS the standard numeric weights resolve to those.
# 11 semantic roles below; the underlying 17-step `cn-size-*` scale and the
# six lineHeight multipliers (none 1.14 → loose 1.75) are documented in
# design-tokens/core/typography.json.
# =============================================================================
typography:
  heading-hero:
    fontFamily: Inter
    fontSize: 3.75rem
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: -0.02em
  heading-section:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  heading-subsection:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  heading-base:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.5
  heading-small:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.428
  body-strong:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.428
  body-normal:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.428
  body-code:
    fontFamily: JetBrains Mono
    fontSize: 0.813rem
    fontWeight: 400
    lineHeight: 1.428
  caption-strong:
    fontFamily: Inter
    fontSize: 0.788rem
    fontWeight: 500
    lineHeight: 1.25
  caption-normal:
    fontFamily: Inter
    fontSize: 0.788rem
    fontWeight: 400
    lineHeight: 1.25
  label-caps:
    fontFamily: Inter
    fontSize: 0.719rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em

# =============================================================================
# ROUNDED
# =============================================================================
# Canary's numeric scale is rounded.1–7 (2/4/6/8/12/16/24px) plus px/none/full.
# Mapped to the spec's xs–xl + named scale below.
# =============================================================================
rounded:
  none: 0px
  px:   1px
  xs:   2px
  sm:   4px
  md:   6px
  lg:   8px
  xl:   12px
  2xl:  16px
  3xl:  24px
  full: 9999px

# =============================================================================
# SPACING
# =============================================================================
# Semantic layout ramp. Underlying numeric scale (`size.0`…`size.96` with
# `-half` half-steps) lives in design-tokens/core/dimensions.json.
# =============================================================================
spacing:
  4xs: 2px
  3xs: 4px
  2xs: 6px
  xs:  8px
  sm:  12px
  md:  16px
  lg:  20px
  xl:  24px
  2xl: 32px
  3xl: 40px
  4xl: 80px

# =============================================================================
# COMPONENTS
# =============================================================================
# Anchor styles for the most common surfaces. Components are built on Radix
# primitives, expressed via class-variance-authority, and resolve every value
# through `cn-*` CSS variables. See packages/ui/src/components/ for source and
# packages/ui/tailwind-utils-config/components/ for the full style payloads.
# =============================================================================
components:
  button-primary:
    backgroundColor: "{colors.cn-set-brand-primary-bg}"
    textColor:       "{colors.cn-set-brand-primary-text}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.sm}"
    typography:      "{typography.body-strong}"
  button-primary-hover:
    backgroundColor: "{colors.indigo-800}"
  button-secondary:
    backgroundColor: "{colors.cn-set-brand-secondary-bg}"
    textColor:       "{colors.cn-set-brand-secondary-text}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.sm}"
  button-outline:
    backgroundColor: transparent
    textColor:       "{colors.cn-text-1}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.sm}"
  button-ghost:
    backgroundColor: transparent
    textColor:       "{colors.cn-text-1}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.sm}"
  input-default:
    backgroundColor: "{colors.cn-bg-1}"
    textColor:       "{colors.cn-text-2}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.sm}"
    typography:      "{typography.body-normal}"
  input-focus:
    backgroundColor: "{colors.cn-bg-1}"
    textColor:       "{colors.cn-text-1}"
  card:
    backgroundColor: "{colors.cn-bg-1}"
    textColor:       "{colors.cn-text-2}"
    rounded:         "{rounded.lg}"
    padding:         "{spacing.md}"
  card-selected:
    backgroundColor: "{colors.cn-set-brand-secondary-bg}"
  dialog:
    backgroundColor: "{colors.cn-bg-3}"
    textColor:       "{colors.cn-text-1}"
    rounded:         "{rounded.lg}"
    padding:         "{spacing.xl}"
  dropdown:
    backgroundColor: "{colors.cn-bg-3}"
    textColor:       "{colors.cn-text-2}"
    rounded:         "{rounded.sm}"
    padding:         "{spacing.2xs}"
  badge-primary:
    backgroundColor: "{colors.cn-set-brand-primary-bg}"
    textColor:       "{colors.cn-set-brand-primary-text}"
    rounded:         "{rounded.xs}"
    typography:      "{typography.caption-normal}"
  badge-status:
    backgroundColor: transparent
    textColor:       "{colors.cn-text-1}"
    rounded:         "{rounded.full}"
    typography:      "{typography.caption-normal}"

# =============================================================================
# THEMES (non-standard extension)
# =============================================================================
# Canary ships four base themes — light, light-dimmer, dark, dark-dimmer —
# plus protanopia/deuteranopia/tritanopia overlays and high-contrast variants
# of each. The spec models a single canonical theme; the block below mirrors
# the semantic aliases for `dark` so agents can reason about both modes
# without losing the canonical light values above. Spec-compliant consumers
# treat this as an unknown key (warning, preserved). Source:
# design-tokens/mode/dark/default.json.
# =============================================================================
themes:
  dark:
    cn-bg-0:           "{colors.pure-black}"
    cn-bg-1:           "{colors.gray-1000}"
    cn-bg-2:           "{colors.gray-950}"
    cn-bg-3:           "{colors.gray-950}"
    cn-text-1:         "{colors.gray-25}"
    cn-text-2:         "{colors.gray-200}"
    cn-text-3:         "{colors.gray-500}"
    cn-text-4:         "{colors.gray-600}"
    cn-text-brand:     "{colors.blue-400}"
    cn-border-1:       "{colors.gray-500}"
    cn-border-2:       "{colors.gray-850}"
    cn-border-3:       "{colors.gray-900}"
    cn-set-brand-primary-bg:     "{colors.indigo-700}"
    cn-set-brand-primary-text:   "{colors.pure-white}"
    cn-set-brand-secondary-bg:   "{colors.blue-950}"
    cn-set-brand-secondary-text: "{colors.blue-300}"
    cn-border-success: "{colors.forest-500}"
    cn-border-danger:  "{colors.red-600}"
    cn-border-warning: "{colors.yellow-500}"
---

# Harness Canary

Canary is the design system behind the Harness Unified UI — a B2B platform spanning CI/CD, GitOps, security, infrastructure, and observability. It ships as `@harnessio/ui` (Radix + Tailwind components) on top of `@harnessio/core-design-system` (style-dictionary tokens). This document is the single read-once source of truth: token values are normative, prose is context.

## Overview

**Identity.** Production B2B platform UI. Workflows are dense: long tables, deeply nested config, simultaneous side-by-side editors, multi-step pipelines. The system is built to hold a lot of information without becoming noisy.

**Personality.** Precise, neutral, pragmatic. Nothing decorative. Hierarchy comes from typography weight and contrast, not from color or texture. Color is reserved for meaning — brand actions, status, intent. The default surface is quiet so the data on it can be loud.

**Aesthetic anchors.**
- Soft corners (2–8px on most surfaces; `rounded.full` reserved for badges, avatars, and counter pills).
- Borders as the primary separator; backgrounds rarely shift more than one step between adjacent layers.
- Subtle elevation. Floating surfaces (dialogs, dropdowns, popovers) take real shadows.
- 150ms ease-in-out for state transitions; 200ms slide+fade for overlay enter/exit.

**Theme system.** Light is canonical. Dark, light-dimmer, and dark-dimmer ship out of the box, plus color-blindness overlays (protanopia, deuteranopia, tritanopia) and a high-contrast variant of each. Themes are switched via a class on the root; every component must read in all four base themes.

**Consumers.** This file is the source of truth for token values, component anchors, and system-level patterns. Consumer-side idioms — how `platformUI` (the primary downstream app) uses the system, including `<Text>` / `<IconV2>` / `<StatusBadge>` vocabulary, form composition with `FormWrapper`, and business-component import rules — live in `platformUI/DESIGN.md`. If you're authoring a new component, change tokens here. If you're using a component, the consumer guide is the right starting point.

## Colors

The color system has two layers and components only ever consume the second one.

**Layer 1 — Primitive ramps.** Fourteen hues (gray, red, orange, yellow, brown, lime, forest, mint, cyan, blue, indigo, violet, purple, pink) at sixteen shades each (`25`, `50`, `100`, `150`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `850`, `900`, `950`, `1000`), plus `pure.white` and `pure.black`. These are the raw pigments. Source: `packages/core-design-system/design-tokens/core/colors_hex.json`.

**Layer 2 — Semantic aliases.** The `cn-*` namespace. Components reference these and only these. Light-theme assignments live in `design-tokens/mode/light/default.json`; dark in `design-tokens/mode/dark/default.json`. The aliases break down into:

- `cn-bg-0`…`cn-bg-3` — four elevation layers from page chrome up to floating surface.
- `cn-text-1`…`cn-text-4` — four contrast levels from headings down to disabled.
- `cn-text-{success,danger,warning,merged,brand}` — intent text.
- `cn-border-1`…`cn-border-3` plus `cn-border-{brand,success,danger,warning}` — three neutral weights and intent borders.
- `cn-set-{intent}-{primary|secondary|outline}-{bg,text,bg-hover,bg-selected,ring}` — the full intent matrix. Fourteen intents (brand, success, danger, warning, blue, purple, brown, cyan, indigo, lime, mint, orange, pink, violet, gray, ai), three roles, four-to-five properties each.

**Intent assignments.**
- **brand** → `indigo` (primary action, focus, links).
- **success** → `lime` text / `forest` borders.
- **danger** → `red`.
- **warning** → `yellow`.
- **merged** → `purple` (PR-merged status; specific to git/code surfaces).
- **ai** → animated gradient (special-cased; see `Button` AI variant).

## Typography

**Families.** `Inter` for UI (`fontFamily.default`), `JetBrains Mono` for code. Both are variable fonts — Inter's weight axis maps the standard 100–900 ladder onto a denser numeric scale (`310`/`360`/`440`/`550` instead of Light/Regular/Medium/SemiBold) for finer control.

**Size scale.** Seventeen steps (`fontSize.0`…`fontSize.16`), 0.55rem (8.8px) → 8rem (128px). The scale is consumed via the eleven semantic roles enumerated in the frontmatter — code should reach for `body-normal`, `heading-section`, `caption-strong`, etc., not raw size tokens.

**Line heights.** Six multipliers — `none` (1.14), `tight` (1.25), `snug` (1.428), `normal` (1.5), `relaxed` (1.625), `loose` (1.75) — composed against each font size. Use `none`/`tight` for display, `snug`/`normal` for body.

**Tracking.** Six steps from `tighter` (-0.05em) for display down through `normal` (0em) up to `widest` (0.1em) for all-caps labels.

**Defaults.**
- Body copy: `body-normal` (14px / 440 weight / 1.428 line-height).
- UI labels: `body-strong` (14px / 550).
- Section headings: `heading-base` (16px / 550) or `heading-subsection` (24px / 550).
- Code/identifiers: `body-code` (13px / JetBrains Mono).
- Eyebrow / metadata: `label-caps` (11.5px / uppercase / 0.1em tracked).

Two weights per surface is the practical ceiling — mixing more than that reads as noise.

Source: `packages/core-design-system/design-tokens/core/typography.json`.

## Layout & Spacing

**Base unit.** 4px.

**Numeric scale.** `size.0` through `size.96` (0–384px) with `-half` half-steps in the dense ranges. Consume the semantic ramp (`4xs`…`4xl`) by default; reach for raw numeric tokens only for one-offs that don't fit.

**Component density.** Form controls run `sm`/`md` heights (32–36px). Padding scales with size: `cn-md` for default, `cn-sm` for compact, `cn-2xl` for dialog interiors. Lists and dropdowns use `2xs`/`3xs` row padding — focused, not sparse.

**Borders.** 1px is the workhorse. 1.5px and 2px exist for emphasis (active form fields, error states). Heavier borders are non-idiomatic.

**Viewport.** Canonical desktop is 1440px; the supported range is 1080–1919px. Source: `packages/core-design-system/design-tokens/breakpoint/desktop.json`.

Source: `packages/core-design-system/design-tokens/core/dimensions.json`.

## Elevation & Depth

Six shadow levels (`cn-shadow-1`…`cn-shadow-6`) plus an inset variant (`cn-shadow-inner`) and a zero level (`cn-shadow-0`, transparent — used for animating into shadow). The shadow color is derived from `gray-600` at 8–13% LCH alpha, so shadows tint with the surrounding theme rather than reading as flat black.

**Usage.**
- Cards: no shadow (except used in Pipelines). Bordered surface (`cn-border-2`) on `cn-bg-1`.
- Tooltips, popovers: `cn-shadow-3`.
- Dropdowns, menus: `cn-shadow-4`.
- Dialogs, modals: `cn-shadow-5`.
- Heaviest (`cn-shadow-6`): reserved for high-emphasis floating surfaces (rare).

**Focus rings.** Implemented as `box-shadow`, not `outline`. The `cn-ring-*` tokens are 4px outer halos in the relevant intent color (`cn-ring-selected`, `cn-ring-danger`, `cn-ring-success`, `cn-ring-warning`). Focus is always visible — no `:focus { outline: none }` without a replacement.

## Shapes

Canary leans soft, not pill-first. Buttons, inputs, cards, and dialogs all live in the 2–12px radius range. `rounded.full` (9999px) is reserved for:
- Badges and counter pills.
- Avatars and logo marks.
- Status dots (the leading indicator in `Badge variant="status"`).

Mixing sharp corners (`rounded.none`) and pill corners in the same surface is non-idiomatic and reads as a regression.

## Components

Canary ships ~115 components across form controls, navigation, data display, feedback, layout, and overlays. They share a common foundation:

- **Built on Radix UI** primitives for accessibility (focus management, ARIA, keyboard nav).
- **Compound component pattern** — `Dialog.Root` / `Dialog.Content` / `Dialog.Footer`, `Card.Root` / `Card.Title` / `Card.Content`. Consumers compose; the system doesn't try to predict every layout.
- **Variants via `class-variance-authority` (cva)** — variants are finite, named, and type-checked. No string-prop polymorphism.
- **Tokens via CSS variables** — every color, size, radius, and shadow resolves through a `--cn-*` custom property. Components never hardcode hex, px, or `oklch()`.
- **`forwardRef` everywhere** — imperative access is uniform.

**Component anchors:**

- **Button** (`packages/ui/src/components/button.tsx`) — variants: `primary`, `secondary`, `outline`, `ghost`, `link`, `transparent`, `ai`. Themes: `default`, `success`, `danger`. Sizes: `3xs`, `2xs`, `xs`, `sm`, `md` (default). Active state scales to 0.99. Focus ring is inset 2px `cn-chrome-25`. The `ai` variant is special-cased: animated gradient background.

- **Input** (`packages/ui/src/components/input.tsx`) — variants: `default`, `extended`, `clean`. Themes: `default`, `danger`. Sizes: `sm` (32px), `md` (36px). Focus-within shifts the border to `cn-brand` and adds a `cn-ring-selected` halo. Subcomponents: `Label`, `Caption`, `Message`.

- **Card** (`packages/ui/src/components/card.tsx`) — bordered surface (`cn-border-2`) on `cn-bg-1` with `rounded.lg` and `cn-md` padding. Sizes `sm`/`md`/`lg`, orientation `vertical`/`horizontal`, optional `interactive` hover that promotes the border to `cn-brand`, `selected` state that fills with `cn-set-brand-secondary-bg`.

- **Dialog** (`packages/ui/src/components/dialog.tsx`) — `cn-bg-3` content surface, `cn-shadow-5`, 1px `cn-border-3`. Sizes `sm`/`md`/`lg`/`max` (80vw). Header themes: `default`, `warning`, `danger`. Body is scroll-area-wrapped by default; footer carries a top border.

- **Dropdown / Select** (`packages/ui/src/components/dropdown-menu.tsx`) — `cn-bg-3` surface, `cn-shadow-4`, `rounded.sm`. Items use `cn-state-hover` highlight. Subcomponents include `CheckboxItem`, `RadioItem`, `AvatarItem`, `LogoItem`, `IconItem`, `IndicatorItem`, plus `Header`/`Footer`/`Separator`/`NoOptions`/`Spinner`.

- **Tabs** (`packages/ui/src/components/tabs.tsx`) — four list variants: `underlined` (default), `overlined`, `ghost`, `outlined`. Active indicator is the `cn-brand` underline; inactive triggers use `cn-text-3`, active use `cn-text-1`. Supports horizontal and vertical orientations.

- **Badge / Tag** (`packages/ui/src/components/badge.tsx`) — variants: `primary`, `secondary`, `outline`, `status`, `ghost`. Intent themes: `success`, `info`, `warning`, `danger`, `muted`, `merged`, `risk`. The `status` variant is bordered-only with a leading colored dot — no fill. Counter badges use `rounded.full` and a smaller size.

The full component property vocabulary is `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width` — every one resolves through a `cn-*` CSS variable.

Source: `packages/ui/src/components/`, with style payloads in `packages/ui/tailwind-utils-config/components/`.

## Do's and Don'ts

**Do**
- Reach for semantic aliases (`cn-text-1`, `cn-bg-2`, `cn-set-brand-primary-bg`) before primitive ramps. Only the design system itself reaches into the primitive layer.
- Let intent dictate color: `indigo` for brand actions, `red` for destructive, `lime`/`forest` for success, `yellow` for warning, `purple` for merged-PR states.
- Build new components on Radix + cva, with compound `Root`/sub-component composition matching the existing patterns.
- Hold transitions to 150ms ease-in-out for color/border/transform; 200ms slide+fade for overlay enter/exit.
- Use one primary action per surface — `button-primary` should denote the single most important action; everything else is `secondary`/`outline`/`ghost`.
- Maintain dark-theme parity. Every component must read in light, dark, light-dimmer, and dark-dimmer.
- Keep typography to two weights per surface. Hierarchy from size and contrast, not from weight stacking.

**Don't**
- Don't hardcode hex values, raw pixel measurements, or `oklch()` calls. Go through CSS variables — all of them — even for one-off styles.
- Don't mix `rounded.none` and `rounded.full` corners in the same surface. The system is soft-cornered; pill shapes are reserved for badges, avatars, and counter pills.
- Don't stack a shadow ≥ `cn-shadow-4` on a card. Cards are border-led; dialogs are shadow-led; mixing the two reads as a regression.
- Don't introduce a new top-level color name (e.g., `teal`) without an accompanying alias in `mode/<theme>/default.json` for every theme.
- Don't replace the Radix primitive under a Canary component. If you need different behavior, extend the wrapper or add a variant — don't fork the foundation.
- Don't disable focus rings without a replacement. `:focus { outline: none }` must always be paired with a `box-shadow` ring.
- Don't reach for shadow to differentiate adjacent surfaces. Use a border or a one-step background change first.
