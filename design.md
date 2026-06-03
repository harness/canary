---
version: alpha
name: Harness Canary
description: Production design system for the Harness Unified UI — Radix-based React components grounded in style-dictionary tokens, consumed via Tailwind. Source of truth for `@harnessio/ui` and downstream apps (`frontend/platformUI`).

# =============================================================================
# COLORS
# =============================================================================
# Two layers:
#   1. Primitive ramps — 14 hues × 16 shades, plus pure white/black. Verbatim
#      from packages/core-design-system/design-tokens/core/colors_hex.json.
#   2. Semantic aliases (`cn-*`) — what components consume. Light theme is
#      canonical; dark variants live under `themes.dark` below. Verbatim from
#      packages/core-design-system/design-tokens/mode/light/default.json.
# Always reference aliases (`{colors.cn-bg-1}`), never primitives, in
# component code.
# =============================================================================
colors:
  # ---- Primitives ------------------------------------------------------------
  pure-white: "#ffffff"
  pure-black: "#0f1013"

  gray-25:    "#fcfcfc"
  gray-50:    "#f6f6f6"
  gray-100:   "#e7e8e9"
  gray-150:   "#d9d9db"
  gray-200:   "#ced1d7"
  gray-300:   "#bec3ce"
  gray-400:   "#b5bbc7"
  gray-500:   "#989ea8"
  gray-600:   "#848892"
  gray-700:   "#6b6f79"
  gray-800:   "#484d5b"
  gray-850:   "#343a47"
  gray-900:   "#242730"
  gray-950:   "#1a1b1e"
  gray-1000:  "#161617"

  red-25:     "#fff7f8"
  red-50:     "#fff0f1"
  red-100:    "#ffe5e6"
  red-150:    "#ffd1d2"
  red-200:    "#ffbabc"
  red-300:    "#ffa9ac"
  red-400:    "#ff8f8f"
  red-500:    "#ff7870"
  red-600:    "#ff5550"
  red-700:    "#d22d34"
  red-800:    "#c33035"
  red-850:    "#8f2c2b"
  red-900:    "#4d1519"
  red-950:    "#3d1418"
  red-1000:   "#1e1518"

  orange-25:    "#fffaf5"
  orange-50:    "#fff1e4"
  orange-100:   "#ffe6d1"
  orange-150:   "#ffd8b9"
  orange-200:   "#ffc49d"
  orange-300:   "#ffad7a"
  orange-400:   "#ff9355"
  orange-500:   "#ff7b31"
  orange-600:   "#e95d00"
  orange-700:   "#c44d00"
  orange-800:   "#a63d00"
  orange-850:   "#7d3716"
  orange-900:   "#542615"
  orange-950:   "#382218"
  orange-1000:  "#1f1b18"

  yellow-25:    "#fffced"
  yellow-50:    "#fff4b9"
  yellow-100:   "#feea93"
  yellow-150:   "#fedc64"
  yellow-200:   "#ffc833"
  yellow-300:   "#f8af00"
  yellow-400:   "#f49b00"
  yellow-500:   "#e38600"
  yellow-600:   "#cf7200"
  yellow-700:   "#b05d10"
  yellow-800:   "#904f1c"
  yellow-850:   "#6e3f1d"
  yellow-900:   "#4e2f19"
  yellow-950:   "#342418"
  yellow-1000:  "#1e1b19"

  brown-25:    "#fff8f6"
  brown-50:    "#fff0ed"
  brown-100:   "#ffe5df"
  brown-150:   "#ffd6cc"
  brown-200:   "#ffc3b4"
  brown-300:   "#ffab97"
  brown-400:   "#ff9179"
  brown-500:   "#ea7e67"
  brown-600:   "#c86b57"
  brown-700:   "#ac5e4d"
  brown-800:   "#8f4e40"
  brown-850:   "#703d31"
  brown-900:   "#502d25"
  brown-950:   "#37231d"
  brown-1000:  "#1f1b18"

  lime-25:    "#f8ffeb"
  lime-50:    "#efffd4"
  lime-100:   "#e5fbc0"
  lime-150:   "#c8ef8c"
  lime-200:   "#ace16c"
  lime-300:   "#97d240"
  lime-400:   "#7ec30a"
  lime-500:   "#65b000"
  lime-600:   "#4e9700"
  lime-700:   "#448600"
  lime-800:   "#376d00"
  lime-850:   "#2c5506"
  lime-900:   "#233d13"
  lime-950:   "#1f2c16"
  lime-1000:  "#1a1c18"

  forest-25:    "#f4fff6"
  forest-50:    "#d6fddf"
  forest-100:   "#b5fbc8"
  forest-150:   "#8df5ad"
  forest-200:   "#5de28d"
  forest-300:   "#1ddd79"
  forest-400:   "#00cb6c"
  forest-500:   "#00b660"
  forest-600:   "#009b51"
  forest-700:   "#008947"
  forest-800:   "#006232"
  forest-850:   "#004a26"
  forest-900:   "#093521"
  forest-950:   "#0b2e1e"
  forest-1000:  "#141e19"

  mint-25:    "#f3fff9"
  mint-50:    "#d4fdea"
  mint-100:   "#CDF4E3"
  mint-150:   "#ABEDD3"
  mint-200:   "#4aebb4"
  mint-300:   "#00dba2"
  mint-400:   "#00c994"
  mint-500:   "#00b484"
  mint-600:   "#009970"
  mint-700:   "#008561"
  mint-800:   "#006f50"
  mint-850:   "#00573e"
  mint-900:   "#00402d"
  mint-950:   "#0f2d22"
  mint-1000:  "#161d1a"

  cyan-25:    "#f2fffe"
  cyan-50:    "#d5fffd"
  cyan-100:   "#D7F4F3"
  cyan-150:   "#ADEBE9"
  cyan-200:   "#00eae8"
  cyan-300:   "#00d8d6"
  cyan-400:   "#00c6c4"
  cyan-500:   "#00b1af"
  cyan-600:   "#009795"
  cyan-700:   "#00807f"
  cyan-800:   "#005f5e"
  cyan-850:   "#004a49"
  cyan-900:   "#053231"
  cyan-950:   "#082d2d"
  cyan-1000:  "#151d1e"

  blue-25:    "#f4fafe"
  blue-50:    "#eef8ff"
  blue-100:   "#E1F3FE"
  blue-150:   "#D3E9FD"
  blue-200:   "#B5DCFD"
  blue-300:   "#5cbdff"
  blue-400:   "#5eb8ff"
  blue-500:   "#2da6ff"
  blue-600:   "#009ae7"
  blue-700:   "#007ab8"
  blue-800:   "#00679d"
  blue-850:   "#00517c"
  blue-900:   "#004466"
  blue-950:   "#082b40"
  blue-1000:  "#191e25"

  indigo-25:    "#f8f9ff"
  indigo-50:    "#f1f3ff"
  indigo-100:   "#e7eaff"
  indigo-150:   "#E0E4FF"
  indigo-200:   "#D1D8FA"
  indigo-300:   "#b1bfff"
  indigo-400:   "#9aaeff"
  indigo-500:   "#7699ff"
  indigo-600:   "#007bfe"
  indigo-700:   "#006dea"
  indigo-800:   "#005fcd"
  indigo-850:   "#004aa3"
  indigo-900:   "#093054"
  indigo-950:   "#10253c"
  indigo-1000:  "#191e25"

  violet-25:    "#f9f9ff"
  violet-50:    "#f7f6ff"
  violet-100:   "#ECEAFE"
  violet-150:   "#E3E0FC"
  violet-200:   "#d1cdff"
  violet-300:   "#bfbbff"
  violet-400:   "#aca9ff"
  violet-500:   "#9495ff"
  violet-600:   "#707bff"
  violet-700:   "#4c68ff"
  violet-800:   "#3956dc"
  violet-850:   "#3143a9"
  violet-900:   "#25317c"
  violet-950:   "#21254b"
  violet-1000:  "#1b1b22"

  purple-25:    "#fef7ff"
  purple-50:    "#fdefff"
  purple-100:   "#fce3ff"
  purple-150:   "#fad3ff"
  purple-200:   "#f6bfff"
  purple-300:   "#f2a6ff"
  purple-400:   "#ec8cff"
  purple-500:   "#e56bff"
  purple-600:   "#d949f9"
  purple-700:   "#b035cc"
  purple-800:   "#9537aa"
  purple-850:   "#722e81"
  purple-900:   "#502659"
  purple-950:   "#352138"
  purple-1000:  "#1e1a1f"

  pink-25:    "#fff7fa"
  pink-50:    "#fff0f6"
  pink-100:   "#ffe4ef"
  pink-150:   "#ffd4e6"
  pink-200:   "#ffbfdb"
  pink-300:   "#ffa6cf"
  pink-400:   "#ff8ac3"
  pink-500:   "#ff63b5"
  pink-600:   "#ee49a3"
  pink-700:   "#d1358d"
  pink-800:   "#b11f75"
  pink-850:   "#87205a"
  pink-900:   "#5e2040"
  pink-950:   "#3d1d2d"
  pink-1000:  "#201a1d"

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
- Subtle elevation. Cards are border-led; only floating surfaces (dialogs, dropdowns, popovers) take real shadows.
- 150ms ease-in-out for state transitions; 200ms slide+fade for overlay enter/exit. No bounce, no spring.

**Theme system.** Light is canonical. Dark, light-dimmer, and dark-dimmer ship out of the box, plus color-blindness overlays (protanopia, deuteranopia, tritanopia) and a high-contrast variant of each. Themes are switched via a class on the root; every component must read in all four base themes.

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

**Families.** `Inter` for UI (`fontFamily.default`), `JetBrains Mono` for code, identifiers, and tabular data (`fontFamily.mono`). Both are variable fonts — Inter's weight axis maps the standard 100–900 ladder onto a denser numeric scale (`310`/`360`/`440`/`550` instead of Light/Regular/Medium/SemiBold) for finer control.

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
- Cards: no shadow. Bordered surface (`cn-border-2`) on `cn-bg-1`.
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
