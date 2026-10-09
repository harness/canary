---
name: accessibility
description: Use when a decorative visual primitive (Icon/Logo/Illustration) sits inside an interactive control, when building an icon-only trigger, or when reviewing focus/contrast tokens against WCAG. Cross-cutting foundation — covers accessible-name requirements, decorative-vs-functional graphics, and focus-indicator conformance. Triggers on icon-only buttons, tooltip triggers, aria-label questions, or focus-ring/contrast review.
domain: accessibility
prefix: ACC
version: 0.2.0
rules:
  - id: ACC-001
    title: Icon-only interactive controls need a programmatically-determinable accessible name, not specifically aria-label
    applies_to: []
    owner_artifact: guidelines
    tier: 1
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 4.1.2 Name, Role, Value (A)", verified: 2026-09-22}
      - {type: wcag, ref: "WCAG 2.2 SC 1.1.1 Non-text Content (A)", verified: 2026-09-22}
    conflicts: []
  - id: ACC-002
    title: Decorative Icon/Logo/Illustration primitives must be hidden from assistive tech by default, not merely unlabeled
    applies_to: [icon-v2, logo-v2, logo-symbol, illustration]
    owner_artifact: code
    tier: 1
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 1.1.1 Non-text Content (A)", verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/icon-v2/icon-v2.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/logo-v2/logo-v2.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/logo-v2/symbol.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/illustration/illustration.tsx, verified: 2026-09-22}
    conflicts: [ACC-CONF-001]
  - id: ACC-003
    title: A tooltip supplies an accessible description, never an accessible name
    applies_to: [icon-with-tooltip]
    owner_artifact: code
    tier: 1
    sources:
      - {type: docs, ref: "WAI-ARIA Authoring Practices Guide — Tooltip Pattern", verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/icon-with-tooltip.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/tooltip.tsx, verified: 2026-09-22}
    conflicts: [ACC-CONF-002]
  - id: ACC-004
    title: Focus-indicator token asserts WCAG conformance but its contrast/area is not independently verified
    applies_to: []
    owner_artifact: code
    tier: 2
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 2.4.7 Focus Visible (AA)", verified: 2026-09-22}
      - {type: wcag, ref: "WCAG 2.2 SC 1.4.11 Non-text Contrast (AA)", verified: 2026-09-22}
      - {type: wcag, ref: "WCAG 2.2 SC 2.4.13 Focus Appearance (AAA)", verified: 2026-09-22}
      - {type: code, ref: packages/core-design-system/design-tokens/mode/light/default.json, verified: 2026-09-22}
    conflicts: []
  - id: ACC-005
    title: Disabled-state opacity is correctly exempt from contrast requirements
    applies_to: []
    owner_artifact: guidelines
    tier: null
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 1.4.11 Non-text Contrast (AA)", verified: 2026-09-22}
    conflicts: []
  - id: ACC-006
    title: Icon-only interactive controls need a 24x24 CSS px minimum target size, not just an accessible name
    applies_to: [icon-with-tooltip]
    owner_artifact: code
    tier: 1
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 2.5.8 Target Size (Minimum) (AA)", verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/icon-with-tooltip.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/dist/styles.css, verified: 2026-09-22}
    conflicts: [ACC-CONF-003]
  - id: ACC-007
    title: Status meaning must not rely on color alone
    applies_to: []
    owner_artifact: guidelines
    tier: 3
    sources:
      - {type: wcag, ref: "WCAG 2.2 SC 1.4.1 Use of Color (A)", verified: 2026-09-22}
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-22}
      - {type: docs, ref: apps/portal/src/content/docs/components/feedback/status-badge.mdx, verified: 2026-09-22}
    conflicts: []
---

# Accessibility

Cross-cutting rules for decorative visual primitives (Icon/Logo/Illustration) inside interactive controls, icon-only triggers, and focus/contrast tokens. Sourced from WCAG 2.2 and the WAI-ARIA APG, cross-checked against canary source.

## ACC-001 — Icon-only interactive controls need a programmatically-determinable accessible name

WCAG 2.2 SC 4.1.2 + 1.1.1 (Level A): an icon-only control must expose an accessible name. `aria-label` is one sufficient technique — so are `aria-labelledby`, an associated `<label>`, or `title` (more fragile). Don't treat `aria-label` as the only option.

## ACC-002 — Decorative primitives must be hidden from assistive tech, not merely unlabeled

WCAG 2.2 SC 1.1.1: pure decoration must be ignorable by AT — via `aria-hidden="true"`, empty `alt`, or `role="presentation"`. Leaving a decorative SVG unlabeled isn't enough; some browsers still expose a bare inline SVG as an unnamed "image."

**Known gap (ACC-CONF-001):** `IconV2`, `LogoV2`, `LogoSymbol`, and `Illustration` set no default `aria-hidden`/`role` — the decorative posture isn't enforced by the components, it depends entirely on what the caller passes.

## ACC-003 — A tooltip supplies an accessible description, never an accessible name

A tooltip trigger wires `aria-describedby` (description), not `aria-labelledby` (name). A tooltip alone never gives a control its accessible name.

**Known bug (ACC-CONF-002):** `IconWithTooltip` renders a `<button>` with no `aria-label`/`aria-labelledby` and no visible text; `iconProps` only reaches the inner SVG. By its public API the button has no accessible name — add one (e.g. an `aria-label` prop threaded onto the button).

## ACC-004 — Focus-indicator token's WCAG conformance is unverified

The `focus` composite token (`border.brand` + `borderWidth.2`, solid) self-describes as "meeting WCAG requirements" but cites no criterion. SC 2.4.7 (AA) is satisfied by any visible indicator; SC 1.4.11 (AA, ≥3:1 against adjacent background) has not been computed for `border.brand` across surfaces/themes. Treat as an open contrast check, not an assumed pass.

## ACC-005 — Disabled-state opacity is exempt from contrast requirements

WCAG 2.2 SC 1.4.11 exempts disabled controls from the 3:1 floor. The shared `opacity.60` disabled token (`interaction-states` STA-001) is compliant by exemption — no change needed.

## ACC-006 — Icon-only interactive controls need a 24×24 CSS px minimum target size

WCAG 2.2 SC 2.5.8 (AA): pointer targets must be ≥24×24 CSS px (exceptions: spacing, equivalent, inline, user-agent, essential). An accessible name does not satisfy this — it's a separate criterion.

**Known gap (ACC-CONF-003):** `IconWithTooltip`'s button has no default padding and its default icon is `md` (18px), so the hit area can render ~18×18 px — under the floor. Add default padding/min-size, or require it of callers. Check the rendered hit area of any bare `<button><IconV2/></button>` too.

## ACC-007 — Status meaning must not rely on color alone

WCAG 2.2 SC 1.4.1 (A): color can't be the only cue. Pair a status color with a second signal — text, icon, or pattern. (`StatusBadge` docs already require this; applies equally to any bare status dot, colored row, or colored border.)

## Cross-references

- `icons`/`logos`/`logo-symbol`/`illustrations` — accessible-name guidance points here (ACC-001/ACC-002).
- `interaction-states` STA-002 is the code-token half of ACC-004.
