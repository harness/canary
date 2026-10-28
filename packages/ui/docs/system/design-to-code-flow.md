---
title: Design-to-Code Flow Rules
description: One-way dependency flow, package boundaries, Code Connect, and versioning
---

Global rules for how design decisions travel from this repo into consuming applications.

## Dependencies flow one way: canary → platformUI → harness-core-ui

**Rule:** canary is the source. `platformUI` consumes `@harnessio/ui`; `harness-core-ui` sits downstream of that. Nothing in canary may import from, or be shaped by, a consuming repo.

**Rule:** Consuming repos are **consumers only** — they don't define design values. In particular, `platformUI` never defines colors; all color comes from canary tokens.

**Why:** A single source means a token change propagates everywhere. A consumer that defines its own values forks the design system silently, and the fork only surfaces when the two disagree visually.

---

## Fix drift upstream, never patch it downstream

**Rule:** When a consuming app needs a component to look or behave differently, change the component or token in canary and release. Don't override `@harnessio/ui` styles from the consumer with local CSS, `!important`, or wrapper components that re-style.

**Why:** Downstream overrides are invisible to canary's audits and break on the next upgrade. They also hide the real signal — that the system is missing a variant.

**When a request can't be met with the manifest's props:** Don't fake it with `className`, `style`, or an unsupported prop (for example, colouring a `link` Button, which takes no `theme`). Use the nearest supported variant and theme (for example, `ghost` with `theme="danger"`), say in your reply what you substituted and why, and offer to raise the gap upstream. If no supported option is close, say so and ask rather than improvising.

**Warn on any documented-rule conflict:** If a request, or the code you are about to write, goes against **any** rule documented in a manifest, a pattern doc, or `docs/system/`, warn the user **before** making the change. Name the rule and the file it is in, say what you would do instead, and wait for their choice. A documented rule means the system has an opinion on it. This covers a theme or variant that exists but means something else (for example `merged` to colour an "Active" badge), an override of a component's styles, a raw px value, and a missing accessible name. Do not apply the workaround first and explain afterwards. If the user confirms after the warning, make the change and say in your reply which rule it departs from.

**A skipped or unanswered warning means no change.** Skipping, dismissing, or saying "no preference" is not permission. Make no edit, say that nothing was changed, and leave the choice open.

**Hard-coded colours are never allowed and are never offered.** Do not write, suggest, or list as an option any hex, `rgb()`, `hsl()`, `lch()`, or named colour value, or a `style` or `className` colour override of a component's colour. This holds even if the user asks for it or confirms it. Say it is not allowed, and offer only the supported route: a component's `theme`, `variant` or `color` prop, a semantic token, or a different component such as `Tag` with a colour theme. If none fits, say so and offer to raise the gap upstream.

---

## Respect package boundaries within the monorepo

**Rule:** Packages depend in one direction only; no circular dependencies between `@harnessio/ui`, `@harnessio/forms`, `@harnessio/filters`, `@harnessio/pipeline-graph`, `@harnessio/yaml-editor`, or `@harnessio/ai-chat-core`. `@harnessio/core-design-system` is the lowest layer — it holds tokens and depends on no sibling package.

**Rule:** Import across packages through the public entry points declared in `package.json` `exports` (e.g. `@harnessio/ui/components`), never by deep-reaching into `src/` or `dist/` internals.

**Why:** Deep imports bypass the export contract, so a refactor that's internal by design becomes a breaking change for consumers.

---

## Global rules stay global; product-specific rules live in domain docs

**Rule:** `docs/system/` holds rules true for all Harness products, and ships with `@harnessio/ui`. Product-specific decisions — Pipelines' extra status colors, Code Repository's diff treatments — belong in product documentation, not here.

**Why:** These docs are consumed by AI tools as authoritative global constraints. A product-specific rule stated globally gets applied in contexts where it's wrong.

---

## Code is the primary source; Figma is secondary

**Rule:** Where Figma and the code disagree, the code is authoritative for what the system *is*. Code Connect mappings (`{name}.figma.ts`) link a Figma component to its code counterpart so design hand-off resolves to real props.

**Rule:** Don't infer a design decision from a gap in Figma. A component or variant missing from the Figma library usually means the library lags — it is not evidence that the pattern is disallowed.

**Why:** Code Connect coverage is incomplete and the Figma library trails releases.

---

## Changes reach consumers through versioned npm releases

**Rule:** Distribution is via published npm packages — consumers upgrade a version. Breaking changes to a component's public API or a token's meaning require a major version and a migration note.

**Note:** Renaming or repurposing a semantic token is a breaking change even when the hex value is unchanged, because consumers reference it by name.

**Local development:** `yalc` is the supported way to test unreleased canary changes against a consumer. It's a temporary bridge — remove yalc links before committing, and never commit a `yalc.lock` or a `file:.yalc/...` dependency.

---

## Cross-references

- **Component Architecture** — Export contracts, React 17 peer constraint
- **Color System** — Why token names are the consumer-facing contract
- `packages/ui/AGENTS.md` — Manifests, Code Connect workflow, validation commands
