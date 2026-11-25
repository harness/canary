Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# AI entry points

**Contents**

- [Anatomy](#anatomy)
- [Choosing an entry point](#choosing-an-entry-point)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Follow up with designer](#follow-up-with-designer)
- [Known gaps](#known-gaps)

**Use when:** the user is on a page or item where AI can help and needs a visible way in, such
as a failing pipeline, an empty list page or a YAML file with a selection. Also use it when the
AI should start with context the user would otherwise type (the page, the entity, the selected
lines), or when a list page has no conversation yet and the AI can offer one real, data-based
starting point.

**Do not use when:** the user needs to ask in their own words with nothing to scope (use the
header toggle and [ai-chat-pattern](./ai-chat-pattern.md); do not add a launcher for every
question), the task is repeatable and governed and needs no human steering (use a Pipeline
Worker Agent step), the task is scripting, CI or an external AI tool (use the CLI, API or MCP),
the user must enter a secret (use a secure form), or the user can already finish the task in
the UI and AI would only be decoration (add no entry point).

The separating question: does the user already have a specific thing in front of them, or are
they still looking for where to begin? A specific thing gets an entry on that thing. Otherwise
use the header toggle, or the empty-state panel on a list page.

Every entry point ends in the same chat panel, described in
[ai-chat-pattern](./ai-chat-pattern.md).

## Anatomy

1. **Header toggle**: always present where chat is available. It opens and closes the panel and
   shows as selected while the panel is open. The host app owns the open state. It carries no context beyond the
   current page. No dedicated component exists, so build it from a
   [Toggle](../../toggle/SKILL.md) with an AI icon.
2. **Context tag**: what the chat is scoped to, such as "All pipelines" or `@Pipeline.yaml#L15-17`.
   Shown in the composer with `PromptInput.Tags` and removed with `onRemove`. Context always goes
   in as a removable tag, never as hidden state.
3. **Welcome screen**: the first thing in the panel when there is no conversation yet. The host
   supplies it. The default shows "How can I help you today?" and quick actions. A list page can replace it with the
   empty-state AI panel, which has three modes:
   - **Orient**: no data or history yet, and the user needs to know what the page is for.
   - **Triage**: one issue matters most right now. Lead with it and give one action.
   - **Healthy**: everything is fine. Stay short, and invent no work.
4. **Quick-action chips**: outline buttons in the welcome screen. They come from the actions the
   page registers, or three defaults ("List pipelines", "Ask a support question", "Analyze
   pipeline errors"). Each sends its prompt. Keep to three or fewer.
5. **Inline AI entry** (optional): a secondary [Button](../../button/SKILL.md) with an AI icon and
   text on one entity, such as a failed run. It opens chat already scoped to that entity.
6. **Suggestion card** (optional): a suggested full question inside the conversation, shown as a
   greeting followed by one full-width outline button per suggestion.

Nothing replaces the header toggle. An entry point may prefill the composer but does not send
for the user.

## Choosing an entry point

- Ask, explore or compare across several things, with no single target: header toggle.
- One action on one item the user is looking at: inline AI entry on that item.
- A list page with no conversation yet and real data to start from: the welcome screen, in Orient,
  Triage or Healthy mode.
- Lines or a file selected for the AI to look at: a reference tag in the composer
  (`@file#L15-17`).
- The next step is predictable from the page: quick-action chips.
- The work needs domain expertise through conversation: a named conversational agent inside
  chat.
- Repeatable, governed, non-conversational work: a Pipeline Worker Agent step, not an entry into
  chat.
- Many fields, review or a secret: a drawer or form.

Ambiguous cases:

- **A list page has both a custom welcome screen and the header toggle**: both stay. The welcome
  screen is the page's opening message and hands the user into chat. The toggle is the way in
  everywhere else.
- **One run failed and the page also has a Triage message**: inline AI entry on the failed run
  when the problem is one item. Triage when several things need attention. Using both for the
  same single failure makes the page shout twice.
- **A custom welcome screen and a conversational agent could both apply**: welcome screen first,
  agent second. Do not open a page with an agent the user did not choose.
- **The page is healthy and the AI has nothing to say**: show a short Healthy message only if you
  can state its basis ("Based on 34 executions in the last 7 days"). With no real basis, keep
  the default welcome screen.
- **An entry point could prefill a prompt and send it**: prefill, do not send. The scoped
  launcher fills the composer and the context tag, and the user presses send. Quick-action chips
  are the exception, because the user has chosen the action by clicking it.
- **The user clicks an inline entry while a conversation is open**: continue if it is about the
  same entity. Otherwise start a new chat with the new scope tag and keep the old one in
  history. Do not silently change the scope of a conversation the user is reading.
- **The panel is collapsed to the rail and the AI has a Triage message**: do not auto-expand it.
- **Quick-action chips or a suggestion card**: chips when the next step is predictable and the
  actions are short. A suggestion card when the next step is a full question. Do not show both
  under the same composer.
- **Selected YAML lines**: add a reference tag to the composer and let the user type. Do not open
  a new chat on selection, and do not send the lines for them.
- **Home page**: the home-page variant of the chat puts the welcome screen and chips in a
  centred row. Use the Home wording ("Needs your attention", "Worth a look"), which spans many
  entities. A single-entity Triage message belongs on that entity's list page.

## Example

```tsx
import { Button, Toggle } from '@harnessio/ui/components'

<Toggle
  variant="ghost"
  size="sm"
  iconOnly
  prefixIcon="ai-solid"
  selected={isPanelOpen}
  onChange={setIsPanelOpen}
/>

<Button variant="secondary" onClick={() => openChatScopedTo(failedRun)}>
  Ask Harness to troubleshoot this run
</Button>
```

The panel and its welcome screen come from the host app. See [ai-chat-pattern](./ai-chat-pattern.md).

Example copy:

- Inline entry: "Ask Harness to troubleshoot this build"
- Healthy: "Based on 34 executions in the last 7 days, nothing needs attention."

## Do's and Don'ts

- ✅ Keep the header toggle on every page where chat is available.
- ✅ Show scope as a removable tag in the composer, using the page or entity name.
- ✅ Use a secondary button for an inline AI entry when AI is not the page's primary action.
- ✅ Write invitations in the second or third person: "Ask Harness to troubleshoot this build",
  not "I can troubleshoot this build for you".
- ✅ State the basis of every welcome message, and lead Triage with the single most important
  issue and one action.
- ✅ Keep a non-AI path. The user can still do the task without opening chat.
- ✅ Reserve the AI icon and glow for real AI entry points, AI-generated content and active
  generation.
- ✅ Keep pre-filled context short and say why each piece is there.
- ✅ Move focus to the chat input when chat opens.
- ✅ Provide keyboard shortcuts to focus the chat input, stop generation and toggle the panel.
- ❌ Don't put the AI icon or glow on upsell banners, empty-state decoration or non-AI
  automation.
- ❌ Don't make chat the only way to finish a task the product already supports.
- ❌ Don't add a launcher for every question. One toggle plus a few scoped entries is enough.
- ❌ Don't send a prompt for the user from a launcher, especially one that could change
  something.
- ❌ Don't send selected content or page context without showing it in the composer.
- ❌ Don't auto-open or auto-expand the panel to deliver a Triage or Healthy message.
- ❌ Don't invent work in a Healthy state to justify the panel.
- ❌ Don't use first-person AI voice in launcher text or welcome copy.
- ❌ Don't ask for or collect secrets from an entry point.
- ❌ Don't use a primary button for an AI entry on a page whose primary action is something else.

## Accessibility

- Give the icon-only header toggle an accessible name, a tooltip and a pressed state, so a screen
  reader user knows whether the panel is open. Put the shortcut in the tooltip once the keys are
  decided. See [Toggle](../../toggle/SKILL.md).
- Make every entry point keyboard-reachable in a logical order: toggle, inline entries, chips,
  context tag and its remove button.
- Move focus into the chat input when an entry point opens the panel, and return it to the
  control that opened it when the panel closes.
- Name the remove button on every context tag, for example "Remove All pipelines".
- Announce a welcome message politely without moving focus away from the page.
- Never rely on the glow or colour alone to show that an entry is AI, active or selected. Use the
  icon and text too. For reduced motion, replace the glow pulse with a static border colour.
- Give each quick-action chip a clear text label. An icon alone is not enough.

## Follow up with designer

- AI toggle: no dedicated component exists, and the built chat has no header toggle.
  Confirm the design (icon, glow, selected state, tooltip) so one can be built, or confirm that
  a `Toggle` with `prefixIcon="ai-solid"` is the intended design.
- Inline AI entry, scope line and the scoped-launch behaviour ("opens chat already scoped") are
  not built. Confirm how a launcher passes scope and whether it prefills the
  composer.
- Welcome modes: the code shows one welcome ("How can I help you today?" plus chips). Orient,
  Triage and Healthy are not built. Confirm whether they replace it per page.
- Quick actions: the code registers them per page and defaults to three. The guidelines say
  three or fewer plus "More options". Confirm whether "More options" exists.
- The minimized state is undecided, including what the toggle shows when the AI has a Triage
  message while the panel is collapsed.
- The welcome screen and a conversational agent overlap. The rule above is a workaround.
- Keyboard shortcut keys are not decided.
- "In-line edit" means two things: editing the user's own sent message, and a launcher on an
  entity. This pattern uses "inline AI entry" for the launcher.

## Known gaps

- The suggestion card greets the user without a name until one is supplied.
- Scoping and prefill are not defined beyond "opens chat already scoped". "Prefill, do not send"
  is a design call, not a confirmed behaviour.
- Loading: show a [Skeleton](../../skeleton/SKILL.md) in the page area, not in the panel. The
  panel shows its own loader.
- Empty: the welcome screen is the empty state.

Inherits everything in [rules.md](../../rules.md).
