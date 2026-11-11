---
title: Page Patterns
description: Anatomy of the settings list page and the create/edit drawer, built only from @harnessio/ui components
---

Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the manifest (`schemas/{component}.manifest.json`) where one exists, otherwise in
`dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

## Settings list page

**Use when:** a settings area lists entities of one kind (for example flag sets, API keys,
webhooks) and the user can create more.

**Anatomy, top to bottom:**

1. **Header row** — `Layout.Horizontal justify="between" align="center"` holding:
   - the page title: `Text variant="heading-subsection"` (or `heading-section` when it is the
     only heading on the page);
   - one primary action: `Button variant="primary"` that opens the create drawer.
     Exactly one primary button per page.
2. **List** — `Table.Root` with `Table.Header` / `Table.Row` / `Table.Head` and
   `Table.Body` / `Table.Row` / `Table.Cell`. Use `DataTable` instead when the list needs
   sorting, selection, or column visibility.
3. **Empty state** — when there are no rows, render `NoData` in place of the table, not
   inside it. Pass `title`, `description` (an array of strings), and `primaryButton` with the
   same action as the header button.

Stack the sections with `Layout.Vertical gap="md"` (or `lg` for looser pages). Do not add
margin utilities between them.

```tsx
<Layout.Vertical gap="md">
  <Layout.Horizontal justify="between" align="center">
    <Text variant="heading-subsection">Flag sets</Text>
    <Button variant="primary" onClick={() => setOpen(true)}>
      Create flag set
    </Button>
  </Layout.Horizontal>

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
</Layout.Vertical>
```

## Create / edit drawer

**Use when:** the user creates or edits one entity from a list without leaving the page.
Use a `Dialog` instead for a short confirmation or a single field; use a full page for a
multi-step flow.

**Anatomy:** the drawer always has these four parts, in this order. Contract details are in
`schemas/drawer.manifest.json` and `schemas/drawer.md`.

1. `Drawer.Root` — controlled with `open` and `onOpenChange`. Opens from the right by default;
   do not change `direction` for a form drawer.
2. `Drawer.Content` — set `size`. Use `sm` (the default) or `md` for a form; `lg` and above
   only when the body holds a table or side-by-side content.
3. `Drawer.Header` — pass `title` (and `description` when it helps). The header renders its
   own close button; do not add another.
4. `Drawer.Body` — scrolls by default. Holds the form: `FormWrapper` (spread the
   `useForm()` return) around `Layout.Vertical gap="lg"` of `FormInput.*` fields.
5. `Drawer.Footer` — `ButtonLayout` holding the actions. One `Button variant="primary"`
   submits; it shows `loading` while the request is in flight. Whether a secondary
   cancel button appears is the app's convention; the header close button already
   dismisses the drawer.

**Fields:** use the `FormInput` wrappers so labels, errors, and required markers come from
the form state: `FormInput.Text`, `FormInput.Textarea`, `FormInput.Select`,
`FormInput.MultiSelect`, `FormInput.Checkbox`, `FormInput.Radio`, `FormInput.Number`. Each
takes `name` and `label`. Mark fields that may be left empty with `optional`; required-ness
and validation messages come from the form's schema (zod or yup resolver), not from the
HTML `required` attribute. Do not hand-build a label and an input from primitives.

**Submitting:** the footer sits outside the `<form>` element. Either give the form an `id`
and set `type="submit" form={id}` on the primary button, or call `handleSubmit(onSubmit)`
from the button's `onClick`.

```tsx
<Drawer.Root open={open} onOpenChange={setOpen}>
  <Drawer.Content size="md">
    <Drawer.Header title="Create flag set" description="Group flags to target them together." />
    <Drawer.Body>
      <FormWrapper {...formMethods} id="create-flag-set" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Layout.Vertical gap="lg">
          <FormInput.Text name="name" label="Name" />
          <FormInput.Textarea name="description" label="Description" optional />
          <FormInput.MultiSelect name="environments" label="Environments" options={environmentOptions} />
        </Layout.Vertical>
      </FormWrapper>
    </Drawer.Body>
    <Drawer.Footer>
      <ButtonLayout>
        <Button variant="primary" type="submit" form="create-flag-set" loading={isSubmitting}>
          Create
        </Button>
      </ButtonLayout>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Styling rules for both patterns

- No hex, rgb, or hsl literals and no Tailwind arbitrary values (`w-[420px]`,
  `text-[#333]`). Drawer width comes from `size`; colors come from the components.
  See `color-system.md`.
- Spacing comes from `Layout` `gap` props or `cn-*` spacing aliases. See `spacing.md`.
- Text style comes from `Text variant`, not font or color utilities. See `typography.md`.
- Do not wrap these components in a styled `div` to restyle them. If a component cannot do
  what the design needs, report the gap instead of overriding it.
