# Generation-Ready Component Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Button to contract schema 0.4.0 and make Canary Copilot execute its constraints and report transparent component-health scores while generating stable schema, type, documentation, and audit artifacts.

**Architecture:** The Zod runtime schema remains the first implementation authority. One canonical contract is compiled into consumer-specific artifacts; the plugin receives compatibility property buckets derived from per-surface bindings plus executable constraints, requirements, evidence, and a centrally versioned evaluation profile. Figma and React remain human-maintained pilot surfaces.

**Tech Stack:** Node.js ESM, Zod 4, JSON Schema, TypeScript, React/Preact, Vitest, pnpm, Figma Plugin API, Confluence.

**Spec:** `docs/superpowers/specs/2026-08-14-generation-ready-component-contracts-design.md`

## Global Constraints

- Target contract schema is exactly `0.4.0`.
- The initial evaluation profile is exactly `1.0.0`.
- Production React Button and published Figma component sets are not generated or overwritten.
- Scores are derived artifacts; no score is authored into a component contract.
- Critical failures produce `blocked` health regardless of numeric score.
- Manual, unavailable, stale, and unevaluated checks never count as passing.
- Existing Button policy, component keys, publication evidence, focus decision, supported rounded icon-only treatment, and deprecated rounded text treatment must survive migration.
- Existing Confluence content must be fetched immediately before editing and updated surgically.
- New behavior follows red-green-refactor TDD.

---

## File map

### Contract authoring and generation

- Create `packages/ui/scripts/component-contract-schema.mjs`: structural Zod schemas and exported enums for schema 0.4.0.
- Modify `packages/ui/scripts/component-contract.mjs`: catalog loading and semantic cross-reference validation using the new structural schema.
- Create `packages/ui/scripts/component-contract-artifacts.mjs`: deterministic JSON Schema, TypeScript declaration, field-reference, and audit-receipt generation.
- Modify `packages/ui/scripts/validate-component-contracts.mjs`: validate source contracts and fail when generated artifacts are stale.
- Modify `packages/ui/scripts/component-contract.test.js`: schema, cross-reference, generation, Button policy, and freshness behavior.
- Create `packages/ui/catalog/evaluation-profile.json`: central dimensions, weights, severity weights, thresholds, and evidence freshness defaults.
- Modify `packages/ui/catalog/contracts/button.contract.json`: migrate the approved Button contract to schema 0.4.0.
- Create `packages/ui/catalog/generated/component-contract.schema.json`: generated JSON Schema.
- Create `packages/ui/catalog/generated/component-contract.types.ts`: generated TypeScript contract types.
- Create `packages/ui/catalog/generated/component-contract.reference.json`: generated nested field-reference data for documentation.
- Create `packages/ui/catalog/generated/button.audit-receipt.json`: generated deterministic Button baseline receipt.
- Modify `packages/ui/catalog/contracts/README.md`: schema 0.4 authoring and generation workflow.
- Modify `packages/ui/package.json`: add `catalog:generate` and make `catalog:validate` include freshness validation.

### Canary Copilot compilation and evaluation

- Modify `packages/figma-plugin/bin/compile-contracts.mjs`: compile canonical properties, bindings, constraints, requirements, evidence, profile, and source metadata.
- Modify `packages/figma-plugin/src/schema/schema.ts`: validate the new compiled catalog shape.
- Modify `packages/figma-plugin/src/core/types.ts`: add constraint findings and health types.
- Create `packages/figma-plugin/src/core/canonical.ts`: derive canonical values from Figma properties and component-set names.
- Create `packages/figma-plugin/src/core/constraints.ts`: select exactly one applicable constraint and return supported/deprecated/unsupported results.
- Create `packages/figma-plugin/src/core/health.ts`: deterministic dimension, total, blocker, evaluation-coverage, and automation-coverage calculation.
- Modify `packages/figma-plugin/src/core/check.ts`: run canonicalization, constraints, requirement evaluations, and component health.
- Modify `packages/figma-plugin/src/ui/state/checkStore.ts`: preserve health when reports are focused and summarized.
- Modify `packages/figma-plugin/src/ui/tabs/CheckTab.tsx`: show health status, total, dimensions, blockers, and coverage per component.
- Modify `packages/figma-plugin/src/ui/lib/handoffPack.ts`: include health and coverage in copied results.
- Modify `packages/figma-plugin/src/ui/theme.css`: style the compact health summary accessibly.
- Modify focused plugin tests and generated catalog fixtures.

### Documentation and verification

- Create the Confluence page `Canary Component Contract Schema Specification` in folder `24145592444`.
- Update the existing contract authoring reference, architecture strategy, overview, Button gap-closure plan, and current-status pages using their latest bodies.
- Record final commands and evidence in the generated Button receipt and current-status page.

---

### Task 1: Define schema 0.4.0 and the evaluation profile

**Files:**
- Create: `packages/ui/scripts/component-contract-schema.mjs`
- Create: `packages/ui/catalog/evaluation-profile.json`
- Modify: `packages/ui/scripts/component-contract.mjs`
- Modify: `packages/ui/scripts/component-contract.test.js`

**Interfaces:**
- Produces: `componentContractSchema`, `evaluationProfileSchema`, `HEALTH_DIMENSIONS`, `REQUIREMENT_SEVERITIES`, `ENFORCEMENT_MODES`.
- Produces: `validateComponentContract(input): { success: boolean; errors: string[] }` with structural and semantic errors.
- Consumed by: artifact generation, Button migration, and plugin compilation.

- [ ] **Step 1: Replace the test fixture with a minimal valid schema 0.4.0 contract and add failing normalization tests**

Add tests that prove:

```js
expect(validateComponentContract(completePilotContract())).toEqual({ success: true, errors: [] })

expect(classifyPropertySurface(propertyWithFigmaAndReactBindings)).toBe('shared')
expect(classifyPropertySurface(propertyWithOnlyFigmaBinding)).toBe('designOnly')
expect(classifyPropertySurface(propertyWithOnlyReactBinding)).toBe('codeOnly')
```

The fixture must include all top-level sections from the design spec and at least one requirement in every health dimension.

- [ ] **Step 2: Run the schema tests and verify RED**

Run:

```bash
cd packages/ui
pnpm exec vitest run scripts/component-contract.test.js
```

Expected: FAIL because schema 0.4.0 and `classifyPropertySurface` do not exist.

- [ ] **Step 3: Implement the structural schema**

Create focused Zod schemas for:

```js
export const HEALTH_DIMENSIONS = [
  'contractDefinition',
  'figmaImplementation',
  'codeImplementation',
  'designCodeParity',
  'governanceEvidence'
]

export const REQUIREMENT_SEVERITIES = ['critical', 'major', 'minor', 'informational']
export const ENFORCEMENT_MODES = ['automated', 'manual', 'advisory']
```

The contract must use these exact top-level fields:

```ts
type ComponentContract = {
  schemaVersion: '0.4.0'
  contractVersion: string
  identity: { id: string; name: string; summary: string; aliases: string[] }
  semantics: { purpose: string; useWhen: string[]; avoidWhen: string[]; roles: string[] }
  lifecycle: { status: 'draft' | 'piloting' | 'stable' | 'deprecated'; publishedAt?: string; replacementId?: string }
  ownership: { team: string; contacts: string[] }
  surfaces: { figma?: FigmaSurface; react?: ReactSurface }
  anatomy: AnatomyPart[]
  properties: CanonicalProperty[]
  states: StateDefinition[]
  constraints: ConstraintRule[]
  tokens: TokenBinding[]
  accessibility: AccessibilityRule[]
  usage: { do: UsageRule[]; dont: UsageRule[]; relatedComponents: string[] }
  requirements: Requirement[]
  migrations: Migration[]
  evidence: { sources: EvidenceSource[]; verifications: Verification[] }
}
```

Canonical property Figma bindings support `property` and `componentName` kinds. `componentName` bindings use ordered `{ contains, value }` matches and an optional scalar fallback. React bindings support `prop`, `slot`, `composition`, `pseudoClass`, and `behavior` kinds.

- [ ] **Step 4: Implement semantic cross-reference validation**

Update `component-contract.mjs` to reject:

- Duplicate IDs in properties, anatomy, states, constraints, requirements, migrations, and verification records.
- Constraint properties or values not declared canonically.
- Constraint surfaces not governed by the contract.
- Missing anatomy/state/requirement/migration references.
- Requirements that omit a health dimension.
- Verification records pointing to unknown requirements or evidence sources.
- Stable Figma contracts without verified keys.
- Contracts whose constraints overlap or leave gaps when `constraints.exhaustive` is true.

Export:

```js
export function classifyPropertySurface(property) {
  const hasFigma = Boolean(property.bindings?.figma)
  const hasReact = Boolean(property.bindings?.react)
  if (hasFigma && hasReact) return 'shared'
  if (hasFigma) return 'designOnly'
  return 'codeOnly'
}
```

- [ ] **Step 5: Add and validate the central profile**

Create exact dimension weights `20/25/25/20/10`, severity weights `8/3/1/0`, thresholds `healthy=90`, `needsAttention=70`, `atRisk=0`, and `blockedOnCritical=true` under profile version `1.0.0`.

- [ ] **Step 6: Run schema tests and verify GREEN**

Run the focused UI contract test command. Expected: all schema and legacy production-usage checks pass.

- [ ] **Step 7: Commit Task 1**

```bash
git add packages/ui/scripts/component-contract-schema.mjs packages/ui/scripts/component-contract.mjs packages/ui/scripts/component-contract.test.js packages/ui/catalog/evaluation-profile.json
git commit -m "feat(ui): add generation-ready contract schema"
```

---

### Task 2: Migrate Button and generate contract artifacts

**Files:**
- Modify: `packages/ui/catalog/contracts/button.contract.json`
- Create: `packages/ui/scripts/component-contract-artifacts.mjs`
- Modify: `packages/ui/scripts/validate-component-contracts.mjs`
- Modify: `packages/ui/scripts/component-contract.test.js`
- Modify: `packages/ui/package.json`
- Create: `packages/ui/catalog/generated/component-contract.schema.json`
- Create: `packages/ui/catalog/generated/component-contract.types.ts`
- Create: `packages/ui/catalog/generated/component-contract.reference.json`
- Create: `packages/ui/catalog/generated/button.audit-receipt.json`
- Modify: `packages/ui/catalog/contracts/README.md`

**Interfaces:**
- Consumes: schema and profile from Task 1.
- Produces: `generateContractArtifacts({ packageRoot, write }): ArtifactResult`.
- Produces: checked-in deterministic generated artifacts consumed by the plugin compiler and Confluence authoring.

- [ ] **Step 1: Write failing Button migration and generation tests**

Assert literal approved outcomes rather than mirroring generator logic:

```js
expect(button.schemaVersion).toBe('0.4.0')
expect(button.identity.id).toBe('canary.button')
expect(button.lifecycle.status).toBe('piloting')
expect(button.properties.map(property => property.id)).toContain('variant')
expect(button.constraints.rules).toHaveLength(13)
expect(matchConstraint(button, approvedRoundedIconOnly).status).toBe('supported')
expect(matchConstraint(button, deprecatedRoundedText).status).toBe('deprecated')
expect(matchConstraint(button, invalidAiDanger).status).toBe('unsupported')
expect(button.evidence).not.toHaveProperty('provisionalFields')
expect(button.evidence).not.toHaveProperty('openQuestions')
```

Add a temporary-directory test that runs `generateContractArtifacts` twice and asserts byte-identical output. Mutating one generated file must make freshness validation fail with its exact repository-relative path.

- [ ] **Step 2: Run tests and verify RED**

Expected failures: Button is still 0.3.0 and the artifact generator does not exist.

- [ ] **Step 3: Migrate the approved Button contract**

Preserve the 12 verified Figma keys and all current policy. Move:

- `overview` into `identity` and `semantics`.
- `status` into `lifecycle.status`.
- `code`/`figma` into `surfaces.react`/`surfaces.figma`.
- Shared/code-only props into one canonical `properties` array with bindings.
- Leading/trailing icons, label, tooltip, and loading indicator into structured anatomy bindings.
- Figma preview controls into state/anatomy bindings rather than duplicate canonical props.
- `supportMatrix` into `constraints.rules` with `exhaustive: true`.
- Behavioral, accessibility, readiness, usage, and pattern statements into stable `requirements` and structured usage rules.
- Approved deprecations into `migrations`.
- Source records and dated verifications into `evidence`.

Use contract version `0.7.0` because the representation and executable evaluation surface change while approved Button policy remains intact.

- [ ] **Step 4: Implement deterministic artifact generation**

`generateContractArtifacts` must:

- Use `z.toJSONSchema(componentContractSchema)` for JSON Schema.
- Emit explicit TypeScript interfaces matching schema 0.4.0.
- Walk the JSON Schema into rows shaped as `{ path, type, required, allowedValues, default, owner, consumers, description }`.
- Generate a Button audit receipt with contract/source versions, requirement evaluations, dimension inputs, evidence freshness, and no wall-clock timestamp unless explicitly supplied.
- Sort object-derived rows and records for byte-stable output.

- [ ] **Step 5: Add generation and freshness commands**

Add:

```json
"catalog:generate": "node scripts/component-contract-artifacts.mjs --write",
"catalog:validate": "node scripts/validate-component-contracts.mjs"
```

The validator runs structural/catalog validation and `generateContractArtifacts({ write: false })`, reporting stale paths without modifying them.

- [ ] **Step 6: Generate artifacts and run GREEN verification**

Run:

```bash
pnpm --filter @harnessio/ui catalog:generate
pnpm --filter @harnessio/ui catalog:validate
pnpm exec vitest run scripts/component-contract.test.js
```

Expected: generated files are current and all tests pass.

- [ ] **Step 7: Update the contract README**

Document the canonical/surface/governance layers, property-binding derivation, executable constraints, requirement enforcement modes, generated artifacts, scoring profile, and authoring commands. Remove schema 0.3 instructions about authoring `shared/designOnly/codeOnly`, `supportMatrix`, provisional fields, and open questions.

- [ ] **Step 8: Commit Task 2**

```bash
git add packages/ui/catalog packages/ui/scripts packages/ui/package.json
git commit -m "feat(ui): migrate Button to contract schema 0.4"
```

---

### Task 3: Compile schema 0.4 contracts for Canary Copilot

**Files:**
- Modify: `packages/figma-plugin/bin/compile-contracts.mjs`
- Modify: `packages/figma-plugin/src/schema/schema.ts`
- Modify: `packages/figma-plugin/tests/compile-contracts.test.ts`
- Modify generated files under: `packages/figma-plugin/catalogs/canary/`
- Modify generated files under: `packages/figma-plugin/public/catalogs/canary/`

**Interfaces:**
- Consumes: Button 0.4 and evaluation profile 1.0.0.
- Produces: compiled `CatalogEntry` with derived property buckets, structured `anatomy`, `states`, `constraints`, `requirements`, `evidence`, `evaluationProfile`, and `baselineReceipt`.

- [ ] **Step 1: Write a failing compiler behavior test**

Assert that compiled Button:

```ts
expect(button.source.schemaVersion).toBe('0.4.0')
expect(button.shared.map(prop => prop.name)).toContain('variant')
expect(button.codeOnly.map(prop => prop.name)).toContain('onClick')
expect(button.anatomy.map(part => part.id)).toContain('label-or-icon')
expect(button.states.find(state => state.id === 'focus-visible')?.fidelity.figma).toBe('specification')
expect(button.constraints.rules).toEqual(buttonContract.constraints.rules)
expect(button.requirements.some(rule => rule.id === 'button.supported-combination')).toBe(true)
expect(button.evaluationProfile.version).toBe('1.0.0')
expect(button.baselineReceipt.componentId).toBe('canary.button')
```

- [ ] **Step 2: Run the compiler test and verify RED**

Run `pnpm exec vitest run tests/compile-contracts.test.ts`. Expected: schema parse fails because the compiled fields do not exist.

- [ ] **Step 3: Update the compiled schema and compiler**

Derive `shared`, `designOnly`, and `codeOnly` from binding presence for backwards-compatible plugin consumption. Compile Figma bindings as:

```ts
type CompiledFigmaBinding =
  | { kind: 'property'; property: string; aliases?: string[]; valueAliases?: Record<string, string> }
  | { kind: 'componentName'; source: 'componentSetName' | 'mainComponentName'; matches: Array<{ contains: string; value: Scalar }>; fallback?: Scalar }
```

Carry anatomy, states, intentional surface fidelity, constraints, and evaluation data without reducing them to prose. Preserve the generated source fingerprint.

- [ ] **Step 4: Pack catalogs and verify GREEN**

Run:

```bash
pnpm --filter @harnessio/figma-plugin catalogs:pack
pnpm exec vitest run tests/compile-contracts.test.ts tests/schema.test.ts
```

- [ ] **Step 5: Commit Task 3**

```bash
git add packages/figma-plugin/bin packages/figma-plugin/src/schema packages/figma-plugin/tests/compile-contracts.test.ts packages/figma-plugin/catalogs packages/figma-plugin/public
git commit -m "feat(figma-plugin): compile executable contract rules"
```

---

### Task 4: Execute Button constraints in Canary Copilot

**Files:**
- Create: `packages/figma-plugin/src/core/canonical.ts`
- Create: `packages/figma-plugin/src/core/anatomy.ts`
- Create: `packages/figma-plugin/src/core/constraints.ts`
- Modify: `packages/figma-plugin/src/core/types.ts`
- Modify: `packages/figma-plugin/src/core/check.ts`
- Create: `packages/figma-plugin/tests/canonical.test.ts`
- Create: `packages/figma-plugin/tests/anatomy.test.ts`
- Create: `packages/figma-plugin/tests/constraints.test.ts`
- Modify: `packages/figma-plugin/tests/check.test.ts`

**Interfaces:**
- Produces: `canonicalizeInstance(snapshot, entry): CanonicalInstance`.
- Produces: `evaluateAnatomy(canonical, entry.anatomy): RequirementEvaluation[]`.
- Produces: `evaluateConstraints(canonical, constraints, surface): ConstraintEvaluation`.
- Adds finding codes `FAIL_REQUIRED_ANATOMY`, `INFO_INTENTIONAL_DIFFERENCE`, `FAIL_UNSUPPORTED_COMBINATION`, `WARN_DEPRECATED_COMBINATION`, and `FAIL_CONSTRAINT_COVERAGE`.

- [ ] **Step 1: Write failing canonicalization tests**

Use literal Figma snapshots to prove:

```ts
expect(canonicalizeInstance(mdText, buttonEntry).values).toMatchObject({
  variant: 'primary', size: 'md', theme: 'default', rounded: false, iconOnly: false
})
expect(canonicalizeInstance(xsRoundedIcon, buttonEntry).values).toMatchObject({
  size: 'xs', rounded: true, iconOnly: true
})
```

These tests catch removal of property aliases or component-set derivation.

- [ ] **Step 2: Run canonical tests and verify RED**

Expected: module missing.

- [ ] **Step 3: Implement canonicalization and verify GREEN**

Property bindings normalize live values. Component-name bindings apply ordered `contains` matches and fallback. Unbound canonical properties use declared defaults only when the surface representation permits it.

- [ ] **Step 4: Write failing constraint tests**

Use hand-authored combinations and assert:

- Primary/md/default/text resolves to exactly one supported rule.
- AI/md/danger/text resolves to exactly one unsupported rule.
- Primary/xs/default/rounded/icon-only resolves to supported.
- Primary/md/default/rounded/text resolves to deprecated with migration.
- No match and two matches return contract-coverage errors.

- [ ] **Step 5: Implement `evaluateConstraints` and verify GREEN**

The evaluator returns:

```ts
type ConstraintEvaluation =
  | { status: 'supported'; ruleId: string; message: string }
  | { status: 'deprecated'; ruleId: string; message: string; migration: string }
  | { status: 'unsupported'; ruleId: string; message: string; migration?: string }
  | { status: 'invalid'; matchingRuleIds: string[]; message: string }
```

- [ ] **Step 6: Write failing anatomy and surface-difference tests**

Prove that a text Button with its declared text property satisfies `label-or-icon`, an instance missing the required text/icon evidence fails `button.required-content`, and the code-only `focus-visible` state emits one informational finding that states Figma uses a representative specification.

- [ ] **Step 7: Implement anatomy and intentional-difference evaluation**

Treat the mapped instance itself as the required `root`. Evaluate required content from compiled anatomy predicates over canonical values and exposed Figma properties. Optional anatomy never fails when absent. Emit intentional-difference information once per distinct state or capability, not once per internal property ID.

- [ ] **Step 8: Integrate anatomy and constraints into `checkInstance` with failing integration tests first**

Assert exact finding severity and requirement ID. Supported adds no problem finding; deprecated emits warn; unsupported and invalid coverage emit fail. Existing property, detached, unmapped, and nested-icon tests must stay green.

- [ ] **Step 9: Run focused plugin tests**

```bash
pnpm exec vitest run tests/canonical.test.ts tests/anatomy.test.ts tests/constraints.test.ts tests/check.test.ts tests/match.test.ts tests/collect.test.ts
```

- [ ] **Step 10: Commit Task 4**

```bash
git add packages/figma-plugin/src/core packages/figma-plugin/tests
git commit -m "feat(figma-plugin): evaluate contract combinations"
```

---

### Task 5: Calculate and display component health

**Files:**
- Create: `packages/figma-plugin/src/core/health.ts`
- Modify: `packages/figma-plugin/src/core/types.ts`
- Modify: `packages/figma-plugin/src/core/check.ts`
- Modify: `packages/figma-plugin/src/ui/state/checkStore.ts`
- Modify: `packages/figma-plugin/src/ui/tabs/CheckTab.tsx`
- Modify: `packages/figma-plugin/src/ui/lib/handoffPack.ts`
- Modify: `packages/figma-plugin/src/ui/theme.css`
- Create: `packages/figma-plugin/tests/health.test.ts`
- Modify: `packages/figma-plugin/tests/check.test.ts`
- Modify: `packages/figma-plugin/tests/checkStore.test.ts`
- Modify: `packages/figma-plugin/tests/tabs.test.tsx`
- Modify: `packages/figma-plugin/tests/handoff.test.ts`

**Interfaces:**
- Produces: `scoreComponentHealth(profile, evaluations): ComponentHealth`.
- Adds: `CheckReport.healthByCatalog: Record<string, ComponentHealth>`.

- [ ] **Step 1: Write failing score tests using literal expected values**

Cover:

```ts
expect(healthy.total).toBe(100)
expect(healthy.status).toBe('healthy')
expect(criticalFailure.status).toBe('blocked')
expect(manualPending.evaluationCoverage).toBeLessThan(100)
expect(manualPending.automationCoverage).toBeLessThan(100)
expect(advisoryOnly.total).toBe(100)
```

Also assert dimension totals using the profile's exact 20/25/25/20/10 weights.

- [ ] **Step 2: Run health tests and verify RED**

Expected: module missing.

- [ ] **Step 3: Implement deterministic health calculation**

Use requirement severity weights within each dimension, then dimension weights for the total. Passed automated checks and current evidenced manual checks earn points. Failed, unavailable, stale, and unevaluated checks earn zero. Advisory and informational rules are excluded. Return:

```ts
type ComponentHealth = {
  total: number
  status: 'healthy' | 'needsAttention' | 'atRisk' | 'blocked'
  blockers: string[]
  evaluationCoverage: number
  automationCoverage: number
  dimensions: Record<HealthDimension, { score: number; evaluated: number; total: number }>
}
```

- [ ] **Step 4: Integrate live evaluations into reports with failing tests first**

Start from compiled baseline evidence. Replace the selected component's live Figma requirement results with actual property, library identity, and constraint outcomes. Multiple selected instances use worst-result semantics for a shared requirement.

- [ ] **Step 5: Preserve health through focused report state**

`reportForFocus` must return only the focused component's health entry. Summary-only helpers must not recompute or discard health.

- [ ] **Step 6: Render the health summary**

Each mapped component section displays:

```text
Health 86/100 · Needs attention
0 blockers · 91% evaluated · 72% automated
```

An expandable semantic list shows the five dimension scores. Status is conveyed by text as well as color. Instance findings remain below it and remain the primary workflow.

- [ ] **Step 7: Add health to copied results**

The handoff pack includes total, status, blocker count, both coverage measures, and dimension scores for each mapped component.

- [ ] **Step 8: Run UI and health tests**

```bash
pnpm exec vitest run tests/health.test.ts tests/check.test.ts tests/checkStore.test.ts tests/tabs.test.tsx tests/handoff.test.ts
```

- [ ] **Step 9: Commit Task 5**

```bash
git add packages/figma-plugin/src packages/figma-plugin/tests
git commit -m "feat(figma-plugin): report component health"
```

---

### Task 6: Validate the complete Button vertical slice

**Files:**
- Modify when evidence changes: `packages/ui/catalog/contracts/button.contract.json`
- Regenerate: `packages/ui/catalog/generated/button.audit-receipt.json`
- Regenerate: `packages/figma-plugin/catalogs/canary/`
- Regenerate: `packages/figma-plugin/public/catalogs/canary/`

**Interfaces:**
- Produces: final deterministic repository evidence for Button schema 0.4 and Canary Copilot.

- [ ] **Step 1: Run contract validation and generation freshness**

```bash
pnpm --filter @harnessio/ui catalog:validate
pnpm --filter @harnessio/figma-plugin catalogs:validate
```

- [ ] **Step 2: Run all Canary Copilot tests, typecheck, and build**

```bash
pnpm --filter @harnessio/figma-plugin test
pnpm --filter @harnessio/figma-plugin typecheck
pnpm --filter @harnessio/figma-plugin build
```

- [ ] **Step 3: Run UI contract and Button checks**

```bash
cd packages/ui
pnpm exec vitest run scripts/component-contract.test.js src/components/__tests__/button.test.tsx
pnpm typecheck
```

- [ ] **Step 4: Validate Code Connect without publishing**

Run from the repository root:

```bash
pnpm dlx @figma/code-connect@1.4.9 connect parse --config figma.config.json --dry-run --exit-on-unreadable-files
```

Expected: every configured Button mapping parses successfully; the command does not publish or mutate Figma.

- [ ] **Step 5: Perform the live Button audit**

Run Canary Copilot against representative supported, deprecated, and unsupported Button instances in the connected Figma file. Record the published library version/date, tested nodes, result counts, health score, coverage, and any manual checks in the Button verification evidence.

- [ ] **Step 6: Regenerate receipts and confirm a clean tree except intended files**

```bash
pnpm --filter @harnessio/ui catalog:generate
pnpm --filter @harnessio/figma-plugin catalogs:pack
git diff --check
git status --short
```

- [ ] **Step 7: Commit Task 6 if verification changed evidence**

```bash
git add packages/ui/catalog packages/figma-plugin/catalogs packages/figma-plugin/public
git commit -m "test(ui): record Button contract health evidence"
```

---

### Task 7: Create and update Confluence documentation

**External pages:**
- Create in folder `24145592444`: `Canary Component Contract Schema Specification`.
- Update page `24147788005`: component contract concept and JSON authoring reference.
- Update page `24145854592`: contracts and Figma auditor strategy.
- Update page `24150016066`: what we are building and why.
- Update page `24150048814`: Button gap-closure plan.
- Update page `24151490697`: work completed and current status.

**Interfaces:**
- Consumes: generated `component-contract.reference.json`, final Button contract, audit receipt, and repository verification output.
- Produces: an authoritative human schema reference and current cross-linked project documentation.

- [ ] **Step 1: Fetch every target page immediately before editing**

Record each current version and body. Do not reuse page bodies captured before implementation.

- [ ] **Step 2: Create the schema specification page**

Include:

- Architecture diagram and canonical/surface/governance layers.
- Complete top-level and nested field tables from the generated reference.
- Type, required status, allowed values, default, owner, consumers, enforcement, and examples.
- Full Button example or a collapsible, readable equivalent.
- Scoring formula, weights, thresholds, blockers, evaluation coverage, and automation coverage.
- Versioning, migration, authoring, validation, and proposal workflows.
- Explicit statement that generated scores are not authored contract fields.

- [ ] **Step 3: Update the authoring reference**

Replace schema 0.2/0.3 authoring instructions with schema 0.4 canonical properties, surface bindings, constraints, requirements, evidence, and generated artifact guidance. Preserve useful conceptual explanations and add a prominent link to the schema specification.

- [ ] **Step 4: Update strategy and overview pages**

Add the approved generation-ready, verification-first architecture, three-way reconciliation, health scoring safeguards, five-pilot generation gate, and links to the schema specification and repository design spec.

- [ ] **Step 5: Update Button and current-status pages**

Record schema 0.4 migration, actual executable constraint evaluation, health score/coverage, validation results, audit evidence, remaining manual work, and exact repository commits. Correct the prior implication that merely compiling `supportMatrix` meant Canary Copilot evaluated it.

- [ ] **Step 6: Cross-link all relevant pages**

Ensure the schema specification, strategy, overview, authoring reference, Button gap plan, inventory workflow, pilot review plan, and status page form a navigable set without duplicating their full content.

- [ ] **Step 7: Re-fetch updated pages and verify preservation**

Confirm current titles, links, tables, comments, and unrelated sections remain present. Record the new page ID and versions.

- [ ] **Step 8: Commit repository documentation links if added**

```bash
git add packages/ui/catalog/contracts/README.md docs/superpowers
git commit -m "docs: document contract schema 0.4 rollout"
```

---

### Task 8: Final review, push, and handoff

**Files:** All intended changes from Tasks 1–7.

**Interfaces:**
- Produces: verified commits on `codex/component-inventory`, updated PR #11305, and linked Confluence documentation.

- [ ] **Step 1: Re-run the complete verification set from Task 6**

All commands must complete with zero failures. Capture exact test counts and any non-blocking warnings.

- [ ] **Step 2: Review the complete diff**

Check:

- No production React or Figma component was generated or overwritten.
- No existing user changes were lost.
- Generated artifacts match their source.
- Button policy did not regress.
- Every health number has visible coverage.
- Every failure retains specific remediation.
- Confluence statements match verified behavior.

- [ ] **Step 3: Run whitespace and repository status checks**

```bash
git diff --check
git status --short --branch
```

- [ ] **Step 4: Commit any final documentation-only corrections atomically**

Use a conventional `docs:` or `fix:` commit matching the actual correction. Do not amend published commits.

- [ ] **Step 5: Push the branch**

```bash
git push
```

- [ ] **Step 6: Report the outcome**

Provide commit hashes, exact verification results, new/updated Confluence links, what Canary Copilot now evaluates, the Button health result, and any remaining manual publication or five-pilot work.
