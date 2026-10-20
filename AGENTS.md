# Canary — Agent Guide

PNPM monorepo containing shared component libraries and packages for the Harness Unified UI. Consumed primarily by `frontend/platformUI`.

## Tech Stack

- **Language**: TypeScript
- **Package manager**: PNPM (monorepo)
- **Build**: Vite
- **Styling**: Tailwind CSS
- **React constraint**: All packages must support React 17

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@harnessio/ui` | `packages/ui/` | Main component library (Radix UI + ShadCN + Tailwind); includes portable foundational design rules in `docs/system/` |
| `@harnessio/ai-chat-core` | `packages/ai-chat-core/` | Framework-agnostic AI chat state machine |
| `@harnessio/filters` | `packages/filters/` | Filter/search components |
| `@harnessio/forms` | `packages/forms/` | React Hook Form + Zod/Yup form primitives |
| `@harnessio/pipeline-graph` | `packages/pipeline-graph/` | Pipeline visualization graph |
| `@harnessio/yaml-editor` | `packages/yaml-editor/` | Monaco-based YAML editor |
| `@harnessio/core-design-system` | `packages/core-design-system/` | Design tokens and themes (style-dictionary) |

## Common Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm test             # Run tests across all packages
pnpm clean            # Remove all dist/ and node_modules/
```

## Package-Level Docs

Packages with detailed agent guides:

- [`packages/ui/AGENTS.md`](packages/ui/AGENTS.md) — Main component library: manifests, design system contracts, component discovery, Figma Code Connect
- [`packages/ai-chat-core/AGENTS.md`](packages/ai-chat-core/AGENTS.md) — AI chat runtime: stream protocol, plugins, capabilities, React hooks
- [`packages/filters/AGENTS.md`](packages/filters/AGENTS.md) — URL-driven filter state: parsers, router integration, saved filters

## Assist CLI (`pnpm assist`)

Contributors who are not technical use `pnpm assist` instead of raw commands. Prefer these task ids over raw commands: run `pnpm assist -- <id>` (or just `assist <id>` once the global command is installed; if `assist` is not found, use `pnpm assist`) (the interactive prompts still appear; relay them to the user).

| Id | What it does |
|----|--------------|
| `fetch-latest` | Stash (with consent), switch to `main`, pull, install, build |
| `start:new-feature` | Switch to latest `main`, create a branch from a Jira id or a name |
| `save-and-push` | Confirm files, commit (`type: [JIRA]: description`), push, ask, then open the PR compare link |
| `start:portal` | Build packages, run the portal |
| `start:design-system` | Build packages, run the design-system preview |
| `update:icons` / `update:logos` | Run the UI package icon / logo update |
| `build:ui` | Build `@harnessio/ui` |
| `publish:yalc` | Build `@harnessio/ui` and `yalc publish` |
| `format` / `lint` / `typecheck` / `test` | Run the quality checks |
| `check-all` | `format`, `lint`, `typecheck`, `test` in order |
| `install` / `uninstall` | Add / remove the global `assist` command (macOS/Linux) |

If a needed action is not in this list, use the raw command instead. When a task fails, details are in `.assist/last-error.log`. The task list lives in `scripts/assist/registry.ts`; see `docs/assist-cli-design.md` for the design.
