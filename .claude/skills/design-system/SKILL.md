---
name: design-system
description: Build UI with the Harness design system (@harnessio/ui). Use BEFORE writing or editing any component markup, styling, props, or tokens, and before deciding which component or variant to use — it routes you to the authoritative contracts so you use real props and values instead of plausible-looking invented ones. Also use when a ds-check validation fails.
---

# Harness Design System — start here

Read **`packages/ui/.claude/skills/design-system/SKILL.md`** before touching any component.

That file is the router: it lists which sources are authoritative (registry → manifest →
pattern doc → `docs/system/`), which are explicitly not (the `apps/portal/**` docs site),
and the order to read them in. It ships with the `@harnessio/ui` package, which is why it
lives there rather than here.

This stub exists only so the skill is registered at startup from the repo root. Nested
`.claude/skills/` directories are otherwise not loaded until a file in that directory is
read, which is too late — the routing has to happen before you decide which props to use.

**Keep this file free of design rules.** It holds no knowledge, so it cannot go stale. Add
rules to `packages/ui/docs/system/` and link them from the router.
