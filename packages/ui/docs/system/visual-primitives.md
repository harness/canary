---
title: Visual Primitives — Design Decisions
description: Global rules for when and how to use icons, logos, and illustrations
---

Three global design decisions for visual primitives (icons, logos, illustrations).

---

## Use LogoV2 for official brand; use LogoSymbol for UI integration

**Rule:** Use full-color `LogoV2` when you need official brand appearance (splash screens, marketing, official headers, brand-forward contexts). Use monochrome `LogoSymbol` when a mark needs to blend with the UI (inside buttons, toolbars, on colored surfaces where the mark should inherit the surrounding text color).

**Why:** Protects brand identity while allowing flexible UI integration.

---

## Icon colors are limited to global status colors

**Rule:** In global/shared UI, use only `inherit`, `danger`, `warning`, `success`. These map
to global semantic tokens.

**Product-specific colors:** Individual products (Pipelines, Code Repository, AI Code
Review) may use `info`, `risk`, `merged` — these are NOT global rules and belong in
product-specific guidance (domain rules). Don't assume they're available in all Harness
contexts. `merged` is the purple used for merged-state indicators.

**Which product colors are actually exercised** (platformUI consumer telemetry, point-in-time
late 2026 — a usage hint, not verifiable from this repo): `info` is widely used (~95+ call
sites); `risk` has no call sites yet. Useful when judging which product colors to lean on,
but confirm current usage before treating either as settled.

**Why:** Keeps the global component lean; product-specific enums belong in domain-specific
rules.

**What the component actually accepts** (`src/components/icon-v2/icon-v2.tsx`, the
authoritative list — the rule above is governance, not a technical limit):
`inherit`, `danger`, `warning`, `success`, `info`, `neutral`, `merged`, `risk`.
`neutral` renders via the `text-cn-disabled` class.

**Disabled icons use `neutral`.** It applies `text-cn-disabled`, the shared disabled text
color. There is no `color="disabled"` on `IconV2`, even though `Text` spells the identical
color `disabled` — the two components disagree on the name for one token. Known
inconsistency, deliberately left alone for now; reach for `neutral` on icons and `disabled`
on text.

Because of that, `tag.tsx` greys a disabled icon by passing `className` rather than the
`color` prop. Follow the existing pattern in a component rather than assuming
`color="disabled"` exists.

---

## Compose IconV2 as a child; its name prop is `name`, not `iconName`

**Rule:** `IconV2` is a standalone `forwardRef<SVGSVGElement>`. Its own icon prop is `name`
(type `IconV2NamesType`) — there is no `iconName` on `IconV2` itself. Compose it as a child
element (e.g. inside `Button`) rather than passing an icon as a string prop to an arbitrary
component.

**But `iconName` is a real prop elsewhere.** ~11 wrapper components (e.g. `PageHeaderV2`,
`SidebarItem`) do accept an `iconName?: IconV2NamesType` string. So the anti-pattern is not
"`iconName` never exists" — it's *don't invent or assume it*. Before wiring an icon into a
component, check that component's actual props: some want a composed `IconV2` child, some
want an `iconName` string. Don't guess which.

---

## Decorative visual primitives must be hidden from assistive tech

**Rule:** Icons, logos, and illustrations are typically decorative SVGs. They must be invisible to screen readers — use `aria-hidden="true"` or `role="presentation"`. Convey meaning through adjacent text (labels, headings, descriptions), not the artwork alone.

**See also:** Accessibility rules for icon-only interactive controls (which need both an accessible name AND the decorative graphics hidden).

---

## Icons: sizing, and missing names fail silently

**Sizing:** `size` is a fixed enum — `2xs`, `xs`, `sm`, `md`, `lg`, `xl` — default `sm`. To size via CSS, set `skipSize` instead of fighting the size class with `className`.

**Missing names:** if `name` isn't in the icon map, `IconV2` renders the `fallback` icon (if given) or nothing, and logs a `console.warn`. It never throws and shows no broken-icon marker, so a typo'd or removed icon just disappears. Always pass a `fallback` when the name comes from dynamic or external data.

**`IconWithTooltip`** composes `IconV2` inside a real `<button>` wrapped by `Tooltip`. `content` is the tooltip body, `iconProps` forwards to the icon (default `info-circle` at `md`), and `disabled` suppresses the tooltip without removing the icon. Its tooltip is a description, not a name — see the Accessibility rules.

---

## Logos: LogoV2 is fixed-color; LogoSymbol follows text color

**`LogoV2`** has no `color` prop and no light/dark asset split — every entry renders one fixed brand-colored asset. Don't recolor it or stretch it with mismatched dimensions. If a mark must follow the theme or text color, use `LogoSymbol`.

**`LogoSymbol`** is monochrome and drawn with `currentColor`, so it inherits the parent's text color. Set it with a text-color class on the parent or the element, not a `color` prop (it has none) and not a `fill`/`color` CSS override.

**Shared behavior:** sizes are `xs`, `sm`, `md`, `lg`, default `lg` (unlike `IconV2`, which defaults to `sm`). `skipSize` and the missing-name fallback work exactly as for icons: a `fallback` name renders with a `console.warn`, no fallback renders nothing. Both components share the brand name set.

---

## Illustrations: pixel sizing, and theme-dependent assets need a `-light` variant

**Sizing:** `Illustration` takes `size?: number` in raw pixels (default `112`), or separate `width`/`height` overrides. The icon/logo size enum does not apply.

**Theme handling:** with `themeDependent` on and a light theme, the component looks for a `<name>-light` entry in `IllustrationsNameMap` and uses it if present. If there isn't one, it applies a CSS `invert` to the dark asset — a geometric approximation, not a real light illustration. If the dark asset doesn't invert cleanly (e.g. a red accent turning cyan), author a real `-light` variant. The fallback gives a wrong-looking result silently, not an error.

---

## Cross-references

- **Accessibility** — Rules for icon-only buttons, accessible names, decorative-vs-interactive graphics
- **Color System** — Semantic color tokens
- For component-specific details (sizing, API, fallback behavior, naming patterns), see the component documentation (icon.mdx, logo.mdx, illustration.mdx)
