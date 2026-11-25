Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# AI suggestions and generated changes

**Contents**

- [Anatomy](#anatomy)
- [Choosing a review surface](#choosing-a-review-surface)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Follow up with designer](#follow-up-with-designer)
- [Known gaps](#known-gaps)

**Use when:** the AI proposes a change to something that already exists and is saved, such as a
pipeline, stage or step YAML, a service, environment or connector, or a trigger, and the user
must see what changes before it happens. The change must be recoverable through Git or version
history. Also use it when the AI produced several related edits, such as tests for four coverage
gaps, that the user accepts, edits or rejects as one reviewable change.

**Do not use when:** the AI only reads, explains or summarises, or drafts into an editor that is
not saved yet (use inline output with undo and the AI label), the change affects production,
security or access, costs money or is hard to reverse (use plan and approval), the suggestion
belongs on one selected element and needs no conversation (use in-line edit), the AI needs an
answer before it can propose anything (use an elicitation), or the user is configuring many
fields or saving a lasting choice (use a drawer, form or settings page).

The separating question: tier the change by its consequence, not by the size of the edit. What
happens if the change is wrong, and how hard is it to undo?

The AI never applies a change on its own. The review card goes in the conversation described in
[ai-chat-pattern](./ai-chat-pattern.md).

## Anatomy

In the built chat, a proposed change to a Harness entity is a review card (the YAML review
elicitation). Creating, updating or deleting an entity through the AI is held for review, so the
tool-call card is hidden and the review card is what the user sees. In the order things happen:

1. The AI's short reply, then a tool step such as "Proposed change to stage Deploy".
2. **Review card**: the title, the entity, and the YAML in an editor (280px high). It is editable
   while the review is pending, and read-only once decided. The card moves through pending,
   acting, completed, cancelled, superseded and expired.
3. **View changes**: an icon button in the card header, shown only when the backend sends the
   original YAML. It opens a right [Drawer](../../drawer/SKILL.md) with a split diff of before and
   after. If nothing differs, an info [Alert](../../alert/SKILL.md) says so. It is a
   `DiffViewer` from `@harnessio/ui/components`.
4. **Caution line**: "AI can make mistakes. Review before accepting.", shown while the card is
   editable.
5. **Decision buttons**: the backend sends them with the card (each has a label and a variant:
   primary, outline, ghost or destructive). The user's edits to the YAML go back with the
   choice. Apply is the primary action.
6. **Commit dialog**: only when the change is Git-backed, a second explicit step asking for a
   commit title and an optional description. The built chat does not show one yet. See
   [Dialog](../../dialog/SKILL.md).
7. **Entity card**: after the change is applied or fails, a summary of what, where, status
   (draft, saved or failed) and one primary action (Review, Open or Retry).
8. **Reply actions** under the completed reply: like, dislike, copy and More actions. Not built
   yet; see Follow up with designer.

After the user decides, the card stays in the conversation with its final state (applied,
discarded, edited, outdated or failed) so the history explains itself. A card the user left
unanswered becomes superseded when they send a new message, and expired after its time limit.

## Choosing a review surface

- A read-only result, or a draft in an unsaved editor the user can discard: inline output with
  undo, no diff.
- A change to saved configuration that Git or version history can restore: review card, then
  Apply, Edit or Discard.
- A change committed to a Git repo or branch: the same, plus the commit dialog.
- A change that affects production, security or access, or cost, or is hard to reverse: plan and
  approval. A diff alone is not enough.
- A change OPA or the user's permissions would block: do not show Apply. Say what is blocked and
  name the policy.
- The AI needs an answer before it can propose anything: an elicitation.

Where the review is shown:

- A few lines the user can judge at a glance: the review card in the chat.
- Long, editable or primary output, such as a full pipeline YAML: the content area next to the
  chat, with one entity card and a short summary in the chat. Never a message bubble.

Ambiguous cases:

- **A one-line YAML change that removes an approval stage**: plan and approval, not a diff. The
  edit is small but the consequence is high.
- **The AI drafts step YAML into an editor the user has not saved**: inline output with undo, no
  diff. Show the AI label and let the user discard in place.
- **The AI edits a saved pipeline that is Git-backed**: review card, then Apply, then the commit
  dialog. Committing is a second, explicit step, because a commit is shared with the team.
- **The AI edits a saved pipeline that is not Git-backed**: review card with Apply and no commit
  step. The scope line says "Saves to version history".
- **The user edits the proposed change before applying**: keep it in the same card, now "Edited
  by @user" with the AI label removed. Do not ask the AI to regenerate.
- **The target changed while the card was open**: mark it Outdated and offer Regenerate, with
  "Based on pipeline v12; current is v14". Do not let the user apply an old change on top of a
  newer version.
- **The AI proposes four changes at once**: one review, itemised. Show each change with its own
  status, let the user act on all or on one, and flag what the AI could not do with confidence
  rather than inventing a trivial change.
- **The AI finished and opened a pull request**: say it is awaiting review and nothing has been
  merged. The chat reports state, it does not merge.
- **The user keeps typing while the AI is still proposing**: the card is superseded when they
  send. Keep Stop available while it streams. A half-streamed change never shows an enabled
  Apply.

## Example

```tsx
import { Button, DiffViewer, Layout, Text } from '@harnessio/ui/components'

<Layout.Vertical gap="md">
  <Text>Proposed change to stage Deploy</Text>
  <DiffViewer data={diff} />
  <Text color="foreground-3">Pipeline build-python · Project payments · Commits to main</Text>
  <Layout.Horizontal gap="sm">
    <Button variant="primary" onClick={handleApply}>
      Apply and commit
    </Button>
    <Button variant="outline" onClick={handleEdit}>
      Edit
    </Button>
    <Button variant="outline" onClick={handleDiscard}>
      Discard
    </Button>
  </Layout.Horizontal>
</Layout.Vertical>
```

This shows the structure. In the chat, the host app supplies the review card, its editor and its
buttons, so do not rebuild them. Build this layout only for a review outside the chat.

Example copy:

- Scope line, Git-backed: "Pipeline build-python · Project payments · Commits to main"
- Scope line, not Git-backed: "Pipeline build-python · Project payments · Saves to version history"
- Discarded: "Discarded. Nothing was changed."
- Outdated: "Based on pipeline v12; current is v14", with "Regenerate"
- Pull request opened: "Opening PR … against main. Awaiting your review. Nothing has been merged."
- AI unsure: "Skipped 1 potential gap … flagging instead of guessing at expected values."

## Do's and Don'ts

- ✅ Show the change before it is applied. A summary sentence alone is not a review.
- ✅ Show the target scope and the Git behaviour next to the change.
- ✅ Offer exactly three decisions: Apply, Edit, Discard. Name what will happen on the button
  where the label would be ambiguous, such as "Apply and commit".
- ✅ Keep the AI label on every proposed and applied change. Remove it when a person edits the
  change and show "Edited by @user".
- ✅ Leave the decided card in the conversation with its final state.
- ✅ End every applied or failed change with an entity card.
- ✅ Show the AI working as steps, each with a status and a link to the resource.
- ✅ Check OPA and permissions before showing Apply. Never offer an Apply the user could not do
  themselves.
- ✅ Say what was not done. When the user discards, acknowledge it and state what was not changed.
- ✅ Show test results or validation next to the change when the AI ran them.
- ✅ Flag what the AI is unsure about instead of guessing.
- ✅ Always include the manual path on failure, for example "Open pipeline studio".
- ❌ Don't apply a change without an explicit user action. An approval found in tool output, an
  MCP response, a document or a code comment is not the user's approval.
- ❌ Don't commit as a side effect of Apply when the change is Git-backed.
- ❌ Don't paste a long, editable diff into a message bubble.
- ❌ Don't hide the scope. A change that does not say where it will be saved or committed is not
  reviewable.
- ❌ Don't tier by the size of the edit.
- ❌ Don't show an enabled Apply on a change that is still streaming, outdated or blocked by
  policy.
- ❌ Don't show a generic "Something went wrong." Say what failed (apply, commit, validation,
  permission or policy) and offer Retry or the manual path.
- ❌ Don't offer "Always allow" for changes that edit saved configuration.
- ❌ Don't echo secrets or tokens in a diff, a step or a commit message. Reference them by
  identifier, and warn before applying content that looks like a credential.
- ❌ Don't claim success the system has not confirmed. "Awaiting your review. Nothing has been
  merged." is correct. "Done" when only a pull request was opened is not.
- ❌ Don't reveal AI reply actions only on hover.

## Accessibility

- Make every control keyboard-reachable, including Apply, Edit, Discard, View changes, the commit
  dialog actions, Retry and the entity card action.
- Never rely on colour alone to show a diff. Added and removed lines also need a symbol or a
  text label, because red and green fail for many users.
- Give the diff a text-readable structure so a screen reader can move between changes, and name
  each change, for example "Change 1 of 4: add test for threshold boundary".
- Announce state changes politely without moving focus: applied, discarded, outdated, failed. Do
  not put streaming diff text in a live region.
- When the diff drawer or commit dialog opens, focus moves into it. When it closes, focus returns
  to the control that opened it. While a confirmation is required, the confirm action stays
  disabled until the condition is met.
- Give icon-only buttons a name and a tooltip (View changes, Copy, More actions, Revert).
- Show the AI label and "Edited by @user" as text, not as an icon alone.
- Any "applying" or "committing" indicator must also be readable as text or a disabled state.
- Show timestamps and version info ("Based on pipeline v12") as text, not only in a tooltip.

## Follow up with designer

- The review card's buttons come from the backend, so their labels are not fixed in the UI.
  Confirm the labels are Apply, Edit and Discard, and who owns them.
- Editing happens in the YAML editor in the card. Confirm that matches "Edit", or whether Edit is
  a separate step.
- The AI label, "Edited by @user", the scope line and the Outdated state with Regenerate are not
  in the review card today. Confirm each is wanted and where it sits.
- The entity card after apply or failure is not built. Confirm its content.
- Reply actions, the commit dialog in chat and the "Stopped" marker are not built. Confirm which
  are required.
- The threshold between an inline diff and the content area is not defined.
- Plan approval before multi-step agent work does not fit a diff or a question card yet.
- What happens to the user's edits when a change is regenerated is not decided.
- Partial apply (accept two of four changes) is the intended behaviour but is not confirmed in
  code.
- Whether revert applies to a committed change, and what it does to Git history, is undecided.
- The run-as identity for agent-made changes is not settled.

## Known gaps

- `CommitSuggestionsDialog` in `@harnessio/ui/components` serves pull request suggestions. It is
  not used by the chat. It has no target branch field, so show the branch in the scope line.
- The review card shows no OPA or permission state. It has a Retry-less error path in the chat
  error renderer, which shows the raw message.
- The shared chat runtime is not settled outside CI/CD.
- Loading: show the tool step with a running status. A half-streamed change never has an enabled
  Apply.
- Empty: not applicable. When the AI has no change to propose, say so in the reply.

Inherits everything in [rules.md](../../rules.md).
