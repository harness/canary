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

## Package-Level Docs

Packages with detailed agent guides:

- [`packages/ai-chat-core/AGENTS.md`](packages/ai-chat-core/AGENTS.md) — AI chat runtime: stream protocol, plugins, capabilities, React hooks
- [`packages/filters/AGENTS.md`](packages/filters/AGENTS.md) — URL-driven filter state: parsers, router integration, saved filters

## `@harnessio/ui` (`packages/ui/`)

Main component library. Import from `@harnessio/ui/components` unless a subpath export is documented.

### `GlowCard` — hover/focus border + halo

Compound layout primitive for the onboarding rotating conic glow on pointer hover and keyboard focus (ported from 3.0 vision `onboarding.html` `.glow-card-container--pointer`). **Does not render card chrome** — wrap `Card` or custom content inside.

| Piece | Path |
|-------|------|
| Component | `packages/ui/src/components/glow-card/` (`glow-card.tsx`, `glow-card-types.ts`) |
| Tailwind styles | `packages/ui/tailwind-utils-config/components/glow-card.ts` |
| Keyframe / `@property` | `packages/ui/src/styles/styles.css` (`glow-card-rotate-angle`, `--cn-comp-glow-card-angle`) |
| Pattern docs | `apps/portal/src/content/docs/patterns/glow-card-animation.mdx` → `/patterns/glow-card-animation/` |

**API**

```tsx
import { GlowCard, Card } from '@harnessio/ui/components'

<GlowCard.Root>
  <GlowCard.Inner tabIndex={0}>
    <Card.Root interactive={false}>...</Card.Root>
  </GlowCard.Inner>
</GlowCard.Root>
```

- `GlowCard.Root` — halo + ring layers; glow activates on `:hover` and `:has(.cn-glow-card-inner:focus-visible)`.
- `GlowCard.Inner` — clips the inner card surface inside the ring; add `tabIndex={0}` (or a focusable child) for keyboard parity.
- Inner `Card` — set `interactive={false}` so the card's hover border does not compete with the glow ring.

**Tokens** — override via CSS on `.cn-glow-card` (or a parent). Palette shortcuts recolor the whole sweep; individual stops can be overridden directly.

| Token | Role |
| ----- | ---- |
| `--cn-comp-glow-card-color-blue` | Brand hero (`--cn-set-brand-primary-bg`) |
| `--cn-comp-glow-card-color-sky` | Mid indigo (`--cn-set-indigo-primary-bg`) |
| `--cn-comp-glow-card-color-orange` | Bright accent (`--cn-set-brand-outline-border`) |
| `--cn-comp-glow-card-color-amber` | Deep brand (`--cn-set-brand-primary-bg-hover`) |
| `--cn-comp-glow-card-color-yellow` | Soft tint (`--cn-set-indigo-secondary-bg`) |
| `--cn-comp-glow-card-color-gold` | Peak brand (`--cn-set-brand-primary-bg`) |
| `--cn-comp-glow-card-color-white` | Highlight (`--cn-set-brand-primary-text`) |
| `--cn-comp-glow-card-halo-alpha-1` … `7` | Halo stop mix percentages (peak on stop 6 / brand primary) |
| `--cn-comp-glow-card-halo-base-stop-1` … `7` | Halo conic stops (default: palette × alpha via `color-mix`) |
| `--cn-comp-glow-card-ring-stop-1` … `5` | Ring conic stops (default: palette at full opacity) |
| `--cn-comp-glow-card-halo-opacity-idle` / `-active` / `-active-dark` | Halo opacity at rest / hover / dark hover (`0` / `1` / `0.85`) |
| `--cn-comp-glow-card-halo-blur` | Halo blur (default `14px`) |
| `--cn-comp-glow-card-radius`, `--cn-comp-glow-card-halo-radius`, `--cn-comp-glow-card-duration` | Layout & rotation period |
| `--cn-comp-glow-card-rotation-count` | Full sweeps per hover/focus (`3` default; `infinite` for continuous) |
| `--cn-comp-glow-card-ring-padding`, `--cn-comp-glow-card-idle-ring` | Ring thickness & idle color |
| `--cn-comp-glow-card-reduced-angle` | Fixed angle when motion is reduced (`225deg`) |

**When to use** — onboarding tiles, landing cards, selectable steps, or any interactive surface that should reveal the full halo + brand-blue sweep on hover/focus. For pipeline running-state shimmer on a single `StudioCard`, use `StudioCard.Status status="executing"` instead (separate treatment, no wrapper).
