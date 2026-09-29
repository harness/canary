# Interactive component playgrounds (Storybook-style previews)

A playground is the bordered, self-contained card you drop into a component's MDX
doc that lets a reader **toggle props and watch a live preview update**, with a
collapsible **Show code** panel that always reflects the current configuration.

There are two flavors. Pick based on the component's props:

| Flavor | File | Use when |
|--------|------|----------|
| **Generic (schema-driven)** | `Playground.tsx` | The component's props are all primitives (string / boolean / number / select / color) and it renders standalone without any surrounding context. |
| **Bespoke (hand-built)** | `DrawerHeaderPlayground.tsx` (reference implementation) | The component needs a surrounding context (a provider, a portal-free host, a parent like `Drawer.Root`/`Tabs.Root`), **or** its interesting props are `ReactNode`/union types (`actions`, `icon`, `tabs`, metadata `children`) that the generic primitive controls can't express. |

Both share the same building blocks — `ControlField`, the bordered frame, and the
**Show code** panel — so a bespoke playground is really "the generic frame, but you
supply a curated control set and render the component yourself."

---

## The shared pieces

- **`types.ts`** — `PropControl` (`name`, `type`, `options?`, `description?`,
  `required?`) and `ComponentSchema`. `ControlType` is
  `"text" | "boolean" | "number" | "select" | "color"`.
- **`ControlField.tsx`** — maps one `PropControl` to a **design-system input**:
  - `boolean` → `Switch` (`checked` / `onCheckedChange`, `label`, `caption`)
  - `select` → `Select` (props-based: `options`, `value`, `onChange(value)`)
  - `number` / `color` → `Input` (native `onChange` event)
  - `text` (default) → `TextInput` (the current DS text primitive, native `onChange` event)
  - Every control passes `label={prop.name}`, `caption={prop.description}`, and
    `optional={!prop.required}` so labels and helper captions come for free.
- **The frame** — a `bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border`
  card wrapped in `<TooltipProvider>`, containing: the preview stage, the control
  grid(s), and the **Show code** `<details>`.

Always use these DS inputs — never hand-roll `<input>`/`<select>`. That's what keeps
the controls on-brand and matches the rest of the docs.

---

## Recipe A — Generic schema-driven playground

Best for a simple component whose props are all primitives.

1. **Generate the schema** (props extracted from the component's types):

   ```bash
   pnpm --filter portal schemas
   ```

   Import the resulting JSON in your MDX.

2. **Drop it into the component's `.mdx`:**

   ```mdx
   import { DocsPage } from "@/components/docs-page";
   import badgeSchema from "@/.../Badge.schema.json";

   <DocsPage.Playground client:only schema={badgeSchema} />
   ```

   - `client:only` is **required** — the playground is interactive React, not static.
   - Optional props: `componentName` (if it differs from `schema.componentName`),
     `fixedProps` (things always passed but not exposed as controls, e.g. `children`),
     `className`.

That's it — `Playground.tsx` looks the component up by name from
`@harnessio/ui/components`, builds initial values from each prop's `defaultValue`,
renders the controls, and generates the code snippet automatically.

---

## Recipe B — Bespoke playground (the one we built for `Drawer.Header`)

Use `DrawerHeaderPlayground.tsx` as the template. Steps to make one for a new
component (call it `Foo`):

### 1. Create `playground/FooPlayground.tsx`

Copy the structure below. The five things you customize per component are marked
**① – ⑤**.

```tsx
import { type FC, type ReactNode, useMemo, useState } from "react";
import {
  Button,
  IconV2,
  TooltipProvider,
  // ...whatever the component + its host context need
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// ① Sample content shared by BOTH the live preview and the generated snippet,
//    so the two never drift.
const SAMPLE_ICON = "settings";

// ② The state shape — one field per control.
interface State {
  title: string;
  actions: boolean;
  // ...
}

// ② Defaults, hoisted to a module constant so the reset button can reuse them.
const INITIAL_STATE: State = {
  title: "Pipeline Settings",
  actions: false,
  // ...
};

// ③ Turn the current state into the JSX string shown in "Show code".
//    Only emit props that are actually set, and mirror exactly what the preview
//    renders (if the preview shows children, the snippet must too).
function generateCode(s: State): string {
  const attrs: string[] = [`title="${s.title}"`];
  if (s.actions) attrs.push("/* ...actions JSX... */");
  return `<Foo\n  ${attrs.join("\n  ")}\n/>`;
}

const FooPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE); // + reset any extra UI state (active tab, etc.)

  // ④ The curated control set.
  const controls: PropControl[] = [
    { name: "title", type: "text", required: true },
    { name: "actions", type: "boolean", description: "Show sample action buttons" },
    // ...
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/select controls.
  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real component from state (add whatever host context it needs).
  const preview = <Foo title={state.title} /* ... */ />;

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: `relative` so the reset button can anchor to it --- */}
        <div className="bg-cn-2 relative flex justify-center p-cn-3xl">
          {/* Reset button, top-right corner */}
          <Button
            variant="outline"
            size="sm"
            iconOnly
            onClick={reset}
            className="absolute right-cn-sm top-cn-sm z-10"
            tooltipProps={{ content: "Reset to defaults" }}
          >
            <IconV2 name="refresh" />
          </Button>

          {/* ...host context + {preview}... */}
        </div>

        {/* --- Control grids: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {booleanControls.map(renderControl)}
        </div>

        {/* --- Show code --- */}
        <details className="example-expand bg-cn-2 relative border-t p-cn-sm">
          <CopyButton
            buttonVariant="transparent"
            className="absolute right-cn-sm top-cn-sm"
            name={code}
          />
          <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
            Show code
          </summary>
          {/* NOTE: text sits directly in <pre>, no inner <code> — see gotchas */}
          <pre
            className="font-body-code p-cn-3xs text-cn-size-2 leading-6"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {code}
          </pre>
        </details>
      </div>
    </TooltipProvider>
  );
};

export default FooPlayground;
```

### 2. Register it in `docs-page/index.ts`

```ts
import FooPlayground from "./playground/FooPlayground.tsx";

export const DocsPage = {
  // ...existing entries...
  FooPlayground,
};
```

### 3. Reference it in the component's `.mdx`

```mdx
<DocsPage.FooPlayground client:only />
```

Always `client:only` — it's interactive.

---

## Frame anatomy (the exact layout we settled on)

```
┌─ bg-cn-1 rounded-cn-6 border ─────────────────────────────┐
│  Preview stage   (bg-cn-2, relative, flex justify-center) │
│     └─ Reset button (absolute right-cn-sm top-cn-sm)      │
│     └─ host context + live component                       │
├───────────────────────────────────────────────────────────┤
│  Input controls  (bg-cn-1, grid grid-cols-3, border-t)    │  ← text + select
├───────────────────────────────────────────────────────────┤
│  Boolean controls (bg-cn-1, grid grid-cols-3, border-t)   │  ← switches, hard-broken
├───────────────────────────────────────────────────────────┤
│  ▸ Show code     (details, bg-cn-2, CopyButton top-right) │
└───────────────────────────────────────────────────────────┘
```

- **Reset button** — `Button` `variant="outline"` `size="sm"` `iconOnly` with
  `<IconV2 name="refresh" />`. `iconOnly` buttons **require** either
  `tooltipProps` or `ignoreIconOnlyTooltip` — we use `tooltipProps={{ content: "Reset to defaults" }}`.
  Restore state from the hoisted `INITIAL_STATE` constant (and any extra UI state
  like the active tab).
- **Hard break** — put boolean toggles in a *second* grid so they start on their
  own row separated by a divider, instead of flowing inline after the inputs.
  Side benefit: the switch captions stop truncating.

---

## Gotchas (learned the hard way — don't rediscover these)

1. **Controls panel must be `bg-cn-1`, not `bg-cn-2`.** The DS text `Input`/`TextInput`
   fill with `bg-cn-2`. On a `bg-cn-2` panel they blend in and read as faint outlines
   rather than fields. A `bg-cn-1` surface underneath gives the needed contrast.

2. **Use plain `grid-cols-3`, not `md:grid-cols-3`.** The `md:` breakpoint is
   viewport-based, and the embedded browser preview sits *below* `md` (~768px), so
   `md:grid-cols-3` renders as 2 columns. Plain `grid-cols-3` guarantees 3-per-row.

3. **Show code: put text directly in `<pre>` with NO inner `<code>`, and set
   `whiteSpace: "pre-wrap"` inline.** `styles.css` has a global
   `code:not(.expressive-code code) { white-space: nowrap !important }` rule that
   collapses a multi-line snippet onto one line and gives it an inline-code
   background. Avoid `<code>` here entirely.

4. **Keep the preview and the generated code in sync.** Drive both from the same
   `SAMPLE_*` constants and the same conditions. If a prop only has a *visible* effect
   under some condition, surface it that way in **both** places. Example: `isLoading`
   on `DrawerHeaderV2` only skeletons the metadata (`children`) slot — so the
   playground surfaces the metadata slot whenever `metadata || isLoading`, and
   `generateCode` emits children under the same condition. Otherwise toggling the
   prop appears to do nothing and the snippet lies.

5. **`client:only` is mandatory** in the MDX tag. These are stateful React islands;
   without it they won't hydrate.

6. **Reference the real component, not a mock.** Render the actual export from
   `@harnessio/ui/components` inside whatever host context it needs (e.g. an inline,
   always-open `Drawer.Root open modal={false}` so `Drawer.Title/Description/Close`
   resolve without portaling into an overlay). If the component changes, the
   playground stays honest.

---

## Verifying a new playground

After building `packages/ui` (if needed) and running the portal dev server:

1. Open the component's doc page and confirm the card renders.
2. Toggle every control and watch the preview update.
3. Open **Show code** and confirm the snippet matches the preview and copies cleanly.
4. Click **Reset** and confirm all controls and the preview return to defaults.
5. Check the browser console for errors (stale `cn is not defined`-style errors are
   usually a mid-edit HMR artifact — do a clean reload before trusting them).
