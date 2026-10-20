---
title: Component Architecture Rules
description: Radix primitives, compound exports, CVA + semantic classes, file structure, and prop typing
---

Global rules for how components in `@harnessio/ui` are built.

## Build interactive components on Radix primitives

**Rule:** Anything with interaction or overlay semantics — dialog, dropdown, select, popover, tooltip, checkbox, accordion, tabs — wraps the corresponding `@radix-ui/react-*` primitive. Don't hand-roll focus traps, portals, roving tabindex, or dismiss behaviour.

**Why:** Radix supplies the keyboard, focus-management, and ARIA behaviour that accessibility rules require. Re-implementing it reliably reintroduces bugs Radix already fixed.

**Note:** Use `asChild` (Radix `Slot`) for polymorphism rather than an `as`-prop switch that re-renders a different element tree.

---

## Export multi-part components as a compound namespace

**Rule:** A component with structural parts exports a single namespace object, not a flat list of prefixed names:

```tsx
export const Dialog = { Root, Trigger, Content, Close, Header, Title, Description, Body, Footer }
```

Consumers write `<Dialog.Content>`. Single-purpose components (`Button`, `Tooltip`) export directly.

**Rule:** Every part uses `forwardRef` and sets a dotted `displayName` (`Content.displayName = 'Dialog.Content'`).

**Why:** Refs must reach the underlying DOM node for Radix composition and focus management; the dotted displayName makes React DevTools and test output readable.

---

## Style with CVA mapping to semantic classes — not inline utility soup

**Rule:** Variants are declared with `cva()` at module level, and each variant maps to a **semantic class name**, not a string of Tailwind utilities:

```tsx
const buttonVariants = cva('cn-button', {
  variants: {
    variant: { primary: 'cn-button-primary', ghost: 'cn-button-ghost', /* … */ },
    size: { md: '', sm: 'cn-button-sm', xs: 'cn-button-xs' }
  },
  defaultVariants: { variant: 'primary', size: 'md', theme: 'default' }
})
```

The `cn-*` classes are defined in `tailwind-utils-config/` where they consume design tokens. Always provide `defaultVariants`.

**Rule:** Merge classes with the local `cn()` util (`src/utils/cn.ts`) — a `tailwind-merge` instance extended with this system's font-size and box-shadow groups. Plain `clsx` or template-string concatenation won't dedupe conflicting classes correctly.

**Why:** The indirection keeps token decisions in the token layer. A component that inlines utilities hardcodes design decisions into TSX, where no token audit can reach them.

---

## Never hardcode design values

**Rule:** No raw colors, pixel padding, font sizes, shadows, or radii in component code. Every visual decision resolves through a token. This is the single rule the other system docs all specialize.

---

## Follow the actual file structure

**Rule:** Scale the structure to the component:

- **Single-file:** `{name}.tsx` alongside optional `{name}.figma.ts` in `src/components/`
- **Multi-file:** a `{name}/` directory with PascalCase part files (`AlertRoot.tsx`, `AlertTitle.tsx`) and an `index.ts` barrel that assembles the namespace export
- **Tests:** centralized in `src/components/__tests__/{name}.test.tsx` — *not* beside the component
- **Public export:** add to `src/components/index.ts`; consumers import from `@harnessio/ui/components`

**Note:** Test placement is the common mistake — a few older directories keep their own tests, but new tests go in the central `__tests__/` folder.

---

## Use discriminated unions to make misuse uncompilable

**Rule:** When a prop combination is invalid, encode it in the type rather than checking at runtime. `ButtonProps` is the reference example — `iconOnly: true` requires either `tooltipProps` or an explicit `ignoreIconOnlyTooltip`, so an unlabeled icon-only button cannot compile.

**Rule:** Export prop types as `{ComponentName}Props`.

**Why:** Accessibility requirements enforced by the type system can't be forgotten; the same rule in a doc or a lint warning can.

---

## Stay React 17 compatible

**Rule:** `@harnessio/ui` declares `react@^17.0.2` as a peer dependency. No React 18+ APIs — no `useTransition`, `useActionState`, `useSyncExternalStore`, or `createRoot` assumptions.

**Why:** Consuming applications have not all migrated. Nothing lints this — the peer range is the only guard, so an 18-only API fails at a consumer's build, not ours.

---

## Cross-references

- **Accessibility** — ARIA, keyboard, accessible names
- **Color System**, **Typography**, **Spacing**, **Shadows** — The token rules this doc defers to
- **Design-to-Code Flow** — Package boundaries and versioning
- `packages/ui/AGENTS.md` — Component manifests, discovery, and validation commands
