# App Setup — what a host app must wire before components render

Installing `@harnessio/ui` is not enough to make components look right. Three things are the
host app's job, and the package does none of them for you. Get them wrong and the failure is
quiet and misleading rather than obviously broken.

This is **app setup, not component usage.** Never add any of it to a component file to work
around a missing one.

---

## 1. The stylesheet

Import it once, at the app root:

```ts
import '@harnessio/ui/styles.css'
```

Import it **exactly once** — it includes the Tailwind preflight reset, so a second import
double-applies it. Without it, components render as correct markup with no colors and no
shape.

Only if the app writes its own Tailwind utility classes, add the preset
`@harnessio/ui/tailwind-design-system` to its `tailwind.config` and include just
`@tailwind utilities`; base and component styles already come from the stylesheet.

---

## 2. Two classes, both required, doing different jobs

The stylesheet does **not** put the design tokens on `:root`. They are split across two
selectors, and a host app has to supply both class names itself.

| Class | What it carries | Symptom when missing |
|---|---|---|
| A **theme class** — `light`, `dark`, or a variant | The semantic tokens: `--cn-text-*`, `--cn-bg-*`, `--cn-border-*` | Semantic colors do not resolve; text and surfaces are unthemed |
| `cn-root` | The border reset: `border-style: solid; border-width: 0` | Every `border-*` utility draws **nothing** |

`:root, :host` does hold the theme-independent primitives — breakpoints, the raw ramp
(`--cn-gray-*`, `--cn-pure-white`), typography tracking, component sizing. That is why a
missing theme class looks *partially* working: the raw values still resolve, so you get a
half-styled result rather than an obviously dead one.

The border reset is scoped `:where(.cn-root)`, so it applies to the subtree, not the element
alone. A `border` utility with no `.cn-root` ancestor is a no-op — Tailwind sets a width, but
nothing has set `border-style`, and the initial value is `none`.

### The theme class is not just light/dark

Themes ship as `{mode}-{contrast}-{vision}` — the bundled defaults are `light-std-std` and
`dark-std-std`, with dimmer, high-contrast, and protanopia/deuteranopia/tritanopia variants
loaded on demand. `light` and `dark` are aliases of the two bundled defaults. Treat
"light or dark" as a simplification, not the model.

---

## 3. The package applies neither class

`ThemeProvider` (`src/context/theme/theme-context.tsx`) is **React context only** — it
exposes `theme`, `setTheme` and `isLightTheme`, and writes nothing to the DOM. There is no
component in this package that puts a theme class or `cn-root` on an element for you.

> There is no `ThemeRoot` export. If you have seen one named in a snippet, it belongs to
> something built on top of this package, not to `@harnessio/ui`.

Both shipping consumers wire it by hand, and they do it at different levels:

- **canary's own design-system app** — theme class on `document.body`, `cn-root` on a
  wrapper `div` (`apps/design-system/src/pages/view-preview/view-preview.tsx`).
- **platformUI** — theme class on `<html>` via its own `@harnessio/ui3-theme`, `cn-root` on
  the MFE root `div`.

Either level works. What matters is that `cn-root` is an ancestor of the components and a
theme class is an ancestor of `cn-root` or on the same element.

Also wrap the tree in `TooltipProvider` (inside the themed subtree). Tooltips are built on
Radix and need a provider ancestor; canary's own app does this in `App.tsx`.

---

## 4. Portaled overlays leave the subtree

Dialog, AlertDialog, Sheet, Drawer, Popover, DropdownMenu and Tooltip portal their content
out of the React tree and into the document. That content lands **outside** `cn-root`.

Because the theme class usually sits on `<html>` or `body`, the tokens still resolve by
inheritance but the border reset does not — so the characteristic symptom is **borders
disappearing inside overlays only**, while colors look fine. It reads like an overlay bug,
and it is a missing class.

These components take a `portalContainer` prop. Point it at a host element that carries
`cn-root`. platformUI does exactly this for toasts, appending a cached `cn-root` host to
`document.body` so the toast escapes the MFE's stacking context without losing styling.

---

## For agents

- Check whether the host app already does all of this before adding anything. If you cannot
  tell, **say so rather than adding an import or a wrapper class speculatively** — a second
  stylesheet import or a nested `cn-root` is its own bug.
- A missing border or an unthemed overlay is almost never a component defect. Check for a
  `cn-root` ancestor and a `portalContainer` first.
- Do not invent a wrapper component name. The exports are `ThemeProvider` and
  `TooltipProvider`; the classes are applied by the app.
