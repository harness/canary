---
name: ui3-form-review
description: Review any piece of code (components, forms, drawers) in gitness against UI 3.0 design guidelines for forms. Validates field ordering, required/optional field visibility, labeling conventions, default values, placeholders, and other form UX best practices.
---

# UI 3.0 Form Design Guidelines Review Skill

You are a reviewer that validates code against UI 3.0 form design guidelines. When invoked, review the provided code (or files) and report violations of the guidelines below. For each violation, cite the specific guideline, the offending code location, and suggest a fix.

## When to Use This Skill

Use this skill when:
- Reviewing form components, drawer forms, or any UI that contains form fields
- Validating that a new or modified form follows UI 3.0 design conventions
- Checking form field ordering, grouping, labeling, and visibility rules
- Auditing forms for UX consistency across the application

## How to Perform the Review

### Step 1: Identify the Target Code

- If the user provides specific file paths, read those files.
- If the user asks to review "this form" or similar, ask which files to review.
- Look for form definitions, form components, drawer components, and any JSX/TSX that renders form fields.

### Step 2: Analyze Against Each Guideline

Review the code against every guideline listed below. For each one, determine if it passes, fails, or is not applicable.

### Step 3: Report Findings

Produce a structured report with:
1. **Summary** - overall pass/fail count
2. **Violations** - each violation with:
   - Guideline name
   - File and line reference
   - What's wrong
   - Suggested fix
3. **Passes** - brief list of guidelines that were satisfied
4. **Not Applicable** - guidelines that don't apply to the reviewed code

---

## Guidelines

### 1. Name/ID Field Placement

The Name / ID field should be the **first field** in the form.

**What to check:**
- Look for fields named `name`, `id`, `identifier`, or similar.
- Verify they appear as the first field(s) in the form definition or JSX rendering order.

**Violation example:**
```tsx
<Input label="Description" ... />
<Input label="Name" ... />  // Name should come first
```

---

### 2. Logical Field Ordering

The ordering of fields should make logical sense. Fields that determine the visibility or content of other fields must appear **before** the dependent fields.

**What to check:**
- If a selector/dropdown controls which subsequent fields are shown (e.g., authentication type), the selector must come before those conditional fields.
- Group related fields together in a logical flow.

**Violation example:**
```tsx
<Input label="Access Key" ... />
<Input label="Secret Key" ... />
<Select label="Authentication Type" ... />  // Should come before Access Key / Secret Key
```

---

### 3. Required Fields Must Be Visible

Form fields that are required must **always be visible**. They should never be hidden inside a collapsible, accordion, `<details>`, or conditionally-hidden section.

**What to check:**
- Identify required fields (via validation schema, `required` prop, zod `.min(1)`, `.nonempty()`, etc.).
- Verify none of them are inside collapsible/accordion/details components.
- Generally, required fields should never need to be "grouped" behind a toggle.

**Violation example:**
```tsx
<details>
  <summary>More Options</summary>
  <Input label="API Key" required />  // Required field hidden in collapsible
</details>
```

---

### 4. Optional Fields in "More Options"

Form fields that are optional should be placed inside a `<details>` component where the `<summary>` is **"More Options"**.

**What to check:**
- Optional fields (not marked required, no required validation) that are shown at the top level alongside required fields.
- Within the "More Options" section, optional fields should be **grouped by category** in expandable/collapsible items.

**Violation example:**
```tsx
// Optional fields shown at top level instead of in "More Options"
<Input label="Name" required />
<Input label="Description" />          // Optional - should be in More Options
<Input label="Tags" />                 // Optional - should be in More Options
<Input label="Timeout" />              // Optional - should be in More Options
```

**Note:** Use judgment here. Some optional fields like "Description" may reasonably appear at the top level if they are commonly filled. Flag them but note they may be acceptable exceptions.

---

### 5. Fields with Defaults Must Be Optional

Form fields that have default values must be **optional**. If the field is not filled out (value is `null` or `undefined`), the backend applies the default from the schema.

**What to check:**
- Fields with `defaultValue`, `defaultValues`, or defaults set in the form/schema.
- These fields should NOT have `required` validation.

**Violation example:**
```tsx
// Field has a default but is also required - contradiction
<Input label="Timeout" defaultValue={30} required />
```

---

### 6. Consistent Field Names Across Drawers

Form field names (the `name` prop used for form state) must be consistent across different drawers/forms that deal with similar concepts.

**What to check:**
- If reviewing multiple forms/drawers, compare field names for the same concepts.
- e.g., a "url" field should not be called `url` in one drawer and `endpoint` in another if they represent the same thing.

**Note:** This guideline requires cross-file context. If only one file is provided, note this as "needs cross-form audit" rather than pass/fail.

---

### 7. Terse Field Labels

Field labels should be **terse** and should not repeat context already provided by the drawer/form title or surrounding UI.

**What to check:**
- If the form is inside a drawer titled "Dockerhub" or "AWS", field labels should not repeat "Dockerhub" or "AWS".
- Look for redundant prefixes in labels.

**Violation examples:**
- Drawer: "Dockerhub Connector" -> Label: "Dockerhub Username" (should be "Username")
- Drawer: "AWS Configuration" -> Label: "AWS Access Key" (should be "Access Key")
- Drawer: "Jira Settings" -> Label: "Jira URL" (should be "URL")

---

### 8. No Single-Option Pre-Selected Fields

Forms should **never** display a form field that is pre-selected to only a single option. If there is exactly one option and it is always selected, the field should be hidden or omitted.

**What to check:**
- Select/dropdown/radio fields with only one option in their options list.
- Fields where the options are hardcoded to a single value.

**Violation example:**
```tsx
<Select label="Region" value="us-east-1" options={[{ label: "US East", value: "us-east-1" }]} />
// Only one option - hide this field entirely
```

---

### 9. Helpful Placeholders for Ambiguous Fields

Fields whose purpose may be ambiguous to a user should include a **placeholder** showing the expected format or an example value.

**What to check:**
- URL fields should show example URLs (e.g., `https://company.atlassian.com`)
- Fields where format matters (IPs, paths, patterns) should have format hints as placeholders.
- The placeholder should clarify: scheme inclusion, trailing slashes, expected format, etc.

**Violation example:**
```tsx
<Input label="URL" name="url" />  // No placeholder - user doesn't know expected format
```

**Good example:**
```tsx
<Input label="URL" name="url" placeholder="https://company.atlassian.com" />
```

---

## Output Format

Structure your review output as follows:

```
## UI 3.0 Form Review: [file/component name]

### Summary
- X violations found
- Y guidelines passed
- Z not applicable

### Violations

#### [Guideline Name]
- **File:** `path/to/file.tsx:line`
- **Issue:** [description]
- **Fix:** [suggested fix]

(repeat for each violation)

### Passed
- [Guideline Name]: [brief note]

### Not Applicable
- [Guideline Name]: [reason]
```
