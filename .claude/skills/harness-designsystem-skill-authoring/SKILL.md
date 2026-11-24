---
name: harness-designsystem-skill-authoring
description: Author or update a component guide (SKILL.md, props.json, pattern.md, components.md entry) for the Harness design system skill in canary. Use when asked to write, draft, scaffold, review or lint a guide for a @harnessio/ui component, or to turn a designer's filled-in intake form into a guide.
---

# Harness design system: guide authoring

Run from this skill's folder. Writes into `staging/<slug>/` here, never into the published package. Copying into
`skills/harness-design-system/` is a separate, explicit step the user decides on.

## Workflow

1. **Scaffold** (deterministic): `../../../node_modules/.bin/tsx scripts/scaffold.ts --export <Name> --source <component.tsx> --category "<Category>"`
   - Generates `props.json` from the TypeScript source (names, types, defaults, enum values, JSDoc), a `SKILL.md`, a `pattern.md` skeleton, `components-entry.md`, and `intake.md` for designers.
   - Judgment fields are `TODO(designer)` markers.
2. **Designer fills `staging/<slug>/intake.md`.** Share it as-is, or run it as an interview: ask the 8 questions one at a time and write the answers into the file.
3. **Draft from the intake**: map answers to sections. §1-2 → Overview, §3 → Decision Framework and ambiguous cases, §4 → each prop value's `whenToUse` / `whenToNotUse` and any component-specific section, §5 → Do's and Don'ts, §6 → Accessibility, §7 → Known Gaps, §8 → Examples.
   - Never invent a rule the designer did not state. Where an answer conflicts with the source (a value that does not exist), stop and ask.
   - Use `canary/skills/harness-design-system/{tag,button}` as style references for tone and depth.
4. **Cross-exam**: `../../../node_modules/.bin/tsx scripts/lint.ts staging/<slug>`. It re-derives props from source and fails on any prop, value, default or required flag that disagrees, on ✅ examples that break `rules.md` or use invalid values, and on missing sections. Add `--strict` to also fail on leftover TODO markers.
5. **Report** what a human still has to decide, then stop. Do not copy to canary.

## Page-level patterns (page layouts)

Not component guides: no scaffold, no `props.json`. Hand-written from `templates/page-layout-pattern.md.tmpl`,
copied to `canary/skills/harness-design-system/patterns/page-layouts/<name>-pattern.md`.
Interview the designer one section at a time and never invent a rule they did not state. Verify
accessibility claims against the component source. Patterns carry nothing about Figma.

Lint: `../../../node_modules/.bin/tsx scripts/lint-pattern.ts <pattern.md> [...] [--strict]`.
Checks the shared preamble and required sections, that the Contents list matches the `##` headings both ways,
that relative links resolve, that the tsx example obeys `rules.md` (and warns on classes outside `cn-*` and the
structural utilities), that Figma is not mentioned, and leftover TODOs (`--strict` fails on them).

## Limits (v1)
- Call-signature components (`Text`, `Tag`, `Button`) work directly. Compound components work with dotted exports: `--export Table --parts Root,Header,Row,...` (scaffold) or `--export DataTable.ColumnFilter`. Parts merge into one flat props.json, each description starting "Set on <Part>."; same-named props with different types across parts fail, so split those into separate guides.
- Canary's root is three levels up from this folder, or `$CANARY_ROOT`. Tooling (`tsx`, `typescript`) comes from canary's `node_modules`.
- Props from outside libraries are excluded by default. For thin wrappers (Command over `cmdk`, InputOTP over `input-otp`), opt in with `--include-from <package>` on scaffold; it is saved in `.source.json` so the lint uses it too. A designer still decides which of those props consumers may use.
- Inherited HTML attributes (`className`, `title`, `aria-*`) are not extracted. Existing guides document a few by hand; the lint only warns about them.
- A cva default can be overridden at runtime (Text's `color` default depends on `variant`). The extractor reports the static default: review it.
- Huge unions (icon names) are typed `string`.

## Validation
`lint.ts` against the existing hand-written `tag` guide: 0 errors. Run it against any existing guide with `--export <Name> --source <file>`.
