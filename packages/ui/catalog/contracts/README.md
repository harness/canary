# Component Contracts

Component contracts are the shared, machine-readable definition of what a Canary component means across Figma and code. The inventory decides which contract governs an export. A contract describes canonical semantics, anatomy, slots, properties, states, supported combinations, presentation, token references, examples, evaluations, and usage. It is a generation foundation, not yet a promise that production React or Figma artifacts can be generated without review.

## Current vertical slice

`button.contract.json` is the first end-to-end contract in piloting. It consolidates evidence from:

- The public React implementation and types.
- Portal documentation.
- Component tests.
- The 12 current Code Connect files that declare `component=Button`.
- The in-repo Figma plugin (`packages/figma-plugin`), which compiles this contract into the bundled check pack.

The Button Figma identity has been audited against the library and live source. Twelve PoC keys resolve to the current md, sm, and xs Text, IconOnly, and Rounded component sets and are stored as confirmed `componentKeys`. The other four PoC keys return 404 as both component and component-set identities and have been removed. The mapping is verified, the approved matrix is reconciled across the live Figma source and code, and the contract is now `piloting`.

## Schema and validation

The structural schema is defined in `scripts/component-contract-schema.mjs`; `scripts/component-contract.mjs` adds semantic, evidence, token, and inventory validation. Schema 0.5 separates:

- Canonical intent: identity, semantics, anatomy, slots, properties, states, supported combinations, presentation, resolvable token IDs, examples, evaluations, and usage.
- Surface bindings: Figma identities and properties plus React bindings and explicitly scoped React-only API extensions.
- Governance: lifecycle, ownership, migrations, and external evidence references.
- Verification evidence: dated results in `catalog/evidence/`, separate from the normative contract and compiled into deterministic audit receipts.

Properties are authored once. The compiler derives `shared`, `designOnly`, and `codeOnly` from binding presence. Unresolved proposals remain in Jira, Confluence, or architecture decisions until approved; they are not effective contract rules.

Run validation from the repository root:

```sh
pnpm --filter @harnessio/ui catalog:validate
```

The validator checks each contract's structure, cross-references, constraint coverage, token-registry references, external verification evidence, generated-artifact freshness, and link to `component-inventory.json`. It also prevents a Figma-governed contract from becoming `stable` without a verified mapping and at least one confirmed component key.

When support depends on a combination of properties, add `constraints`. Each combination declares:

- A unique `id` and one of `supported`, `deprecated`, or `unsupported`.
- The governed `figma` and/or `react` surfaces.
- `conditions` whose keys reference declared contract properties and whose arrays form the rule's allowed Cartesian product.
- A plain-language `description`, auditable `ruleId`, and optional migration reference.

When `constraints.exhaustive` is true, every declared combination must match exactly one entry in `constraints.combinations`. Contract validation rejects gaps, overlaps, unknown properties, and unknown values. Health and governance checks live separately in `evaluations`; this keeps supported combinations distinct from the checks that measure them.

Optional metadata collections default to empty. Authors do not need to add placeholder arrays for aliases, React extensions, Figma keys, Code Connect files, presentation variants, tokens, related components, examples, or migrations. Piloting, stable, and deprecated contracts still require external evidence references and evaluation coverage across every health dimension.

Canonical presentation uses logical relationships such as `inline`, `block`, alignment, and token IDs. CSS display mechanisms and Figma layout implementation details belong in their surface generators or bindings, not in approved portable intent.

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

The Button family contains 12 component sets. The live source was re-audited on August 14, 2026 after the approved matrix was reconciled:

- Text, IconOnly, and Rounded treatments at md, sm, and xs.
- Every component uses horizontal Auto Layout and has variable bindings.
- Every set exposes default, hover, active, loading, and disabled states.
- Figma does not publish 2xs or 3xs sets. Focus is intentionally code-only and is documented with a detached representative Figma specification instead of a published state variant.
- The corrected matrix keeps AI, transparent, and link Buttons on the default theme. Primary, secondary, outline, and ghost Buttons may use default, success, or danger with text or icon-only content. All six standard and rounded icon-only sets expose the three themes. Rounded icon-only sets include transparent/default and use the rounded radius token.
- The ❌ prefix denotes a deprecated component. TextRounded Button treatments are deprecated and remain temporarily for migration. IconOnlyRounded remains supported in md, sm, and xs because it is used by Pipeline Studio.
- Code Connect includes the `-` theme mapping only for md and sm Text, matching the Figma sets that expose it.
- Button is approved for actions, including action toolbars and controls that start or advance onboarding in place. Link is required for routes, URLs, files, and other destinations. Canary does not currently provide an approved button-styled Link pattern.
- The approved support matrix is encoded in `button.contract.json` and compiled into the Figma plugin catalog. It supports md, sm, and xs; supports rounded only for icon-only Buttons; limits AI, transparent, and link to the default theme; permits semantic themes for primary, secondary, outline, and ghost text and icon-only Buttons; limits link to md/sm text actions; deprecates TextRounded; and excludes 2xs/3xs from the public API.

The inventory entry is now `mapped`. Size, shape, variant, theme, and focus policy are approved, and the contract has no provisional fields or open policy questions. Focus remains a required code state and an accessibility requirement, but the absence of a published Figma focus variant is compliant by design.

The Button contract is now `piloting`. The approved support matrix is reconciled with the live Figma source, the public Button API, production usage, Portal guidance, Code Connect, and evaluator fixtures. The icon-only theme correction requires no Figma library change because all six published sets already expose the three themes. Piloting will continue testing the contract against real designs and auditor results before it can become `stable`.

## Adding the next contract

1. Confirm the governing inventory entry and contract path.
2. Gather implementation, docs, tests, Code Connect, and Figma evidence.
3. Write canonical properties once and bind them explicitly to Figma and/or React. Add exhaustive `constraints` when availability depends on combinations.
4. Keep unresolved decisions outside the effective contract until approved.
5. Add canonical slots, structured examples, presentation relationships, and resolvable token IDs when they affect generation or evaluation.
6. Add auditable evaluations to the contract and dated verification results to the separate evidence file; declare automated, manual, and advisory enforcement honestly.
7. Run `catalog:generate` and `catalog:validate`.
8. Compile the Figma plugin pack (`pnpm --filter @harnessio/figma-plugin catalogs:pack`) so Check uses the new contract.
9. Review the component in Figma before changing its mapping or lifecycle status.
