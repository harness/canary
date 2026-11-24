Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Main and side columns

**Contents**

- [Anatomy](#anatomy)
- [Guidelines](#guidelines)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Known gaps](#known-gaps)

**Use when:** one task is primary and supporting information sits beside it: a main area
that carries the work, and a narrow side column that describes it. The layout is not limited to
one product area. Match the anatomy below, not the product area.

**Do not use when:** both areas hold working content and people should control the balance
(use [resizable split](./resizable-split-pattern.md)), or the page has one content area (use the
[standard page](./standard-page-pattern.md)).

## Anatomy

1. **Page header** — `Page.HeaderV2` with breadcrumbs, title, description and tabs, as in the
   [standard page](./standard-page-pattern.md).
2. **Main column** — takes the remaining width (`1fr`) and holds the primary content: files, a
   conversation or a form.
3. **Side column** — a fixed width: 272px for a summary, 334px for a richer panel with
   reviewers and labels. It holds metadata and quick actions, never the primary task.
4. **Gap** — `cn-xl` between the columns.

The columns are `SandboxLayout.Columns` with two `SandboxLayout.Column` children. Only the
main column flexes, so set the widths with `columnWidths`: `"1fr 272px"`, or
`"minmax(calc(100% - 334px), 1fr) 334px"` for the wider side column.

## Guidelines
- Keep the side column short. If it is longer than the main column, move some of it into the
  main column or into a tab.
- Order the side column by importance and separate its groups with a divider.
- Put `gap-cn-xl` on `SandboxLayout.Columns` for the space between the columns, and `min-w-0`
  on the main column so long content shrinks instead of overflowing.

## Example

```tsx
import {
  Breadcrumb,
  Layout,
  Page,
  SandboxLayout,
  Separator,
  Text
} from '@harnessio/ui/components'

<Page.Root scrollable>
  <Page.HeaderV2
    breadcrumbs={
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/canary">canary</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Summary</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    }
    title="canary"
    description="Shared component libraries."
  />
  <Page.Content>
    <SandboxLayout.Columns columnWidths="1fr 272px" className="gap-cn-xl">
      <SandboxLayout.Column className="min-w-0">
        <Text variant="heading-subsection">Files</Text>
      </SandboxLayout.Column>
      <SandboxLayout.Column>
        <Layout.Vertical gap="md">
          <Text variant="heading-subsection">About</Text>
          <Separator />
          <Text color="foreground-3">Languages</Text>
        </Layout.Vertical>
      </SandboxLayout.Column>
    </SandboxLayout.Columns>
  </Page.Content>
</Page.Root>
```

## Do's and Don'ts

- ✅ Put the primary task in the main column and supporting metadata in the side column.
- ✅ Let only the main column flex.
- ❌ Do not put the primary task in the side column.
- ❌ Do not let the side column grow longer than the main column.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- `SandboxLayout.Columns` renders `role="grid"` and each column `role="gridcell"`.
  TODO(designer): confirm that is intended for a page layout, and what a consumer must provide.

## Known gaps

- TODO(designer): empty and loading states for each column.

Inherits everything in [rules.md](../../rules.md).
