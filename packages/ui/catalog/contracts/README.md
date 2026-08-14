# Component Contracts

Component contracts are the shared, machine-readable definition of what a Canary component means across Figma and code. The inventory decides which contract governs an export. A contract then describes the component's anatomy, properties, states, behavior, accessibility requirements, usage rules, and AI-readiness expectations.

## Current vertical slice

`button.contract.json` is the first end-to-end contract in piloting. It consolidates evidence from:

- The public React implementation and types.
- Portal documentation.
- Component tests.
- The 12 current Code Connect files that declare `component=Button`.
- The in-repo Figma plugin (`packages/figma-plugin`), which compiles this contract into the bundled check pack.

The Button Figma identity has been audited against the library and live source. Twelve PoC keys resolve to the current md, sm, and xs Text, IconOnly, and Rounded component sets and are stored as confirmed `componentKeys`. The other four PoC keys return 404 as both component and component-set identities and have been removed. The mapping is verified, the approved matrix is reconciled across the live Figma source and code, and the contract is now `piloting`.

## Schema and validation

The structural schema is defined in `scripts/component-contract-schema.mjs`; `scripts/component-contract.mjs` adds semantic and inventory validation. Schema 0.4 separates:

- A canonical component model: identity, semantics, anatomy, properties, states, constraints, tokens, accessibility, and usage.
- Figma and React surface bindings: component identities, properties, props, slots, composition, state representation, aliases, and intentional fidelity limits.
- Governance: lifecycle, ownership, requirements, migrations, and dated evidence.

Properties are authored once. The compiler derives `shared`, `designOnly`, and `codeOnly` from binding presence. Unresolved proposals remain in Jira, Confluence, or architecture decisions until approved; they are not effective contract rules.

Run validation from the repository root:

```sh
pnpm --filter @harnessio/ui catalog:validate
```

The validator checks each contract's structure, cross-references, constraint coverage, generated-artifact freshness, and link to `component-inventory.json`. It also prevents a Figma-governed contract from becoming `stable` without a verified mapping and at least one confirmed component key.

When support depends on a combination of properties, add `constraints`. Each rule declares:

- A unique `id` and one of `supported`, `deprecated`, or `unsupported`.
- The governed `figma` and/or `react` surfaces.
- `conditions` whose keys reference declared contract properties and whose arrays form the rule's allowed Cartesian product.
- A plain-language `description`, auditable requirement, and optional migration reference.

When `constraints.exhaustive` is true, every declared combination must match exactly one rule. Contract validation rejects gaps, overlaps, unknown properties, and unknown values.

Generate the machine-readable JSON Schema, TypeScript types, Confluence field-reference data, and audit receipts after authoring:

```sh
pnpm --filter @harnessio/ui catalog:generate
```

The generated files under `catalog/generated/` are checked in and must not be edited by hand.

## Status meaning

- `draft`: Codebase evidence is captured, but one or more mappings or decisions remain provisional.
- `piloting`: The team is testing the contract against real Figma nodes, code, and auditor results.
- `stable`: The mapping is verified and the contract is approved as enforceable guidance.
- `deprecated`: The contract remains available for migration guidance but should not be used for new work.

## Button audit result

The Button family contains 12 component sets. The live source was re-audited on August 13, 2026 after the approved matrix was applied:

- Text, IconOnly, and Rounded treatments at md, sm, and xs.
- Every component uses horizontal Auto Layout and has variable bindings.
- Every set exposes default, hover, active, loading, and disabled states.
- Figma does not publish 2xs or 3xs sets. Focus is intentionally code-only and is documented with a detached representative Figma specification instead of a published state variant.
- The corrected matrix keeps AI, transparent, link, and every icon-only Button on the default theme. Primary, secondary, outline, and ghost text Buttons may use default, success, or danger. Each icon-only set now contains 30 variants: six visual variants, one default theme, and five state/disabled combinations. Rounded icon-only sets include transparent/default and use the rounded radius token.
- The ❌ prefix denotes a deprecated component. TextRounded Button treatments are deprecated and remain temporarily for migration. IconOnlyRounded remains supported in md, sm, and xs because it is used by Pipeline Studio.
- Code Connect includes the `-` theme mapping only for md and sm Text, matching the Figma sets that expose it.
- Button is approved for actions, including action toolbars and controls that start or advance onboarding in place. Link is required for routes, URLs, files, and other destinations. Canary does not currently provide an approved button-styled Link pattern.
- The approved support matrix is encoded in `button.contract.json` and compiled into the Figma plugin catalog. It supports md, sm, and xs; supports rounded only for icon-only Buttons; limits AI, transparent, link, and icon-only Buttons to the default theme; limits link to md/sm text actions; deprecates TextRounded; and excludes 2xs/3xs from the public API.

The inventory entry is now `mapped`. Size, shape, variant, theme, and focus policy are approved, and the contract has no provisional fields or open policy questions. Focus remains a required code state and an accessibility requirement, but the absence of a published Figma focus variant is compliant by design.

The Button contract is now `piloting`. The approved support matrix is reconciled with the live Figma source, the public Button API, production usage, Portal guidance, Code Connect, and evaluator fixtures. Publishing the updated Figma library remains a manual step before consumers receive the new matrix; piloting will test the contract against real designs and auditor results before it can become `stable`.

## Adding the next contract

1. Confirm the governing inventory entry and contract path.
2. Gather implementation, docs, tests, Code Connect, and Figma evidence.
3. Write canonical properties once and bind them explicitly to Figma and/or React. Add exhaustive `constraints` when availability depends on combinations.
4. Keep unresolved decisions outside the effective contract until approved.
5. Add auditable requirements and dated evidence; declare automated, manual, and advisory enforcement honestly.
6. Run `catalog:generate` and `catalog:validate`.
7. Compile the Figma plugin pack (`pnpm --filter @harnessio/figma-plugin catalogs:pack`) so Check uses the new contract.
8. Review the component in Figma before changing its mapping or lifecycle status.
