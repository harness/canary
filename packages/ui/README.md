# Canary UI

Canary UI is Harness' Unified Component Library built on top of Shadcn/Radix and TailwindCSS.

## Setup

Installing the package is not enough to make components look right. A host app must also:

```ts
import '@harnessio/ui/styles.css'
```

and put a **theme class** and `cn-root` on an ancestor of the components. The package
applies neither for you, and getting them wrong fails quietly: unthemed surfaces, or
`border-*` utilities drawing nothing.

**Read [`docs/system/app-setup.md`](./docs/system/app-setup.md) before first render**, and
before diagnosing any "it renders but looks wrong" report. It covers the stylesheet, the
theme class, and routing portaled overlays through a `cn-root` host.

## Design rules

`docs/system/*.md` holds the cross-cutting design rules (colour, spacing, typography,
shadows, accessibility, interaction states). AI agents should start at
`.claude/skills/design-system/SKILL.md`.
