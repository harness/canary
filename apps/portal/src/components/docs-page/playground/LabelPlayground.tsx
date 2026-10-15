import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  IconV2,
  Label,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Label is a small, prop-driven wrapper around the Radix label primitive. Its text is the
// `children`; `optional` toggles the required `*` (shown by default), `disabled` dims it,
// `tooltipContent` adds an info informer beside the text, and `suffix` places an element on
// the right. The component renders nothing with empty children, so the playground keeps a
// sensible default label.
interface State {
  content: string;
  optional: boolean;
  disabled: boolean;
  tooltipContent: string;
  suffix: string;
}

const INITIAL_STATE: State = {
  content: "Name",
  optional: false,
  disabled: false,
  tooltipContent: "",
  suffix: "",
};

// Mirror the preview: only emit props that differ from the component defaults. `suffix` is a
// ReactNode in the API, but for the playground a plain string reads clearly in the snippet.
function generateCode(s: State): string {
  const attrs: string[] = [];
  if (s.optional) attrs.push("optional");
  if (s.disabled) attrs.push("disabled");
  if (s.tooltipContent) attrs.push(`tooltipContent="${s.tooltipContent}"`);
  if (s.suffix) attrs.push(`suffix={<Button size="2xs">${s.suffix}</Button>}`);
  const open = attrs.length ? `<Label ${attrs.join(" ")}>` : "<Label>";
  return `${open}${s.content}</Label>`;
}

const LabelPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setState(INITIAL_STATE);

  const controls: PropControl[] = [
    { name: "content", type: "text", description: "The label text" },
    {
      name: "tooltipContent",
      type: "text",
      description: "Adds an info informer beside the label with this tooltip",
    },
    {
      name: "suffix",
      type: "text",
      description: "Label for an action button shown on the right",
    },
    {
      name: "optional",
      type: "boolean",
      description: "Hides the required * marker (shown by default)",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Renders the label dimmed",
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

  const preview = (
    <Label
      optional={state.optional}
      disabled={state.disabled}
      tooltipContent={state.tooltipContent || undefined}
      suffix={
        state.suffix ? (
          <Button size="2xs" iconOnly>
            <IconV2 name="plus" skipSize />
          </Button>
        ) : undefined
      }
    >
      {state.content}
    </Label>
  );

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

export default LabelPlayground;
