import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Tooltip,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Tooltip is an overlay: its surface portals out and floats over the page,
// positioned relative to the trigger it wraps. So (like Popover) the preview
// stage holds the TRIGGER and the surface renders above everything else.
//
// A real tooltip opens on hover/focus after a delay, which is awkward for a
// playground — you'd have to keep hovering to see a control change. So we force
// it open (`open`) and leave that prop out of the generated snippet, exactly the
// way the Popover playground keeps its panel pinned open.

// ② State — one field per control.
interface State {
  triggerLabel: string;
  title: string;
  content: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  hideArrow: boolean;
  footer: boolean;
}

const INITIAL_STATE: State = {
  triggerLabel: "Hover me",
  title: "Tooltip title",
  content: "Tooltips provide helpful context and information.",
  side: "top",
  align: "center",
  hideArrow: false,
  footer: false,
};

// A representative footer, shared by the preview and the snippet so they match.
const FOOTER_SNIPPET = `<Button variant="link" size="md">View details</Button>`;

// ③ Mirror exactly what the preview renders, emitting only props that differ
//    from the defaults. `open` is playground-only, so it's never emitted.
function generateCode(s: State): string {
  const attrs: string[] = [];
  attrs.push(`    content="${s.content || "Tooltip content"}"`);
  if (s.title) attrs.push(`    title="${s.title}"`);
  if (s.side !== "top") attrs.push(`    side="${s.side}"`);
  if (s.align !== "center") attrs.push(`    align="${s.align}"`);
  if (s.hideArrow) attrs.push(`    hideArrow`);
  if (s.footer) attrs.push(`    footer={${FOOTER_SNIPPET}}`);

  return `<TooltipProvider>
  <Tooltip
${attrs.join("\n")}
  >
    <Button variant="secondary">${s.triggerLabel}</Button>
  </Tooltip>
</TooltipProvider>`;
}

const TooltipPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "triggerLabel",
      type: "text",
      required: true,
      description: "Text on the element the tooltip wraps",
    },
    {
      name: "title",
      type: "text",
      description: "Optional heading above the content (plain text)",
    },
    {
      name: "content",
      type: "text",
      required: true,
      description: "The tooltip body",
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
      name: "hideArrow",
      type: "boolean",
      description: "Hide the arrow pointing to the trigger",
    },
    {
      name: "footer",
      type: "boolean",
      description: "Add a fixed footer below the content",
    },
  ];

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

  // ⑤ Render the real Tooltip from state. Forced open so control tweaks show
  //    live (see note above); the frame already provides the TooltipProvider.
  const preview = (
    <Tooltip
      content={state.content || "Tooltip content"}
      title={state.title || undefined}
      side={state.side}
      align={state.align}
      hideArrow={state.hideArrow}
      footer={
        state.footer ? (
          <Button variant="link" size="md">
            View details
          </Button>
        ) : undefined
      }
      open
    >
      <Button variant="secondary">{state.triggerLabel}</Button>
    </Tooltip>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: shows the trigger; the tooltip floats over the page --- */}
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

export default TooltipPlayground;
