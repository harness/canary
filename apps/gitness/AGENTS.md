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

## UI development — mandatory skill compliance

**All UI work in `apps/gitness` MUST start with `.claude/skills/ui-builder/SKILL.md`.** Agents must not implement UI without following the ui-builder routing table and Phase 4 checklist.

| Skill | When |
|-------|------|
| **ui-builder** | **Always first** — architecture, canonical patterns, workflow, completion report |
| **ui-guidelines** | Every task — Tier 1–2 minimum; Tier 3 for novel components |
| **form-builder** | **Only** `@harnessio/forms` / `IFormDefinition` (ui-builder Step 2a) |
| **ui3-form-review** | **After any form work** — before declaring done (ui-builder Step 3) |

Component paths: `.ui-builder-config.json`

### Agent completion criteria (UI tasks)

Before marking a UI task done, agents must:

1. Copy a canonical pattern from ui-builder (not invent from scratch)
2. Run typecheck on touched packages (`gitness`, `@harnessio/views` if changed)
3. Rebuild views if using webpack MFE: `pnpm --filter @harnessio/views build`
4. Run ui3-form-review when forms were touched
5. Include **UI Builder compliance** section in the final response

## Import Conventions

- **Base UI**: `import { Button, Text, Layout } from '@harnessio/ui/components'`
- **Views**: `import { RepoCreatePage } from '@harnessio/views'`
- **API**: `import { useListReposQuery } from '@harnessio/code-service-client'`
- **Local code**: relative imports within `src/`

Never import base UI components from local paths.

## Code Quality

```bash
pnpm prettier --write <file>
pnpm eslint --fix <file>
pnpm typecheck
```
