---
title: Design-to-Code Flow Rules
description: What to do when a request does not fit the system: substitute, warn, and never hard-code colors
---

Rules for how an agent building in a consuming app handles requests the design system does not cover.

## Fix drift upstream, never patch it downstream

**Rule:** When your app needs a component to look or behave differently, raise the gap with the design system team rather than patching it locally. Don't override `@harnessio/ui` styles from the consumer with local CSS, `!important`, or wrapper components that re-style.

**Why:** Downstream overrides are invisible to the design system's audits and break on the next upgrade. They also hide the real signal — that the system is missing a variant.

**When a request can't be met with the component's props:** Don't fake it with `className`, `style`, or an unsupported prop (for example, colouring a `link` Button, which takes no `theme`). Use the nearest supported variant and theme (for example, `ghost` with `theme="danger"`), say in your reply what you substituted and why, and offer to raise the gap upstream. If no supported option is close, say so and ask rather than improvising.

**Warn on any documented-rule conflict:** If a request, or the code you are about to write, goes against **any** rule documented in a component contract, a pattern doc, or the system rules, warn the user **before** making the change. Name the rule and the file it is in, say what you would do instead, and wait for their choice. A documented rule means the system has an opinion on it. This covers a theme or variant that exists but means something else (for example `merged` to colour an "Active" badge), an override of a component's styles, a raw px value, and a missing accessible name. Do not apply the workaround first and explain afterwards. If the user confirms after the warning, make the change and say in your reply which rule it departs from.

**A skipped or unanswered warning means no change.** Skipping, dismissing, or saying "no preference" is not permission. Make no edit, say that nothing was changed, and leave the choice open.

**Hard-coded colours are never allowed and are never offered.** Do not write, suggest, or list as an option any hex, `rgb()`, `hsl()`, `lch()`, or named colour value, or a `style` or `className` colour override of a component's colour. This holds even if the user asks for it or confirms it. Say it is not allowed, and offer only the supported route: a component's `theme`, `variant` or `color` prop, a semantic token, or a different component such as `Tag` with a colour theme. If none fits, say so and offer to raise the gap upstream.

