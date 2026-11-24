Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the component's `references/props.json` where one exists, otherwise in the installed
package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Settings list page

This pattern is the content of a page, not the page frame. Every page has a `Page.HeaderV2`, so
the title, breadcrumbs, tabs and the page actions come from the header of a
[standard page](./standard-page-pattern.md). This pattern goes inside its `Page.Content` and
does not repeat the title as a heading.

**Use when:** a settings area lists entities of one kind (for example flag sets, API keys,
webhooks) and the user can create more.

**Anatomy, top to bottom:**

1. **Create action** — `Button variant="primary"` that opens the create drawer. Its place
   depends on what it creates:
   - If it applies to the whole page, pass it to `Page.HeaderV2` `actions`.
   - If the page has a section menu and it creates something in the selected section, place it
     at the top right of the section content, above the list.
   See [section-menu-page-pattern](./section-menu-page-pattern.md).
2. **List** — `Table.Root` with `Table.Header` / `Table.Row` / `Table.Head` and
   `Table.Body` / `Table.Row` / `Table.Cell`. Use `DataTable` instead when the list needs
   sorting, selection, or column visibility.
3. **Empty state** — when there are no rows, render `NoData` in place of the table, not
   inside it. Pass `title`, `description` (an array of strings), and `primaryButton` with the
   same action as the header button.

```tsx
<Page.Root scrollable>
  <Page.HeaderV2
    title="Flag sets"
    actions={
      <Button variant="primary" onClick={() => setOpen(true)}>
        Create flag set
      </Button>
    }
  />
  <Page.Content>
    {rows.length === 0 ? (
      <NoData
        title="No flag sets yet"
        description={['Group flags so they can be targeted together.']}
        primaryButton={{ label: 'Create flag set', onClick: () => setOpen(true) }}
      />
    ) : (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Description</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    )}
  </Page.Content>
</Page.Root>
```

Both patterns inherit everything in [rules.md](../rules.md).
