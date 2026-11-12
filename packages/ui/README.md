# Canary UI

Canary UI is Harness' Unified Component Library built on top of Shadcn/Radix and TailwindCSS.

## Setup

Installing the package is not enough to make components look right. A host app must also:

```ts
import '@harnessio/ui/styles.css'
```

and put a **theme class** and `cn-root` on an ancestor of the components. The package
applies neither for you, and getting them wrong fails quietly — unthemed surfaces, or
`border-*` utilities drawing nothing.

**Read [`docs/system/app-setup.md`](./docs/system/app-setup.md) before first render**, and
before diagnosing any "it renders but looks wrong" report. It covers the stylesheet, the
theme class, and routing portaled overlays through a `cn-root` host.

## Component contracts

Props, allowed values, defaults and tokens are defined per component, not in this README:

- `schemas/registry.json` — which components have a contract, and where each one's files are
- `schemas/{component}.manifest.json` — the authoritative API
- `schemas/{component}.md` — when to use the component, when not to, known gaps
- `docs/system/*.md` — cross-cutting design rules

AI agents should start at `.claude/skills/design-system/SKILL.md`, which routes to these in
priority order.

## Packaged documentation

From the repository root, export Button, TextInput and Select without building the documentation site:

```sh
pnpm --filter @harnessio/ui guidance:build
node --test packages/ui/scripts/build-agent-guidance.test.mjs
```

Read the generated files in `packages/ui/agent/components/`. The UI build and `prepack` run the same generator; `agent/` is generated output included in the package, not a second documentation source.

Edit the existing pages under `apps/portal/src/content/docs/components/`. The exporter preserves ordinary Markdown, converts `DocsPage.ComponentExample` into code fences and `DocsPage.PropsTable` into tables, and preserves `Aside` notes. Unsupported MDX or dynamic expressions fail the export rather than disappear. No component example markers are required. The compact setup excerpt still uses the existing `package-guidance` markers in `design-system/usage.mdx`.

The manifest records package version, source hashes and coverage. Each page also supplies one standalone starter example, selected by its existing section (Button: “Default Button”; TextInput/Select: introduction). Exporting every snippet does not certify that every snippet compiles or behaves correctly. The Platform UI reviewer PoC retrieves the three documents and type-checks those three exact starter files against the packed package; it does not validate the remaining live examples.
