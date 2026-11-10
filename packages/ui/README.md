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

## Using Claude Code with @harnessio/ui

`docs/system/*.md` holds the cross-cutting design rules (colour, spacing, typography,
shadows, accessibility, interaction states). To make Claude Code follow them, and to reject
code that bypasses the components and tokens:

1. Install `@harnessio/ui` and make your `tailwind.config` use its preset.
2. Install the lint dependencies: `npm install -D eslint@8 eslint-plugin-react eslint-plugin-tailwindcss @typescript-eslint/parser`.
3. Run `npx harnessio-ui init-ai` in your project root. Add `--dry-run` to preview. It is opt-in: nothing is written until you run it, and re-running updates what it wrote.
4. Open `/hooks` once in Claude Code, or restart it, so the new hook loads.

`init-ai` writes three things:

- a PostToolUse hook in `.claude/settings.json` that lints every `.ts` and `.tsx` file Claude writes and returns violations to Claude in the same turn;
- `.claude/skills/design-system/SKILL.md`, the workflow, pointing at the docs and the installed types under `node_modules/@harnessio/ui`;
- a marked block in `CLAUDE.md` that makes reading the skill unconditional.

The lint rejects hex and `rgb()` colours, default-palette classes (`bg-blue-500`), inline
`style` for colour, type, spacing, radius or shadow, fixed widths and heights
(`w-[720px]`, `style={{ width: 720 }}`), arbitrary Tailwind values, classes the preset does
not define, raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` and `<table>`,
and imports from Radix, deep `@harnessio/ui` paths or other UI libraries. Allowed host
classes: `cn-root`, `cn-page-content`, `cn-page-content-pt` and the `light`/`dark` theme
classes. A size computed from data (`style={{ width: progress }}`) is allowed.

To lint outside Claude Code, extend the same config from an `.eslintrc.js`:

```js
module.exports = { root: true, extends: [require.resolve('@harnessio/ui/eslint')] }
```

Maintainer notes, fixtures and eval results: [`scripts/ai-eval/README.md`](./scripts/ai-eval/README.md).
