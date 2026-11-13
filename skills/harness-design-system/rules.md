---
title: Shared Rules for Product Module
description: Rules every page built from @harnessio/ui must follow, regardless of pattern; pattern docs inherit these
---

These rules apply to every page or feature built on `@harnessio/ui`. Pattern docs
(the files in `patterns/`) inherit them and add only the rules specific to their pattern.
The name in parentheses after a rule is its short identifier; cite it when you flag a violation.

**Imports.** Import only from public `@harnessio/ui` entry points (for example
`@harnessio/ui/components`), and only names that entry point exports. Never import from
`src/` or `dist/` paths, and never invent a component. (`public-imports`)

**Colors.** No hex, rgb, hsl, or oklch literals; colors come from the components. See
`color-system.md`. (`no-color-literals`) No palette or fixed color utilities such as
`bg-blue-500` or `text-white`; use semantic tokens and component props.
(`no-palette-colors`) Hard-coded colours are never
allowed and are never offered as an option, even if the user asks for or confirms them: say it
is not allowed and offer only a component's `theme`, `variant` or `color` prop, a semantic
token, or a different component such as `Tag` with a colour theme.

**Sizing and spacing.** No Tailwind arbitrary values such as `w-[420px]` or `text-[#333]`.
Drawer width comes from `size`; spacing comes from `Layout` `gap` props or real `cn-*`
spacing aliases. See `spacing.md`. (`no-arbitrary-values`) Every `cn-*` class must exist in
the shipped stylesheet. (`known-cn-classes`)

**Inline style.** No `style` attribute. (`no-inline-style`)

**Raw elements.** Do not hand-build `<input>`, `<textarea>`, `<select>`, `<label>`,
`<button>`, `<table>` or `<dialog>`. Use `FormInput.*`, `Button`, `Table.*` and `Drawer` or
`Dialog`. (`no-raw-elements`)

**Text and wrapping.** Text style comes from `Text variant`, not font or color utilities.
See `typography.md`. Do not wrap components in a styled `div` to restyle them; if a
component cannot do what the design needs, report the gap instead of overriding it.

**App setup.** Components need the stylesheet, a theme class and `cn-root` from the host app.
Check `app-setup.md` before diagnosing any "renders but looks wrong" report, and do not add
wrappers or imports speculatively.

## When the system can't do what's asked

**Fix drift upstream, never patch it downstream.** When the app needs a component to look or
behave differently, raise the gap with the design system team. Don't override `@harnessio/ui`
styles with local CSS, `!important`, or wrapper components that re-style. Downstream overrides
are invisible to the design system's audits, break on the next upgrade, and hide the real
signal: that the system is missing a variant.

**Substitute, and say so.** If a request can't be met with the component's props, don't fake it
with `className`, `style` or an unsupported prop (for example, colouring a `link` Button, which
takes no `theme`). Use the nearest supported variant and theme (for example, `ghost` with
`theme="danger"`), say in your reply what you substituted and why, and offer to raise the gap
upstream. If no supported option is close, say so and ask rather than improvising.

**Warn before departing from a documented rule.** If a request, or code you are about to write,
goes against any rule documented in a component guide, a pattern or these rules, warn the user
before making the change. Name the rule and the file it is in, say what you would do instead,
and wait for their choice. This covers a theme or variant that exists but means something else
(for example `merged` to colour an "Active" badge), an override of a component's styles, a raw
px value, and a missing accessible name. Do not apply the workaround first and explain
afterwards. If the user confirms after the warning, make the change and say in your reply which
rule it departs from.

**A skipped or unanswered warning means no change.** Skipping, dismissing, or saying "no
preference" is not permission. Make no edit, say that nothing was changed, and leave the choice
open.

## Patterns

- [page-layout](./patterns/page-layout.md): settings list page
- [edit-drawer-pattern](./patterns/edit-drawer-pattern.md): create/edit drawer

## Foundations

- [accessibility](./foundations/accessibility.md)
- [app-setup](./foundations/app-setup.md)
- [color-system](./foundations/color-system.md)
- [shadows](./foundations/shadows.md)
- [spacing](./foundations/spacing.md)
- [typography](./foundations/typography.md)
- [visual-primitives](./foundations/visual-primitives.md)
