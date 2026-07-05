# `@harnessio/ui` — Agent Guide

The main Canary component library: 118 React components built on Radix UI primitives, styled with Tailwind against style-dictionary design tokens. This is the package agents build UI with most. Consumed by `frontend/platformUI` and the apps under `apps/`.

---

## Package Info

| Field | Value |
|-------|-------|
| Package name | `@harnessio/ui` |
| Version | `0.5.58` |
| License | Apache-2.0 |
| React peer dep | `^17.0.2` (React 17 — no React 18-only APIs) |
| Build tool | Vite |
| Primary entry | `dist/index.js` |
| Components subpath | `@harnessio/ui/components` |

**Commands**

```bash
pnpm dev            # Vite dev server
pnpm build          # Production build + i18n extract
pnpm lint           # eslint ./src --quiet
pnpm test           # vitest --run
pnpm typecheck      # tsc -b
```

---

## Directory Structure

```
src/
├── index.ts        # Root entry — re-exports namespaces: components, hooks, locales, context, types, utils
├── components/      # 118 components (see Component Catalog); barrel is components/index.ts
├── context/         # React context providers
├── hooks/           # Reusable hooks (use-debounce-search, use-infinite-scroll, use-local-storage, …)
├── utils/           # cn(), string/type/merge helpers (utils/index.ts)
├── types/           # Shared type exports
├── styles/          # styles.css and shared style variables
├── fonts/ · svgs/   # Static assets
└── scripts/         # Icon/logo codegen (update:icons, update:logos)
```

---

## Import Paths

```ts
// Named component imports (most common)
import { Button, Card, Tag, StatusBadge, CounterBadge, Text } from '@harnessio/ui/components'

// Namespace form from the root entry
import { components, hooks, utils } from '@harnessio/ui'
```

Prefer `@harnessio/ui/components` for components. The root `@harnessio/ui` entry exposes everything as namespaces (`components`, `hooks`, `locales`, `context`, `types`, `utils`).

---

## Core Concepts

- **Built on Radix UI** primitives for accessibility (focus management, ARIA, keyboard nav). Don't replace the Radix primitive under a component — extend the wrapper or add a variant instead.
- **Variants via `class-variance-authority` (cva)** — variants are finite, named, and type-checked. No string-prop polymorphism. Read a component's `cva` config to see its real variant/size/theme set.
- **Tokens via CSS variables** — every color, size, radius, and shadow resolves through a `--cn-*` custom property, applied through `cn-*` utility classes. Components never hardcode hex, px, or `oklch()`. Reach for semantic aliases (`cn-text-1`, `cn-bg-2`, `cn-set-brand-primary-bg`) rather than primitive ramps.
- **Compound component pattern** — many components export an object of sub-components rather than a flat component. Example (`card.tsx`): `Card.Root` / `Card.Title` / `Card.Content` / `Card.Image`. Similarly `Dialog.Root` / `Dialog.Content` / `Dialog.Footer`. Consumers compose; the system doesn't predict every layout.
- **`forwardRef` everywhere** — imperative access is uniform across the library.

See the root `DESIGN.md` for the full token vocabulary, color system, typography scale, and do's/don'ts.

---

## Component Catalog

The barrel `src/components/index.ts` re-exports all components. Read the target component's source for its exact `cva` variants before use — this catalog covers only the boundaries agents get wrong.

### Choosing between similar components

**Badge family — the most common mistake.** There is **no generic `Badge` component**; `badge.tsx` does not exist. Do not import or reference it. Three distinct components cover this space:

| Need | Use | Import | Notes |
|------|-----|--------|-------|
| Category / descriptive label / key-value chip | **`Tag`** | `tag.tsx` | Base `cn-tag`. `variant`: outline (default)/secondary. 15 color `theme`s. `label`+`value` renders a split key:value chip. Optional leading `icon`; removable via `actionIcon` + `onActionClick`. |
| Status / state indicator | **`StatusBadge`** | `status-badge/status-badge.tsx` | Base `cn-badge`. `variant`: primary (default)/secondary/outline/ghost/status. Semantic `theme`s: muted/success/warning/danger/info/merged/risk. `variant="status"` adds a leading dot + optional `pulse`; other variants accept a leading `icon`. |
| Numeric count / tally | **`CounterBadge`** | `counter-badge.tsx` | Base `cn-badge cn-badge-counter` (pill, smaller). `variant`: outline (default)/secondary. `theme`: default/info/success/danger. **The count goes in `children`.** |

Do **not** render a count with `Text` — use `CounterBadge`. Do not use `StatusBadge` for a category label — use `Tag`.

`Text` (`text.tsx`) is the polymorphic typography primitive (headings, body, captions via `variant`; `as`/`asChild` for the element). It is for prose and labels, not for counts, status, or category chips.

---

## Migrations

The badge/tag family is mid-migration to the new design system (Tag component migration, issue **#1505**). Residue an agent will encounter:

- **`badge.tsx` is gone.** The former unified `Badge` was split into `Tag` / `StatusBadge` / `CounterBadge`. Older docs and code may still reference `badge.tsx` or a bare `Badge` — treat those as stale; use the three components above.
- **`status-badge.tsx` carries a leftover `'counter'` reference** in its variant `Exclude` type — a harmless artifact of the split, not a live variant. `CounterBadge` is the real counts component.

When continuing this migration, prefer the split components and remove references to the phantom `Badge`.

---

## Important Constraints

- **React 17 compatible** — do not use React 18-only APIs.
- **No raw values** — never hardcode hex, raw pixel measurements, or `oklch()`. Everything routes through `cn-*` CSS-variable classes, even for one-offs. Avoid Tailwind arbitrary values like `w-[240px]`; use token classes.
- **Don't fork Radix** — extend the wrapper or add a cva variant; don't replace the underlying primitive.
- **Read the `cva` config before guessing variants** — the real variant/theme/size sets are defined there and diverge from stock shadcn (e.g. Button has no `destructive` variant; it uses `theme="danger"`).
