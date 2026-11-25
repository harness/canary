Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Destructive confirm

**Contents**

- [Anatomy](#anatomy)
- [Choosing standard or typed confirmation](#choosing-standard-or-typed-confirmation)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Known gaps](#known-gaps)

**Use when:** a person deletes one entity (pipeline, connector, secret, user group, template),
deletes several selected rows at once, or takes another irreversible action whose loss cannot
be recovered.

**Do not use when:** the person is closing a drawer or leaving a page with unsaved changes (use
`ExitConfirmDialog`), the person is editing something (use the
[edit-drawer-pattern](./edit-drawer-pattern.md)), or the action is not destructive, such as
saving, applying or creating (no confirmation is needed).

Delete always uses this dialog, never a drawer, even when the delete starts inside a drawer.
Open the dialog over the drawer.

## Anatomy

1. **Trigger**: a row overflow menu item, a page-header overflow item or a table action. It never
   deletes directly. It only opens the dialog, and the deletion runs only when the person
   confirms. Put Delete at the bottom of any overflow menu so it is never the first thing
   reached for.
2. **`DeleteAlertDialog`**: the confirmation. It is `AlertDialog` with the `danger` theme plus
   delete behavior, and `AlertDialog` is built on `Dialog`. "Friction dialog", "the `danger`
   theme" and `DeleteAlertDialog` are one component. It is controlled with `open` and
   `onClose`, runs `deleteFn(identifier)` on confirm, and shows loading and error states from
   `isLoading` and `error`.
3. **`AlertDialog`** (optional): for a destructive or irreversible action that is not a delete.
   Use the `warning` or `danger` theme. See [alert-dialog](../alert-dialog/SKILL.md).

**Wording:** the dialog title and the confirm button both name the action. A title of "Delete
pipeline?" gets the button "Delete". Pass `title` and `deleteConfirmText` every time (see Known
gaps). Name the thing being deleted with `type` and `deletionItemName`, and say plainly that it
cannot be undone.

**Rule violations:** a delete that a rule blocks, or that an admin can bypass, uses the same
dialog. Set `violation`. If the rule forbids the delete, leave `bypassable` off and the confirm
button is disabled. If the rule can be bypassed, set `bypassable` and the button reads "Bypass
rules and delete". Do not build a separate dialog for this.

## Choosing standard or typed confirmation

Every delete gets the dialog. The only question is whether the person must also type a keyword
before the confirm button works (`withForm`, with `deletionKeyword`, `DELETE` by default).

| Question | Answer |
| -------- | ------ |
| Is this one self-contained entity that can be recreated without much loss? | Standard |
| Is this a bulk delete of selected rows? | Standard, one dialog showing the count |
| Does deleting this also remove other things (child entities, dependent configuration, history)? | Typed confirmation |
| Is this a container such as a project, organization or account? | Typed confirmation |

The component supports typed confirmation, but no team rule yet says when it is required. The
last two rows are a proposal from the designer, not a settled rule.

Ambiguous cases:

- **Delete started from inside a drawer:** a dialog, opened over the drawer.
- **Bulk delete of many rows:** one standard dialog that states the number of items and that it
  cannot be undone. Do not ask for a typed name per item; it makes the action unusable at scale.
- **Deleting a project or other container:** typed confirmation. The loss includes everything
  inside it.
- **Permanently deleting something already soft-deleted:** a standard dialog with stronger
  wording that says plainly it cannot be recovered. It is the second, final step.

## Example

```tsx
import { DeleteAlertDialog } from '@harnessio/ui/components'

// One entity: the title and the confirm button both name the action
<DeleteAlertDialog
  open={isOpen}
  onClose={close}
  type="pipeline"
  identifier={pipeline.identifier}
  deletionItemName={pipeline.name}
  title="Delete pipeline?"
  deleteConfirmText="Delete"
  deleteFn={deletePipeline}
  isLoading={isDeleting}
  error={deleteError}
/>

// A container: the person must type the keyword before Delete works
<DeleteAlertDialog
  open={isOpen}
  onClose={close}
  type="project"
  identifier={project.identifier}
  deletionItemName={project.name}
  title="Delete project?"
  deleteConfirmText="Delete"
  withForm
  deletionKeyword="DELETE"
  deleteFn={deleteProject}
/>

// Bulk delete: one dialog, with the count in a custom message
<DeleteAlertDialog
  open={isOpen}
  onClose={close}
  title="Delete 12 items?"
  message="This will permanently delete 12 items. This action cannot be undone."
  deleteConfirmText="Delete"
  deleteFn={deleteSelected}
/>
```

`identifier` is optional in the props, so the bulk example compiles. `deleteFn` is then called
with `undefined`, so read the selection from your own state instead of the argument.

## Do's and Don'ts

### ✅ Do

- Use the dialog for every delete.
- Make the confirm button mirror the dialog title: "Delete pipeline?" gets "Delete", never "Yes".
- Name the thing being deleted so the person can see what they are about to lose.
- Say plainly when it cannot be undone.
- Show one confirmation for a bulk delete, with the item count.
- Anchor Delete at the bottom of any overflow menu.

### ❌ Don't

- Don't delete directly from a menu item or button with no confirmation. This is the most
  common failure.
- Don't use a drawer for delete, even when the delete starts inside a drawer.
- Don't use a different confirmation per entity type. People should meet the same dialog for
  every delete.
- Don't use generic button labels such as "Yes", "OK" or "Confirm".
- Don't use this dialog for unsaved changes. That is `ExitConfirmDialog`.
- Don't ask for a typed name per item in a bulk delete.

```tsx
// ❌ Relying on the defaults: the title reads "Are you sure?" and the button reads "Yes"
<DeleteAlertDialog open={isOpen} onClose={close} type="pipeline" identifier={id} deleteFn={deletePipeline} />
```

## Accessibility

- Write a dialog title that describes the action, such as "Delete pipeline?". It is the first
  thing a screen reader announces.
- Give an icon-only delete trigger an accessible label; there is nothing visible to announce.
- With typed confirmation, the input takes focus when the dialog opens and shows a mismatch
  message if the keyword is wrong.
- Cancel and Confirm are disabled while `isLoading` is set, so the person cannot dismiss or
  repeat the action mid-request.

## Known gaps

- **Defaults break the wording rule.** With no props the title is "Are you sure?" and the
  confirm button says "Yes". Always pass `title` and `deleteConfirmText`.
- **Hard-coded failure title.** When a delete fails the dialog shows an alert titled "Failed
  to perform delete operation". The description comes from the `error` you pass, so pass one
  that says what happened and how to fix it.
- **Typed keyword is English.** `deletionKeyword` defaults to `DELETE`. Pass a localised
  keyword if your product is localised.
- **No rule yet for typed confirmation.** The split above is a proposal.
- **Focus return is unverified.** Whether keyboard focus returns to the trigger after the dialog
  closes has not been confirmed against the component, so test it in your page.
- **Missing and inconsistent confirmations exist in the product.** Some delete controls have no
  confirmation and some entities show a different dialog. Audit each delete control against
  this pattern.

Inherits everything in [rules.md](../rules.md).
