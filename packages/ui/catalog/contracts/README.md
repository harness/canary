# Component Contracts

Component contracts are the shared, machine-readable definition of what a Canary component means across Figma and code. The inventory decides which contract governs an export. A contract then describes the component's anatomy, properties, states, behavior, accessibility requirements, usage rules, and AI-readiness expectations.

## Current vertical slice

`button.contract.json` is the first end-to-end draft. It consolidates evidence from:

- The public React implementation and types.
- Portal documentation.
- Component tests.
- The 12 current Code Connect files that declare `component=Button`.
- The in-repo Figma plugin (`packages/figma-plugin`), which compiles this contract into the bundled check pack.

The Button Figma identity has been audited against the published library. Twelve PoC keys resolve to the current md, sm, and xs Text, IconOnly, and Rounded component sets and are now stored as confirmed `componentKeys`. The other four PoC keys return 404 as both component and component-set identities and have been removed. The mapping is verified, but the contract remains `draft` while product decisions about surface differences are unresolved.

## Schema and validation

The runtime schema is defined in `scripts/component-contract.mjs`. It requires every contract to include:

- Overview and usage boundaries.
- Figma and/or code identity for the governed surfaces.
- Anatomy and property classifications.
- Required states and behavior.
- Accessibility requirements.
- Explicit AI-readiness expectations.
- Evidence, provisional fields, and open questions.

Run validation from the repository root:

```sh
pnpm --filter @harnessio/ui catalog:validate
```

The validator checks each contract's structure and its link to `component-inventory.json`. It also prevents a Figma-governed contract from becoming `stable` without a verified mapping and at least one confirmed component key.

When support depends on a combination of properties, add `supportMatrix`. Each rule declares:

- A unique `id` and one of `supported`, `deprecated`, or `unsupported`.
- The governed `surfaces`.
- `conditions` whose keys reference declared contract properties and whose arrays form the rule's allowed Cartesian product.
- A plain-language `description` and, for deprecated or unsupported legacy behavior, an optional `migration`.

Rules should cover every declared combination exactly once. Contract validation rejects unknown property names and values; component-specific tests should also verify exhaustive, non-overlapping coverage.

## Status meaning

- `draft`: Codebase evidence is captured, but one or more mappings or decisions remain provisional.
- `piloting`: The team is testing the contract against real Figma nodes, code, and auditor results.
- `stable`: The mapping is verified and the contract is approved as enforceable guidance.
- `deprecated`: The contract remains available for migration guidance but should not be used for new work.

## Button audit result

The published Button family currently contains 12 component sets:

- Text, IconOnly, and Rounded treatments at md, sm, and xs.
- Every component uses horizontal Auto Layout and has variable bindings.
- Every set exposes default, hover, active, loading, and disabled states.
- Figma does not publish 2xs or 3xs sets and does not expose a focus preview.
- Variant availability is not a full matrix: link appears only in md and sm Text; transparent is absent from most TextRounded sets and all IconOnlyRounded sets.
- The ❌ prefix denotes a deprecated component. TextRounded Button treatments are deprecated and remain temporarily for migration. IconOnlyRounded remains supported in md, sm, and xs because it is used by Pipeline Studio.
- Code Connect includes a `-` theme mapping in every Button file, while Figma currently exposes that option only on md and sm Text.
- Button is approved for actions, including action toolbars and controls that start or advance onboarding in place. Link is required for routes, URLs, files, and other destinations. Canary does not currently provide an approved button-styled Link pattern.
- The approved support matrix is encoded in `button.contract.json` and compiled into the Figma plugin catalog. It supports md, sm, and xs; supports rounded only for icon-only Buttons; limits the link visual variant to default-theme md/sm text actions; deprecates TextRounded; and marks 2xs/3xs unsupported for new use.

The inventory entry is now `mapped`. Size, shape, variant, and theme policy are approved. The Button draft still needs one manual design-system decision before it should leave `draft`:

1. Decide whether Figma needs a focus preview.

Do not advance the contract to `piloting` or `stable` until the remaining focus-preview decision is recorded and the approved matrix has been reconciled with Figma and code. The verified identity is sufficient for the inventory's `mapped` status, but it does not make every current Figma/code difference compliant.

## Adding the next contract

1. Confirm the governing inventory entry and contract path.
2. Gather implementation, docs, tests, Code Connect, and Figma evidence.
3. Write the contract using Button as the structural example. Add an exhaustive `supportMatrix` when availability depends on property combinations, and mark uncertain values in `evidence.provisionalFields` and `evidence.openQuestions`.
4. Run `catalog:validate`.
5. Compile the Figma plugin pack (`pnpm --filter @harnessio/figma-plugin catalogs:pack`) so Check uses the new contract.
6. Review the component in Figma before changing its mapping or lifecycle status.
