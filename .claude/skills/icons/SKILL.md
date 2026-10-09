---
name: icons
description: Use when adding, choosing, or coloring an icon in Canary (IconV2). Covers sizing, color roles, and the missing-icon fallback behavior. Triggers on icon name lookups, icon color props, or "icon not found" warnings.
domain: icons
prefix: null
version: 0.1.0
rules: []
---

# Icons

Guidance for `IconV2` and `IconWithTooltip`. Sourced from the docs site (`icon.mdx`, `foundations/icons.mdx`) and `icon-v2.tsx`.

## Sizing is a fixed enum, default `sm`

Six sizes: `2xs`, `xs`, `sm`, `md`, `lg`, `xl` (default `sm` — note Logo defaults to `lg`). Use `skipSize` to opt out of the size class when controlling size via CSS, rather than a custom className.

## Color is an 8-value enum, larger than the status-color set

`color` accepts: `inherit` (default), `danger`, `warning`, `success`, `info`, `risk`, `neutral`, `merged` — a larger set than the general status colors (`color-semantics` ICN-004 found only success/danger/warning). `neutral` reuses the `text-cn-disabled` class rather than getting its own token.

**Docs/code conflict:** `icon.mdx` lists `disabled` as the 8th value, but the code (`icon-v2.tsx`, confirmed by tests) implements `merged` (purple), not `disabled`. `merged` is the trustworthy value — `StatusBadge`'s theme enum documents it as a real cross-component role. Likely a docs typo; confirm with the component owner before relying on it. In practice `info` is widely used (95+ platformUI call sites); `risk` has no usage yet.

## Missing icon names fail silently

If `name` doesn't resolve in `IconNameMapV2`: with a `fallback`, it renders the fallback icon + `console.warn`; without, it renders `null` + `console.warn`. No thrown error, no visible broken-icon marker — a typo'd or removed icon just disappears. Always pass a `fallback` for any name sourced from dynamic/external data.

## Icons compose as their own element, not a prop

`IconV2` is a standalone `forwardRef<SVGSVGElement>` — compose it as a child element (e.g. inside `Button`), don't pass it as a `name`/`icon` string prop to other components. Don't invent an `iconName` prop; check whether the component expects a composed `IconV2` child instead.

## `IconWithTooltip` pairs an icon with a focusable trigger

Composes `IconV2` inside a real `<button>` wrapped by `Tooltip`. `content` sets the tooltip body; `iconProps` forwards to the icon (defaults to `info-circle` at `md`); `disabled` suppresses the tooltip without removing the icon. Reach for this when an icon needs its own explanatory text.

## Accessibility

`IconV2` renders a decorative SVG with no accessible name and no `title`/`aria-label`. For an icon-only interactive control the *parent* needs the accessible name (see `accessibility` ACC-001). `IconWithTooltip` is **not** a safe exception — its tooltip only wires `aria-describedby` (a description, not a name), and its button has no default padding/min target size (see ACC-003 and ACC-006). `IconV2` also sets no default `aria-hidden`/`role`, so its decorative posture isn't enforced by the component (ACC-002).
