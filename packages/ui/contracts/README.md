# Component contracts

Each component that agents may use gets two files next to its source:

- `<kebab>.manifest.json`: the component API. Props, Figma bindings, constraints, states, tokens, examples and known gaps. Schema: `component-manifest.schema.json`.
- `<kebab>.guide.md`: the usage rules. YAML front matter holds each rule's id, title, status, tier and check; the Markdown body holds the prose. Schema for the front matter: `component-guide.schema.json`.

The manifest points to its guide through `governance.guide`, and the guide points back through `manifest`. StatusBadge (`src/components/status-badge/`) is the reference example.

## Add a contract

```bash
pnpm ds:scaffold MyComponent --prefix MYC
```

This writes `src/components/my-component/my-component.manifest.json` and `my-component.guide.md` from the templates in this folder. Every unknown value is `[TK]`. The scaffolder refuses to overwrite existing files unless you pass `--force`, and refuses a prefix another guide already uses.

Fill the files using `COMPONENT_CHECKLIST.md`, then run:

```bash
pnpm ds:validate
```

A freshly scaffolded contract fails validation until every `[TK]` is replaced. That is intended.

## Read a contract

- Start from the manifest. `purpose` says when to use the component, `props` says what you can pass, `constraints` and `illegalCombinations` say what you cannot combine, and `examples` shows both.
- Rule IDs in the manifest (`constraints[].rule`, `examples.incorrect[].violates`, `knownGaps[].rule`) resolve to headings in the guide.
- A rule's `status` tells you how much to trust it: `adopted` is ratified, `proposed` is a draft, `open` is a question.
- A rule's `check` tells you what enforces it. `review` means nothing automatic does.
- `knownGaps` lists where Figma, code and docs disagree. Do not copy behavior described there without checking the source it cites.

## What the validator checks

`pnpm ds:validate` (source: `scripts/ds/validate-contracts.ts`) checks every `*.manifest.json` under `src/components`:

- Both files against their schemas.
- Guide structure: headings match front matter titles, no metadata in the body, rule IDs referenced anywhere exist.
- `check` targets resolve.
- Props match the TypeScript props type: names, kinds, enum values, required/optional, and `enforcedBy: types` constraints.
- Token refs exist in the token source.
- Bindings cover shared props and agree with `variantPropertyMap`.
- Examples obey the props and constraints.
- Waivers in `knownGaps[].waives` still match a finding.

It does not check Figma itself, runtime default values, or the meaning of rule prose.

## Templates

`TEMPLATE.manifest.json` and `TEMPLATE.guide.md` use `{ComponentName}`, `{component-kebab}` and `{PREFIX}` placeholders that the scaffolder fills. The template's `$schema` path is relative to `src/components/<kebab>/`, not to this folder.
