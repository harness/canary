---
title: Shared Rules for Product Module
description: Rules every page built from @harnessio/ui must follow, regardless of pattern; pattern docs inherit these
checks:
  - public-imports
  - no-color-literals
  - no-arbitrary-values
  - no-palette-colors
  - no-inline-style
  - no-raw-elements
  - known-cn-classes
---

These rules apply to every page or feature built on `@harnessio/ui`. Pattern docs
(the files in `patterns/`) inherit them and add only the rules specific to their pattern.
The name in parentheses after a rule is its check name; a checker that reports violations
reports them by that name.

**Imports.** Import only from public `@harnessio/ui` entry points (for example
`@harnessio/ui/components`), and only names that entry point exports. Never import from
`src/` or `dist/` paths, and never invent a component. (`public-imports`)

**Colors.** No hex, rgb, hsl, or oklch literals; colors come from the components. See
`color-system.md`. (`no-color-literals`) No palette or fixed color utilities such as
`bg-blue-500` or `text-white`; use semantic tokens and component props.
(`no-palette-colors`)

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

**Rule conflicts.** If a request, or code you are about to write, goes against any documented
rule, warn the user before making the change: name the rule, say what you would do instead,
and wait. A skipped or unanswered warning means no change. If a component cannot do what the
design needs, use the nearest supported variant, say what you substituted, and report the gap.
Hard-coded colours are never allowed and never offered, even if the user confirms. Full text:
`design-to-code-flow.md`.

**App setup.** Components need the stylesheet, a theme class and `cn-root` from the host app.
Check `app-setup.md` before diagnosing any "renders but looks wrong" report, and do not add
wrappers or imports speculatively.
