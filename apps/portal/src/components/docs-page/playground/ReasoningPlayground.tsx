import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Reasoning,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Reasoning is a compound collapsible — Reasoning.Root owns the streaming/open
// state and provides context, Reasoning.Trigger is the clickable header (a
// shimmer "Thinking…" while streaming, a "Thought for N seconds" label once
// done), and Reasoning.Content is the collapsible body. That's composed JSX with
// a surrounding context, so this is a bespoke playground.
//
// Root has tangled internal effects: it measures duration with Date.now() and
// auto-collapses on the streaming→done transition. Toggling props on a live
// instance would fire those and fight the control values, so the preview remounts
// (via `key`) on every config change — each configuration renders cleanly from
// its initial state, exactly as the generated snippet describes.

// ① The state shape — one field per control.
interface State {
  content: string;
  duration: number;
  isStreaming: boolean;
  defaultOpen: boolean;
}

const INITIAL_STATE: State = {
  content:
    "Let me think about this step by step. First I'll parse the request, then weigh the options, and finally settle on the best approach.",
  duration: 5,
  isStreaming: false,
  defaultOpen: true,
};

// ② Turn the current state into the JSX string shown in "Show code". Only emit
//    props that differ from defaults, and mirror the preview exactly — while
//    streaming the duration label is ignored, so the snippet drops it too.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.isStreaming) attrs.push("isStreaming");
  else attrs.push(`duration={${s.duration}}`);
  if (!s.defaultOpen) attrs.push("defaultOpen={false}");

  const root = attrs.length
    ? `<Reasoning.Root ${attrs.join(" ")}>`
    : "<Reasoning.Root>";

  return [
    root,
    "  <Reasoning.Trigger />",
    "  <Reasoning.Content>",
    `    ${s.content}`,
    "  </Reasoning.Content>",
    "</Reasoning.Root>",
  ].join("\n");
}

const ReasoningPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ③ The curated control set. `duration` drops out while streaming, where the
  //    trigger shows the shimmer instead of an elapsed-time label.
  const controls: PropControl[] = [
    { name: "content", type: "text", description: "Reasoning body text" },
    ...(state.isStreaming
      ? []
      : [
          {
            name: "duration" as const,
            type: "number" as const,
            description: "Elapsed thinking time shown in the header (seconds)",
          },
        ]),
    {
      name: "isStreaming",
      type: "boolean",
      description: "Show the animated 'Thinking…' shimmer",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      description: "Whether the panel starts expanded",
    },
  ];

  // Split so boolean toggles hard-break onto their own row instead of flowing
  // inline after the text/number controls.
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

  // ④ Render the real composition from state. The `key` forces a fresh mount on
  //    every config change so Root's duration/auto-collapse effects don't fight
  //    the controls — each configuration starts clean. Keep the conditions here
  //    aligned with generateCode so preview and snippet agree.
  const preview = (
    <div className="w-full max-w-[460px]">
      <Reasoning.Root
        key={`${state.isStreaming}-${state.duration}-${state.defaultOpen}`}
        isStreaming={state.isStreaming}
        duration={state.isStreaming ? undefined : state.duration}
        defaultOpen={state.defaultOpen}
      >
        <Reasoning.Trigger />
        <Reasoning.Content>{state.content}</Reasoning.Content>
      </Reasoning.Root>
    </div>
  );

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage: the live collapsible; reset anchors to this box --- */}
        <div className="bg-cn-2 relative flex min-h-[180px] items-center justify-center p-cn-3xl">
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

export default ReasoningPlayground;
