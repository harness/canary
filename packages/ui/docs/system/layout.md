---
title: Layout Rules
description: Composition-based layout, containers, shell structure, and breakpoints
---

Global layout rules. The system is **composition-based** — there is no fixed column grid.

## There is no 12-column grid — compose with flex and explicit grid templates

**Rule:** Don't reach for a column-grid abstraction; it doesn't exist in this system. Lay out with flexbox utilities, or with CSS Grid using an explicit template that states the actual intent (`grid-cols-[auto_1fr]`, `grid-cols-[246px_1fr]`).

**Why:** Harness layouts are predominantly app-shell shapes — fixed-width rails beside a fluid main region — which a proportional 12-column grid models poorly. Explicit templates say what the layout *is*.

**Note:** `Layout.Grid` accepts a numeric `columns` prop, which expands to `repeat(n, minmax(0, 1fr))`. That's an equal-width convenience, not a design-system column grid — don't treat `columns={12}` as "the grid".

---

## Pick Grid vs Flex by dimensionality

**Rule:** Use **Grid** when you need to control rows and columns together, or when children must align across both axes (forms, shell regions, data layouts). Use **Flex** for one-dimensional runs — a toolbar, a button row, a stack. Don't nest flex containers to simulate two-dimensional alignment.

---

## Use the layout primitives instead of raw flex containers

**Rule:** Prefer `Layout.Horizontal`, `Layout.Vertical`, `Layout.Flex`, and `Layout.Grid` over hand-rolled `className="flex ..."`. They expose typed `gap`, `align`, `justify`, `direction`, `wrap`, and `grow` props.

**Rule:** For page shells, use the `SandboxLayout` parts (`Root`, `LeftPanel`, `LeftSubPanel`, `Header`, `SubHeader`, `Main`, `Content`, `Columns`, `Column`) rather than rebuilding the sidebar/main arrangement. Panel widths and the content padding are fixed by the layout, not by the caller.

**Why:** The shell geometry must match across products. A locally-built sidebar drifts from the real one on width, padding, and radius.

---

## Constrain page content with the page-container max-width

**Rule:** Long-form page content is capped at the page-container max-width (**1280px**) via `max-w-cn-page`, with the page padding applied by `.cn-page-content`. Don't invent a container width.

**Note:** Tailwind's built-in `container` class is configured in this repo (centered, 2rem padding, `2xl: 1400px`) but is **not** the design-system container and is not what `SandboxLayout` uses. Prefer `max-w-cn-page`; don't mix the two.

---

## Breakpoint tokens exist but are not wired into Tailwind

**Rule:** The design system defines viewport tokens — `viewportMin` 1080, `viewportXl` 1280, `viewport` 1440, `viewportMax` 1920 — describing the supported desktop range. These are **not** registered as Tailwind screens. Responsive variants in component code (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) are stock Tailwind defaults (640/768/1024/1280/1536px) and do **not** correspond to the tokens above.

**Rule:** Don't assume `xl:` means `viewportXl`. If a layout must key off a design-system breakpoint, reference the CSS variable explicitly rather than guessing at a Tailwind screen.

**Why:** Flagged because the mismatch is silent — the names look like they line up and don't.

---

## Known gaps & verifications needed

- **Breakpoints unintegrated:** The token-to-Tailwind-screen gap above is the largest known inconsistency in the layout system. Until it's closed, responsive code and design tokens describe different breakpoints.
- **Desktop-only:** Tokens are authored for a desktop breakpoint set; there is no mobile or tablet token mode. Treat mobile layout as out of scope for these global rules.
- **Two container systems:** Tailwind `container` and `max-w-cn-page` coexist. Consolidation hasn't happened.

---

## Cross-references

- **Spacing** — Gap, padding, page and shell spacing tokens
- **Shadows** — Elevation for floating and overlay layers
