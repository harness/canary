Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the component's `references/props.json` where one exists, otherwise in the installed
package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Create / edit drawer

**Use when:** the user creates or edits one entity from a list without leaving the page.
Use a `Dialog` instead for a short confirmation or a single field; use a full page for a
multi-step flow.

**Anatomy:** the drawer always has these four parts, in this order (the `drawer-complete` check: a
file that builds `Drawer.Root` must also build `Drawer.Content`, `Drawer.Header`,
`Drawer.Body` and `Drawer.Footer`). Contract details are in `drawer/references/props.json` and
`drawer/references/pattern.md`.

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


Both patterns inherit everything in [rules.md](../rules.md).
