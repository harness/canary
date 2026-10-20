# Component Contract Checklist

Use this when adding a manifest and guide for a component. Items marked **(validator)** are checked by `pnpm ds:validate`; the rest need a person.

## 1. Scaffold

- [ ] Add a row for the component's rule-ID prefix to `contracts/rule-ids.md`. Never reuse a prefix or an ID, including retired ones.
- [ ] Run `pnpm ds:scaffold <ComponentName> --prefix <PREFIX>` from `packages/ui`.
- [ ] Both files sit next to the component source in `src/components/<kebab>/`.
- [ ] The prefix is 2 to 5 uppercase letters and `rule-ids.md` registers it to this component. **(scaffolder, validator)**

## 2. Manifest

- [ ] Every `[TK]` is replaced with a sourced value, or the field is removed if it is optional. Never guess a token, prop or Figma name.
- [ ] `code.propsType` names the exported props type. **(validator)**
- [ ] `figma.fileKey`, `exampleNodeId` and `variantPropertyMap` come from Figma, with property keys copied exactly, including `#id` suffixes. **(validator for consistency with props, not for Figma itself)**
- [ ] `figma.lastVerified` is the date you checked Figma. **(validator for format)**
- [ ] Every prop in the type appears in exactly one of `shared`, `designOnly` or `codeOnly`. **(validator)**
- [ ] Enum values, required/optional and prop kind match the type. **(validator)**
- [ ] Optional props have a `default` that matches the runtime default. **(validator for presence only; check the value by hand)**
- [ ] Each shared prop has a binding, and every `enum-map` covers all values. **(validator)**
- [ ] `constraints` with `enforcedBy: types` are actually enforced by the type. **(validator)**
- [ ] Every `tokens.refs` value exists in the token source. **(validator)**
- [ ] Correct examples pass the props and constraints; incorrect examples break the rule they cite. **(validator)**
- [ ] Each mismatch between Figma, code and docs is a `knownGaps` entry with a source. Use `waives` only for a validator finding you have chosen to accept for now. **(validator flags stale waivers)**

## 3. Guide

- [ ] Front matter holds id, title, status, tier and check for each rule. The body never restates them. **(validator)**
- [ ] Each rule has a `## PREFIX-NNN — Title` heading with the exact front matter title. Each gap has a `### PREFIX-NNN — Title` heading under `## Known gaps`. **(validator)**
- [ ] `check` names a real target: `types:<Export>`, `schema:/json/pointer`, `test:<file>#<name>`, `lint:<rule>`, `docs:<path>`, or `review`. **(validator)**
- [ ] Every tier 1 rule that can be checked automatically names a `test:` or `types:` target, and the test exists with that exact name. Rules only a person can judge say `review`. **(validator for target existence)**
- [ ] Rule statuses stay `proposed` or `open` until Design ratifies them.
- [ ] Each rule says why, in one to three sentences.
- [ ] If a sibling component exists, the guide says when to choose each.

## 4. Before you commit

- [ ] `pnpm ds:generate` has been run and its output in `agents/components/` is committed.
- [ ] `pnpm ds:check <ComponentName>` exits 0. It runs the validator, the reference staleness check and the component's rule tests.
- [ ] `pnpm typecheck`, `pnpm lint` and `pnpm test` pass.
- [ ] No `[TK]` remains in either file.

## Ratification

- [ ] Design signs off on each rule; change its status from `proposed` to `adopted`.
- [ ] Move the manifest `status` from `draft` or `beta` to `stable`.
- [ ] Update `governance.note` and `governance.tokenStatus`.
