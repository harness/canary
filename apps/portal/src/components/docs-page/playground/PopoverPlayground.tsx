import { type ComponentProps, type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Popover,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Popover is an overlay compound component: its content portals to <body> and
// floats over the page, positioned relative to the trigger. So (like Dialog) the
// preview stage holds the TRIGGER, and the panel renders above everything else.
// This playground drives the composed API (Popover.Root / Trigger / Content) —
// the primary pattern — with `Popover.Content`'s built-in title / description /
// link, plus the positioning and theme props.
//
// The preview keeps the popover controlled-open and prevents outside-click close,
// so adjusting a control updates the live panel instead of dismissing it. Those
// two affordances are playground-only, so they're left out of the generated code.

// ② The state shape — one field per control.
interface State {
  triggerLabel: string;
  title: string;
  description: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  theme: "themed" | "default";
  showLink: boolean;
  hideArrow: boolean;
}

const INITIAL_STATE: State = {
  triggerLabel: "Open popover",
  title: "Settings",
  description: "Manage your account settings and preferences.",
  side: "bottom",
  align: "center",
  theme: "themed",
  showLink: false,
  hideArrow: false,
};

// Shared between the preview and the snippet so they never drift. The preview uses
// a neutral target so clicking it doesn't navigate the docs away; the snippet shows
// a realistic one. `linkProps` is a union over router/anchor link shapes, so its
// `to` key only survives behind a cast — the Popover component casts it internally
// the same way.
const LINK_TEXT = "View documentation";
type ContentLinkProps = ComponentProps<typeof Popover.Content>["linkProps"];

// ③ Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from the component defaults, mirroring the preview.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.title) attrs.push(`    title="${s.title}"`);
  if (s.description) attrs.push(`    description="${s.description}"`);
  if (s.side !== "bottom") attrs.push(`    side="${s.side}"`);
  if (s.align !== "center") attrs.push(`    align="${s.align}"`);
  if (s.theme !== "themed") attrs.push(`    theme="${s.theme}"`);
  if (s.hideArrow) attrs.push(`    hideArrow`);
  if (s.showLink)
    attrs.push(
      `    linkProps={{ text: "${LINK_TEXT}", to: "/docs", suffixIcon: true }}`,
    );

  const content = attrs.length
    ? `  <Popover.Content\n${attrs.join("\n")}\n  />`
    : `  <Popover.Content />`;

  return `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline">${s.triggerLabel}</Button>
  </Popover.Trigger>
${content}
</Popover.Root>`;
}

const PopoverPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  // Controlled so control tweaks show live (see note above). Open on mount for
  // immediate feedback.
  const [open, setOpen] = useState(true);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setOpen(true);
  };

  // ④ The curated control set.
  const controls: PropControl[] = [
    {
      name: "triggerLabel",
      type: "text",
      required: true,
      description: "Text on the button that opens the popover",
    },
    {
      name: "title",
      type: "text",
      description: "Heading shown at the top of the popover",
    },
    {
      name: "description",
      type: "text",
      description: "Supporting text below the title",
    },
    {
      name: "side",
      type: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Preferred side of the trigger to render against",
    },
    {
      name: "align",
      type: "select",
      options: ["start", "center", "end"],
      description: "Alignment against the trigger",
    },
    {
      name: "theme",
      type: "select",
      options: ["themed", "default"],
      description: "Follow the theme palette, or fixed high-contrast colors",
    },
    {
      name: "showLink",
      type: "boolean",
      description: "Add a link at the bottom of the popover",
    },
    {
      name: "hideArrow",
      type: "boolean",
      description: "Hide the arrow pointing to the trigger",
    },
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

  // ⑤ Render the real component from state, mirroring generateCode exactly.
  const preview = (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline">{state.triggerLabel}</Button>
      </Popover.Trigger>
      <Popover.Content
        title={state.title || undefined}
        description={state.description || undefined}
        side={state.side}
        align={state.align}
        theme={state.theme}
        hideArrow={state.hideArrow}
        linkProps={
          state.showLink
            ? ({
                text: LINK_TEXT,
                to: "#",
                suffixIcon: true,
              } as ContentLinkProps)
            : undefined
        }
        // Playground-only: keep focus from jumping to the panel on mount, and keep
        // the panel open while the user clicks the controls.
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      />
    </Popover.Root>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: shows the trigger; the popover floats over the page --- */}
        <div className="bg-cn-2 relative flex min-h-[240px] items-center justify-center p-cn-3xl">
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

          {preview}
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

export default PopoverPlayground;
