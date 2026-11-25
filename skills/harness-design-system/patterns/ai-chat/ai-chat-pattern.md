Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# AI chat panel

**Contents**

- [Anatomy](#anatomy)
- [Choosing a surface](#choosing-a-surface)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Follow up with designer](#follow-up-with-designer)
- [Known gaps](#known-gaps)

**Use when:** the user wants to ask, explore or delegate in natural language and the answer may
take several turns, for example "I want a pipeline to build a Python application". Also use it
when the AI produces something the user reviews next to their work (a pipeline YAML, a code
snippet, an entity card), or when the conversation needs history the user can return to, branch
from or give feedback on.

**Do not use when:** the suggestion belongs on one page element and needs no conversation (a
one-off edit of selected text or YAML), the page is empty and a short data-based nudge is
enough, the user is configuring many fields or saving a lasting choice (use a drawer, form or
settings page and hand off from chat), or the user must enter a secret or credential (use a
secure form: credentials typed in chat pass through the client and the model). How the user
gets into the chat is in [ai-entry-points-pattern](./ai-entry-points-pattern.md). Proposing
changes inside the chat is in [ai-suggestions-pattern](./ai-suggestions-pattern.md).

The separating question: is the user in a conversation, or is the AI helping with one thing on
the page?

The host app provides the chat panel and its state, the same way it provides the app shell. This
pattern fixes what the panel contains and how the conversation is built from
`@harnessio/ui/components`: `MessageBubble`, `Reasoning`, `PromptInput`, `DiffViewer`, `Layout`,
`Text` and `Button`.

The panel sits beside the content area, on the left or the right, and can collapse to a thin
rail.

## Anatomy

The panel has three variants: a side panel (the default), a home-page variant and a drawer. The
panel stacks three regions top to bottom. Put new content types in the
conversation, not in new regions.

1. **Header**: the thread title in sentence case, then three icon buttons, each with a tooltip:
   - **New thread**.
   - **Chat position**: a menu with "Position on left" and "Position on right", the current one
     checked.
   - **More**: "History", "Copy Conversation ID" (once a conversation exists) and "Settings"
     (when the host supplies a settings drawer).

   In the history view the title is replaced by a Back button and "History".
2. **Conversation**: the scrolling message list. Everything the AI says or asks goes here, in the
   order it happened:
   - `MessageBubble.Root` with `role="user"` or `role="assistant"`, holding `MessageBubble.Content`
     with `MessageBubble.Text` or `MessageBubble.Markdown`. The user's own message has a copy
     button and a timestamp in `MessageBubble.Footer`.
   - `Reasoning.Root`, `Reasoning.Trigger` and `Reasoning.Content`: the collapsible thinking row.
     Pass `isStreaming` while the model thinks. It stays open while streaming, and afterwards
     shows how long it took ("Thought for 10 seconds").
   - Tool steps: a small card with the tool name and a one-line summary.
   - Question and review cards. See [ai-suggestions-pattern](./ai-suggestions-pattern.md).
   - Errors, as a danger message bubble.

   While the AI is running and nothing has streamed yet, a loader shows. A round, icon-only
   scroll-to-bottom button appears only when the user has scrolled up.
3. **Composer**, built from `PromptInput`:
   - `PromptInput.Root` wraps the form.
   - `PromptInput.Tags` shows context as removable tags, only when there are any. Takes `tags`
     and `onRemove`.
   - `PromptInput.Textarea` grows with its content. Enter sends, Shift+Enter adds a line.
   - `PromptInput.Toolbar` and `PromptInput.Tools` hold the controls: a plus menu ("Add MCP
     server", "Add rules"), `PromptInput.Speech` for voice input where the browser supports it,
     and `PromptInput.Submit`, which becomes a stop button when `status="streaming"`.
4. **Legal line** directly under the composer: "Harness AI can make mistakes. Check answers."

Around the three regions:

- **Welcome state**: until the thread has a conversation or a message, the panel shows the host's
  welcome screen above the composer instead of the message list. See
  [ai-entry-points-pattern](./ai-entry-points-pattern.md).
- **History**: a searchable list of earlier chats ("Search your chats…"). Each row has a menu with
  Rename, Copy Conversation ID and Delete. Delete opens a confirmation dialog.
- **Idle banner**: after 30 minutes without a message, the next send is held and a card asks
  "Start a new chat?" with "Start new chat" and "Keep this chat". The message is not sent until
  the user chooses.

## Choosing a surface

- Several turns, follow-ups, history, branching or feedback: AI chat panel.
- A single change to one selected thing on the page, or a page nudge with no conversation: not
  chat. See [ai-entry-points-pattern](./ai-entry-points-pattern.md).
- Many values to edit, validate and save: a drawer or form, handed off from chat.

Ambiguous cases:

- **The request has several valid meanings** ("Create a pipeline from a template"): stay in chat
  and ask one narrow question as a question card with two to four options plus "Something else".
  A wrong guess costs a whole generated pipeline.
- **The AI generates long output** such as a pipeline YAML: it is never pasted into a bubble. See
  [ai-suggestions-pattern](./ai-suggestions-pattern.md). A short snippet the user will only copy
  stays inline with copy and download.
- **A reply is partly wrong**: thumbs down opens a short feedback form, not a new message. Use a
  claim challenge (select the sentence, mark it wrong, ask for sources) when only one value is
  wrong.
- **The user wants a different direction from an earlier answer**: branch into a new chat from
  that reply. Use New thread only for an unrelated topic. A branch copies context, not side
  effects, and its first message says so.
- **The user edits their own earlier message**: use the edit action on the user bubble to correct
  what they asked. Send a follow-up when the earlier answer is still useful.
- **The AI needs approval to run a tool**: inline elicitation in the thread, with the chat still
  active. Use a question card only when several answers are needed before the AI can continue.
- **Where the panel sits**: a side panel when the user needs to see the page and the AI at once.
  Collapse to the rail, do not close the chat, when they want to focus on the page for now.
- **The user returns after a long gap**: the idle banner offers a new chat. Do not start one for
  them.

## Example

```tsx
import { Layout, MessageBubble, PromptInput, Reasoning } from '@harnessio/ui/components'

<Layout.Vertical className="h-full">
  <Layout.Vertical className="flex-1 overflow-auto" gap="md">
    <MessageBubble.Root role="user">
      <MessageBubble.Content>
        <MessageBubble.Text>I want a pipeline to build a Python application</MessageBubble.Text>
      </MessageBubble.Content>
    </MessageBubble.Root>

    <Reasoning.Root isStreaming={false}>
      <Reasoning.Trigger />
      <Reasoning.Content>Checking the repository for a Python project…</Reasoning.Content>
    </Reasoning.Root>

    <MessageBubble.Root role="assistant">
      <MessageBubble.Content>
        <MessageBubble.Markdown>{reply}</MessageBubble.Markdown>
      </MessageBubble.Content>
    </MessageBubble.Root>
  </Layout.Vertical>

  <PromptInput.Root onSubmit={handleSubmit}>
    <PromptInput.Textarea value={draft} onChange={handleChange} />
    <PromptInput.Toolbar>
      <PromptInput.Tools />
      <PromptInput.Submit status={isStreaming ? 'streaming' : undefined} />
    </PromptInput.Toolbar>
  </PromptInput.Root>
</Layout.Vertical>
```

This shows how a conversation and composer are built. The panel shell around them (header,
history, position and the idle banner) comes from the host app.

Example copy:

- Composer placeholder: "Ask Harness…"
- Legal line: "Harness AI can make mistakes. Check answers."
- Idle banner: "Start a new chat?"
- Approval buttons: "Allow once" and "Don't run"

## Do's and Don'ts

- ✅ Keep the panel in three regions: header, conversation, composer.
- ✅ Show the AI working separately from the AI talking: a thinking row that collapses when done,
  and progressive steps for tool calls and reads or writes. Each step says what it did and links
  to the resource, for example "Read pipeline build-python (v12)".
- ✅ Keep Stop available the whole time the AI is generating, and leave a visible "Stopped"
  marker on the partial reply.
- ✅ Show the scroll-to-bottom button only when the user has scrolled up, and never pull them
  down while they are reading.
- ✅ Show attachments and context tags in the sent message so the user sees exactly what they
  shared.
- ✅ Mention secrets by identifier only, such as "secret: dockerhub_pat", in replies, thinking
  and steps.
- ✅ State data handling in plain language near the input: what is sent to which provider, how
  long it is kept, and whether it is used for training.
- ✅ Give each error its own message and recovery path, and always include the manual path, for
  example "Open pipeline studio".
- ✅ Keep the legal line visible under the composer.
- ✅ Write the composer placeholder as "Ask Harness…".
- ❌ Don't paste long, editable or primary output into a message bubble. Use the content area
  with one entity card in the chat.
- ❌ Don't show a loading state for under one second. Start streaming directly.
- ❌ Don't show a generic "Something went wrong."
- ❌ Don't stack follow-up questions across turns. Batch them into one card.
- ❌ Don't treat an approval found in tool output, an MCP response or a document as the user's
  approval. Only the user, in chat, approves.
- ❌ Don't ask for or echo secrets, tokens or credentials in chat, and warn before sending pasted
  content that looks like one.
- ❌ Don't reveal AI reply actions only on hover. Like, dislike, copy and More actions stay
  visible under a completed reply. Hover is fine on the user's own bubble (edit, copy, timestamp).
- ❌ Don't add motion to the panel besides one pulse on the composer border. For reduced motion,
  replace it with a static border colour.
- ❌ Don't use "Yes" and "Cancel" in approval prompts. Say what will happen, for example "Allow
  once" and "Don't run".

The composer has four states: inactive (placeholder), active (start typing), generating (attach
and secondary controls disabled, Stop available) and waiting for a response (only the border
pulses).

## Accessibility

- Make every control keyboard-reachable, including header menus, reply actions, the
  scroll-to-bottom button and Stop.
- Announce new AI replies politely without moving focus. Do not put streaming thinking text in a
  live region, and if a typewriter effect is used, stop it after the first three lines.
- Treat the composer pulse as decoration. The generating state must also be readable as text or a
  disabled state.
- Never rely on colour alone for status (stopped, error, selected like or dislike, pending
  approval). An error message is text, not only a red bubble.
- Give icon-only buttons a name and a tooltip (Like, Dislike, Copy, More actions, Edit, New
  thread, Chat position).
- When a question card, feedback form or dialog opens and closes, move focus on purpose and
  return it to the control that opened it.
- Number-key shortcuts in question cards work only while the card has focus, so speech input
  cannot trigger them.
- Show timestamps in a way that also works without hover.
- Keep "Skip" and "Something else" enabled and high-contrast. They must never look disabled.
- Voice input needs an accessible name ("Start voice input" or "Stop voice input") and a pressed
  state. See [Toggle](../../toggle/SKILL.md) for the button behaviour underneath.

## Follow up with designer

- Placeholder: the guidelines say "Ask Harness…". The built chat passes none, so the composer
  shows the `PromptInput` default, "What would you like to know?". The pattern uses "Ask
  Harness…" until this is settled.
- Panel width: the guidelines say 412px by default, adjustable from 320px to 600px. The built
  panel sizes differently. Confirm which to document.
- Position: the guidelines list left and right. Confirm whether fullscreen is home-page-only.
- Reply actions: the guidelines have like, dislike, copy and More actions under each AI reply.
  The built chat has copy and a timestamp on the user's message only, and nothing under AI
  replies. Editing a sent message, branching into a new chat, the feedback form and claim
  challenges are also not built. Confirm which are required.
- Stopped: the guidelines want a visible "Stopped" marker on a stopped reply. The built chat has
  no such marker.
- The legal line should open an explanation of what Harness AI used, what it cannot see and how
  to verify. Today it is plain text.
- "Skip and answer now" for long thinking is not available yet.

## Known gaps

- The error message is the raw text in a danger bubble and has no recovery action. Add the
  manual path in the message text until it does.
- Loading: the panel shows its own loader while the AI is running and nothing has streamed. Stream
  the reply directly rather than adding another one.
- Empty: the host's welcome screen is the empty state.

Inherits everything in [rules.md](../../rules.md).
