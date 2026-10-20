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
| `@harnessio/ui` | `packages/ui/` | Main component library (Radix UI + ShadCN + Tailwind) |
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

## UI Components

Before writing or reviewing UI code that uses `@harnessio/ui`:

- Read [`packages/ui/agents/components/INDEX.md`](packages/ui/agents/components/INDEX.md). It lists every component and pattern with a contract.
- Use only the components, props and tokens the index and its references list.
- After editing a component, its manifest or its guide, run `pnpm -F @harnessio/ui ds:check <Component>`. For a pattern in `packages/ui/src/patterns/`, pass the pattern name.

Details: [`packages/ui/AGENTS.md`](packages/ui/AGENTS.md).

## Package-Level Docs

Packages with detailed agent guides:

- [`packages/ui/AGENTS.md`](packages/ui/AGENTS.md) — Component contracts: index, usage guide, review prompt, checks

- [`packages/ai-chat-core/AGENTS.md`](packages/ai-chat-core/AGENTS.md) — AI chat runtime: stream protocol, plugins, capabilities, React hooks
- [`packages/filters/AGENTS.md`](packages/filters/AGENTS.md) — URL-driven filter state: parsers, router integration, saved filters
