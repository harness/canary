# harness-designsystem-skill-authoring
Tooling to scaffold, draft and cross-check component guides for the Harness design system skill. See SKILL.md.
- `scripts/extract-props.ts` TS compiler API → props.json skeleton
- `scripts/scaffold.ts` writes a guide skeleton + designer intake to `staging/<slug>/` (`--parts` for compound components)
- `scripts/lint.ts` cross-exam against source and rules.md
- `templates/`, `intake/` the fill-in files
