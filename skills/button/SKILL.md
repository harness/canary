---
name: button
description: The library's only guaranteed-actionable control — seven emphasis variants, four semantic themes, five sizes, icon-only mode, and automatic loading from a promise-returning onClick
---

# Button Component

Import: `import { Button } from '@harnessio/ui/components'`

Read in this order:

1. [references/props.json](references/props.json): the contract. Props, values, rules. If a prop or value is not here, it does not exist.
2. [references/pattern.md](references/pattern.md): when to use it, composition, judgment calls.

Before writing code, read [../rules.md](../rules.md). If you cannot, these still apply:

- Import only from `@harnessio/ui/components` (public entry points), never from `src/` or `dist/` paths.
- No hex, rgb or hsl colours, no palette utilities like `bg-blue-500`, and no `style` attribute. Use component props and semantic tokens.
- No arbitrary values like `w-[420px]`. Spacing comes from `Layout` `gap`, and drawer width from `size`.
- Do not restyle a component with `className` or a wrapper. If it cannot do what is asked, use the nearest supported option, say what you substituted, and offer to raise the gap with the design system team.
- If a request goes against a documented rule, warn the user before changing anything and wait for their answer.
- A component not listed in [../components.md](../components.md) has no guide here: say so rather than guessing its props.
