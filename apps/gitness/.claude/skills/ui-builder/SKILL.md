---
name: ui-builder
description: Mandatory entry point for ALL UI work in apps/gitness. Orchestrates ui-guidelines, form-builder, and ui3-form-review. Use when building or changing pages, lists, drawers, dialogs, or forms in Code V2. Agents MUST read this skill first and complete every checklist item before finishing.
---

# UI Builder

**All UI development in `apps/gitness` MUST follow this skill.** No exceptions.

## When this skill applies

- Any new or changed UI in gitness / Code V2
- User says "UI Builder" or asks for a page, list, drawer, dialog, tab, or form
- Touching `pages-v2/`, `components-v2/`, `packages/views/` for Code features

---

## Skill routing (complete before writing code)

| Step | Condition | Skill | Required action |
|------|-----------|-------|-----------------|
| 0 | Always | **ui-builder** (this file) | Read fully; follow architecture + patterns below |
| 1 | Always | **ui-guidelines** | Read **UI Builder fast path** (Tiers 1–2 minimum) |
| 2a | `IFormDefinition` / `@harnessio/forms` | **form-builder** | Read full skill before writing definitions |
| 2b | `react-hook-form` + `zod` + `FormWrapper` | — | **Do not** use form-builder; copy RHF canonical pattern |
| 3 | Any form, drawer, or multi-field create/edit page | **ui3-form-review** | Run review after build; output report before done |
| 4 | Always | — | Complete **Phase 4 verification** below |

**Steps 0, 1, and 4 are never skippable.** Step 3 is never skippable when the change includes form fields.

### Form type decision

```
Form work?
├─ @harnessio/forms / IFormDefinition / InputFactory → form-builder (Step 2a)
└─ react-hook-form + FormWrapper + FormInput.*       → RHF table (Step 2b) + ui3-form-review
```

---

## Architecture (strict)

```
apps/gitness/src/pages-v2/<area>/   → containers only (data, routes, mutations, navigate)
apps/gitness/src/components-v2/     → gitness composites — NOT route pages
packages/views/src/               → shared presentational views
@harnessio/ui/components          → primitives — NEVER copy into gitness locally
```

| Rule | Requirement |
|------|-------------|
| Container / view split | Containers in `pages-v2/`; views in `@harnessio/views` unless truly gitness-only |
| Imports | `import { … } from '@harnessio/ui/components'` and `@harnessio/views` |
| Route registration | `routes.tsx` + `RouteConstants` in `framework/routing/types.ts` |
| Repo tabs | `repo-subheader.tsx` + `repo-layout.tsx` `issuesPath` / equivalent |
| Data | Prefer `code-service-client` hooks; if mock, use container + store, state it in PR/summary |
| MFE / webpack | After changing `packages/views`, run `pnpm --filter @harnessio/views build` |

---

## Canonical patterns (copy — do not invent)

### Lists & repo tabs

| Pattern | Reference |
|---------|-----------|
| Repo sub-tab list | `packages/views/src/repo/repo-tags/`, `packages/views/src/repo/pull-request/` |
| List container | `apps/gitness/src/pages-v2/repo/repo-tags-list-container.tsx` |
| Open/closed header tabs | `packages/views/src/repo/pull-request/components/pull-request-list-header.tsx` |
| Subheader tab | `packages/views/src/components/repo-subheader.tsx` + `apps/gitness/src/routes.tsx` |

### Layout

| Pattern | Reference | Rule |
|---------|-----------|------|
| Two-column main + sidebar | `packages/views/src/repo/pull-request/compare/pull-request-compare-page.tsx` | **`Layout.Flex gap="xl"`** + `flex-1` main + fixed-width sidebar (`w-[272px]` or `w-[344px]`) |
| Summary two-column | `packages/views/src/repo/repo-summary/repo-summary.tsx` | `SandboxLayout.Columns` + **`pr-cn-xl`** on nested `SandboxLayout.Content` |
| Page shell | `SandboxLayout.Main` → `SandboxLayout.Content` | Match sibling pages in same area |

**Do not** use `SandboxLayout.Columns` for form sidebars without an explicit gap strategy (`Layout.Flex gap="xl"` is preferred).

### Forms (RHF — Step 2b)

| Pattern | Reference |
|---------|-----------|
| Create page | `packages/views/src/repo/repo-create/index.tsx` |
| Settings form | `packages/views/src/repo/repo-settings/components/repo-settings-general-form.tsx` |
| Label form | `packages/views/src/labels/label-form-page.tsx` |
| Fork / wizard | `packages/views/src/repo/repo-fork/repo-fork-page.tsx` |
| PR compare create | `packages/views/src/repo/pull-request/compare/` |
| Title + body + sidebar | `packages/views/src/repo/repo-issues/repo-create-issue-page.tsx` |

**RHF stack:** `useForm` + `zodResolver` + `FormWrapper` + `FormInput.*` + schema in `*-schema.ts`.

### Composites before primitives

Before raw `MultiSelect`, `SearchableDropdown`, etc., search `@harnessio/views` for an existing composite:

| Need | Use |
|------|-----|
| PR assignees + labels sidebar | `PullRequestSideBar` + compare/conversation pages |
| PR labels display | `LabelsList` / `LabelTag` |
| Repo list actions | `ListActions` + `SearchInput` + `StackedList` |

---

## Workflow

### Phase 1 — Requirements

- Behavior and success criteria
- Location (repo / project / settings / PR / …)
- Design reference: capture **layout AND interaction** (not only information architecture)
- Data: API hooks vs mock

### Phase 2 — Discovery

1. Find closest canonical pattern in table above
2. Read that reference file before writing new code
3. Check `routes.tsx`, `RouteConstants`, subheader if repo-scoped
4. Classify form type (decision tree)

### Phase 3 — Build

- Match reference structure, spacing, and components
- ui-guidelines Tier 2 for any component not in the reference file
- form-builder only for Step 2a

### Phase 4 — Verify (mandatory before done)

- [ ] **Forms** → `ui3-form-review` report on changed form files (or "0 violations")
- [ ] `pnpm prettier --write` on changed files
- [ ] `pnpm eslint --fix` where applicable
- [ ] `pnpm --filter gitness typecheck` (+ `@harnessio/views` if views changed)
- [ ] `pnpm --filter @harnessio/views build` if gitness webpack/MFE consumes views
- [ ] Routes + subheader wired if new repo tab/page
- [ ] **Completion report** to user (see below)

---

## Completion report (include in final message)

```
## UI Builder compliance
- Skills used: ui-builder, ui-guidelines (Tier _), [form-builder | RHF pattern], [ui3-form-review]
- Canonical pattern copied from: <path>
- Phase 4: typecheck ✓, [form review summary]
```

---

## Constraints (MUST NOT)

- Invent base UI components locally
- Put route containers in `components-v2/`
- Use `form-builder` for react-hook-form pages
- Use `SandboxLayout.Columns` for side-by-side form + sidebar without gap
- Skip ui3-form-review on form work
- Finish without typecheck on touched packages
