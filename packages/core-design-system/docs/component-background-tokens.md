# Decision: per-mode component background tokens (sidebar & chat)

**Status:** accepted · **Date:** 2026-07-02 · **Area:** `core-design-system` tokens + `@harnessio/ui` wiring

## Context

We needed the **sidebar** and the **AI chat panel** to use different background colors
per theme mode (e.g. light vs dark), independently of the generic `bg.*` primitives:

- Sidebar background: light = `{pure.white}`, dark = `{bg.2}`
- Chat panel background: light = `{bg.1}` (unchanged from before), dark = `{bg.2}`

The naive approach — swapping the raw Tailwind utility on the component (e.g.
`bg-cn-1` → `bg-cn-2`) — **does not work for a per-mode change**. A raw utility like
`bg-cn-2` maps to the same semantic token in every mode; it just resolves to that mode's
value. So changing the class changes *all* modes at once, and it also recolors every other
surface that happens to use the same utility. There is no way to say "only in dark mode"
from a shared component class.

## Decision

Introduce a **semantic component token** for each surface, give it a per-mode value in the
theme JSONs, expose it as a CSS variable, and consume it through a dedicated
`tailwind-utils-config` class. This is the same pattern the sidebar already used and the one
we extended to chat.

### The four moving parts

1. **Token** (`design-tokens/mode/{light,dark}/*.json`) under `comp.<component>.bg`.
   Set the value per mode. Add it to **all** theme variants in that mode folder
   (`default`, `dimmer`, `high-contrast`, and their `-deuteranopia` / `-protanopia` /
   `-tritanopia` colorblind variants) — 12 files per mode, 24 total.

   ```jsonc
   // mode/dark/*.json
   "comp": { "ai-chat": { "bg": { "$type": "color", "$value": "{bg.2}" } } }
   // mode/light/*.json
   "comp": { "ai-chat": { "bg": { "$type": "color", "$value": "{bg.1}" } } }
   ```

2. **CSS variable** — generated automatically by the Style Dictionary build.
   `comp.ai-chat.bg` → `--cn-comp-ai-chat-bg`. (Dot path → `--cn-` prefix + kebab-case.)

3. **Tailwind utility** (`packages/ui/tailwind-utils-config/components/<component>.ts`) that
   reads the variable, registered in that folder's `index.ts` (`import` + add to the
   `ComponentStyles` array):

   ```ts
   // components/chat.ts
   export default { '.cn-chat-surface': { backgroundColor: 'var(--cn-comp-ai-chat-bg)' } }
   ```

4. **Component** — use the class instead of the raw utility.
   For chat, all three surface elements (Root, Header, Footer) in
   `packages/ui/src/components/chat/chat.tsx` were switched from `bg-cn-1` →
   `cn-chat-surface` so the sticky header/footer stay flush with the body.

## Why not just edit `bg.1` in dark mode?

Because `bg.1` is a primitive consumed by *many* surfaces. Editing it would recolor the whole
app in dark mode, not just the chat. The semantic `comp.*.bg` token isolates the change to one
surface while still resolving through the primitives per mode.

## Build & preview workflow (local, via yalc)

platformUI consumes the **published** `@harnessio/ui`, not the local canary checkout, so local
token edits are seen through a yalc link:

```bash
# 1. rebuild tokens → dist/styles/*.css (--cn-* vars)
cd packages/core-design-system && pnpm build

# 2. rebuild the component library (bundles token CSS + generates the .cn-* class)
cd ../ui && pnpm build

# 3. push the local build into platformUI's yalc-linked copy
yalc publish --push
```

Then in the consuming stack:

- platformUI MFE dev server runs on **:4000** (`pnpm dev:mfe`). **Restart it** after a yalc push —
  webpack does not watch `node_modules`, so the swapped package is only picked up on restart.
- harness-core-ui shell runs on **https://localhost:8181** (`yarn dev`). It proxies
  `/platform_ui` → `http://localhost:4000` (see `configs/devServerProxy.config.js`), unless
  `PLATFORM_UI_REMOTE=true`. Hard-refresh with **Cmd+Shift+R** after the MFE restarts.

## Making it permanent

The steps above are local only (uncommitted token edits + a yalc link). To ship:

1. Commit the token JSON + `@harnessio/ui` changes in canary and publish a new
   `@harnessio/ui` version.
2. Bump the catalog pin in platformUI `pnpm-workspace.yaml` (`'@harnessio/ui'`) to that version
   and remove the yalc link (`yalc remove @harnessio/ui`).

## Files touched (chat, for reference)

- `design-tokens/mode/{light,dark}/*.json` — added `comp.ai-chat.bg` (24 files)
- `packages/ui/tailwind-utils-config/components/chat.ts` — new `.cn-chat-surface` utility
- `packages/ui/tailwind-utils-config/components/index.ts` — registered `chatStyles`
- `packages/ui/src/components/chat/chat.tsx` — Root/Header/Footer use `cn-chat-surface`

The sidebar equivalent is `comp.sidebar.bg` →
`packages/ui/tailwind-utils-config/components/sidebar.ts` (`.cn-sidebar`).

## Consuming the token in platformUI (chat case study)

The chat panel visible in the app (core-ui shell → federated platformUI MFE) is **platformUI's own**
chat, not the `@harnessio/ui` `Chat` component. It lives in
`apps/kitchen-sink/src/components/chat/`. Distinguishing detail: its empty state reads
"How can I help you today?" with buttons *List pipelines / Ask a support question / Analyze
Pipeline Errors* — different from the `@harnessio/ui` `Chat` demo. Editing canary's `chat.tsx`
did **not** affect it. The token/class we built in canary still applies — platformUI just has to
*consume* it (per the no-raw-colors rule: platformUI consumes, never defines).

**Where the background goes:** all chat presentations (`panel`, `drawer`, `homepage`) render the
same local `<Chat>` → shared root `ChatContent` in `chat.tsx`. `variant` only swaps the body, not
the container. So the surface is applied **once** on that shared root, **gated to non-homepage** so
the homepage hero chat is left flat:

```tsx
// apps/kitchen-sink/src/components/chat/chat.tsx
import { cn } from '@harnessio/ui/utils'
<Layout.Vertical className={cn('h-full pt-cn-md', { 'cn-chat-surface': variant !== 'homepage' })} … />
```

The fullscreen wrapper in `chat-panel.tsx` was also switched from the generic `bg-cn-2` to
`cn-chat-surface` so the whole panel uses one semantic token (no light-mode seam).

**Collapsed vs expanded:** `ChatPanel` (rendered once, in
`components/navigation/sidebar-layout.tsx`) has two distinct collapse mechanisms — easy to confuse:
- **`isHidden`** prop (driven by the layout's hide/show toggle → `setAIChatHidden`) → the "minimal
  stack" strip early-return in `chat-panel.tsx`. **This is the collapse users trigger.**
- **`collapsed`** internal `useState` (the in-panel sidebar-icon button) → a separate branch.

The strip only had `hover:bg-cn-2` (transparent at rest), so it showed the darker page bg. Minimal
fix: add `cn-chat-surface` to the **`isHidden` strip's** className only. Expanded chat already gets
its surface from `Chat`'s root (see above), so collapsed now matches expanded (`bg.2` dark /
`bg.1` light). Net platformUI diff for the whole collapse fix is a single added class; the fullscreen
wrapper keeps its original `bg-cn-2` and the `collapsed`-state branch is untouched.

**Config:** the `ui-guidelines` skill requires `platformUI/.ui-builder-config.json` (points at the
canary component/tailwind/portal paths); created if missing.

**No canary rebuild / no yalc for this step** — it's a platformUI source edit, so the MFE dev
server (:4000) hot-recompiles on save. Hard-refresh :8181.

**Known light-mode nuance:** the docked panel was previously transparent (showing the page bg);
consuming the token makes light = `{bg.1}`. If the page behind was already `bg.1` this is a no-op;
verify visually. Dark = `{bg.2}` as intended.

**Raw-color violations noted (not fixed here):** `chat-drawer-layout.tsx` still has raw values
(`'#3b82f6'`, `hover:bg-blue-500`, `bg-gray-400`) that violate the no-raw-colors rule — separate
cleanup.
