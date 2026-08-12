# Pilot Component Inventory Review Report

Date: August 11, 2026

## Outcome

This codebase-first review classified 17 of the 19 exports in the pilot review batch. Caption and FormSeparator remain unreviewed because the codebase shows overlapping old and new implementations but does not establish an approved deprecation path.

The review used public APIs, implementation structure, composition, tests, Portal documentation, repository usage, Code Connect metadata, and a published-library audit for Button. Other Figma component keys remain unassigned until their published identities are confirmed.

## Reviewed classifications

| Export             | Previous family | Reviewed family | Disposition    | Governed by       | Surfaces    | Contract path                                |
| ------------------ | --------------- | --------------- | -------------- | ----------------- | ----------- | -------------------------------------------- |
| Button             | button          | button          | contract       | —                 | figma, code | catalog/contracts/button.contract.json       |
| Drawer             | drawer          | drawer          | contract       | —                 | figma, code | catalog/contracts/drawer.contract.json       |
| Select             | form-primitives | select          | contract       | —                 | figma, code | catalog/contracts/select.contract.json       |
| StatusBadge        | status-badge    | status-badge    | contract       | —                 | figma, code | catalog/contracts/status-badge.contract.json |
| TextInput          | inputs          | text-input      | contract       | —                 | figma, code | catalog/contracts/text-input.contract.json   |
| NumberInput        | inputs          | number-input    | contract       | —                 | figma, code | catalog/contracts/number-input.contract.json |
| SearchInput        | inputs          | search-input    | contract       | —                 | figma, code | catalog/contracts/search-input.contract.json |
| Textarea           | form-primitives | textarea        | contract       | —                 | figma, code | catalog/contracts/textarea.contract.json     |
| Label              | form-primitives | label           | contract       | —                 | figma, code | catalog/contracts/label.contract.json        |
| ControlGroup       | form-primitives | form-field      | part-of-family | canary.form-field | figma, code | catalog/contracts/form-field.contract.json   |
| FormCaption        | form-primitives | form-field      | part-of-family | canary.form-field | figma, code | catalog/contracts/form-field.contract.json   |
| Fieldset           | form-primitives | fieldset        | contract       | —                 | code        | catalog/contracts/fieldset.contract.json     |
| Legend             | form-primitives | fieldset        | part-of-family | canary.fieldset   | code        | catalog/contracts/fieldset.contract.json     |
| FormWrapper        | form-primitives | form-wrapper    | contract       | —                 | code        | catalog/contracts/form-wrapper.contract.json |
| FormWrapperContext | form-primitives | form-wrapper    | utility        | —                 | code        | —                                            |
| Message            | form-primitives | message         | contract       | —                 | code        | catalog/contracts/message.contract.json      |
| MessageTheme       | form-primitives | message         | part-of-family | canary.message    | code        | catalog/contracts/message.contract.json      |

Every reviewed entry is classified. Button has advanced to `mapped` after its 12 persistent published component-set keys were confirmed; other Figma-connected entries remain classified until their identities are verified.

## Shared form-field contract

TextInput, NumberInput, Select, and Textarea repeat the same field anatomy through ControlGroup, Label, and FormCaption. ControlGroup and FormCaption are therefore assigned to a shared `canary.form-field` contract instead of being duplicated across every input contract.

The shared contract should define:

- Vertical and horizontal orientation.
- Label and optional-state behavior.
- Control placement.
- Caption, warning, and error placement.
- Disabled presentation.
- Relationships between label, control, and descriptive content.

The individual input contracts can extend those rules with component-specific properties, states, and behavior.

## Evidence correction

Code Connect evidence was previously matched by filename. This incorrectly attached `message-bubble.figma.ts` to Message and attached ButtonGroup and ButtonLayout files to Button.

The generator now reads each file's `// component=` metadata and matches the declared component name. Namespace members remain supported through names such as `Drawer.Content`.

After correction:

- Message has no Code Connect evidence.
- MessageBubble owns `message-bubble.figma.ts`.
- Button retains only files declaring `component=Button`.
- ButtonGroup and ButtonLayout retain their own evidence.

## New governance fields

The generator now preserves:

- `governedBy`: identifies the contract responsible for a family member.
- `replacedBy`: records the migration target for a deprecated export.
- `surfaces`: declares whether rules apply to Figma, code, or both.

These fields are human-reviewed. Regeneration must never overwrite them.

## Unresolved decisions

### Caption

Caption is documented and public, but repository usage ties it primarily to the older Input implementation. The newer input family uses FormCaption.

Decision required:

1. Deprecate Caption and replace it with FormCaption.
2. Keep Caption as a separate standalone primitive with an explicitly different purpose.
3. Keep it temporarily as part of the legacy Input family while a migration is planned.

Do not classify it until the intended migration direction is confirmed.

### FormSeparator

FormSeparator is widely used in forms, but it overlaps the newer Separator component, which has Code Connect evidence. FormSeparator additionally supports dashed and dotted styles.

Decision required:

1. Deprecate FormSeparator in favor of Separator and define how dashed or dotted use cases migrate.
2. Keep it as a form-layout-specific contract.
3. Make it part of a future form-layout contract.

Do not classify it until the intended API direction is confirmed.

## Design and accessibility debt discovered

Legend renders a `section` rather than an HTML `legend`. Fieldset also hardcodes `aria-describedby="fieldset-description"` without guaranteeing the referenced element exists.

The Fieldset contract should specify correct semantics before its status advances to contracted. The contract must describe the intended accessible behavior rather than copying the current implementation defects.

## Button contract vertical slice

Button now has the first complete draft contract and validator. The draft combines the React API, Portal documentation, tests, Code Connect, the earlier contract PoC, and a direct audit of the published Figma library into one structured evaluation target.

The Figma identity is verified:

- Twelve PoC keys resolve to the current md, sm, and xs Text, IconOnly, and Rounded component sets.
- Four legacy PoC keys return 404 and were removed.
- The inventory entry is `mapped`, and the contract's Figma mapping is `verified`.
- All published Button components use horizontal Auto Layout, have variable bindings, and expose disabled and loading states.

The contract remains intentionally `draft` because the audit found decisions rather than identity uncertainty:

- Figma has no 2xs or 3xs Button sets, although code supports both.
- Figma has no focus preview, although code implements `:focus-visible` styling.
- The supported variant matrix differs by Figma size, content type, and shape, while code accepts every combination.
- The ❌ prefix is confirmed to mean deprecated. TextRounded Button treatments are deprecated and remain temporarily for migration. IconOnlyRounded remains supported in md, sm, and xs because it is used by Pipeline Studio.
- Code Connect maps a `-` theme option in every Button mapping, while Figma exposes it only on md and sm Text.
- Navigation semantics are approved: Button performs actions, including starting or advancing onboarding in place; Link navigates to destinations. The Button link variant changes appearance only, and Canary has no approved button-styled Link pattern.
- A stable Figma-governed contract must have a verified mapping and at least one confirmed component key.

See `catalog/contracts/README.md` for the review checklist and `catalog/contracts/button.contract.json` for the evidence-backed draft.

## Verification

The implementation is complete when all of the following remain true:

- Governance fields survive regeneration.
- Code Connect evidence is matched using declared component metadata.
- The 17 reviewed entries remain classified after regeneration.
- Caption and FormSeparator remain explicitly unreviewed.
- Button retains its 12 verified Figma component-set keys through regeneration.
- Focused inventory-generator tests pass.
- The generated inventory and report pass repository formatting.

## Next actions

1. Confirm the Caption migration decision.
2. Confirm the FormSeparator migration decision.
3. Retrieve the published Figma component keys for the remaining pilots.
4. Advance each verified pilot from `classified` to `mapped`.
5. Resolve Button's size, variant-matrix, and focus-preview decisions; plan migration of deprecated TextRounded usage.
6. Write the shared form-field contract.
7. Use the mapped Button contract as the first evaluator and plugin-result vertical slice.
