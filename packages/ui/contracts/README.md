# Component contracts

Each component that agents may use gets two files next to its source:

- `<kebab>.manifest.json`: the component API. Props, Figma bindings, constraints, states, tokens, examples and known gaps. Schema: `component-manifest.schema.json`.
- `<kebab>.guide.md`: the usage rules. YAML front matter holds each rule's id, title, status, tier and check; the Markdown body holds the prose. Schema for the front matter: `component-guide.schema.json`.

The manifest points to its guide through `governance.guide`, and the guide points back through `manifest`. StatusBadge (`src/components/status-badge/`) is the reference example.

A pattern gets the same pair in `src/patterns/<kebab>/`. Its manifest uses `pattern-manifest.schema.json` and names the components it composes; its guide uses `component-guide.schema.json`. ExecutionStatus (`src/patterns/execution-status/`) is the example. `pnpm ds:scaffold --pattern` writes one, and `PATTERN_CHECKLIST.md` says how to fill it.

## Add a contract

```bash
pnpm ds:scaffold MyComponent --prefix MYC
```

Register the prefix first: add a row to `rule-ids.md`. Then the scaffolder writes `src/components/my-component/my-component.manifest.json` and `my-component.guide.md` from the templates in this folder. Every unknown value is `[TK]`. The scaffolder refuses to overwrite existing files unless you pass `--force`, and refuses a prefix that `rule-ids.md` does not register to that component.

Fill the files using `COMPONENT_CHECKLIST.md`, then run:

```bash
pnpm ds:validate
```

A freshly scaffolded contract fails validation until every `[TK]` is replaced. That is intended.

For a pattern, register its PascalCase name and pass `--pattern`. The files go to `src/patterns/<kebab>/`. Fill them using `PATTERN_CHECKLIST.md`.

```bash
pnpm ds:scaffold MyPattern --prefix MYP --pattern
```

When it passes, regenerate the agent references and run every check for the component:

```bash
pnpm ds:generate
pnpm ds:check MyComponent
```

## Read a contract

- Start from the manifest. `purpose` says when to use the component, `props` says what you can pass, `constraints` and `illegalCombinations` say what you cannot combine, and `examples` shows both.
- Rule IDs in the manifest (`constraints[].rule`, `examples.incorrect[].violates`, `knownGaps[].rule`) resolve to headings in the guide.
- A rule's `status` tells you how much to trust it: `ratified` is decided by Design, `proposed` is a draft, `open` is a question, `retired` no longer applies.
- A rule's `check` tells you what enforces it. `review` means nothing automatic does.
- `knownGaps` lists where Figma, code and docs disagree. Do not copy behavior described there without checking the source it cites.

## What the validator checks

`pnpm ds:validate` (source: `scripts/ds/validate-contracts.ts`) checks every `*.manifest.json` under `src/components` and `src/patterns`:

- Both files against their schemas.
- Guide structure: headings match front matter titles, no metadata in the body, rule IDs referenced anywhere exist.
- Rule-ID prefixes are registered in `rule-ids.md` to the manifest's `code.export`, and no retired ID is in use.
- `check` targets resolve. A `test:` target must name a real `it` or `test` call in that file.
- Props match the TypeScript props type: names, kinds, enum values, required/optional, and `enforcedBy: types` constraints.
- Token refs exist in the token source.
- Bindings cover shared props and agree with `variantPropertyMap`.
- Examples obey the props and constraints.
- Waivers in `knownGaps[].waives` still match a finding.
- For a pattern: each listed component has a manifest whose export matches, or a source path that exists. Anatomy prop values are a subset of the component's. `states.map` keys are listed in `states.values`. Every rule ref is in the pattern guide or one of its component guides, and a retired ref names its replacement. Examples are checked against the components' props, constraints and lint rules and the pattern's slot narrowing; an incorrect example must break each rule it cites that can be checked automatically.

It does not check Figma itself, runtime default values, or the meaning of rule prose.

## Scripts

Run from `packages/ui`. CI runs the same scripts (`.github/workflows/pr-checks.yml`, jobs `Contracts_*`).

| Script | What it does |
| ------ | ------------ |
| `pnpm ds:validate [manifest ...]` | Validates contracts. |
| `pnpm ds:generate` | Writes `agents/components/<kebab>.md` per component, `agents/patterns/<kebab>.md` per pattern, and `agents/components/INDEX.md`. |
| `pnpm ds:generate --check` | Exits 1 if any generated file is stale, missing or orphaned. |
| `pnpm ds:test [Component]` | Runs the tests that guide `check: test:` entries name. |
| `pnpm ds:check [Component]` | Runs all three above for one component, or for every contract. |

The `ds:*` scripts run TypeScript directly and need Node 22.18 or later.

Never edit files in `agents/components/` or `agents/patterns/` by hand. Edit the manifest or guide, then regenerate.

## Templates

`TEMPLATE.manifest.json` and `TEMPLATE.guide.md` use `{ComponentName}`, `{component-kebab}` and `{PREFIX}` placeholders that the scaffolder fills. `TEMPLATE.pattern.manifest.json` and `TEMPLATE.pattern.guide.md` use `{PatternName}`, `{pattern-kebab}` and `{PREFIX}`. Each template's `$schema` path is relative to where the scaffolder writes it, not to this folder. HTML comments in a guide hold notes for authors and never reach the agent reference.
