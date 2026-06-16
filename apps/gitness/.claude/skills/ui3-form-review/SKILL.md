---
name: ui3-form-review
description: Mandatory gitness form UX review. Invoked by ui-builder Step 3 after any form, drawer, or multi-field create/edit page. Run before declaring UI work done. Applies to react-hook-form and IFormDefinition forms.
---

# UI 3.0 Form Review

> **Routing:** Only run after ui-builder Phase 3 build. ui-builder Step 3 requires this before completion.

## When required

ui-builder **mandates** this review when the change includes:

- `FormWrapper`, `FormInput.*`, `IFormDefinition`, or multi-field form JSX
- Create/edit pages or drawers with 2+ user-editable fields
- New `zod` / validation schemas

**Output:** Structured report below, or one-line `0 violations` if clean. Include in ui-builder completion report.

## Review steps

1. Read all form-related files changed (view, container, `*-schema.ts`)
2. For RHF: include controlled fields outside `register()` (e.g. `MultiSelect` in `useState`)
3. Check each guideline — pass, fail, or N/A
4. Apply Code V2 exceptions where noted

## Code V2 exceptions

| Pattern | Guideline | Treatment |
|---------|-----------|-----------|
| Assignees/labels in sidebar column | 4 | Pass with exception — GitHub-style metadata |
| Description optional at top level | 4 | Pass with exception — commonly used |
| `title` first field (issues, PRs) | 1 | Pass — treat as name field |
| List/search-only pages | All | N/A — not a form |

---

## Guidelines

### 1. Name/ID field first

`name`, `id`, `identifier`, or `title` (create flows) must be the first field.

### 2. Logical field order

Fields that control visibility of others must appear before dependents.

### 3. Required fields visible

Required fields must not be inside `<details>`, accordion, or hidden sections.

### 4. Optional fields in "More Options"

Rarely-used optional fields at top level should use `<details summary="More Options">`. See exceptions above.

### 5. Defaults imply optional

Fields with defaults must not be required in validation.

### 6. Consistent field names

Same concepts use same `name` across similar forms (when auditable).

### 7. Terse labels

Labels must not repeat drawer/page title context.

### 8. No single-option fields

Hide selects/radios with only one meaningful option.

### 9. Helpful placeholders

Ambiguous fields (URLs, formats) need example placeholders on `FormInput` / `MultiSelect`.

---

## Output format

```
## UI 3.0 Form Review: [component]

### Summary
- X violations | Y passed | Z N/A

### Violations
#### [Guideline]
- **File:** path:line
- **Issue:** …
- **Fix:** …

### Passed
- …

### Passed (with exception)
- …

### Not Applicable
- …
```
