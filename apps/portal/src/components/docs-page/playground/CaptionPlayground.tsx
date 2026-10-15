import { type FC, useMemo, useState } from "react";
import { Button, Caption, CopyButton, IconV2, TooltipProvider } from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Caption is a presentational one-liner: it renders `children` through the Text
// primitive and merges a `className`. The only meaningful knobs are the text itself
// and the state it signals — and state is conveyed purely by a color className
// (default vs. a danger color for errors). A `select` control that maps to that
// className can't be expressed by the generic schema, so this is a bespoke playground.

// ① The className each state maps to. Empty = no className (default styling).
const STATE_CLASS: Record<State["state"], string> = {
  default: "",
  error: "text-cn-danger",
};

// ② State — one field per control.
interface State {
  text: string;
  state: "default" | "error";
}

const INITIAL_STATE: State = {
  text: "Use lowercase letters and hyphens only.",
  state: "default",
};

// ③ Mirror exactly what the preview renders. Only emit className when the state
//    actually maps to one.
function generateCode(s: State): string {
  const cls = STATE_CLASS[s.state];
  return cls ? `<Caption className="${cls}">${s.text}</Caption>` : `<Caption>${s.text}</Caption>`;
}

const CaptionPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "text", type: "text", required: true, description: "The caption's content" },
    {
      name: "state",
      type: "select",
      options: ["default", "error"],
      description: "error applies text-cn-danger via className",
    },
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real Caption from state, mirroring generateCode exactly.
  const cls = STATE_CLASS[state.state];
  const preview = <Caption className={cls || undefined}>{state.text}</Caption>;

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex justify-center p-cn-3xl">
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

        {/* --- Control grid: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
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

export default CaptionPlayground;
