# Canary contracts and Copilot review guide

This work is split into five stacked pull requests. Review and merge them in order because each branch uses the previous branch as its target.

## Series map

| Order | Branch | Outcome | Primary review question |
| --- | --- | --- | --- |
| 1 | `codex/contracts-inventory-foundation` | Audited inventory of public Canary exports | Is the inventory repeatable and are the initial governance classifications accurate? |
| 2 | `codex/button-contract-alignment` | First Button contract, usage rules, and consumer alignment | Do Button semantics, rounded treatment, and migrations match product intent? |
| 3 | `codex/canary-copilot-mvp` | In-repository Figma auditor backed by Canary contracts | Does the plugin load, match, and report contract findings correctly? |
| 4 | `codex/contracts-piloting-hardening` | Approved Button matrix, Code Connect cleanup, schema artifacts, and plugin hardening | Are the executable constraints and design-to-code bindings accurate? |
| 5 | `codex/button-stable-copilot-health` | Canonical evaluation, health scoring, accessibility enforcement, and stable Button evidence | Is the Button vertical slice trustworthy enough to call stable? |

## Review boundaries

- Review only the diff against the preceding branch. Comparing a later branch directly with `main` repeats already-reviewed changes.
- Generated schema, types, reference, and audit receipts should agree with their source scripts and contract. Review their structure and validation result rather than every generated line.
- The existing `codex/component-inventory` branch remains an unchanged backup of the complete implementation.
- Confluence contains the explanatory and authoring documentation. Repository files remain the executable source of truth.

## Recommended reviewers

- Design system designers: contract intent, Figma identity, supported combinations, and usage guidance.
- UI engineers: schema implementation, component API, accessibility, tests, and consumer migrations.
- Figma/Code Connect owners: component keys, property mappings, generated examples, and publish readiness.
- Plugin reviewers: catalog compilation, matching, evaluation behavior, Jira proposals, health scoring, and Figma runtime safety.

## Validation by layer

### Inventory

```sh
pnpm --filter @harnessio/ui exec vitest --run scripts/component-inventory.test.js
```

### Button contract and UI

```sh
pnpm --filter @harnessio/ui catalog:validate
pnpm --filter @harnessio/ui exec vitest --run scripts/component-contract.test.js src/components/__tests__/button.test.tsx
```

### Canary Copilot

```sh
pnpm --filter @harnessio/figma-plugin test
pnpm --filter @harnessio/figma-plugin typecheck
pnpm --filter @harnessio/figma-plugin build
```

### Final stack

Node versions that expose global `localStorage` without a backing file require:

```sh
NODE_OPTIONS=--localstorage-file=/tmp/canary-vitest-local-storage pnpm test
```

## Final acceptance evidence

- Button contract version: `0.9.0`
- Contract lifecycle: `stable`
- Verified Figma component sets: 12
- Published Code Connect mappings: 12
- Exhaustive Button combination rules: 14
- Canary Copilot Button page audit: 6/6 mapped, 6 pass, 0 fail, 0 warn
- Button health score: 100/100
- Contract tests: 22 passing
- Canary Copilot tests: 172 passing across 26 files

## Merge procedure

1. Merge PR 1 into `main`.
2. Retarget PR 2 from PR 1's branch to `main`, then merge it.
3. Repeat for PRs 3–5.
4. Re-run the validation listed for each layer after retargeting if the target branch changed.
5. Close the original all-in-one PR only after all five replacement PRs exist and their diffs have been verified.
