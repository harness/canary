# Gitness (Code V2 UI) — Agent Guide

React app for Harness Code (repositories, branches, pull requests, settings). Lives in the `canary` monorepo and consumes `@harnessio/ui`, `@harnessio/views`, and `@harnessio/code-service-client`.

## Tech Stack

- **React** 17, **TypeScript** (strict), **Vite** / Webpack MFE
- **Routing**: React Router v6 (`src/routes.tsx`)
- **Data**: `@harnessio/code-service-client` (React Query hooks)
- **State**: Zustand stores, `nuqs` for URL query state
- **Styling**: Tailwind with `-cn-` design tokens from `@harnessio/ui`
- **Testing**: Vitest

## Directory Layout

```
src/
├── pages-v2/           # Route pages and feature containers
├── components-v2/      # Gitness-specific UI components
├── framework/          # Context, hooks, routing, RBAC
├── utils/              # Shared utilities
├── routes.tsx          # Route definitions
└── App.tsx             # App entry (providers, router)
```

**Container / view pattern**: Thin containers in `pages-v2/` fetch data and wire mutations; presentational views often live in `@harnessio/views`.

## Common Commands

```bash
pnpm dev              # Vite dev server (port 5137)
pnpm build            # Production build
pnpm test             # Vitest
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm start:webpack    # Webpack dev server (MFE mode)
```

## UI Builder

**UI Builder** is the orchestrator agent for Code V2 UI work. Invoke it when building features with AI:

- **Cursor subagent**: `.cursor/agents/ui-builder.md` — select **UI Builder** in the agent picker, or ask to use the UI Builder agent
- **Skill**: `.claude/skills/ui-builder/SKILL.md` — routes to the skills below based on the task

## UI Development Skills

Skills live in `.claude/skills/`. UI Builder picks the relevant ones automatically:

| Skill | When to use |
|-------|-------------|
| `ui-builder` | Start here — orchestrates the full UI build workflow |
| `ui-guidelines` | Creating or modifying UI with `@harnessio/ui/components`, design tokens, component APIs |
| `ui3-form-review` | Reviewing forms/drawers against UI 3.0 form UX guidelines |
| `form-builder` | Building forms with `@harnessio/forms` (`IFormDefinition`, validators, transformers) |

Component source paths are configured in `.ui-builder-config.json` (monorepo-relative paths into `packages/ui`).

## Import Conventions

- **Base UI**: `import { Button, Text, Layout } from '@harnessio/ui/components'`
- **Views**: `import { RepoCreatePage } from '@harnessio/views'`
- **API**: `import { useListReposQuery } from '@harnessio/code-service-client'`
- **Local code**: relative imports within `src/` (e.g. `../../framework/context/NavigationContext`)

Never import base UI components from local paths — always use `@harnessio/ui/components`.

## Code Quality

After changes:

```bash
pnpm prettier --write <file>
pnpm eslint --fix <file>
pnpm typecheck
```
